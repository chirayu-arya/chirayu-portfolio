"use client";

import AppleNav from "../components/AppleNav";
import AppleFooter from "../components/AppleFooter";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ── Design tokens (light Apple) ──────────────────────────────────────────────

const C = {
  page: "#fbfbfd",
  alt: "#f5f5f7",
  card: "#ffffff",
  hairlineSoft: "rgba(0,0,0,0.06)",
  ink: "#1d1d1f",
  ink2: "#6e6e73",
  ink3: "#86868b",
};

const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;

// ── Data ─────────────────────────────────────────────────────────────────────

type Dish = {
  id: string;
  name: string;
  note?: string;
  emoji: string;
  spineColor: string;
  image?: string;
  /** Bento span on lg+ */
  span?: "wide" | "tall" | "big" | "square";
};

const SIGNATURE: Dish[] = [
  { id: "1", name: "Butter chicken", note: "Slow. Smoky. Worth it.", emoji: "🍛", spineColor: "#8B2E1F", span: "big" },
  { id: "2", name: "Aglio e olio", note: "Three ingredients, infinite patience.", emoji: "🍝", spineColor: "#C4773B", span: "tall" },
  { id: "3", name: "Sourdough loaf", emoji: "🍞", spineColor: "#A87248", span: "tall" },
  { id: "4", name: "Korean fried chicken", emoji: "🍗", spineColor: "#B23A2A", span: "wide" },
  { id: "5", name: "Eggs, every way", emoji: "🍳", spineColor: "#D89A2A" },
  { id: "6", name: "Tacos al pastor", emoji: "🌮", spineColor: "#9C4321" },
  { id: "7", name: "Ramen, from scratch", note: "20-hour broth nights.", emoji: "🍜", spineColor: "#6F3322", span: "tall" },
  { id: "8", name: "Tiramisu", emoji: "🍰", spineColor: "#7A4A2D" },
];

const CUISINES = ["Indian", "Italian", "American", "French", "Chinese"];

// ── Tiles ────────────────────────────────────────────────────────────────────

function PlaceholderTile({ dish, className = "" }: { dish: Dish; className?: string }) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${dish.spineColor} 0%, rgba(0,0,0,0.35) 100%)`,
      }}
    >
      {dish.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dish.image}
          alt={dish.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: NOISE, opacity: 0.10, mixBlendMode: "overlay" }}
      />
      {!dish.image && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", opacity: 0.6 }}>{dish.emoji}</span>
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p
          className="text-sm sm:text-base font-semibold"
          style={{ color: "#f5f5f7", letterSpacing: "-0.01em" }}
        >
          {dish.name}
        </p>
        {dish.note && (
          <p className="text-xs mt-1" style={{ color: "rgba(245,245,247,0.78)" }}>
            {dish.note}
          </p>
        )}
      </div>
    </div>
  );
}

function BentoTile({ dish, index }: { dish: Dish; index: number }) {
  const span =
    dish.span === "big"
      ? "lg:col-span-2 lg:row-span-2"
      : dish.span === "wide"
      ? "lg:col-span-2"
      : dish.span === "tall"
      ? "lg:row-span-2"
      : "";

  const minH =
    dish.span === "big"
      ? "min-h-[420px] lg:min-h-[520px]"
      : dish.span === "tall"
      ? "min-h-[420px] lg:min-h-[520px]"
      : "min-h-[240px] lg:min-h-[250px]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.05 }}
      className={`relative ${span} ${minH}`}
    >
      <PlaceholderTile dish={dish} />
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CookingPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.page, fontFamily: SF }}
    >
      <AppleNav />

      <div className="relative z-10 px-8 sm:px-14 lg:px-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-12">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <motion.h1
              className="font-semibold"
              style={{
                fontSize: "clamp(2.4rem, 6.2vw, 6rem)",
                color: C.ink,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                padding: "0.1em 0",
              }}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            >
              Here&apos;s what&apos;s cooking.
            </motion.h1>
            <motion.p
              className="text-sm hidden sm:block"
              style={{ color: C.ink2, paddingBottom: "0.4rem", maxWidth: "26rem", textAlign: "right" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            >
              The dishes I make and the flavours I keep coming back to.
            </motion.p>
          </div>

          {/* Cuisines as inline text — type-led, no pills */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="mt-8 text-sm"
            style={{ color: C.ink2 }}
          >
            <span style={{ color: C.ink3, marginRight: "0.6rem" }}>Cuisines</span>
            {CUISINES.map((c, i) => (
              <span key={c} style={{ color: C.ink }}>
                {i > 0 && <span style={{ color: C.ink3, margin: "0 0.45rem" }}>·</span>}
                {c}
              </span>
            ))}
          </motion.p>
        </section>

        <div className="flex flex-col gap-20 pb-24">
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:auto-rows-[250px] lg:[grid-auto-flow:dense]">
              {SIGNATURE.map((dish, i) => (
                <BentoTile key={dish.id} dish={dish} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <AppleFooter />
    </main>
  );
}
