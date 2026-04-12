"use client";

import { motion, useScroll, useTransform, type Variants, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Intro state: spline starts fullscreen, fades to 20% after 3.5s
  // Falls back after 6s max in case iframe onLoad never fires
  const [introDone, setIntroD] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [headlineHovered, setHeadlineHovered] = useState(false);

  const triggerIntro = () => {
    if (timerRef.current) return; // already scheduled
    timerRef.current = setTimeout(() => setIntroD(true), 3500);
  };

  useEffect(() => {
    // Fallback: guarantee text appears even if iframe onLoad never fires
    setIsMobile(window.innerWidth < 768);
    const fallback = setTimeout(() => setIntroD(true), 4500);
    return () => {
      clearTimeout(fallback);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
      style={{ isolation: "isolate" }}
    >
      {/* ── Gradient blobs — z:1 ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "70vmax", height: "70vmax",
            top: "-20vmax", left: "-20vmax",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.38) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.07, 1], x: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "65vmax", height: "65vmax",
            top: "-15vmax", right: "-15vmax",
            background: "radial-gradient(ellipse, rgba(37,99,235,0.35) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.1, 1], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "65vmax", height: "65vmax",
            bottom: "-15vmax", left: "50%", marginLeft: "-32.5vmax",
            background: "radial-gradient(ellipse, rgba(219,39,119,0.3) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.08, 1], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "50vmax", height: "50vmax",
            bottom: "-10vmax", left: "-10vmax",
            background: "radial-gradient(ellipse, rgba(20,184,166,0.25) 0%, transparent 68%)",
            filter: "blur(70px)",
          }}
          animate={isMobile ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.2) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 140% 140% at 50% 50%, transparent 45%, rgba(0,0,0,0.4) 100%)" }}
        />
      </div>

      {/* ── Spline — desktop only (lg+), too heavy for mobile ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: introDone ? 0.2 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          zIndex: introDone ? 3 : 20,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as "hidden",
        }}
      >
        <iframe
          src="https://my.spline.design/sentientcopycopy-acxzGqKYwXGxcJSUoNyFjUmZ-QSE/"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          onLoad={triggerIntro}
          allowFullScreen
        />
      </motion.div>

      {/* ── Content — hidden during intro, fades in after ── */}
      <motion.div
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        style={{ y, zIndex: 10 }}
        className="relative flex flex-col items-center text-center px-6 pt-28 pb-24"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="relative inline-block mb-7"
            onMouseEnter={() => setHeadlineHovered(true)}
            onMouseLeave={() => setHeadlineHovered(false)}
            onTouchStart={() => setHeadlineHovered(true)}
            onTouchEnd={() => setTimeout(() => setHeadlineHovered(false), 1800)}
          >
            <h1
              className="font-semibold tracking-[-0.03em] whitespace-nowrap cursor-default"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)",
                lineHeight: 1.05,
                color: "#f5f5f7",
                textShadow: "0 2px 40px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              Hi! I am Chirayu.
            </h1>

            {/* Glass bubble — top right of headline */}
            <AnimatePresence>
              {headlineHovered && (
                <div
                  className="absolute pointer-events-none"
                  style={{ bottom: "calc(100% + 16px)", left: 0, right: 0, display: "flex", justifyContent: "center" }}
                >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "5rem",
                      height: "5rem",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                    }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 25, -10, 25, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                      style={{ fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "70% 70%", lineHeight: 1 }}
                    >
                      👋
                    </motion.span>
                  </div>
                </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xs"
            style={{ color: "#f5f5f7", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
          >
            One creative. Three disciplines.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
            <a
              href="#work"
              className="px-7 py-3 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap"
              style={{
                background: "#f5f5f7",
                color: "#000",
                transition: "box-shadow 0.3s ease",
                boxShadow: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(245,245,247,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              View work
            </a>
            <a
              href="#contact"
              className="px-7 py-3 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#f5f5f7",
                transition: "box-shadow 0.3s ease, color 0.3s ease",
                boxShadow: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#f5f5f7";
                e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(245,245,247,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#f5f5f7";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Get in touch
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none"
          >
            <p className="text-sm font-bold tracking-wide" style={{ color: "#f5f5f7" }}>
              🚧 Marketing @ SiteMarker &nbsp;|&nbsp; 📍 Charleston, South Carolina
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ zIndex: 21, background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
