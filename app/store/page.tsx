"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WALLPAPERS,
  OTHER_PRODUCTS,
  orientationOf,
  formatPrice,
  getProduct,
  type Product,
} from "@/lib/store/catalog";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type StoreTab = "wallpapers" | "templates" | "guides";

const TABS: { id: StoreTab; label: string }[] = [
  { id: "wallpapers", label: "Wallpapers" },
  { id: "templates", label: "Templates" },
  { id: "guides", label: "Guides" },
];

function WallpaperCard({
  product,
  delay,
  isTouchDevice,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  product: Product;
  delay: number;
  isTouchDevice: boolean;
  onSelect: (p: Product) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
      className={`text-left ${isTouchDevice ? "" : "cursor-none"}`}
      style={{ background: "transparent", padding: 0, border: "none" }}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => onSelect(product)}
    >
      <div
        style={{
          aspectRatio: "4 / 5",
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0a",
          border: "12px solid #f5f1e6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.preview}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.7s ease",
            // @ts-expect-error vendor-prefixed property not in CSS types
            WebkitUserDrag: "none",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 55%)",
            opacity: hovered || isTouchDevice ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-5 pointer-events-none"
          style={{
            opacity: hovered || isTouchDevice ? 1 : 0,
            transform: hovered || isTouchDevice ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>
            {product.title}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,245,247,0.7)" }}>
            {formatPrice(product.prices.single ?? 0)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem, setDrawerOpen } = useCart();
  const [added, setAdded] = useState(false);
  const orientation = orientationOf(product.w, product.h);
  const priceCents = product.prices.single ?? 0;

  const handleAdd = () => {
    addItem({ productId: product.id, pack: "single" });
    setAdded(true);
    window.setTimeout(() => {
      onClose();
      setDrawerOpen(true);
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.32, ease: EASE }}
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col sm:flex-row"
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          maxHeight: "calc(100vh - 64px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#f5f5f7",
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          className="relative shrink-0 sm:w-[46%]"
          style={{ background: "#0a0a0a", minHeight: 280 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.preview}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-semibold" style={{ color: "#f5f5f7" }}>
            {product.title}
          </h2>
          <p className="text-sm mt-1 mb-4" style={{ color: "#86868b" }}>
            {product.subtitle}
          </p>

          {/* Same description copy the gallery lightbox shows */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#a1a1a6" }}>
            {product.description}
          </p>

          {/* Single device-agnostic price by orientation; original file */}
          <div
            className="flex items-baseline gap-3 mb-6 rounded-2xl px-4 py-4"
            style={{ background: "rgba(245,245,247,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-2xl font-semibold" style={{ color: "#f5f5f7" }}>
              {formatPrice(priceCents)}
            </span>
            <span className="text-sm capitalize" style={{ color: "#86868b" }}>
              {orientation} · {product.w} × {product.h}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="mt-auto rounded-full px-7 py-3 text-sm font-semibold cursor-pointer self-start"
            style={{
              background: "#f5f5f7",
              color: "#000",
              transition: "opacity 0.2s ease",
              opacity: added ? 0.7 : 1,
            }}
          >
            {added ? "Added to cart" : `Add to cart · ${formatPrice(priceCents)}`}
          </button>
          <p className="text-xs mt-4" style={{ color: "#515154" }}>
            The original full-resolution image, delivered by email. Personal use only.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center justify-center text-center px-8"
      style={{ minHeight: "40vh" }}
    >
      <p
        className="font-black tracking-tight"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", color: "#f5f5f7" }}
      >
        {label} are in the works.
      </p>
      <p className="text-base mt-4 max-w-md" style={{ color: "#86868b" }}>
        This shelf is being stocked. Check back soon, or grab a wallpaper while you wait.
      </p>
    </motion.div>
  );
}

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<StoreTab>("wallpapers");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { items, setDrawerOpen } = useCart();

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse) and (max-width: 767px)").matches);
  }, []);

  // Deep link from the gallery lightbox: /store?buy=<productId> opens that
  // product's modal on load. Read from location.search to avoid the
  // useSearchParams Suspense requirement on this fully-client page.
  useEffect(() => {
    const buy = new URLSearchParams(window.location.search).get("buy");
    if (!buy) return;
    const product = getProduct(buy);
    if (product) setSelected(product);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const templates = useMemo(
    () => OTHER_PRODUCTS.filter((p) => p.kind === "notion-template" || p.kind === "prompt-pack"),
    []
  );
  const guides = useMemo(() => OTHER_PRODUCTS.filter((p) => p.kind === "pdf-guide"), []);

  const cartCount = items.length;

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}>
      <div className="relative">
        <Nav />

        {/* Custom "View" cursor pill */}
        {!isTouchDevice && (
          <div
            className="fixed pointer-events-none z-[60]"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(-50%, -50%)",
              opacity: cursorVisible ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            <div
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              View
            </div>
          </div>
        )}

        {/* Cart — fixed top-right */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed top-[28px] right-6 lg:right-10 z-50 py-2 text-sm font-medium tracking-tight cursor-pointer transition-colors duration-200 hidden md:block"
          style={{ color: cartCount > 0 ? "#f5f5f7" : "#515154" }}
        >
          Cart{cartCount > 0 ? ` (${cartCount})` : ""}
        </button>

        {/* Page header */}
        <section className="pt-32 md:pt-40 pb-10 px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-black tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", color: "#f5f5f7" }}
          >
            Take a piece with you.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="text-base sm:text-lg mt-5 max-w-xl mx-auto"
            style={{ color: "#86868b" }}
          >
            The original full-resolution images from the gallery, yours to keep.
            Templates, prompt packs and guides are on the way.
          </motion.p>
        </section>

        {/* Toggle — in flow, between the header and the grid */}
        <div className="flex justify-center items-center gap-5 pb-10">
          {TABS.map((tab, i) => (
            <div key={tab.id} className="flex items-center gap-5">
              {i > 0 && (
                <span
                  aria-hidden
                  style={{ width: "1px", height: "18px", background: "rgba(245,245,247,0.18)" }}
                />
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className="relative text-sm sm:text-base font-medium tracking-tight cursor-pointer transition-colors duration-200"
                style={{ color: activeTab === tab.id ? "#f5f5f7" : "#515154", padding: "2px 0" }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="store-tab-underline"
                    className="absolute left-0 right-0"
                    style={{ bottom: -2, height: 1, background: "#f5f5f7" }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Mobile floating cart button */}
        {cartCount > 0 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-50 rounded-full px-5 py-3 text-sm font-semibold cursor-pointer"
            style={{ background: "#f5f5f7", color: "#000" }}
          >
            Cart ({cartCount})
          </button>
        )}

        <section className="px-4 sm:px-6 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === "wallpapers" ? (
              <motion.div
                key="wallpapers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE } }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {WALLPAPERS.map((product, i) => (
                  <WallpaperCard
                    key={product.id}
                    product={product}
                    delay={Math.min(i * 0.025, 0.6)}
                    isTouchDevice={isTouchDevice}
                    onSelect={setSelected}
                    onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                    onMouseMove={handleMouseMove}
                    onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
                  />
                ))}
              </motion.div>
            ) : activeTab === "templates" ? (
              templates.length > 0 ? null : <EmptyTab key="templates" label="Templates and prompt packs" />
            ) : guides.length > 0 ? null : (
              <EmptyTab key="guides" label="Guides" />
            )}
          </AnimatePresence>
        </section>

        {/* Product modal */}
        <AnimatePresence>
          {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

        <CartDrawer />
        <Contact />
      </div>
    </main>
  );
}
