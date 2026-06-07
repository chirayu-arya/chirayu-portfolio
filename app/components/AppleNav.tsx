"use client";

import { useEffect, useState } from "react";

const C = {
  page: "#fbfbfd",
  ink: "#1d1d1f",
  hairlineSoft: "rgba(0,0,0,0.06)",
};

const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;

export type AppleNavProps = {
  /** Optional content rendered in place of the default right-side links (e.g. the gallery toggle). */
  rightSlot?: React.ReactNode;
};

const DEFAULT_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Gaming", href: "/gaming" },
  { label: "Cooking", href: "/cooking" },
  { label: "Bookshelf", href: "/bookshelf" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/#contact" },
];

export default function AppleNav({ rightSlot }: AppleNavProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(251,251,253,0.72)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.hairlineSoft}` : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
        fontFamily: SF,
      }}
    >
      <div className="px-8 sm:px-14 lg:px-20 h-12 flex items-center justify-between">
        <a
          href="/"
          style={{ color: C.ink, fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}
        >
          Chirayu Arya
        </a>

        {rightSlot ?? (
          <div className="hidden md:flex items-center gap-8">
            {DEFAULT_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  color: C.ink,
                  fontSize: 12,
                  fontWeight: 400,
                  opacity: 0.88,
                  transition: "opacity 0.18s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
