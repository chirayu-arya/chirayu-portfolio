import { PHOTOGRAPHY, ILLUSTRATIONS, descFor, type Photo } from "@/app/gallery/data";

// The store sells two billing shapes:
//  - one_time: digital downloads (wallpapers now; Notion templates, prompt
//    packs and PDF guides when those products exist)
//  - subscription: recurring tools, checkout runs in Stripe subscription mode
//    against a pre-created Stripe Price (stripePriceId)
export type ProductKind = "wallpaper" | "notion-template" | "prompt-pack" | "pdf-guide" | "tool";
export type Billing = "one_time" | "subscription";

// Each product delivers a single file. Wallpapers deliver the ORIGINAL,
// full-resolution gallery image (no resizing). "single" is the only pack used.
export type Pack = "single";

// Pricing is by orientation, device-agnostic. Portraits are cheaper than
// landscapes. The buyer receives the original image regardless of device.
export const PRICE_PORTRAIT_CENTS = 699;
export const PRICE_LANDSCAPE_CENTS = 999;

export type Orientation = "portrait" | "landscape";

export function orientationOf(w: number, h: number): Orientation {
  return w > h ? "landscape" : "portrait";
}

export function wallpaperPriceCents(w: number, h: number): number {
  return orientationOf(w, h) === "landscape" ? PRICE_LANDSCAPE_CENTS : PRICE_PORTRAIT_CENTS;
}

export const PACK_LABELS: Record<Pack, string> = {
  single: "Original image",
};

export type Product = {
  id: string;
  kind: ProductKind;
  billing: Billing;
  title: string;
  subtitle: string;
  description: string;
  preview: string; // public image path shown on the store card
  w: number;
  h: number;
  // one_time: price in cents per available pack
  prices: Partial<Record<Pack, number>>;
  // subscription only: Stripe recurring Price id + display price
  stripePriceId?: string;
  monthlyCents?: number;
  // wallpaper only: pointer back to the gallery photo the master comes from
  source?: { tab: "photography" | "illustrations"; photoId: number };
};

function wallpaperFrom(photo: Photo): Product {
  return {
    id: `wallpaper-${photo.tab === "photography" ? "photo" : "illustration"}-${photo.id}`,
    kind: "wallpaper",
    billing: "one_time",
    title: photo.title,
    subtitle: photo.tab === "photography" ? photo.category : "Illustration",
    // Same narrative copy the gallery lightbox shows for this image.
    description: descFor(photo),
    preview: photo.src,
    w: photo.w,
    h: photo.h,
    // One device-agnostic price by orientation; delivers the original file.
    prices: { single: wallpaperPriceCents(photo.w, photo.h) },
    source: { tab: photo.tab, photoId: photo.id },
  };
}

export const WALLPAPERS: Product[] = [
  ...PHOTOGRAPHY.map(wallpaperFrom),
  ...ILLUSTRATIONS.map(wallpaperFrom),
];

// Non-wallpaper products go here as they're created. Each needs a deliverable
// wired into the download route before going live.
export const OTHER_PRODUCTS: Product[] = [];

export const PRODUCTS: Product[] = [...WALLPAPERS, ...OTHER_PRODUCTS];

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | null {
  return BY_ID.get(id) ?? null;
}

// Validates a raw cart item against the catalog. Returns the priced item or
// null when the product/pack combination doesn't exist. Prices always come
// from the catalog, never from the client.
export function priceItem(productId: string, pack: Pack): { product: Product; unitCents: number } | null {
  const product = getProduct(productId);
  if (!product) return null;
  if (product.billing === "subscription") return null;
  const unitCents = product.prices[pack];
  if (unitCents == null) return null;
  return { product, unitCents };
}

export function formatPrice(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
