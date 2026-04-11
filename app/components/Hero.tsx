"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const roles = ["Designer", "Marketer", "Photographer"];

function MarqueeTrack() {
  const items = [...roles, ...roles, ...roles, ...roles];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight text-[--color-surface-2] select-none"
          >
            {item}
            <span className="text-[--color-brand] mx-8">*</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #B8E207 0%, transparent 70%)" }}
      />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="flex-1 flex flex-col justify-center px-8 pt-32 pb-24 max-w-7xl mx-auto w-full"
      >
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Label */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
            <span className="w-2 h-2 rounded-full bg-[--color-brand] animate-pulse" />
            <span className="text-xs tracking-[0.25em] uppercase text-[--color-text-secondary]">
              Available for projects
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.9] tracking-tight mb-8"
          >
            Chirayu
            <br />
            <span className="text-[--color-text-secondary]">Arya</span>
          </motion.h1>

          {/* Descriptor */}
          <motion.p
            variants={fadeUp}
            className="text-[--color-text-secondary] text-lg max-w-md leading-relaxed mb-12"
          >
            Crafting visual stories through design, strategy, and photography.
            Based wherever the work takes me.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <a
              href="#work"
              className="px-6 py-3 bg-[--color-brand] text-black text-sm font-semibold rounded-full cursor-pointer hover:bg-[--color-brand-dark] transition-colors"
            >
              View work
            </a>
            <a
              href="#about"
              className="px-6 py-3 text-sm text-[--color-text-secondary] border border-[--color-surface-3] rounded-full cursor-pointer hover:text-[--color-text-primary] transition-colors"
            >
              About me
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Marquee */}
      <div className="border-t border-[--color-surface-2] py-6">
        <MarqueeTrack />
      </div>
    </section>
  );
}
