"use client";

import {
  motion,
  useMotionValue,
  animate as animateValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import StarField from "./StarField";

const CHARS = ["C", "H", "I", "R", "A", "Y", "U"];

const TAPE_ITEMS = [
  "Marketing", "Branding", "Design", "UI UX",
  "Illustrations", "Photography", "Gaming", "Music",
];

const TAPE_LOOP = [
  ...TAPE_ITEMS, ...TAPE_ITEMS, ...TAPE_ITEMS, ...TAPE_ITEMS,
];

const SOCIALS = [
  {
    href: "https://www.linkedin.com/in/chirayuarya/",
    label: "LinkedIn",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/chirayu-arya",
    label: "GitHub",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/technonaut.frames",
    label: "Instagram",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Twitter / X",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function SocialIcons() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {SOCIALS.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 12,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f5f5f7",
            flexShrink: 0,
          }}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

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
