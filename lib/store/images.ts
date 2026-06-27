import type { Product } from "./catalog";

export type OriginalFile = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Fetches the original, full-resolution gallery image over HTTP (masters live
// in public/, served by the CDN) and returns it untouched for download.
// baseUrl is the request origin locally and the production origin on Vercel.
export async function fetchOriginal(product: Product, baseUrl: string): Promise<OriginalFile> {
  const masterUrl = new URL(product.preview, baseUrl);
  const res = await fetch(masterUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch original for ${product.id}: ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());

  const ext = decodeURIComponent(product.preview).split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const safeTitle = product.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, " ");

  return { buffer, contentType, filename: `${safeTitle} - Chirayu Arya.${ext}` };
}
