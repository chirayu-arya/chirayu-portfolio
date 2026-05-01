"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StarField from "./StarField";

const CHARS = ["C", "H", "I", "R", "A", "Y", "U"];

const TAPE_ITEMS = [
  "Marketing",
  "Design",
  "Photography",
  "Gaming",
  "Charleston, SC",
  "Techno_Naut",
  "Guitar",
  "Books",
  "SiteMarker",
];

const TAPE_LOOP = [...TAPE_ITEMS, ...TAPE_ITEMS];

const IDENTITY = ["Marketing", "Design", "Photography", "Gaming", "Guitar", "Books"];

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
      style={{ isolation: "isolate" }}
    >
      {/* ── Gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <motion.div
          className="bg-blob absolute rounded-full"
          style={{
            width: "70vmax", height: "70vmax",
            top: "-20vmax", left: "-20vmax",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.38) 0%, transparent 68%)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.07, 1], x: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-blob absolute rounded-full"
          style={{
            width: "65vmax", height: "65vmax",
            top: "-15vmax", right: "-15vmax",
            background: "radial-gradient(ellipse, rgba(37,99,235,0.35) 0%, transparent 68%)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.1, 1], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="bg-blob absolute rounded-full"
          style={{
            width: "65vmax", height: "65vmax",
            bottom: "-15vmax", left: "50%", marginLeft: "-32.5vmax",
            background: "radial-gradient(ellipse, rgba(219,39,119,0.3) 0%, transparent 68%)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.08, 1], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.15) 0%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 140% 140% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      {/* ── Star field ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <StarField />
      </div>

      {/* ── Main content ── */}
      <div
        className="relative w-full flex flex-col items-center"
        style={{ zIndex: 10 }}
      >

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.9, ease, delay: 0.0 }}
          style={{
            color: "rgba(245,245,247,0.35)",
            fontSize: "0.65rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: "1.5rem",
          }}
        >
          Charleston, SC &nbsp;·&nbsp; Portfolio 2026
        </motion.p>

        {/* Name + tape wrapper */}
        <div className="relative w-full flex justify-center items-center">

          {/* CHIRAYU — per-character clip-up reveal */}
          <h1
            className="font-black select-none relative"
            style={{
              fontSize: "clamp(56px, 21.5vw, 380px)",
              lineHeight: 1,
              color: "#f5f5f7",
              letterSpacing: "-0.02em",
              zIndex: 1,
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
                  transition={{ duration: 1.0, ease, delay: 0.08 + i * 0.07 }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* ── Diagonal tape ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: "50%", left: "-25vw", width: "150vw", zIndex: 20 }}
            initial={{ opacity: 0, y: "-50%" }}
            animate={ready ? { opacity: 1, y: "-50%" } : { opacity: 0, y: "-50%" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
          >
            <div
              style={{
                transform: "rotate(-9deg)",
                background: "rgba(245,245,247,0.94)",
                padding: "16px 0",
                overflow: "hidden",
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
                      fontSize: "0.82rem",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                    <span style={{ opacity: 0.25, fontSize: "0.5rem" }}>◆</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Circular photo ── */}
          <motion.div
            className="absolute"
            style={{ top: "50%", left: "50%", zIndex: 30 }}
            initial={{ scale: 0, x: "-50%", y: "-50%" }}
            animate={ready ? { scale: 1, x: "-50%", y: "-50%" } : { scale: 0, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.15 }}
          >
            <img
              src="/Chirayu Square.png"
              alt="Chirayu"
              style={{
                width: isMobile ? 66 : 116,
                height: isMobile ? 66 : 116,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                border: "3px solid rgba(10,10,10,0.2)",
                display: "block",
              }}
            />
          </motion.div>
        </div>

        {/* Identity strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 1.0, ease, delay: 0.85 }}
          style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0", flexWrap: "wrap", justifyContent: "center" }}
        >
          {IDENTITY.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span
                style={{
                  color: "rgba(245,245,247,0.45)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {item}
              </span>
              {i < IDENTITY.length - 1 && (
                <span style={{ color: "rgba(245,245,247,0.18)", margin: "0 1rem", fontSize: "0.5rem" }}>◆</span>
              )}
            </span>
          ))}
        </motion.div>

      </div>

      {/* ── Footer line ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.8, ease, delay: 1.5 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none"
        style={{ zIndex: 22 }}
      >
        <p className="text-base font-medium tracking-wide" style={{ color: "rgba(245,245,247,0.5)" }}>
          <span className="hidden sm:inline">🚧 Marketing @ SiteMarker &nbsp;|&nbsp; 📍 Charleston, South Carolina</span>
          <span className="sm:hidden flex flex-col items-center gap-1">
            <span>🚧 Marketing @ SiteMarker</span>
            <span>📍 Charleston, South Carolina</span>
          </span>
        </p>
      </motion.div>
    </section>
  );
}
