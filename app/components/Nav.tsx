"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const workCol1 = [
  { label: "Branding & Marketing", href: "#brand-marketing" },
  { label: "UI & UX", href: "#ui-ux" },
  { label: "Photography", href: "#photography" },
];

const workCol2 = [
  { label: "Illustrations", href: "#illustrations" },
  { label: "Virtual Photography", href: "#virtual-photography" },
];

const glassStyle = {
  backdropFilter: "blur(64px) saturate(2.2) brightness(1.08)",
  WebkitBackdropFilter: "blur(64px) saturate(2.2) brightness(1.08)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%), rgba(12,12,14,0.28)",
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.15), inset 0 -0.5px 0 rgba(0,0,0,0.15), 0 16px 56px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
};

const dropdownGlassStyle = {
  backdropFilter: "blur(72px) saturate(2.4) brightness(1.08)",
  WebkitBackdropFilter: "blur(72px) saturate(2.4) brightness(1.08)",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%), rgba(10,10,12,0.35)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.13), 0 20px 60px rgba(0,0,0,0.45), 0 4px 14px rgba(0,0,0,0.25)",
};

export default function Nav() {
  const [workOpen, setWorkOpen] = useState(false);

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="pointer-events-auto flex items-center gap-2.5 px-2 py-1.5 rounded-full"
        style={glassStyle}
      >
        {/* Home */}
        <a
          href="/"
          className="px-4 py-2 rounded-full text-sm font-medium text-white/65 hover:text-white transition-colors duration-200 cursor-pointer"
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Home
        </a>

        {/* About Me */}
        <a
          href="#about"
          className="px-4 py-2 rounded-full text-sm font-medium text-white/65 hover:text-white transition-colors duration-200 cursor-pointer"
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          About Me
        </a>

        {/* Work dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setWorkOpen(true)}
          onMouseLeave={() => setWorkOpen(false)}
        >
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white/65 hover:text-white transition-colors duration-200 cursor-pointer"
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Work
            <motion.svg
              animate={{ rotate: workOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              width="11" height="11" viewBox="0 0 11 11" fill="none"
              className="opacity-50"
            >
              <path d="M2 3.5L5.5 7L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {workOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="absolute top-full left-0 mt-2 rounded-2xl p-2 overflow-hidden"
                style={dropdownGlassStyle}
              >
                <div className="flex gap-1">
                  {/* Column 1 */}
                  <div className="flex flex-col min-w-[160px]">
                    {workCol1.map((item, i) => (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        className="block px-4 py-2.5 rounded-full text-sm text-white/65 hover:text-white transition-colors duration-150 cursor-pointer whitespace-nowrap"
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.label}
                      </motion.a>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px self-stretch mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

                  {/* Column 2 */}
                  <div className="flex flex-col min-w-[160px]">
                    {workCol2.map((item, i) => (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 + 0.05, duration: 0.2 }}
                        className="block px-4 py-2.5 rounded-full text-sm text-white/65 hover:text-white transition-colors duration-150 cursor-pointer whitespace-nowrap"
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.label}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/chirayuarya/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-200"
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.65)" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* Get in touch */}
        <a
          href="#contact"
          className="px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85"
          style={{ background: "rgba(255,255,255,0.92)", color: "#000" }}
        >
          Get In Touch
        </a>
      </motion.nav>
    </div>
  );
}
