"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

// Arrow cursor pointing upper-left, no tail (hot-point at tip 0,0)
const PATH = "M0 0 L0 22 L6 17 L18 8 Z";
const W = 20;
const H = 24;

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [x, y, visible]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 99999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Glass fill — clip-path matches the cursor shape */}
      <div
        style={{
          position: "absolute",
          width: W,
          height: H,
          clipPath: `polygon(0px 0px, 0px 22px, 6px 17px, 18px 8px)`,
          backdropFilter: "blur(28px) saturate(2.2) brightness(1.15)",
          WebkitBackdropFilter: "blur(28px) saturate(2.2) brightness(1.15)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 100%), rgba(14,14,18,0.3)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.3)",
        }}
      />
      {/* SVG outline for crispness */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={PATH}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
