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
  "crimson-amber-teal": ["220,20,60", "212,168,67", "20,184,166"],
  navy: ["30,58,138", "37,99,235", "15,23,42"],
  "magenta-orange": ["217,70,239", "249,115,22", "192,38,211"],
  "ps-blue": ["0,48,135", "0,86,179", "15,23,42"],
  amber: ["212,168,67", "180,140,50", "146,64,14"],
};

export type Palette = keyof typeof PALETTES;

// Vertical layout — first blob at 5%, then 15% increments (7 total),
// alternating sides so the eye reads a soft zig-zag down the canvas.
// All blobs share the same intensity (0.40 core / 0.18 mid) for a uniform
// page-level feel.
const CORE_ALPHA = 0.40;
const MID_ALPHA = 0.18;

const LAYOUT = [
  { top: "10%", side: "center" as const, size: "70vmax", offset: "0", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 0 },
  { top: "20%", side: "right" as const, size: "72vmax", offset: "-20vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 1 },
  { top: "35%", side: "left" as const, size: "75vmax", offset: "-20vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 2 },
  { top: "50%", side: "right" as const, size: "72vmax", offset: "-18vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 0 },
  { top: "65%", side: "left" as const, size: "75vmax", offset: "-20vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 1 },
  { top: "80%", side: "right" as const, size: "70vmax", offset: "-18vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 2 },
  { top: "95%", side: "left" as const, size: "75vmax", offset: "-20vmax", coreAlpha: CORE_ALPHA, midAlpha: MID_ALPHA, colorIdx: 0 },
];

interface PageBlobsProps {
  palette: Palette;
  /**
   * Offset from the top of the parent before blobs start rendering.
   * Use "100vh" for pages where the hero is scoped and shouldn't be tinted
   * by the page-level palette (e.g. home).
   */
  startTop?: string;
  /**
   * Alpha scale applied to blobs after the first one (i.e. everything below
   * the hero region). Use < 1 to lighten the rest of the page.
   */
  postHeroAlphaScale?: number;
}

export default function PageBlobs({ palette, startTop = "0", postHeroAlphaScale = 1 }: PageBlobsProps) {
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
        const isCenter = b.side === "center";
        const scale = i === 0 ? 1 : postHeroAlphaScale;
        const core = b.coreAlpha * scale;
        const mid = b.midAlpha * scale;
        return (
          <div
            key={i}
            className="bg-blob absolute rounded-full"
            style={{
              top: b.top,
              ...(isCenter ? { left: "50%" } : { [b.side]: b.offset }),
              width: b.size,
              height: b.size,
              transform: isCenter ? "translate(-50%, -25%)" : "translateY(-25%)",
              background: `radial-gradient(circle, rgba(${c},${core}) 0%, rgba(${c},${mid}) 42%, transparent 76%)`,
            }}
          />
        );
      })}
    </div>
  );
}
