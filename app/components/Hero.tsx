"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black">

      {/* Background: mesh gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left warm glow */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        {/* Center-right cool glow */}
        <div
          className="absolute top-[20%] right-[-15%] w-[55vw] h-[55vw] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom subtle fill */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40vh]"
          style={{
            background: "linear-gradient(to top, rgba(255,255,255,0.015) 0%, transparent 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 px-8 pt-28 pb-24"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div variants={container} initial="hidden" animate="show">

            {/* Display name */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                variants={line}
                className="font-black leading-[0.86] tracking-[-0.04em]"
                style={{ fontSize: "clamp(5rem, 14vw, 13rem)", color: "#f5f5f7" }}
              >
                Chirayu
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-14">
              <motion.h1
                variants={line}
                className="font-black leading-[0.86] tracking-[-0.04em]"
                style={{ fontSize: "clamp(5rem, 14vw, 13rem)", color: "rgba(245,245,247,0.28)" }}
              >
                Arya.
              </motion.h1>
            </div>

            {/* Tagline + CTAs */}
            <motion.div
              variants={line}
              className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-20"
            >
              <p
                className="text-lg leading-relaxed max-w-xs"
                style={{ color: "#86868b" }}
              >
                Designer, marketer, and photographer
                crafting work worth remembering.
              </p>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#work"
                  className="px-7 py-3 rounded-full text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-80 whitespace-nowrap"
                  style={{ background: "#f5f5f7", color: "#000" }}
                >
                  View work
                </a>
                <a
                  href="#contact"
                  className="px-7 py-3 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap"
                  style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#86868b" }}
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

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }}
      />
    </section>
  );
}
