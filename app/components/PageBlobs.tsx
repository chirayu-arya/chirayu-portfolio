"use client";

// ── Per-page palette system ──────────────────────────────────────────────────
// One blob canvas per page. Lives absolutely-positioned at the page level so
// blobs bleed seamlessly across section boundaries. Each page picks a palette.
//
// Adding a new page? Pick or add a palette below and render
// <PageBlobs palette="..." /> once near the top of the page.

type ColorTriple = readonly [string, string, string];

// Each entry is "r,g,b" (no alpha) so we can vary opacity per blob.
const PALETTES: Record<string, ColorTriple> = {
  crimson: ["220,20,60", "180,0,40", "139,0,0"],
  "crimson-purple": ["220,20,60", "139,92,246", "91,33,182"],
  navy: ["30,58,138", "37,99,235", "15,23,42"],
  "magenta-orange": ["217,70,239", "249,115,22", "192,38,211"],
  "ps-blue": ["0,48,135", "0,86,179", "15,23,42"],
  amber: ["212,168,67", "180,140,50", "146,64,14"],
};

export type Palette = keyof typeof PALETTES;

// Vertical layout of the four blobs across the page height. Each one alternates
// sides so the eye reads a soft zig-zag down the canvas.
const LAYOUT = [
  { top: "0%", side: "left" as const, size: "75vmax", offset: "-18vmax", coreAlpha: 0.34, midAlpha: 0.14, colorIdx: 0 },
  { top: "28%", side: "right" as const, size: "78vmax", offset: "-20vmax", coreAlpha: 0.28, midAlpha: 0.12, colorIdx: 1 },
  { top: "58%", side: "left" as const, size: "80vmax", offset: "-22vmax", coreAlpha: 0.30, midAlpha: 0.13, colorIdx: 2 },
  { top: "85%", side: "right" as const, size: "75vmax", offset: "-18vmax", coreAlpha: 0.26, midAlpha: 0.11, colorIdx: 0 },
];

interface PageBlobsProps {
  palette: Palette;
  /**
   * Offset from the top of the parent before blobs start rendering.
   * Use "100vh" for pages where the hero is scoped and shouldn't be tinted
   * by the page-level palette (e.g. home).
   */
  startTop?: string;
}

export default function PageBlobs({ palette, startTop = "0" }: PageBlobsProps) {
  const colors = PALETTES[palette];

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none overflow-hidden"
      style={{
        top: startTop,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    >
      {LAYOUT.map((b, i) => {
        const c = colors[b.colorIdx];
        return (
          <div
            key={i}
            className="bg-blob absolute rounded-full"
            style={{
              top: b.top,
              [b.side]: b.offset,
              width: b.size,
              height: b.size,
              transform: "translateY(-25%)",
              background: `radial-gradient(circle, rgba(${c},${b.coreAlpha}) 0%, rgba(${c},${b.midAlpha}) 42%, transparent 76%)`,
            }}
          />
        );
      })}
    </div>
  );
}
