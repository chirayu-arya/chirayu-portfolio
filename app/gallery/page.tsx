"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

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
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Diagonal stagger: top-left to bottom-right
function getDiagDelay(i: number): number {
  return (Math.floor(i / COLS) + (i % COLS)) * 0.055;
}

type FlipPhase = "idle" | "folding" | "unfolding";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photography");
  const [displayTab, setDisplayTab] = useState<Tab>("photography");
  const [flipPhase, setFlipPhase] = useState<FlipPhase>("idle");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const transitionLock = useRef(false);

  const photos = displayTab === "photography" ? PHOTOGRAPHY : ILLUSTRATIONS;
  const count = photos.length;

  // Total fold duration: last card starts at getDiagDelay(count-1), runs for 0.3s
  function totalFoldDuration(n: number): number {
    return getDiagDelay(n - 1) * 1000 + 320;
  }

  function switchTab(tab: Tab) {
    if (tab === activeTab || transitionLock.current) return;
    transitionLock.current = true;
    setActiveTab(tab);

    // Phase 1: fold current cards
    setFlipPhase("folding");

    const foldDur = totalFoldDuration(count);

    setTimeout(() => {
      // Swap content while cards are at 90deg (invisible)
      setDisplayTab(tab);
      // Phase 2: unfold new cards
      setFlipPhase("unfolding");

      const nextCount = tab === "photography" ? PHOTOGRAPHY.length : ILLUSTRATIONS.length;
      const unfoldDur = totalFoldDuration(nextCount);

      setTimeout(() => {
        setFlipPhase("idle");
        transitionLock.current = false;
      }, unfoldDur);
    }, foldDur);
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
      {/* Colourful background blobs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full" style={{ width: "70vmax", height: "70vmax", top: "-25vmax", left: "-15vmax", background: "radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 68%)", filter: "blur(90px)" }} />
        <div className="absolute rounded-full" style={{ width: "60vmax", height: "60vmax", top: "-10vmax", right: "-20vmax", background: "radial-gradient(ellipse, rgba(251,113,133,0.25) 0%, transparent 68%)", filter: "blur(80px)" }} />
        <div className="absolute rounded-full" style={{ width: "55vmax", height: "55vmax", top: "40vh", left: "30%", background: "radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 68%)", filter: "blur(80px)" }} />
        <div className="absolute rounded-full" style={{ width: "50vmax", height: "50vmax", bottom: "10vh", right: "-10vmax", background: "radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 68%)", filter: "blur(70px)" }} />
        <div className="absolute rounded-full" style={{ width: "45vmax", height: "45vmax", bottom: "-10vmax", left: "10%", background: "radial-gradient(ellipse, rgba(251,191,36,0.15) 0%, transparent 68%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
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
        <section className="pt-36 pb-10 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.22em] uppercase font-medium"
              style={{ color: "#86868b" }}
            >
              Gallery
            </motion.p>
          </div>
        </section>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
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
        <section className="px-4 pb-24">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ pointerEvents: flipPhase !== "idle" ? "none" : undefined }}
          >
            {photos.map((photo, i) => {
              const diagDelay = getDiagDelay(i);

              // Determine rotateY target and initial
              let rotateY = 0;
              let initialRotateY = 0;

              if (flipPhase === "folding") {
                rotateY = 90;
                initialRotateY = 0;
              } else if (flipPhase === "unfolding") {
                rotateY = 0;
                initialRotateY = 90;
              }

              return (
                <div
                  key={`${displayTab}-${photo.id}`}
                  style={{ perspective: "1200px" }}
                >
                  <motion.div
                    initial={{ rotateY: initialRotateY }}
                    animate={{ rotateY }}
                    transition={{
                      duration: 0.3,
                      delay: diagDelay,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    }}
                    style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                  >
                    {/* Card entrance animation only on first mount */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        delay: i * 0.03,
                      }}
                      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                      className="group relative overflow-hidden rounded-2xl cursor-none"
                      style={{
                        aspectRatio: "4/3",
                        background: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                      onMouseEnter={() => setCursorVisible(true)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setCursorVisible(false)}
                      onClick={() => setSelected(photo)}
                    >
                      {/* Noise texture placeholder */}
                      <div
                        className="absolute inset-0 opacity-[0.18]"
                        style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
                      />

                      {/* Glow on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 48px rgba(255,255,255,0.07)",
                        }}
                      />

                      {/* Bottom dark gradient */}
                      <div
                        className="absolute inset-x-0 bottom-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          height: "65%",
                          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
                        }}
                      />

                      {/* Text overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 p-5 pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "#f5f5f7" }}>
                          {photo.title}
                        </p>
                        <p className="text-xs" style={{ color: "#a1a1a6" }}>
                          {photo.location} · {photo.year}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
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
                <div
                  className="w-full relative"
                  style={{ aspectRatio: "4/3", background: "#0a0a0a" }}
                >
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
