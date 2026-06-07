"use client";

import AppleNav from "./components/AppleNav";
import AppleFooter from "./components/AppleFooter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Light Apple palette ──
const C = {
  page: "#fbfbfd",
  alt: "#f5f5f7",
  card: "#ffffff",
  hairline: "rgba(0,0,0,0.08)",
  hairlineSoft: "rgba(0,0,0,0.06)",
  ink: "#1d1d1f",
  ink2: "#6e6e73",
  ink3: "#86868b",
  link: "#0066cc",
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;

// ── Hero — gradient mesh + floating geometric shapes (Apple Big Sur × dev page hybrid) ──

// Big soft radial blobs that slowly drift to create a liquid gradient mesh behind the headline.
const MESH_BLOBS = [
  { color: "rgba(255,107,157,0.42)",  size: "62vmax", x: "-12%", y: "-18%", drift: { x: 60,  y: 40 },  duration: 22 }, // pink, top-left
  { color: "rgba(94, 197, 255, 0.40)", size: "55vmax", x: "62%",  y: "-22%", drift: { x: -50, y: 60 },  duration: 26 }, // sky, top-right
  { color: "rgba(155,109,255,0.38)",  size: "50vmax", x: "-8%",  y: "55%",  drift: { x: 70,  y: -40 }, duration: 30 }, // violet, bottom-left
  { color: "rgba(255,200,87,0.40)",   size: "48vmax", x: "55%",  y: "60%",  drift: { x: -60, y: -50 }, duration: 28 }, // amber, bottom-right
  { color: "rgba(78,204,163,0.32)",   size: "44vmax", x: "30%",  y: "20%",  drift: { x: 40,  y: 50 },  duration: 24 }, // mint, center
];

// Smaller geometric primitives around the edges — adds the "explosion" personality.
const SHAPES = [
  { kind: "ring",     gradient: "linear-gradient(135deg, #ff6b9d, #ff8c61)",  size: 110, x: "8%",  y: "16%", float: 18, rotate: [0, 8],  duration: 9 },
  { kind: "circle",   gradient: "linear-gradient(135deg, #ffc857, #ff8c61)",  size: 64,  x: "84%", y: "14%", float: 14, rotate: [0, 0],  duration: 7 },
  { kind: "square",   gradient: "linear-gradient(135deg, #5ec5ff, #9b6dff)",  size: 78,  x: "12%", y: "78%", float: 22, rotate: [-12, 4], duration: 11 },
  { kind: "triangle", gradient: "linear-gradient(135deg, #4ecca3, #5ec5ff)",  size: 96,  x: "82%", y: "76%", float: 16, rotate: [10, -6], duration: 10 },
  { kind: "circle",   gradient: "linear-gradient(135deg, #ff6b9d, #9b6dff)",  size: 28,  x: "44%", y: "10%", float: 10, rotate: [0, 0],  duration: 6 },
  { kind: "ring",     gradient: "linear-gradient(135deg, #ffc857, #4ecca3)",  size: 56,  x: "56%", y: "84%", float: 14, rotate: [0, 0],  duration: 8 },
];

function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ overflow: "hidden" }}>
      {/* Liquid gradient mesh */}
      <div className="absolute inset-0" style={{ filter: "blur(70px)" }}>
        {MESH_BLOBS.map((blob, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, blob.drift.x, -blob.drift.x * 0.6, 0],
              y: [0, blob.drift.y, -blob.drift.y * 0.6, 0],
            }}
            transition={{ duration: blob.duration, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x,
              top: blob.y,
              background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 60%)`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes — sharp, vivid, gently animated */}
      {SHAPES.map((s, i) => (
        <motion.div
          key={`shape-${i}`}
          initial={{ y: 0, rotate: s.rotate[0], opacity: 0 }}
          animate={{ y: [-s.float, s.float, -s.float], rotate: s.rotate, opacity: 0.95 }}
          transition={{
            y: { duration: s.duration, ease: "easeInOut", repeat: Infinity },
            rotate: { duration: s.duration * 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
            opacity: { duration: 1.2, delay: 0.3 + i * 0.08, ease: "easeOut" },
          }}
          style={{ position: "absolute", left: s.x, top: s.y }}
        >
          <div style={{ position: "relative", width: s.size, height: s.size }}>
            {s.kind === "ring" ? (
              <div
                style={{
                  width: s.size,
                  height: s.size,
                  borderRadius: "9999px",
                  padding: Math.max(4, Math.round(s.size * 0.09)),
                  background: s.gradient,
                }}
              >
                <div style={{ width: "100%", height: "100%", borderRadius: "9999px", background: C.page }} />
              </div>
            ) : s.kind === "circle" ? (
              <div style={{ width: s.size, height: s.size, borderRadius: "9999px", background: s.gradient }} />
            ) : s.kind === "square" ? (
              <div style={{ width: s.size, height: s.size, borderRadius: 14, background: s.gradient }} />
            ) : (
              <div
                style={{
                  width: s.size,
                  height: s.size,
                  background: s.gradient,
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                }}
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Soft white veil behind the text so the headline always stays legible */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "90vmin",
          height: "60vmin",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, rgba(251,251,253,0.65) 0%, rgba(251,251,253,0) 70%)",
        }}
      />
    </div>
  );
}

function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-8"
      style={{ background: C.page, fontFamily: SF }}
    >
      <HeroBackground />

      <div className="relative" style={{ maxWidth: "96rem", zIndex: 10 }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="font-semibold"
          style={{
            fontSize: "clamp(3rem, 9vw, 9rem)",
            color: C.ink,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            margin: 0,
          }}
        >
          Chirayu Arya.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.65 }}
          className="mx-auto mt-8"
          style={{
            color: C.ink2,
            fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            maxWidth: "70rem",
            fontWeight: 400,
          }}
        >
          Designer and marketer working at the intersection of craft, product, and growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <a href="#about" style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}>
            See the work <span style={{ marginLeft: 4 }}>›</span>
          </a>
          <a href="/about" style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}>
            About me <span style={{ marginLeft: 4 }}>›</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── StoryTile — the Apple section pattern: eyebrow → headline → supporting → blue link → visual ──
function StoryTile({
  id,
  eyebrow,
  headline,
  supporting,
  linkLabel,
  linkHref,
  linkTarget,
  bg,
  ink,
  ink2,
  visual,
  align = "center",
  minHeight = "min-h-screen",
}: {
  id?: string;
  eyebrow: string;
  headline: React.ReactNode;
  supporting?: string;
  linkLabel?: string;
  linkHref?: string;
  linkTarget?: string;
  bg: string;
  ink: string;
  ink2: string;
  visual?: React.ReactNode;
  align?: "center" | "left";
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${minHeight} flex flex-col`}
      style={{ background: bg, fontFamily: SF }}
    >
      <div
        className={`flex flex-col ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        } justify-start px-8 sm:px-14 lg:px-20 pt-28 pb-10`}
      >
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.08 }}
          className="font-semibold"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 6rem)",
            color: ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.2,
            padding: "0.15em 0",
            maxWidth: align === "center" ? "72rem" : "62rem",
          }}
        >
          {headline}
        </motion.h2>

        {supporting && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-5"
            style={{
              color: ink2,
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              maxWidth: "58rem",
              fontWeight: 400,
            }}
          >
            {supporting}
          </motion.p>
        )}

        {linkLabel && linkHref && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            href={linkHref}
            target={linkTarget}
            rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
            className="mt-7"
            style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            {linkLabel} <span style={{ marginLeft: 4 }}>›</span>
          </motion.a>
        )}
      </div>

      {visual && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          className="flex-1 w-full flex items-end justify-center"
        >
          {visual}
        </motion.div>
      )}
    </section>
  );
}

// Featured image visual — rounded top, clipped at bottom of tile
// Tech stack pills (light Apple variant) — colored dot prefix on a white pill with hairline.
const TECH_STACK: { category: string; tools: { name: string; color: string }[] }[] = [
  { category: "Design", tools: [
    { name: "Figma", color: "#F24E1E" },
    { name: "Photoshop", color: "#31A8FF" },
    { name: "Illustrator", color: "#FF9A00" },
    { name: "Spline", color: "#7C6EFA" },
    { name: "Blender", color: "#E87D0D" },
  ]},
  { category: "Video & Motion", tools: [
    { name: "Final Cut Pro", color: "#888" },
    { name: "Premiere Pro", color: "#9999FF" },
    { name: "After Effects", color: "#9999FF" },
  ]},
  { category: "Analytics", tools: [
    { name: "Power BI", color: "#F2C811" },
    { name: "Tableau", color: "#E97627" },
  ]},
  { category: "AI", tools: [
    { name: "Claude", color: "#D4A574" },
    { name: "ChatGPT", color: "#74AA9C" },
    { name: "Gemini", color: "#8AB4F8" },
  ]},
  { category: "CRM", tools: [
    { name: "HubSpot", color: "#FF7A59" },
    { name: "Apollo.io", color: "#6C63FF" },
    { name: "Salesforce", color: "#00A1E0" },
  ]},
];

// Centered, stacked layout: category eyebrow above, tools wrap below centered around the
// page axis. Hairline divider between each group. Balanced regardless of category word length.
function TechStackPills() {
  return (
    <div className="w-full">
      {TECH_STACK.map((group, i) => (
        <div
          key={group.category}
          className="py-5 text-center lg:text-left"
          style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairlineSoft}` }}
        >
          <div
            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3"
            style={{ color: C.ink, fontSize: "clamp(1rem, 1.15vw, 1.15rem)", letterSpacing: "-0.01em" }}
          >
            {group.tools.map((tool) => (
              <span key={tool.name} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block rounded-full"
                  style={{ width: 7, height: 7, background: tool.color }}
                />
                <span>{tool.name}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutVisual() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 pt-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Portrait */}
        <div
          className="w-full"
          style={{
            aspectRatio: "4 / 5",
            backgroundImage: "url(/chirayu-wide.png)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            borderRadius: "18px",
          }}
        />
        {/* Tech stack */}
        <div className="w-full">
          <TechStackPills />
        </div>
      </div>
    </div>
  );
}

function ImageVisual({ src, alt, maxW = "60rem" }: { src: string; alt: string; maxW?: string }) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: maxW,
        margin: "0 auto",
        aspectRatio: "16 / 10",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "18px 18px 0 0",
        background: src ? undefined : C.alt,
      }}
    />
  );
}

// ── Featured carousel (Apple TV homepage pattern) ──
type FeaturedCard = {
  id: number;
  eyebrow: string;
  title: string;
  caption: string;
  cta: string;
  href: string;
  image?: string;
  youtube?: string;
  /** When true, clicking the CTA opens an in-page lightbox modal instead of navigating. */
  lightbox?: boolean;
  /** When true, the CTA opens in a new tab and renders a top-right arrow on the pill. */
  external?: boolean;
};

const FEATURED_CARDS: FeaturedCard[] = [
  {
    id: 1,
    eyebrow: "Times Square Showcase",
    title: "Aurora.",
    caption: "Illustration · Featured on the Times Square billboard, June 2025.",
    cta: "View",
    href: "#",
    image: "/TS-feature-1.png",
    lightbox: true,
  },
  {
    id: 2,
    eyebrow: "Fuqua MMS Blogs",
    title: "Becoming a leader in Web3 at Duke.",
    caption: "Featured on the official Fuqua MMS blog, April 2023.",
    cta: "Read",
    href: "https://blogs.fuqua.duke.edu/duke-mms/2023/04/05/chirayu-arya/becoming-a-leader-in-web3-at-fuqua",
    image: "/Chirayu-Arya-Becoming-a-Leader-in-Web3-at-Fuqua.png",
    external: true,
  },
  {
    id: 3,
    eyebrow: "YouTube",
    title: "Blue Devil Coin.",
    caption: "Launch film · A student-led crypto project at Duke, March 2023.",
    cta: "Watch",
    href: "https://www.youtube.com/watch?v=qDZOsjGx39k",
    youtube: "qDZOsjGx39k",
  },
];

const AUTOPLAY_MS = 5000;
// Render 3 copies of FEATURED_CARDS so the autoplay can keep marching forward forever.
// Once we cross out of the middle copy into the last copy, we silently snap the scroll
// position back to the equivalent card in the middle copy — visually identical, so the
// user sees 1-2-3-1-2-3-1-2-3... ad infinitum.
const SET_COPIES = 3;
const REAL_LEN = FEATURED_CARDS.length;
const MIDDLE_START = REAL_LEN; // first card of the middle copy
const RENDERED_CARDS = Array.from({ length: SET_COPIES * REAL_LEN }, (_, i) => ({
  card: FEATURED_CARDS[i % REAL_LEN],
  key: i,
}));

const TRANSITION_MS = 800;
const TRANSITION_CURVE = "cubic-bezier(0.22, 1, 0.36, 1)";

function FeaturedCarousel() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // `domIndex` is the index into the rendered (cloned) list. `dotIndex` derived via `% REAL_LEN`.
  const [domIndex, setDomIndex] = useState(MIDDLE_START);
  const [offsetPx, setOffsetPx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const [lightboxCard, setLightboxCard] = useState<FeaturedCard | null>(null);

  useEffect(() => {
    if (!lightboxCard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxCard(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxCard]);

  // Pause autoplay while the lightbox is open.
  useEffect(() => {
    setPaused(!!lightboxCard);
  }, [lightboxCard]);
  const domIndexRef = useRef(MIDDLE_START);
  domIndexRef.current = domIndex;

  // Compute the translateX offset that centers the card at `idx` in the viewport.
  const computeOffset = (idx: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return 0;
    return -(card.offsetLeft + card.clientWidth / 2 - viewport.clientWidth / 2);
  };

  // Initial centering (no animation) — and re-center on window resize.
  useEffect(() => {
    const center = () => setOffsetPx(computeOffset(domIndexRef.current));
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, []);

  // After the transform transition completes, if we crossed out of the middle copy, silently
  // jump back to the equivalent card in the middle copy (same card, same neighbors — invisible).
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    const idx = domIndexRef.current;
    let newIdx = idx;
    if (idx >= MIDDLE_START + REAL_LEN) newIdx = idx - REAL_LEN;
    else if (idx < MIDDLE_START) newIdx = idx + REAL_LEN;
    if (newIdx === idx) {
      setAnimating(false);
      return;
    }
    // Snap silently: disable transition, change index + offset in same React commit.
    setAnimating(false);
    domIndexRef.current = newIdx;
    setDomIndex(newIdx);
    setOffsetPx(computeOffset(newIdx));
  };

  const goToDomIndex = (i: number) => {
    domIndexRef.current = i;
    setDomIndex(i);
    setAnimating(true);
    setOffsetPx(computeOffset(i));
  };

  // Dot indicator click: scroll to nearest copy of the requested real card.
  const scrollToReal = (real: number) => {
    const currentReal = ((domIndexRef.current % REAL_LEN) + REAL_LEN) % REAL_LEN;
    const target = domIndexRef.current + (real - currentReal);
    goToDomIndex(target);
  };

  // Autoplay — advance one card every AUTOPLAY_MS, unless the cursor is hovering a card.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      goToDomIndex(domIndexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, []);

  const dotIndex = ((domIndex % REAL_LEN) + REAL_LEN) % REAL_LEN;

  return (
    <section
      id="featured"
      className="relative pt-28 pb-20"
      style={{ background: C.alt, fontFamily: SF }}
    >
      <div ref={headerRef} className="text-center px-8 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.08 }}
          className="font-semibold mx-auto"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 6rem)",
            color: C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.2,
            maxWidth: "72rem",
          }}
        >
          Moments worth pointing at.
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, ease: EASE, delay: 0.25 }}
      >
        <div
          ref={viewportRef}
          className="overflow-hidden"
          style={{ paddingBottom: "1.5rem" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex gap-3"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(${offsetPx}px, 0, 0)`,
              transition: animating ? `transform ${TRANSITION_MS}ms ${TRANSITION_CURVE}` : "none",
              willChange: "transform",
            }}
          >
          {RENDERED_CARDS.map(({ card, key }) => {
            const Inner = card.youtube ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${card.youtube}?rel=0`}
                title={card.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: "100%", height: "100%", display: "block", border: "none" }}
              />
            ) : (
              <img
                src={card.image}
                alt={card.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            );

            return (
              <div
                key={key}
                style={{
                  flex: "0 0 min(53vw, 816px)",
                }}
              >
                {/* Card */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    overflow: "hidden",
                    background: card.youtube ? "#000" : C.alt,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.10)",
                  }}
                >
                  {Inner}

                  {/* CTA pill — bottom-right */}
                  {!card.youtube && (() => {
                    const pillStyle: React.CSSProperties = {
                      position: "absolute",
                      right: 28,
                      bottom: 28,
                      background: C.card,
                      color: C.ink,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.10)",
                      transition: "transform 0.2s ease",
                    };
                    const onEnter = (e: React.MouseEvent<HTMLElement>) =>
                      ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)");
                    const onLeave = (e: React.MouseEvent<HTMLElement>) =>
                      ((e.currentTarget as HTMLElement).style.transform = "translateY(0)");

                    if (card.lightbox) {
                      return (
                        <button
                          type="button"
                          onClick={() => setLightboxCard(card)}
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium cursor-pointer border-0"
                          style={pillStyle}
                          onMouseEnter={onEnter}
                          onMouseLeave={onLeave}
                        >
                          {card.cta}
                        </button>
                      );
                    }
                    return (
                      <a
                        href={card.href}
                        target={card.external ? "_blank" : undefined}
                        rel={card.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-medium cursor-pointer"
                        style={pillStyle}
                        onMouseEnter={onEnter}
                        onMouseLeave={onLeave}
                      >
                        {card.cta}
                        {card.external && (
                          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
                            <path
                              d="M3 10L10 3M10 3H4.5M10 3V8.5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </a>
                    );
                  })()}
                </div>

                {/* Caption — one line: bold title · light description */}
                <p className="mt-5 px-1 text-sm" style={{ color: C.ink2 }}>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{card.title.replace(/\.$/, "")}</span>
                  <span style={{ margin: "0 0.4rem", color: C.ink3 }}>·</span>
                  {card.caption}
                </p>
              </div>
            );
          })}
          </div>
        </div>
      </motion.div>

      {/* Dot indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={headerInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center justify-center gap-2 mt-8"
      >
        {FEATURED_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToReal(i)}
            aria-label={`Go to featured ${i + 1}`}
            style={{
              width: dotIndex === i ? "1.75rem" : "0.5rem",
              height: "0.5rem",
              borderRadius: "9999px",
              background: dotIndex === i ? C.ink : "rgba(0,0,0,0.18)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </motion.div>

      {/* Lightbox modal — gallery-style dark backdrop for in-page image cards */}
      <AnimatePresence>
        {lightboxCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
              background: "rgba(20,20,22,0.85)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            onClick={() => setLightboxCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxCard(null)}
                aria-label="Close"
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
              {lightboxCard.image && (
                <div className="w-full relative" style={{ aspectRatio: "16 / 10", background: "#0a0a0a" }}>
                  <img
                    src={lightboxCard.image}
                    alt={lightboxCard.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-1" style={{ color: "#f5f5f7" }}>
                  {lightboxCard.title}
                </h2>
                <p className="text-sm" style={{ color: "#86868b" }}>
                  {lightboxCard.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function YouTubeVisual({ id, maxW = "60rem" }: { id: string; maxW?: string }) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: maxW,
        margin: "0 auto",
        aspectRatio: "16 / 10",
        borderRadius: "18px 18px 0 0",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: "100%", height: "100%", display: "block", border: "none" }}
      />
    </div>
  );
}

// ── At a Glance stats visual ──
function StatNumber({ value, inView, delay }: { value: string; inView: boolean; delay: number }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", lineHeight: 1, paddingBottom: "0.08em" }}>
      <motion.span
        style={{ display: "block", lineHeight: 1, whiteSpace: "nowrap" }}
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1.0, ease: EASE, delay }}
      >
        {value}
      </motion.span>
    </span>
  );
}

// ── 2x2 project tiles (Apple homepage pattern) ──
type ProjectTile = {
  id: number;
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryHref: string;
  primaryExternal?: boolean;
  secondaryCTA?: string;
  secondaryHref?: string;
  bg: string;
  /** CSS background for the visual area (gradient, image url, or solid color). */
  visualBg: string;
};

const PROJECT_TILES: ProjectTile[] = [
  {
    id: 1,
    title: "SiteMarker",
    subtitle: "Marketing systems for construction tech.",
    primaryCTA: "Learn more",
    primaryHref: "https://sitemarker.io",
    primaryExternal: true,
    bg: "#f5f5f7",
    visualBg: "linear-gradient(135deg, #d6e4ff 0%, #f0f4ff 100%)",
  },
  {
    id: 2,
    title: "Apex",
    subtitle: "A newsletter, 200K+ students strong.",
    primaryCTA: "Read more",
    primaryHref: "#",
    bg: "#eef3f0",
    visualBg: "linear-gradient(135deg, #c8e6dd 0%, #e8f4f0 100%)",
  },
  {
    id: 3,
    title: "Enso Homes",
    subtitle: "A wellness-focused homebuilding brand.",
    primaryCTA: "Learn more",
    primaryHref: "https://ensohomes.com",
    primaryExternal: true,
    bg: "#f4efe8",
    visualBg: "linear-gradient(135deg, #e8d9c4 0%, #f5ece0 100%)",
  },
  {
    id: 4,
    title: "Web3 at Duke",
    subtitle: "Conviction at the emerging frontier.",
    primaryCTA: "Read the essay",
    primaryHref: "https://blogs.fuqua.duke.edu/duke-mms/2023/04/05/chirayu-arya/becoming-a-leader-in-web3-at-fuqua",
    primaryExternal: true,
    bg: "#eef1f7",
    visualBg: "linear-gradient(135deg, #c4d0e8 0%, #e6ecf5 100%)",
  },
];

function ProjectTiles() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 pt-8">
      {PROJECT_TILES.map((tile, i) => (
        <motion.div
          key={tile.id}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.08 }}
          className="relative overflow-hidden flex flex-col"
          style={{ background: tile.bg, aspectRatio: "5 / 4" }}
        >
          {/* Header: title, subtitle, CTAs */}
          <div className="text-center pt-14 px-8" style={{ position: "relative", zIndex: 2 }}>
            <h3
              className="font-semibold"
              style={{
                fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
                color: C.ink,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                marginBottom: "0.4rem",
              }}
            >
              {tile.title}
            </h3>
            <p style={{ color: C.ink, fontSize: "clamp(1rem, 1.3vw, 1.2rem)", marginBottom: "1.4rem", letterSpacing: "-0.01em" }}>
              {tile.subtitle}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={tile.primaryHref}
                target={tile.primaryExternal ? "_blank" : undefined}
                rel={tile.primaryExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium cursor-pointer"
                style={{ background: C.link, color: "#ffffff", transition: "opacity 0.18s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                {tile.primaryCTA}
              </a>
              {tile.secondaryCTA && tile.secondaryHref && (
                <a
                  href={tile.secondaryHref}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium cursor-pointer"
                  style={{ background: "transparent", color: C.link, border: `1px solid ${C.link}`, transition: "background 0.18s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,102,204,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  {tile.secondaryCTA}
                </a>
              )}
            </div>
          </div>

          {/* Visual placeholder filling the bottom of the tile */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "55%",
              background: tile.visualBg,
              maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function StatsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const stats = [
    { value: "4+", label: "Years of Experience" },
    { value: "3M+", label: "Members Across Communities" },
    { value: "5M+", label: "Monthly Impressions" },
    { value: "$1.7M", label: "Sales Pipeline Built" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 w-full max-w-7xl mx-auto pt-12 pb-20 px-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div
            className="font-semibold leading-none mb-4"
            style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: C.ink, letterSpacing: "-0.04em" }}
          >
            <StatNumber value={stat.value} inView={inView} delay={0.15 + i * 0.12} />
          </div>
          <p className="text-xs uppercase tracking-[0.16em] font-medium" style={{ color: C.ink3 }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Polaroid scatter (only old-visual kept per request) ──
const VP = "/Gallery/Photography/Virtual%20Photography";
const RP = "/Gallery/Photography/Real%20Photography";

const POLAROIDS = [
  { id: 1, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg`, rotation: -14, left: "0%",  top: "2%",  fromX: -900, z: 2, w: "22vw", delay: 0 },
  { id: 2, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG`,                                  rotation: 9,   left: "24%", top: "-3%", fromX: 900,  z: 3, w: "21vw", delay: 0.07 },
  { id: 3, src: `${VP}/Spider%20Man%202/IMG_7733.JPG`,                                    rotation: -5,  left: "48%", top: "4%",  fromX: -900, z: 2, w: "22vw", delay: 0.14 },
  { id: 4, src: `${VP}/Avatar/IMG_8200.JPG`,                                              rotation: 17,  left: "72%", top: "-2%", fromX: 900,  z: 1, w: "20vw", delay: 0.04 },
  { id: 5, src: `${RP}/IMG_6865.jpg`,                                                     rotation: -18, left: "3%",  top: "46%", fromX: -900, z: 4, w: "23vw", delay: 0.19 },
  { id: 6, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG`,                               rotation: 7,   left: "27%", top: "43%", fromX: 900,  z: 3, w: "21vw", delay: 0.11 },
  { id: 7, src: `${VP}/Expedition%2033/IMG_9360.jpg`,                                     rotation: -11, left: "54%", top: "50%", fromX: -900, z: 2, w: "20vw", delay: 0.23 },
  { id: 8, src: `${VP}/Spider%20Man%202/IMG_7743.JPG`,                                    rotation: 13,  left: "76%", top: "45%", fromX: 900,  z: 1, w: "21vw", delay: 0.16 },
];
const MOBILE_ROT = [-8, 5, -12, 9, -4, 14, -7, 11];

function Polaroid({ p, inView }: { p: (typeof POLAROIDS)[0]; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ x: p.fromX, opacity: 0, rotate: p.rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: p.rotation } : {}}
      transition={{ duration: 1.0, ease: EASE, delay: p.delay }}
      whileHover={{ scale: 1.1, rotate: p.rotation * 0.1, zIndex: 50, transition: { duration: 0.28, ease: EASE } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "absolute", left: p.left, top: p.top, zIndex: p.z, width: p.w, cursor: "pointer", willChange: "transform" }}
    >
      <div
        style={{
          background: "#fff",
          padding: "10px 10px 44px 10px",
          filter: hovered
            ? "drop-shadow(0 14px 36px rgba(0,0,0,0.18)) drop-shadow(0 4px 14px rgba(0,0,0,0.10))"
            : "drop-shadow(0 10px 28px rgba(0,0,0,0.14)) drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
          transition: "filter 0.3s ease",
        }}
      >
        <img src={p.src} alt={`Photography ${p.id}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
      </div>
    </motion.div>
  );
}

function MobilePolaroid({ p, rotation, inView, delay }: { p: (typeof POLAROIDS)[0]; rotation: number; inView: boolean; delay: number }) {
  const fromX = rotation > 0 ? 400 : -400;
  return (
    <motion.div
      initial={{ x: fromX, opacity: 0, rotate: rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: rotation } : {}}
      transition={{ duration: 0.95, ease: EASE, delay }}
      whileHover={{ scale: 1.08, rotate: rotation * 0.1, zIndex: 50, transition: { duration: 0.25 } }}
      style={{ cursor: "pointer", willChange: "transform" }}
    >
      <div
        style={{
          background: "#fff",
          padding: "8px 8px 34px 8px",
          filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.14)) drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
        }}
      >
        <img src={p.src} alt={`Photography ${p.id}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
      </div>
    </motion.div>
  );
}

function PolaroidVisual() {
  const scatterRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const inView = useInView(scatterRef, { once: true, margin: "-5%" });
  const mobileInView = useInView(mobileRef, { once: true, margin: "-5%" });

  return (
    <div className="w-full">
      <div ref={mobileRef} className="md:hidden grid grid-cols-2 gap-6 px-8" style={{ paddingBottom: "2rem" }}>
        {POLAROIDS.map((p, i) => (
          <MobilePolaroid key={p.id} p={p} rotation={MOBILE_ROT[i]} inView={mobileInView} delay={i * 0.07} />
        ))}
      </div>
      <div ref={scatterRef} className="hidden md:block" style={{ position: "relative", height: "54vw" }}>
        {POLAROIDS.map((p) => (
          <Polaroid key={p.id} p={p} inView={inView} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: C.page, fontFamily: SF }}>
      <AppleNav />
      <Hero />

      {/* About */}
      <StoryTile
        id="about"
        eyebrow="About Me"
        headline={
          <>
            I make things people <span style={{ color: C.ink2 }}>actually pay attention to.</span>
          </>
        }
        supporting="Designing things that create an impact, and figuring out how to grow them. A few years across startups, communities, newsletters, and campaigns that reached millions."
        linkLabel="More about me"
        linkHref="/about"
        bg={C.page}
        ink={C.ink}
        ink2={C.ink2}
        visual={<AboutVisual />}
      />

      {/* Featured — horizontal carousel (Apple TV homepage pattern) */}
      <FeaturedCarousel />

      {/* At a Glance + Stats */}
      <StoryTile
        id="work"
        eyebrow="At a Glance"
        headline={
          <>
            Projects that speak <span style={{ color: C.ink2 }}>for themselves.</span>
          </>
        }
        bg={C.page}
        ink={C.ink}
        ink2={C.ink2}
        visual={
          <div className="w-full">
            <ProjectTiles />
            <StatsVisual />
          </div>
        }
        minHeight=""
      />

      {/* Photography */}
      <StoryTile
        id="photography"
        eyebrow="Photography"
        headline={
          <>
            Capturing moments, <span style={{ color: C.ink2 }}>both real &amp; virtual.</span>
          </>
        }
        supporting="Shot on a camera. Or a television. The best shots don't ask which world they're from."
        linkLabel="Gallery Mode"
        linkHref="/gallery"
        bg={C.alt}
        ink={C.ink}
        ink2={C.ink2}
        visual={<PolaroidVisual />}
      />

      <AppleFooter />
    </main>
  );
}
