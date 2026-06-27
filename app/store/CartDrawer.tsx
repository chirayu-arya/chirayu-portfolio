"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { getProduct, formatPrice, PACK_LABELS } from "@/lib/store/catalog";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function CartDrawer() {
  const { items, removeItem, subtotalCents, drawerOpen, setDrawerOpen } = useCart();
  const router = useRouter();

  const goToCheckout = () => {
    setDrawerOpen(false);
    router.push("/store/checkout");
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-md flex flex-col"
            style={{ background: "#0a0a0a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>
                Your cart
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", fontSize: "1.25rem", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-base" style={{ color: "#86868b" }}>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    const price = product.prices[item.pack] ?? 0;
                    return (
                      <div
                        key={`${item.productId}-${item.pack}`}
                        className="flex items-center gap-4 py-4"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.preview}
                          alt={product.title}
                          className="rounded-lg object-cover shrink-0"
                          style={{ width: 56, height: 56 }}
                          draggable={false}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "#f5f5f7" }}>
                            {product.title}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>
                            {PACK_LABELS[item.pack]}
                          </p>
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#f5f5f7" }}>
                          {formatPrice(price)}
                        </span>
                        <button
                          onClick={() => removeItem(item)}
                          aria-label="Remove"
                          className="cursor-pointer text-lg leading-none"
                          style={{ color: "#515154" }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: "#86868b" }}>Subtotal</span>
                    <span className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>
                      {formatPrice(subtotalCents)}
                    </span>
                  </div>
                  <button
                    onClick={goToCheckout}
                    className="w-full rounded-full py-3 text-sm font-semibold cursor-pointer"
                    style={{ background: "#f5f5f7", color: "#000" }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
