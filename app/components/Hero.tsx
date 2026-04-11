"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

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
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      {/* ── Colorful background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Purple — top left */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "65vw",
            height: "65vw",
            top: "-20%",
            left: "-20%",
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.65) 0%, transparent 68%)",
            filter: "blur(90px)",
          }}
          animate={{ scale: [1, 1.07, 1], x: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Blue — top right */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "55vw",
            height: "55vw",
            top: "-10%",
            right: "-15%",
            background:
              "radial-gradient(ellipse, rgba(37,99,235,0.6) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.1, 1], y: [0, 28, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Pink — bottom center */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            bottom: "-5%",
            left: "25%",
            background:
              "radial-gradient(ellipse, rgba(219,39,119,0.5) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.08, 1], x: [0, -22, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        {/* Teal — bottom left */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "35vw",
            height: "35vw",
            bottom: "0%",
            left: "-8%",
            background:
              "radial-gradient(ellipse, rgba(20,184,166,0.38) 0%, transparent 68%)",
            filter: "blur(70px)",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Dark centre scrim — keeps text legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* ── Content — fully centred ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Name — single line, responsive font */}
          <motion.h1
            variants={fadeUp}
            className="font-black tracking-[-0.04em] whitespace-nowrap mb-7"
            style={{
              fontSize: "clamp(2.6rem, 9.2vw, 9rem)",
              lineHeight: 1.05,
              color: "#f5f5f7",
            }}
          >
            Chirayu Arya
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xs"
            style={{ color: "rgba(245,245,247,0.5)" }}
          >
            Brands, campaigns, and photographs —
            <br />
            done with care.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
            <a
              href="#work"
              className="px-7 py-3 rounded-full text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-80 whitespace-nowrap"
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              View work
            </a>
            <a
              href="#contact"
              className="px-7 py-3 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap transition-colors duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(245,245,247,0.55)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.55)")}
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
