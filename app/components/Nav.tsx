"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const workCategories = [
  { label: "Explore", href: "#work" },
  { label: "Brand and Marketing Design", href: "#brand-marketing" },
  { label: "UI / UX", href: "#ui-ux" },
  { label: "Illustrations", href: "#illustrations" },
  { label: "Photography", href: "#photography" },
  { label: "Virtual Photography", href: "#virtual-photography" },
];

const glassStyle = {
  backdropFilter: "blur(40px) saturate(1.8) brightness(1.05)",
  WebkitBackdropFilter: "blur(40px) saturate(1.8) brightness(1.05)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%), rgba(22,22,24,0.65)",
  border: "1px solid rgba(255,255,255,0.11)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.18), inset 0 -0.5px 0 rgba(0,0,0,0.2), 0 12px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.25)",
};

const dropdownGlassStyle = {
  backdropFilter: "blur(48px) saturate(1.9) brightness(1.05)",
  WebkitBackdropFilter: "blur(48px) saturate(1.9) brightness(1.05)",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(20,20,22,0.78)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.16), 0 16px 56px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3)",
};

export default function Nav() {
  const [workOpen, setWorkOpen] = useState(false);

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-[18px]"
        style={glassStyle}
      >
        {/* Left: nav links */}
        <a
          href="/"
          className="px-4 py-2 rounded-xl text-sm font-medium text-white/65 hover:text-white transition-colors duration-200 cursor-pointer"
          style={{ "&:hover": { background: "rgba(255,255,255,0.07)" } } as React.CSSProperties}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Home
        </a>

        {/* Work dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setWorkOpen(true)}
          onMouseLeave={() => setWorkOpen(false)}
        >
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/65 hover:text-white transition-colors duration-200 cursor-pointer"
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Work
            <motion.svg
              animate={{ rotate: workOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              className="opacity-50"
            >
              <path
                d="M2 3.5L5.5 7L9 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>

          <AnimatePresence>
            {workOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="absolute top-full left-0 mt-2 min-w-[230px] rounded-2xl py-2 overflow-hidden"
                style={dropdownGlassStyle}
              >
                {workCategories.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className="block px-4 py-2.5 mx-1 rounded-xl text-sm text-white/65 hover:text-white transition-colors duration-150 cursor-pointer"
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Right: Get in touch */}
        <a
          href="#contact"
          className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#000",
          }}
        >
          Get in touch
        </a>
      </motion.nav>
    </div>
  );
}
