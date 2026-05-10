"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type FeaturedItem = {
  id: number;
  src: string;
  note: string;
  source?: string;
  date?: string;
  link?: string;
  youtube?: string;
};

const items: FeaturedItem[] = [
  {
    id: 1,
    src: "/TS-feature-1.png",
    note: "Aurora (Illustration by Chirayu Arya)",
    source: "Times Square Showcase",
    date: "June 2025",
  },
  {
    id: 2,
    src: "/Chirayu-Arya-Becoming-a-Leader-in-Web3-at-Fuqua.png",
    note: "Becoming a Leader in Web3 at Duke",
    source: "Fuqua MMS Blogs",
    date: "April 2023",
    link: "https://blogs.fuqua.duke.edu/duke-mms/2023/04/05/chirayu-arya/becoming-a-leader-in-web3-at-fuqua",
  },
  {
    id: 3,
    src: "",
    note: "Blue Devil Coin",
    source: "Chirayu Arya",
    date: "March 2023",
    youtube: "qDZOsjGx39k",
    link: "https://www.youtube.com/watch?v=qDZOsjGx39k",
  },
];

export default function Featured() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-6%" });

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<FeaturedItem | null>(null);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
      className="relative"
      style={{ paddingTop: "9rem", paddingBottom: "6rem" }}
    >
      <div className="relative">
        {/* Header */}
        <div ref={headerRef} className="px-8 sm:px-14 lg:px-20 mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Featured
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
            >
              Turned 'em eyeballs.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "18rem", textAlign: "right" }}
            >
              Selected moments where my work made it out into the world.
            </motion.p>
          </div>
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
              paddingLeft: "clamp(2rem, 5.56vw, 5rem)",
              paddingRight: "2rem",
              scrollPaddingLeft: "clamp(2rem, 5.56vw, 5rem)",
            }}
          >
            {items.map((item) => {
              const containerStyle = {
                width: "100%",
                height: "clamp(260px, 38vw, 480px)",
                borderRadius: "1.25rem",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
              } as const;

              const Image = (
                <div style={containerStyle}>
                  <img
                    src={item.src}
                    alt={item.note}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              );

              const YouTubeFrame = item.youtube ? (
                <div style={{ ...containerStyle, background: "#000" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${item.youtube}?rel=0`}
                    title={item.note}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", display: "block", border: "none" }}
                  />
                </div>
              ) : null;

              return (
                <div
                  key={item.id}
                  style={{
                    flex: "0 0 min(80vw, 720px)",
                    scrollSnapAlign: "center",
                  }}
                >
                  {YouTubeFrame ? (
                    YouTubeFrame
                  ) : item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", cursor: "pointer" }}
                    >
                      {Image}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="block w-full p-0 border-0 bg-transparent text-left cursor-pointer"
                    >
                      {Image}
                    </button>
                  )}

                  {/* Footer note */}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-wrap items-center gap-1.5 text-sm mt-4 px-1 cursor-pointer"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#f5f5f7" }}>{item.note}</span>
                      {(item.source || item.date) && (
                        <span style={{ color: "#86868b" }}>
                          {item.source && <>| {item.source}</>}
                          {item.source && item.date && ", "}
                          {item.date}
                        </span>
                      )}
                      <svg width="11" height="11" viewBox="0 0 13 13" fill="none" style={{ color: "#86868b" }}>
                        <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : item.source || item.date ? (
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="inline-flex flex-wrap items-center gap-1.5 text-sm mt-4 px-1 cursor-pointer p-0 border-0 bg-transparent text-left"
                    >
                      <span style={{ color: "#f5f5f7" }}>{item.note}</span>
                      <span style={{ color: "#86868b" }}>
                        {item.source && <>| {item.source}</>}
                        {item.source && item.date && ", "}
                        {item.date}
                      </span>
                    </button>
                  ) : (
                    <p className="text-sm mt-4 px-1" style={{ color: "#86868b" }}>
                      {item.note}
                    </p>
                  )}
                </div>
              );
            })}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#f5f5f7",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                }}
              >
                ×
              </button>

              {/* Image */}
              <div className="w-full relative" style={{ aspectRatio: "4/3", background: "#0a0a0a" }}>
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.note}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2 gap-4">
                  <h2 className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>
                    {lightboxItem.note}
                  </h2>
                  {lightboxItem.date && (
                    <span className="text-sm font-medium flex-shrink-0" style={{ color: "#515154" }}>
                      {lightboxItem.date}
                    </span>
                  )}
                </div>
                {lightboxItem.source && (
                  <p className="text-sm" style={{ color: "#86868b" }}>{lightboxItem.source}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
