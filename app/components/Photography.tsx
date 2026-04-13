"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const polaroids = [
  { id: 1,  src: "https://picsum.photos/seed/vp01/600/600", rotation: -14, left: "0%",   top: "2%",   fromX: -900, z: 2, w: "22vw", delay: 0     },
  { id: 2,  src: "https://picsum.photos/seed/vp02/600/600", rotation:  9,  left: "24%",  top: "-3%",  fromX:  900, z: 3, w: "21vw", delay: 0.07  },
  { id: 3,  src: "https://picsum.photos/seed/vp03/600/600", rotation: -5,  left: "48%",  top: "4%",   fromX: -900, z: 2, w: "22vw", delay: 0.14  },
  { id: 4,  src: "https://picsum.photos/seed/vp04/600/600", rotation:  17, left: "72%",  top: "-2%",  fromX:  900, z: 1, w: "20vw", delay: 0.04  },
  { id: 5,  src: "https://picsum.photos/seed/vp05/600/600", rotation: -18, left: "3%",   top: "46%",  fromX: -900, z: 4, w: "23vw", delay: 0.19  },
  { id: 6,  src: "https://picsum.photos/seed/vp06/600/600", rotation:  7,  left: "27%",  top: "43%",  fromX:  900, z: 3, w: "21vw", delay: 0.11  },
  { id: 7,  src: "https://picsum.photos/seed/vp07/600/600", rotation: -11, left: "54%",  top: "50%",  fromX: -900, z: 2, w: "20vw", delay: 0.23  },
  { id: 8,  src: "https://picsum.photos/seed/vp08/600/600", rotation:  13, left: "76%",  top: "45%",  fromX:  900, z: 1, w: "21vw", delay: 0.16  },
];

// Mobile: same images, simpler tilted grid
const mobileRotations = [-8, 5, -12, 9, -4, 14, -7, 11];

function Polaroid({
  p,
  inView,
}: {
  p: (typeof polaroids)[0];
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: p.fromX, opacity: 0, rotate: p.rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: p.rotation } : {}}
      transition={{
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: p.delay,
      }}
      whileHover={{
        scale: 1.1,
        rotate: p.rotation * 0.1,
        zIndex: 50,
        transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "absolute",
        left: p.left,
        top: p.top,
        zIndex: p.z,
        width: p.w,
        cursor: "pointer",
        willChange: "transform",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "10px 10px 44px 10px",
          filter: hovered
            ? "drop-shadow(0 0 28px rgba(200,180,255,0.55)) drop-shadow(0 8px 28px rgba(0,0,0,0.45))"
            : "drop-shadow(0 8px 28px rgba(0,0,0,0.45))",
          transition: "filter 0.3s ease",
        }}
      >
        <img
          src={p.src}
          alt={`Virtual photography ${p.id}`}
          style={{
            width: "100%",
            aspectRatio: "1",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </motion.div>
  );
}

function MobilePolaroid({
  p,
  rotation,
  inView,
  delay,
}: {
  p: (typeof polaroids)[0];
  rotation: number;
  inView: boolean;
  delay: number;
}) {
  const fromX = rotation > 0 ? 400 : -400;
  return (
    <motion.div
      initial={{ x: fromX, opacity: 0, rotate: rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: rotation } : {}}
      transition={{
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay,
      }}
      whileHover={{
        scale: 1.08,
        rotate: rotation * 0.1,
        zIndex: 50,
        transition: { duration: 0.25 },
      }}
      style={{ cursor: "pointer", willChange: "transform" }}
    >
      <div
        style={{
          background: "#fff",
          padding: "8px 8px 34px 8px",
          filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.5))",
        }}
      >
        <img
          src={p.src}
          alt={`Virtual photography ${p.id}`}
          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
        />
      </div>
    </motion.div>
  );
}

export default function Photography() {
  const headerRef = useRef<HTMLDivElement>(null);
  const scatterRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-5%" });
  const inView = useInView(scatterRef, { once: true, margin: "-5%" });
  const mobileInView = useInView(mobileRef, { once: true, margin: "-5%" });

  return (
    <section
      id="virtual-photography"
      className="overflow-hidden"
      style={{ background: "#000", paddingTop: "9rem", paddingBottom: "0", position: "relative", isolation: "isolate" }}
    >
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Top-left — pink, toned down */}
        <div
          className="absolute rounded-full"
          style={{
            width: "55vmax", height: "55vmax",
            top: "-10vmax", left: "-15vmax",
            background: "radial-gradient(ellipse, rgba(244,114,182,0.3) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        {/* Bottom-right — amber, unchanged */}
        <div
          className="absolute rounded-full"
          style={{
            width: "45vmax", height: "45vmax",
            bottom: "0", right: "-10vmax",
            background: "radial-gradient(ellipse, rgba(251,146,60,0.52) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        {/* Center — purple */}
        <div
          className="absolute rounded-full"
          style={{
            width: "50vmax", height: "50vmax",
            top: "25%", left: "25%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.55) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Top-right — sky blue */}
        <div
          className="absolute rounded-full"
          style={{
            width: "40vmax", height: "40vmax",
            top: "5%", right: "0%",
            background: "radial-gradient(ellipse, rgba(56,189,248,0.52) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-center — yellow */}
        <div
          className="absolute rounded-full"
          style={{
            width: "42vmax", height: "42vmax",
            bottom: "5%", left: "25%",
            background: "radial-gradient(ellipse, rgba(251,191,36,0.5) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      {/* Header */}
      <div ref={headerRef} className="relative max-w-6xl mx-auto px-8 mb-20" style={{ zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-5"
          style={{ color: "#86868b" }}
        >
          Virtual Photography
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="font-bold tracking-tight"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#f5f5f7" }}
        >
          Worlds I&apos;ve built.
        </motion.h2>
      </div>

      {/* Mobile grid (< md) */}
      <div
        ref={mobileRef}
        className="md:hidden grid grid-cols-2 gap-6 px-6"
        style={{ paddingBottom: "2rem", position: "relative", zIndex: 1 }}
      >
        {polaroids.map((p, i) => (
          <MobilePolaroid
            key={p.id}
            p={p}
            rotation={mobileRotations[i]}
            inView={mobileInView}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* Scatter (md+) */}
      <div
        ref={scatterRef}
        className="hidden md:block"
        style={{
          position: "relative",
          height: "54vw",
          maxWidth: 1500,
          margin: "0 auto",
          padding: "0 40px",
          zIndex: 1,
        }}
      >
        {polaroids.map((p) => (
          <Polaroid key={p.id} p={p} inView={inView} />
        ))}
      </div>

      {/* Exhibition Mode button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.4 }}
        className="flex justify-center pb-20 relative"
        style={{ zIndex: 1 }}
      >
        <a
          href="/gallery"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold cursor-pointer"
          style={{
            background: "#f5f5f7",
            color: "#000",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Gallery Mode
        </a>
      </motion.div>
    </section>
  );
}
