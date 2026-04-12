"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const items = [
  {
    id: 1,
    src: "https://picsum.photos/seed/feat01/900/600",
    note: "Brand launch event — New York, March 2024",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/feat02/900/600",
    note: "SiteMarker go-to-market showcase — Charleston, SC",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/feat03/900/600",
    note: "Design week panel, featured work — October 2023",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/feat04/900/600",
    note: "Creative Studio open house — Summer 2023",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/feat05/900/600",
    note: "Photography exhibition, downtown gallery — 2022",
  },
];

export default function Featured() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-6%" });

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    const offsetLeft = card.offsetLeft - track.offsetLeft;
    track.scrollTo({ left: offsetLeft, behavior: "smooth" });
    setActive(index);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    // If at the end of scroll, always mark last dot active
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
      setActive(items.length - 1);
      return;
    }
    const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 0;
    const gap = 24;
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    setActive(Math.min(index, items.length - 1));
  };

  return (
    <section
      id="featured"
      className="relative overflow-hidden"
      style={{ background: "#000", paddingTop: "9rem", paddingBottom: "6rem", isolation: "isolate" }}
    >
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: "60vmax", height: "60vmax",
            top: "-20vmax", right: "-10vmax",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.32) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vmax", height: "50vmax",
            bottom: "-15vmax", left: "-10vmax",
            background: "radial-gradient(ellipse, rgba(37,99,235,0.28) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} className="max-w-6xl mx-auto px-8 mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-5"
            style={{ color: "#86868b" }}
          >
            Featured
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#f5f5f7" }}
          >
            Work in the wild.
          </motion.h2>
        </div>

        {/* Scrollable track */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: "1rem",
              paddingLeft: "max(2rem, calc((100vw - 72rem) / 2 + 2rem))",
              paddingRight: "2rem",
              scrollPaddingLeft: "max(2rem, calc((100vw - 72rem) / 2 + 2rem))",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: "0 0 min(80vw, 720px)",
                  scrollSnapAlign: "center",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: "100%",
                    height: "clamp(260px, 38vw, 480px)",
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.note}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                {/* Footer note */}
                <p
                  className="text-sm mt-4 px-1"
                  style={{ color: "#86868b" }}
                >
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Carousel indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: active === i ? "1.75rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                background: active === i ? "#f5f5f7" : "rgba(255,255,255,0.25)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
