"use client";

// ── Story Mode modal ─────────────────────────────────────────────────────────
// Reusable case-study "chapter" modal: reveals a sequence of story cards one
// at a time with prev/next navigation and a progress dial. Used by /work
// case studies to walk through a build story beat by beat.

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export type StoryStat = { value: string; label: string };

export type StoryCard = {
  label: string; // e.g. "01 / The Setup"
  headline: string;
  body: string;
  stats?: StoryStat[]; // optional, renders as a stat grid instead of the visual pane
  closing?: string; // optional closing line under stats
};

interface StoryModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string; // e.g. "Media Brand"
  title: string; // e.g. "Apex"
  cards: StoryCard[];
  accent?: string; // rgb triple, e.g. "43,92,255" — defaults to crimson
}

export default function StoryModal({
  open,
  onClose,
  eyebrow,
  title,
  cards,
  accent = "220,20,60",
}: StoryModalProps) {
  const [index, setIndex] = useState(0);

  // Reset to the first card the instant the modal opens, synchronously
  // during render rather than in an effect, so there's never a frame where
  // stale leftover state and a fresh mount disagree with each other.
  const prevOpenRef = useRef(open);
  if (open && !prevOpenRef.current && index !== 0) {
    setIndex(0);
  }
  prevOpenRef.current = open;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex(i => Math.min(cards.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex(i => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cards.length, onClose]);

  const card = cards[index];
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;

  return (
    <AnimatePresence>
      {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          width: "min(1560px, 96vw)",
          maxHeight: "calc(100vh - 24px)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient tint */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, rgba(${accent},0.16) 0%, transparent 55%)`,
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#f5f5f7",
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <div className="relative px-8 sm:px-14 pt-9 pb-2 shrink-0">
          <p
            className="text-xs tracking-[0.22em] uppercase font-medium mb-2"
            style={{ color: `rgba(${accent},0.9)` }}
          >
            {eyebrow}
          </p>
          <h2
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "#f5f5f7" }}
          >
            {title}
          </h2>
        </div>

        {/* Card content — remounts on key change, no exit animation, so it
            can never get stuck mid-transition between structurally
            different cards (text card vs. stats-grid card). A modest
            min-height gives it some presence without ever forcing scroll,
            since the wider modal means content never gets close to it. */}
        <div
          className="relative px-8 sm:px-14 py-8 overflow-visible"
          style={{ minHeight: "clamp(380px, 46vh, 460px)" }}
        >
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={card.stats ? "" : "grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-10 sm:gap-14 items-start"}
          >
            {!card.stats && (
              <div
                className="hidden sm:flex rounded-2xl items-center justify-center shrink-0"
                style={{
                  aspectRatio: "4 / 3",
                  background: `linear-gradient(150deg, rgba(${accent},0.22) 0%, rgba(255,255,255,0.03) 100%)`,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="font-black select-none"
                  style={{ fontSize: "6.5rem", color: `rgba(${accent},0.35)` }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            )}

            <div>
              <p
                className="text-xs uppercase tracking-[0.16em] font-medium mb-6"
                style={{ color: "#515154" }}
              >
                {card.label}
              </p>
              <h3
                className="font-black tracking-tight leading-[0.98] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#f5f5f7" }}
              >
                {card.headline}
              </h3>
              {card.body && (
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: "#a1a1a6" }}>
                  {card.body}
                </p>
              )}

              {card.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-10 pt-6">
                  {card.stats.map(stat => (
                    <div key={stat.label}>
                      <div
                        className="font-black tracking-tight leading-none mb-2"
                        style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", color: `rgb(${accent})` }}
                      >
                        {stat.value}
                      </div>
                      <p className="text-xs uppercase tracking-[0.14em] font-medium" style={{ color: "#515154" }}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {card.closing && (
                <p className="text-base sm:text-lg leading-relaxed mt-8" style={{ color: "#f5f5f7" }}>
                  {card.closing}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer nav */}
        <div
          className="relative flex items-center justify-between px-8 sm:px-14 py-6 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            disabled={isFirst}
            className="text-sm font-medium flex items-center gap-2"
            style={{ color: isFirst ? "#3a3a3c" : "#f5f5f7", cursor: isFirst ? "default" : "pointer" }}
          >
            <span aria-hidden>←</span> Back
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to card ${i + 1}`}
                className="cursor-pointer"
                style={{
                  width: i === index ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === index ? `rgb(${accent})` : "rgba(255,255,255,0.15)",
                  transition: "width 0.24s ease, background 0.24s ease",
                }}
              />
            ))}
          </div>

          {isLast ? (
            <button onClick={onClose} className="text-sm font-medium cursor-pointer" style={{ color: `rgb(${accent})` }}>
              Done
            </button>
          ) : (
            <button
              onClick={() => setIndex(i => Math.min(cards.length - 1, i + 1))}
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
              style={{ color: "#f5f5f7" }}
            >
              Next <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
