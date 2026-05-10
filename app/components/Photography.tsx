"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// Pulled from /gallery photography set — varied across categories.
const VP = "/Gallery/Photography/Virtual%20Photography";
const RP = "/Gallery/Photography/Real%20Photography";

const polaroids = [
  { id: 1,  src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg`, rotation: -14, left: "0%",   top: "2%",   fromX: -900, z: 2, w: "22vw", delay: 0     },
  { id: 2,  src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG`,                                   rotation:  9,  left: "24%",  top: "-3%",  fromX:  900, z: 3, w: "21vw", delay: 0.07  },
  { id: 3,  src: `${VP}/Spider%20Man%202/IMG_7733.JPG`,                                     rotation: -5,  left: "48%",  top: "4%",   fromX: -900, z: 2, w: "22vw", delay: 0.14  },
  { id: 4,  src: `${VP}/Avatar/IMG_8200.JPG`,                                               rotation:  17, left: "72%",  top: "-2%",  fromX:  900, z: 1, w: "20vw", delay: 0.04  },
  { id: 5,  src: `${RP}/IMG_6865.jpg`,                                                      rotation: -18, left: "3%",   top: "46%",  fromX: -900, z: 4, w: "23vw", delay: 0.19  },
  { id: 6,  src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG`,                                rotation:  7,  left: "27%",  top: "43%",  fromX:  900, z: 3, w: "21vw", delay: 0.11  },
  { id: 7,  src: `${VP}/Expedition%2033/IMG_9360.jpg`,                                      rotation: -11, left: "54%",  top: "50%",  fromX: -900, z: 2, w: "20vw", delay: 0.23  },
  { id: 8,  src: `${VP}/Spider%20Man%202/IMG_7743.JPG`,                                     rotation:  13, left: "76%",  top: "45%",  fromX:  900, z: 1, w: "21vw", delay: 0.16  },
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

  const btnRef = useRef<HTMLDivElement>(null);
  const btnInView = useInView(btnRef, { once: true, margin: "-5%" });

  return (
    <section
      id="virtual-photography"
      style={{ paddingTop: "9rem", paddingBottom: "0", position: "relative" }}
    >
      {/* Header */}
      <div ref={headerRef} className="relative px-8 sm:px-14 lg:px-20 mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
          style={{ color: "#86868b" }}
        >
          Photography
        </motion.p>
        <div className="flex items-end justify-between gap-8">
          <motion.h2
            initial={{ opacity: 0, x: -60 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.05 }}
            className="font-black tracking-tight leading-[0.92]"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
          >
            Capturing moments,<br />both real &amp; virtual.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
            className="text-sm hidden sm:block"
            style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "16rem", textAlign: "right" }}
          >
            Shot on a camera. Or a television. The best shots don&apos;t ask which world they&apos;re from.
          </motion.p>
        </div>
      </div>

      {/* Mobile grid (< md) */}
      <div
        ref={mobileRef}
        className="md:hidden grid grid-cols-2 gap-6 px-8"
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
          padding: "0",
          zIndex: 1,
        }}
      >
        {polaroids.map((p) => (
          <Polaroid key={p.id} p={p} inView={inView} />
        ))}
      </div>

      {/* Exhibition Mode button */}
      <motion.div
        ref={btnRef}
        initial={{ opacity: 0, y: 16 }}
        animate={btnInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
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
