"use client";

import {
  motion,
  useMotionValue,
  animate as animateValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import StarField from "./StarField";
import SocialIcons from "./SocialIcons";

const CHARS = ["C", "H", "I", "R", "A", "Y", "U"];

const TAPE_ITEMS = [
  "Marketing", "Branding", "Design", "UI UX",
  "Illustrations", "Photography", "Gaming", "Music",
];

const TAPE_LOOP = [
  ...TAPE_ITEMS, ...TAPE_ITEMS, ...TAPE_ITEMS, ...TAPE_ITEMS,
];

function TapeContent({ rotate = -5, padding = "11px 0" }: { rotate?: number; padding?: string }) {
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg)`,
        background: "#FFE234",
        padding,
        overflow: "hidden",
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
      }}
    >
      <div
        className="animate-marquee flex"
        style={{ width: "max-content", animationDuration: "22s" }}
      >
        {TAPE_LOOP.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1.6rem",
              paddingRight: "1.6rem",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ opacity: 0.3, fontSize: "0.48rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Tape entrance opacity
  const tapeEntranceOpacity = useMotionValue(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Fire tape entrance after the name finishes revealing (~2.1 s)
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      animateValue(tapeEntranceOpacity, 1, { duration: 0.5, ease: "easeOut" });
    }, 2100);
    return () => clearTimeout(t);
  }, [ready, tapeEntranceOpacity]);

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
      style={{ isolation: "isolate" }}
    >
      {/* ── Cinematic black overlay — lifts on load ── */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{ zIndex: 999 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeInOut" }}
      />

      {/* ── Crimson gradient blobs — breathe in first ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Blob 1 — top-left */}
        <motion.div
          className="absolute"
          style={{ width: "70vmax", height: "70vmax", top: "-20vmax", left: "-20vmax" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.8, delay: 0.1 }}
        >
          <motion.div
            className="bg-blob absolute inset-0 rounded-full"
            style={{ background: isMobile ? "radial-gradient(ellipse, rgba(220,20,60,0.82) 0%, transparent 68%)" : "radial-gradient(ellipse, rgba(220,20,60,0.45) 0%, transparent 68%)" }}
            animate={isMobile ? {} : { scale: [1, 1.07, 1], x: [0, 18, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Blob 2 — top-right */}
        <motion.div
          className="absolute"
          style={{ width: "65vmax", height: "65vmax", top: "-15vmax", right: "-15vmax" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.8, delay: 0.35 }}
        >
          <motion.div
            className="bg-blob absolute inset-0 rounded-full"
            style={{ background: isMobile ? "radial-gradient(ellipse, rgba(180,0,40,0.72) 0%, transparent 68%)" : "radial-gradient(ellipse, rgba(180,0,40,0.38) 0%, transparent 68%)" }}
            animate={isMobile ? {} : { scale: [1, 1.1, 1], y: [0, 24, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </motion.div>

        {/* Blob 3 — bottom-center */}
        <motion.div
          className="absolute"
          style={{ width: "65vmax", height: "65vmax", bottom: "-15vmax", left: "50%", marginLeft: "-32.5vmax" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.8, delay: 0.6 }}
        >
          <motion.div
            className="bg-blob absolute inset-0 rounded-full"
            style={{ background: isMobile ? "radial-gradient(ellipse, rgba(139,0,0,0.78) 0%, transparent 68%)" : "radial-gradient(ellipse, rgba(139,0,0,0.4) 0%, transparent 68%)" }}
            animate={isMobile ? {} : { scale: [1, 1.08, 1], x: [0, -20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </motion.div>

        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.15) 0%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 140% 140% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      {/* ── Star field ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <StarField />
      </div>

      {/* ── Name — centered by section's justify-center ── */}
      <div
        className="relative w-full flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>

          {/* "I AM" */}
          <div className="text-center md:text-left" style={{ overflow: "hidden", marginBottom: "-0.05em" }}>
            <motion.p
              style={{
                fontSize: "clamp(24px, 8.4vw, 148px)",
                fontWeight: 900,
                color: "#f5f5f7",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
              initial={{ y: "110%" }}
              animate={ready ? { y: "0%" } : { y: "110%" }}
              transition={{ duration: 0.9, ease, delay: 1.2 }}
            >
              I AM
            </motion.p>
          </div>

          {/* "CHIRAYU®" */}
          <h1
            className="font-black select-none"
            style={{
              fontSize: "clamp(52px, 20.5vw, 365px)",
              lineHeight: 1,
              color: "#f5f5f7",
              letterSpacing: "-0.02em",
              position: "relative",
              zIndex: 1,
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            {CHARS.map((char, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  lineHeight: 1.12,
                  marginRight: i === 4 ? "-0.045em" : undefined,
                }}
              >
                <motion.span
                  style={{ display: "inline-block" }}
                  initial={{ y: "110%" }}
                  animate={ready ? { y: "0%" } : { y: "110%" }}
                  transition={{ duration: 1.0, ease, delay: 1.4 + i * 0.09 }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
            <motion.span
              style={{
                position: "absolute",
                top: "0.08em",
                right: "-0.28em",
                fontSize: "0.2em",
                lineHeight: 1,
              }}
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease, delay: 1.4 + CHARS.length * 0.09 + 0.1 }}
            >
              ®
            </motion.span>
          </h1>

          {/* ── Tape — desktop only (angled) ── */}
          <motion.div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: "58%",
              left: "-30vw",
              width: "160vw",
              translateY: "-50%",
              zIndex: 20,
              opacity: tapeEntranceOpacity,
            }}
          >
            <TapeContent rotate={-5} padding="11px 0" />
          </motion.div>

        </div>

        {/* Mobile: SiteMarker in flow below name */}
        <motion.p
          className="md:hidden"
          style={{ marginTop: "1.5rem", zIndex: 10, textAlign: "center", color: "rgba(245,245,247,0.45)", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 1.0, ease, delay: 2.5 }}
        >
          Building SiteMarker &nbsp;|&nbsp; Based in Charleston, SC
        </motion.p>

        {/* Desktop: social icons in flow below name */}
        <div className="hidden md:flex justify-center" style={{ marginTop: "2rem", zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 1.0, ease, delay: 2.6 }}
          >
            <SocialIcons />
          </motion.div>
        </div>

      </div>

      {/* Desktop SiteMarker — absolute footer */}
      <motion.p
        className="hidden md:block absolute"
        style={{ bottom: "5%", left: 0, right: 0, zIndex: 10, textAlign: "center", color: "rgba(245,245,247,0.45)", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}
        initial={{ opacity: 0, y: 14 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 1.0, ease, delay: 2.5 }}
      >
        Building SiteMarker &nbsp;|&nbsp; Based in Charleston, SC
      </motion.p>

      {/* Mobile: social icons at 72.5% */}
      <div className="flex md:hidden absolute" style={{ top: "72.5%", left: 0, right: 0, zIndex: 10, justifyContent: "center", transform: "translateY(-50%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 1.0, ease, delay: 2.7 }}
        >
          <SocialIcons />
        </motion.div>
      </div>

      {/* ── Mobile tape — absolute, pinned to bottom ── */}
      <motion.div
        className="md:hidden absolute"
        style={{ bottom: "10%", left: 0, right: 0, zIndex: 10, overflow: "hidden", opacity: tapeEntranceOpacity }}
      >
        <TapeContent rotate={0} padding="7px 0" />
      </motion.div>
    </section>
  );
}
