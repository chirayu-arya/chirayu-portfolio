"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import PageBlobs from "../components/PageBlobs";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

type Tab = "photography" | "illustrations";

type Photo = {
  id: number;
  tab: Tab;
  title: string;
  location: string;
  year: string;
  about: string;
};

const PHOTOGRAPHY: Photo[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  tab: "photography",
  title: `Photograph ${String(i + 1).padStart(2, "0")}`,
  location: "Location, Country",
  year: "2024",
  about: "A placeholder description for this photograph. Replace with your own words about the moment, the light, or what drew you to capture it.",
}));

const ILLUSTRATIONS: Photo[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  tab: "illustrations",
  title: `Illustration ${String(i + 1).padStart(2, "0")}`,
  location: "Digital",
  year: "2024",
  about: "A placeholder description for this illustration. Replace with your own words about the concept, the medium, or what inspired it.",
}));

const COLS = 3;
// Always 30 slots — photography fills all, illustrations fills first 18 (rest are blank backs)
const MAX_SLOTS = PHOTOGRAPHY.length;

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function getDiagDelay(i: number): number {
  return (Math.floor(i / COLS) + (i % COLS)) * 0.055;
}

// Card face content — driven by hovered state passed from parent
function CardFace({
  photo,
  hovered,
}: {
  photo: Photo | null;
  hovered: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 48px rgba(255,255,255,0.07)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "65%",
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Text */}
      {photo && (
        <div
          className="absolute inset-x-0 bottom-0 p-5 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#f5f5f7" }}>
            {photo.title}
          </p>
          <p className="text-xs" style={{ color: "#a1a1a6" }}>
            {photo.location} · {photo.year}
          </p>
        </div>
      )}
    </div>
  );
}

function CardSlot({
  i,
  activeTab,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  i: number;
  activeTab: Tab;
  onSelect: (photo: Photo) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const photo = PHOTOGRAPHY[i];
  const illus = ILLUSTRATIONS[i] ?? null;
  const diagDelay = getDiagDelay(i);
  const flipRotate = activeTab === "photography" ? 0 : 180;

  const activePhoto = activeTab === "photography" ? photo : illus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: i * 0.03,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="cursor-none"
      style={{ aspectRatio: "4/3", perspective: "1200px" }}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => { if (activePhoto) onSelect(activePhoto); }}
    >
      {/* Flipper */}
      <motion.div
        animate={{ rotateY: flipRotate }}
        transition={{
          duration: 0.3,
          delay: diagDelay,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face — Photography */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardFace photo={photo} hovered={hovered && activeTab === "photography"} />
        </div>

        {/* Back face — Illustrations */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFace photo={illus} hovered={hovered && activeTab === "illustrations"} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photography");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  function switchTab(tab: Tab) {
    if (tab === activeTab || isTransitioning) return;
    setIsTransitioning(true);
    setActiveTab(tab);
    // Lock until the last card finishes: getDiagDelay(MAX_SLOTS-1) + flip duration
    const lockMs = (getDiagDelay(MAX_SLOTS - 1) + 0.35) * 1000;
    setTimeout(() => setIsTransitioning(false), lockMs);
  }

  // Close lightbox on Escape
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

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}>
      <PageBlobs palette="magenta-orange" />

      <div className="relative">
        <Nav />

        {/* Custom "View" cursor pill */}
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

        {/* Page header */}
        <section className="pt-36 pb-12 px-8 sm:px-14 lg:px-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Gallery
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
            >
              Take a deep dive.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "18rem", textAlign: "right" }}
            >
              A scrapbook for the chronically curious.
            </motion.p>
          </div>
        </section>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex justify-center pb-10"
        >
          <div
            className="flex items-center p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {(["photography", "illustrations"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: activeTab === tab ? "#000" : "rgba(255,255,255,0.5)" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#f5f5f7" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Photo grid */}
        <section className="px-8 sm:px-14 lg:px-20 pb-24">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ pointerEvents: isTransitioning ? "none" : undefined }}
          >
            {Array.from({ length: MAX_SLOTS }, (_, i) => (
              <CardSlot
                key={i}
                i={i}
                activeTab={activeTab}
                onSelect={setSelected}
                onCursorEnter={() => setCursorVisible(true)}
                onMouseMove={handleMouseMove}
                onCursorLeave={() => setCursorVisible(false)}
              />
            ))}
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selected && (
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
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
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

                {/* Image placeholder */}
                <div className="w-full relative" style={{ aspectRatio: "4/3", background: "#0a0a0a" }}>
                  <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>
                      {selected.title}
                    </h2>
                    <span className="text-sm font-medium" style={{ color: "#515154" }}>
                      {selected.year}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#86868b" }}>{selected.location}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#a1a1a6" }}>{selected.about}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Contact />
      </div>
    </main>
  );
}
