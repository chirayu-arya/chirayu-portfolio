"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [visible, setVisible] = useState(false);

  // Spring for the liquid trailing feel
  const x = useSpring(mouseX, { stiffness: 280, damping: 22, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 280, damping: 22, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
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
  }, [mouseX, mouseY, visible]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 99999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        // Offset so the tip of the arrow aligns with the actual hot-point
        translateX: 0,
        translateY: 0,
      }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/*
        Arrow cursor shape via clip-path.
        Hot-point is top-left (0,0).
        Width: 22px  Height: 30px
      */}
      <div
        style={{
          width: 22,
          height: 30,
          clipPath:
            "polygon(0% 0%, 0% 73%, 28% 57%, 52% 96%, 67% 88%, 43% 48%, 70% 48%)",
          backdropFilter: "blur(32px) saturate(2.2) brightness(1.15)",
          WebkitBackdropFilter: "blur(32px) saturate(2.2) brightness(1.15)",
          background:
            "linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%), rgba(18,18,20,0.32)",
          boxShadow:
            "inset 0 0.5px 0 rgba(255,255,255,0.35), inset 0 -0.5px 0 rgba(0,0,0,0.18), 0 4px 18px rgba(0,0,0,0.35)",
        }}
      />
    </motion.div>
  );
}
