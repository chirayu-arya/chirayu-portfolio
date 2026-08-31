import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { priceItem, type Pack } from "@/lib/store/catalog";
import { createOrder, attachStripeSession, isDbConfigured } from "@/lib/store/db";

type CheckoutBody = {
  name?: string;
  email?: string;
  items?: { productId: string; pack: Pack }[];
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !isDbConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not live yet. The store is in preview mode." },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const rawItems = body.items ?? [];

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid name and email." }, { status: 400 });
  }
  if (rawItems.length === 0 || rawItems.length > 50) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-price every item server-side; reject anything not in the catalog.
  const priced = [];
  for (const raw of rawItems) {
    const result = priceItem(raw.productId, raw.pack);
    if (!result) {
      return NextResponse.json({ error: `Unknown item: ${raw.productId}` }, { status: 400 });
    }
    priced.push({
      productId: result.product.id,
      title: result.product.title,
      subtitle: result.product.subtitle,
      pack: raw.pack,
      unitCents: result.unitCents,
    });
  }
  const totalCents = priced.reduce((sum, item) => sum + item.unitCents, 0);

  try {
    return await startCheckout({ email, name, totalCents, priced, origin: req.nextUrl.origin });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}

async function startCheckout(input: {
  email: string;
  name: string;
  totalCents: number;
  priced: { productId: string; title: string; subtitle: string; pack: Pack; unitCents: number }[];
  origin: string;
}) {
  const { email, name, totalCents, priced, origin } = input;

  const orderId = await createOrder({
    email,
    name,
    totalCents,
    items: priced,
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: priced.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: item.unitCents,
        product_data: {
          name: item.title,
          description: `${item.subtitle} · ${item.pack === "single" ? "Digital download" : `${item.pack} wallpaper`}`,
        },
      },
    })),
    metadata: { orderId },
    success_url: `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/store?canceled=1`,
  });

  await attachStripeSession(orderId, session.id);

  return NextResponse.json({ url: session.url });
}
