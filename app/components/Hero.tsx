"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const roles = ["Designer", "Marketer", "Photographer"];

function Marquee() {
  const items = [...roles, ...roles, ...roles, ...roles];
  return (
    <div className="overflow-hidden whitespace-nowrap border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="inline-flex gap-12 py-5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-sm font-medium tracking-[0.2em] uppercase select-none"
            style={{ color: "#515154" }}
          >
            {item}
            <span className="ml-12" style={{ color: "#515154" }}>*</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Radial glow — top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(184,226,7,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="flex-1 flex flex-col justify-center px-8 pt-36 pb-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div variants={container} initial="hidden" animate="show">

            {/* Available badge */}
            <motion.div variants={line} className="flex items-center gap-2.5 mb-14">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#f5f5f7" }}
              />
              <span
                className="text-xs tracking-[0.22em] uppercase font-medium"
                style={{ color: "#86868b" }}
              >
                Available for projects
              </span>
            </motion.div>

            {/* Display headline */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                variants={line}
                className="font-black leading-[0.88] tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(4.5rem, 13vw, 12rem)",
                  color: "#f5f5f7",
                }}
              >
                Chirayu
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-12">
              <motion.h1
                variants={line}
                className="font-black leading-[0.88] tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(4.5rem, 13vw, 12rem)",
                  color: "#86868b",
                }}
              >
                Arya.
              </motion.h1>
            </div>

            {/* Descriptor + CTA row */}
            <motion.div
              variants={line}
              className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16"
            >
              <p
                className="text-lg leading-relaxed max-w-sm"
                style={{ color: "#86868b" }}
              >
                Crafting visual stories through design,
                strategy, and the lens.
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="#work"
                  className="px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-80"
                  style={{ background: "#f5f5f7", color: "#000" }}
                >
                  View work
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#86868b",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#86868b")}
                >
                  Get in touch
                </a>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>

      <Marquee />
    </section>
  );
}
