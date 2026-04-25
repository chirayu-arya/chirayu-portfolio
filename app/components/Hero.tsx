"use client";

import { motion, useScroll, useTransform, type Variants, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import StarField from "./StarField";
import MagneticButton from "./MagneticButton";

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
  const [revealPos, setRevealPos] = useState<{ x: number; y: number } | null>(null);

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
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.2) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 140% 140% at 50% 50%, transparent 45%, rgba(0,0,0,0.4) 100%)" }}
        />
      </div>

      {/* ── Star field — fades in with content after Spline intro ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ zIndex: 2 }}
      >
        <StarField />
      </motion.div>

      {/* ── Spline — desktop only (lg+), too heavy for mobile ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: introDone ? 0 : 1 }}
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
        className="relative flex flex-col items-center text-center px-6 pt-20 sm:pt-28 pb-24"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="flex flex-col items-center"
        >
          {/* Memoji — above headline, with cursor reveal effect */}
          <motion.div
            variants={fadeUp}
            className="relative mb-6"
            style={{
              display: "inline-block",
              cursor: "none",
              height: isMobile ? "11rem" : "clamp(8rem, 18vw, 16rem)",
              width: isMobile ? "11rem" : "clamp(8rem, 18vw, 16rem)",
              filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.5))",
            }}
            onMouseEnter={() => setHeadlineHovered(true)}
            onMouseLeave={() => { setHeadlineHovered(false); setRevealPos(null); }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setRevealPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onTouchStart={e => {
              setHeadlineHovered(true);
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              setRevealPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
            }}
            onTouchMove={e => {
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              setRevealPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
            }}
            onTouchEnd={() => {
              setTimeout(() => { setHeadlineHovered(false); setRevealPos(null); }, 1800);
            }}
          >
            {/* Reveal image — behind, fills container */}
            <img
              src="/Chirayu Reveal.png"
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "1rem",
              }}
            />

            {/* Memoji — on top, fully covers container, transparent in spotlight */}
            <img
              src="/Memoji 3.png"
              alt="Chirayu memoji"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                WebkitMaskImage: revealPos
                  ? `radial-gradient(circle at ${revealPos.x}px ${revealPos.y}px, transparent 0px, transparent 89px, black 90px)`
                  : undefined,
                maskImage: revealPos
                  ? `radial-gradient(circle at ${revealPos.x}px ${revealPos.y}px, transparent 0px, transparent 89px, black 90px)`
                  : undefined,
              }}
            />

            {/* Wave bubble — mobile only, diagonally above top-right of memoji */}
            <AnimatePresence>
              {headlineHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute pointer-events-none sm:hidden"
                  style={{ top: "-1rem", right: "-1rem" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full w-10 h-10"
                    style={{
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
                      className="text-lg"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "70% 70%", lineHeight: 1 }}
                    >
                      👋
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Headline — bubble appears top-right on hover of image or headline */}
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute pointer-events-none hidden sm:block"
                  style={{ bottom: "calc(100% - 20px)", right: "-2.5rem" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full w-10 h-10 sm:w-[clamp(3.6rem,8vw,5rem)] sm:h-[clamp(3.6rem,8vw,5rem)]"
                    style={{
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
                      className="text-lg sm:text-[clamp(1.5rem,3.5vw,2rem)]"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "70% 70%", lineHeight: 1 }}
                    >
                      👋
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl"
            style={{ color: "#f5f5f7", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
          >
            Most people treat design &amp; marketing as separate things. I don&apos;t.
            <br />
            Design without strategy is decoration. Marketing without craft is noise.
            <br />
            I believe in working at the intersection, and creating an impact.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
            <MagneticButton>
              <a
                href="#work"
                className="px-7 py-3 rounded-full text-sm font-semibold whitespace-nowrap"
                style={{
                  background: "#f5f5f7",
                  color: "#000",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "none",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(245,245,247,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                View Work
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="mailto:chirayuarya21@gmail.com"
                className="px-7 py-3 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#f5f5f7",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "none",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 28px 6px rgba(245,245,247,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                Get in Touch
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero footer line — pinned to bottom of section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none"
        style={{ zIndex: 22 }}
      >
        <p className="text-base font-medium tracking-wide" style={{ color: "#f5f5f7" }}>
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
