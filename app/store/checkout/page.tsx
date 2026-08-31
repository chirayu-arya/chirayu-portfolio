"use client";

import Nav from "../../components/Nav";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../CartContext";
import { getProduct, formatPrice, PACK_LABELS } from "@/lib/store/catalog";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      // Stripe redirect; cart is cleared after a successful payment on the
      // success page, not here, so an abandoned checkout keeps the items.
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}>
      <Nav />
      <section className="max-w-2xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-black tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f5f5f7" }}
        >
          Checkout
        </motion.h1>

        {items.length === 0 ? (
          <div className="mt-10">
            <p className="text-base" style={{ color: "#86868b" }}>Your cart is empty.</p>
            <button
              onClick={() => router.push("/store")}
              className="mt-6 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer"
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              Browse the store
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Order summary */}
            <div className="order-2 lg:order-1">
              <p className="text-xs font-medium uppercase mb-4" style={{ color: "#515154", letterSpacing: "0.14em" }}>
                Order summary
              </p>
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <div
                    key={`${item.productId}-${item.pack}`}
                    className="flex items-center gap-4 py-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.preview}
                      alt={product.title}
                      className="rounded-lg object-cover shrink-0"
                      style={{ width: 48, height: 48 }}
                      draggable={false}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#f5f5f7" }}>{product.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>{PACK_LABELS[item.pack]}</p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#f5f5f7" }}>
                      {formatPrice(product.prices[item.pack] ?? 0)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-5">
                <span className="text-sm" style={{ color: "#86868b" }}>Total</span>
                <span className="text-xl font-semibold" style={{ color: "#f5f5f7" }}>{formatPrice(subtotalCents)}</span>
              </div>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="order-1 lg:order-2 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium uppercase mb-2" style={{ color: "#515154", letterSpacing: "0.14em" }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#f5f5f7" }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase mb-2" style={{ color: "#515154", letterSpacing: "0.14em" }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#f5f5f7" }}
                  placeholder="you@example.com"
                />
                <p className="text-xs mt-2" style={{ color: "#515154" }}>
                  Your downloads are sent here.
                </p>
              </div>

              {error && (
                <p className="text-sm rounded-2xl px-4 py-3" style={{ background: "rgba(220,80,80,0.1)", color: "#f5a5a5" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full py-3 text-sm font-semibold cursor-pointer mt-2"
                style={{ background: "#f5f5f7", color: "#000", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Redirecting to payment…" : `Pay ${formatPrice(subtotalCents)}`}
              </button>
              <p className="text-xs text-center" style={{ color: "#515154" }}>
                Secure payment by Stripe. Card, Apple Pay and Google Pay.
              </p>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
