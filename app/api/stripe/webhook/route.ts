import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  markOrderStatus,
  markOrderDelivered,
  createDownloadToken,
  getOrder,
  getOrderItems,
} from "@/lib/store/db";
import { sendOrderConfirmation, isEmailConfigured } from "@/lib/store/email";

// Stripe needs the raw body to verify the signature, so this must stay a
// route handler reading req.text() (not a server action).
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error(`[stripe-webhook] ${event.type} failed:`, err);
    // Non-2xx makes Stripe retry the event later.
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    const order = await getOrder(orderId);
    if (!order || order.status === "paid") {
      // Unknown order or duplicate delivery of the same event.
      return;
    }

    await markOrderStatus(orderId, "paid");
    const token = await createDownloadToken(orderId, 7);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://chirayuarya.com");
    const downloadUrl = `${siteUrl}/store/download/${token}`;

    if (isEmailConfigured()) {
      const items = await getOrderItems(orderId);
      await sendOrderConfirmation({ order: { ...order, status: "paid" }, items, downloadUrl });
      await markOrderDelivered(orderId);
    }
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await getOrder(orderId);
      if (order && order.status === "pending") {
        await markOrderStatus(orderId, "abandoned");
      }
    }
  }
}
