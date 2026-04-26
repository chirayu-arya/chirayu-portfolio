"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, useInView, useAnimation, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type TrophyCounts = {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
};

type TrophyTitle = {
  trophyTitleName: string;
  trophyTitleIconUrl: string;
  trophyTitlePlatform: string;
  definedTrophies: TrophyCounts;
  earnedTrophies: TrophyCounts;
  progress: number;
  npCommunicationId: string;
};

type TrophySummary = {
  trophyLevel: number;
  earnedTrophies: TrophyCounts;
};

type LibraryGame = {
  titleId: string;
  name: string;
  imageUrl: string;
  localizedImageUrl?: string;
  category: string;
  service: string;
  playCount: number;
  firstPlayedDateTime?: string;
  lastPlayedDateTime?: string;
  playDuration?: string;
  concept?: {
    id: number;
    name: string;
    media?: { images?: { url: string; type: string }[] };
  };
  trophy: TrophyTitle | null;
};

type PSNData = {
  titles: TrophyTitle[];
  trophySummary: TrophySummary;
  recentlyPlayed: LibraryGame[];
  library: LibraryGame[];
  totalLibraryCount: number;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

function parseDurationHours(iso: string | undefined): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return parseInt(match[1] ?? "0") + parseInt(match[2] ?? "0") / 60;
}

function parseDuration(iso: string | undefined): string {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return "";
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}


function gameImage(g: LibraryGame): string {
  const conceptImg = g.concept?.media?.images?.find(
    (i) => i.type === "FOUR_BY_THREE_BANNER" || i.type === "MASTER"
  )?.url;
  return conceptImg ?? g.imageUrl ?? "";
}

function platformLabel(category: string): string {
  if (category === "ps5_native_game") return "PS5";
  if (category === "ps4_game") return "PS4";
  if (category === "pspc_game") return "PC";
  return category.toUpperCase().replace("_GAME", "").replace("_", " ");
}

// ── Physics PS buttons ────────────────────────────────────────────────────────

type PhysBall = { x: number; y: number; vx: number; vy: number; r: number; size: number };

const PS_BUTTON_CONFIGS = [
  {
    size: 280, r: 140, color: "#6B8ED6", glow: "rgba(107,142,214,0.45)",
    svg: (
      <svg width="280" height="280" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#6B8ED6" strokeWidth="1" fill="rgba(91,127,217,0.12)"/>
        <line x1="9" y1="9" x2="19" y2="19" stroke="#6B8ED6" strokeWidth="2.4" strokeLinecap="round"/>
        <line x1="19" y1="9" x2="9" y2="19" stroke="#6B8ED6" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    size: 240, r: 120, color: "#C44B4B", glow: "rgba(196,75,75,0.4)",
    svg: (
      <svg width="240" height="240" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#C44B4B" strokeWidth="1" fill="rgba(196,75,75,0.1)"/>
        <circle cx="14" cy="14" r="5.5" stroke="#C44B4B" strokeWidth="2.4" fill="none"/>
      </svg>
    ),
  },
  {
    size: 200, r: 100, color: "#4BAE8A", glow: "rgba(75,174,138,0.38)",
    svg: (
      <svg width="200" height="200" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#4BAE8A" strokeWidth="1" fill="rgba(75,174,138,0.1)"/>
        <polygon points="14,8 20.5,20 7.5,20" stroke="#4BAE8A" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    size: 160, r: 80, color: "#BA7CC4", glow: "rgba(186,124,196,0.38)",
    svg: (
      <svg width="160" height="160" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#BA7CC4" strokeWidth="1" fill="rgba(186,124,196,0.1)"/>
        <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" stroke="#BA7CC4" strokeWidth="2.4" fill="none"/>
      </svg>
    ),
  },
];

function PhysicsPSButtons() {
  const x0 = useMotionValue(100);  const y0 = useMotionValue(80);
  const x1 = useMotionValue(800);  const y1 = useMotionValue(300);
  const x2 = useMotionValue(500);  const y2 = useMotionValue(600);
  const x3 = useMotionValue(250);  const y3 = useMotionValue(400);

  const mvs = [
    { x: x0, y: y0 }, { x: x1, y: y1 },
    { x: x2, y: y2 }, { x: x3, y: y3 },
  ];

  const balls = useRef<PhysBall[]>([
    { x: 100, y: 80,  vx: 1.54, vy: 1.12, r: 140, size: 280 },
    { x: 800, y: 300, vx: -1.4, vy: 1.68, r: 120, size: 240 },
    { x: 500, y: 600, vx: 1.26, vy: -1.4, r: 100, size: 200 },
    { x: 250, y: 400, vx: -1.68, vy: -1.26, r: 80, size: 160 },
  ]);

  useEffect(() => {
    // Skip physics loop entirely on touch devices — rAF at 60fps kills mobile performance
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    let raf: number;
    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const b = balls.current;

      // Move
      for (let i = 0; i < b.length; i++) {
        b[i].x += b[i].vx;
        b[i].y += b[i].vy;
        // Wall bounce — use radius for circular boundary
        if (b[i].x < 0)              { b[i].x = 0;                  b[i].vx =  Math.abs(b[i].vx); }
        if (b[i].x + b[i].size > vw) { b[i].x = vw - b[i].size;    b[i].vx = -Math.abs(b[i].vx); }
        if (b[i].y < 0)              { b[i].y = 0;                  b[i].vy =  Math.abs(b[i].vy); }
        if (b[i].y + b[i].size > vh) { b[i].y = vh - b[i].size;    b[i].vy = -Math.abs(b[i].vy); }
      }

      // Circle-circle elastic collisions
      for (let i = 0; i < b.length; i++) {
        for (let j = i + 1; j < b.length; j++) {
          const cx_a = b[i].x + b[i].r, cy_a = b[i].y + b[i].r;
          const cx_b = b[j].x + b[j].r, cy_b = b[j].y + b[j].r;
          const dx = cx_b - cx_a, dy = cy_b - cy_a;
          const dist = Math.hypot(dx, dy);
          const minDist = b[i].r + b[j].r;
          if (dist < minDist && dist > 0.01) {
            const nx = dx / dist, ny = dy / dist;
            // Relative velocity along collision normal
            const dot = (b[i].vx - b[j].vx) * nx + (b[i].vy - b[j].vy) * ny;
            if (dot > 0) {
              // Equal-mass elastic swap along normal
              b[i].vx -= dot * nx; b[i].vy -= dot * ny;
              b[j].vx += dot * nx; b[j].vy += dot * ny;
            }
            // Separate overlapping circles
            const overlap = (minDist - dist) / 2;
            b[i].x -= nx * overlap; b[i].y -= ny * overlap;
            b[j].x += nx * overlap; b[j].y += ny * overlap;
          }
        }
      }

      // Push positions to motion values
      mvs[0].x.set(b[0].x); mvs[0].y.set(b[0].y);
      mvs[1].x.set(b[1].x); mvs[1].y.set(b[1].y);
      mvs[2].x.set(b[2].x); mvs[2].y.set(b[2].y);
      mvs[3].x.set(b[3].x); mvs[3].y.set(b[3].y);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {PS_BUTTON_CONFIGS.map((cfg, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ top: 0, left: 0, x: mvs[i].x, y: mvs[i].y }}
        >
          <div style={{ opacity: 0.38, filter: `drop-shadow(0 0 16px ${cfg.color}) drop-shadow(0 0 40px ${cfg.glow})` }}>
            {cfg.svg}
          </div>
        </motion.div>
      ))}
    </>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function PSButtons({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <div className="flex gap-3 select-none" style={{ opacity }} aria-hidden>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill="rgba(91,127,217,0.15)" stroke="rgba(91,127,217,0.4)" strokeWidth="1"/>
        <line x1="9" y1="9" x2="19" y2="19" stroke="#6B8ED6" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="19" y1="9" x2="9" y2="19" stroke="#6B8ED6" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill="rgba(196,75,75,0.15)" stroke="rgba(196,75,75,0.4)" strokeWidth="1"/>
        <circle cx="14" cy="14" r="5.5" stroke="#C44B4B" strokeWidth="2.2" fill="none"/>
      </svg>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill="rgba(75,174,138,0.15)" stroke="rgba(75,174,138,0.4)" strokeWidth="1"/>
        <polygon points="14,8 20.5,20 7.5,20" stroke="#4BAE8A" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill="rgba(186,124,196,0.15)" stroke="rgba(186,124,196,0.4)" strokeWidth="1"/>
        <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" stroke="#BA7CC4" strokeWidth="2.2" fill="none"/>
      </svg>
    </div>
  );
}

function TrophyPip({ type, count }: { type: keyof TrophyCounts; count: number }) {
  const colors: Record<keyof TrophyCounts, string> = {
    platinum: "#B8C5D6",
    gold: "#D4A843",
    silver: "#A8A8B0",
    bronze: "#C87A40",
  };
  const icons: Record<keyof TrophyCounts, string> = {
    platinum: "🏆", gold: "🥇", silver: "🥈", bronze: "🥉",
  };
  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: colors[type] }}>
      <span>{icons[type]}</span>
      <span>{count}</span>
    </span>
  );
}

function ProgressBar({ value, color = "#003087" }: { value: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div ref={ref} className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
      <motion.div
        className="h-1 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
      />
    </div>
  );
}

// ── Trophy Dashboard ──────────────────────────────────────────────────────────

function TrophyDashboard({ summary }: { summary: TrophySummary }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const tiers = [
    { type: "platinum" as const, label: "Platinum", color: "#B8C5D6", glow: "rgba(184,197,214,0.45)" },
    { type: "gold" as const,     label: "Gold",     color: "#D4A843", glow: "rgba(212,168,67,0.5)" },
    { type: "silver" as const,   label: "Silver",   color: "#A8A8B0", glow: "rgba(168,168,176,0.4)" },
    { type: "bronze" as const,   label: "Bronze",   color: "#C87A40", glow: "rgba(200,122,64,0.45)" },
  ];

  const counts = tiers.map((t) => summary.earnedTrophies[t.type]);
  const total = counts.reduce((s, c) => s + c, 0);
  const maxCount = Math.max(...counts);

  // Circular ring for trophy level
  const R = 66;
  const circum = 2 * Math.PI * R;
  // Use level mod 100 as progress within tier (PSN doesn't expose next-level threshold via this API)
  const levelProgress = (summary.trophyLevel % 100) / 100;

  return (
    <motion.div ref={ref} className="rounded-2xl overflow-hidden"
      style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
      whileHover={{ y: -4, borderColor: "rgba(212,168,67,0.3)" }}
      transition={{ duration: 0.3, ease: EASE }}>
      <div className="flex flex-col lg:flex-row">

        {/* Left: level ring */}
        <div className="flex flex-col items-center justify-center gap-3 p-8 lg:p-10 lg:w-64 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          // On desktop use right border instead
        >
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B8C5D6"/>
                <stop offset="50%" stopColor="#D4A843"/>
                <stop offset="100%" stopColor="#C87A40"/>
              </linearGradient>
              <filter id="ringGlow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Track */}
            <circle cx="80" cy="80" r={R} fill="none"
              stroke="rgba(255,255,255,0.07)" strokeWidth="9"/>
            {/* Glow copy */}
            <motion.circle
              cx="80" cy="80" r={R} fill="none"
              stroke="url(#ringGrad)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circum}
              initial={{ strokeDashoffset: circum }}
              animate={inView ? { strokeDashoffset: circum * (1 - levelProgress) } : {}}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
              style={{ rotate: "-90deg", transformOrigin: "80px 80px", opacity: 0.35, filter: "blur(6px)" }}
            />
            {/* Main arc */}
            <motion.circle
              cx="80" cy="80" r={R} fill="none"
              stroke="url(#ringGrad)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circum}
              initial={{ strokeDashoffset: circum }}
              animate={inView ? { strokeDashoffset: circum * (1 - levelProgress) } : {}}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
              style={{ rotate: "-90deg", transformOrigin: "80px 80px" }}
            />
            {/* Level number — group centered at (80,80) */}
            <text x="80" y="75" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: "#f5f5f7", fontSize: "38px", fontWeight: "800", fontFamily: "inherit" }}>
              {summary.trophyLevel}
            </text>
            <text x="80" y="98" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: "#515154", fontSize: "9px", fontWeight: "600", letterSpacing: "0.18em", fontFamily: "inherit" }}>
              LEVEL
            </text>
          </svg>
          <p className="text-xs uppercase tracking-widest text-center" style={{ color: "#515154" }}>Trophy Level</p>
        </div>

        {/* Right: bars */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center gap-5"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl" style={{ lineHeight: 1 }}>🏆</span>
            <motion.span
              className="text-3xl font-bold"
              style={{ color: "#f5f5f7" }}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {total.toLocaleString()}
            </motion.span>
            <span className="text-sm" style={{ color: "#515154" }}>trophies earned</span>
          </div>

          {tiers.map(({ type, label, color, glow }, i) => {
            const count = summary.earnedTrophies[type];
            const barPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={type} className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider w-16 text-right flex-shrink-0"
                  style={{ color }}>
                  {label}
                </span>
                <div className="flex-1 relative h-2.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${barPct}%` } : { width: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.07 }}
                  />
                  {/* Glow layer */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: color, filter: `blur(6px)`, opacity: 0.5 }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${barPct}%` } : { width: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.07 }}
                  />
                </div>
                <motion.span
                  className="text-sm font-bold w-10 flex-shrink-0"
                  style={{ color }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.07 }}
                >
                  {count}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Currently Playing ─────────────────────────────────────────────────────────

function CurrentlyPlaying({ game }: { game: LibraryGame }) {
  const pct = game.trophy?.progress ?? 0;
  const duration = parseDuration(game.playDuration);
  const img = gameImage(game);

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden"
      style={{ border: "1px solid rgba(0,48,135,0.35)", cursor: "pointer" }}
      whileHover={{ y: -8, scale: 1.015, borderColor: "rgba(0,48,135,0.7)" }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {img && (
        <div className="absolute inset-0">
          <img src={img} alt="" className="w-full h-full object-cover"
            style={{ filter: "blur(32px) brightness(0.25) saturate(1.4)", transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,16,48,0.85) 0%, rgba(0,0,0,0.92) 100%)" }} />
        </div>
      )}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 p-8 lg:p-12 items-start lg:items-center">
        <div className="flex-shrink-0">
          <div className="relative w-36 h-36 lg:w-48 lg:h-48 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(0,48,135,0.45)" }}>
            {img
              ? <img src={img} alt={game.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: "#111" }}><span className="text-5xl">🎮</span></div>
            }
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#003087" }}>
              Currently Playing
            </p>
            <h2 className="text-xl lg:text-2xl font-bold leading-tight" style={{ color: "#f5f5f7" }}>
              {game.name}
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {duration && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "#515154" }}>Play Time</p>
                <p className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>{duration}</p>
              </div>
            )}
            {game.playCount > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "#515154" }}>Sessions</p>
                <p className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>{game.playCount}</p>
              </div>
            )}
            {game.trophy && (
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "#515154" }}>Trophy Progress</p>
                <p className="text-lg font-semibold" style={{ color: "#f5f5f7" }}>{pct}%</p>
              </div>
            )}
          </div>
          {game.trophy && (
            <div className="flex flex-col gap-2 max-w-sm">
              <ProgressBar value={pct} color="#003087" />
              <div className="flex gap-4">
                {(["platinum", "gold", "silver", "bronze"] as const).map((t) => (
                  <TrophyPip key={t} type={t} count={game.trophy!.earnedTrophies[t]} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Recently Played Strip ─────────────────────────────────────────────────────

function RecentCard({ game, index }: { game: LibraryGame; index: number }) {
  const img = gameImage(game);
  const duration = parseDuration(game.playDuration);
  const pct = game.trophy?.progress ?? null;

  return (
    <motion.div
      className="flex-shrink-0 w-44 flex flex-col gap-2"
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {img
          ? <img src={img} alt={game.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center" style={{ background: "#111" }}><span className="text-3xl">🎮</span></div>
        }
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
        <div className="absolute bottom-2 left-2 right-2">
          {pct !== null && (
            <div className="w-full h-0.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div className="h-0.5 rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "#B8C5D6" : "#003087" }} />
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium"
          style={{ background: "rgba(0,0,0,0.65)", color: "#86868b", backdropFilter: "blur(8px)" }}>
          {platformLabel(game.category)}
        </div>
      </div>
      <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: "#f5f5f7" }}>{game.name}</p>
      {duration && <p className="text-xs" style={{ color: "#515154" }}>{duration}</p>}
    </motion.div>
  );
}

// ── Library Card ──────────────────────────────────────────────────────────────

function LibraryCard({ game, index }: { game: LibraryGame; index: number }) {
  const img = gameImage(game);
  const pct = game.trophy?.progress ?? null;
  const hasPlatinum = (game.trophy?.earnedTrophies.platinum ?? 0) > 0;
  const duration = parseDuration(game.playDuration);

  const row = Math.floor(index / 3);
  const col = index % 3;

  return (
    <div className="library-card-wrap" style={{ cursor: "pointer" }}>
    <motion.div
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: hasPlatinum ? "1px solid rgba(184,197,214,0.25)" : "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, ease: EASE, delay: (row + col) * 0.03 }}
    >
      {/* Fixed pixel height kills the fractional-pixel gap that aspect-ratio causes */}
      <div className="relative w-full overflow-hidden" style={{ height: 160 }}>
        {img
          ? <img src={img} alt={game.name} className="w-full h-full object-cover object-top" style={{ display: "block", transition: "transform 0.7s ease", }} />
          : <div className="w-full h-full flex items-center justify-center" style={{ background: "#111" }}><span className="text-4xl opacity-20">🎮</span></div>
        }
        {hasPlatinum && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(184,197,214,0.18)", color: "#B8C5D6", backdropFilter: "blur(8px)", border: "1px solid rgba(184,197,214,0.25)" }}>
            PLATINUM
          </div>
        )}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(0,0,0,0.65)", color: "#f5f5f7", backdropFilter: "blur(8px)" }}>
          {platformLabel(game.category)}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 50%)" }} />
      </div>

      <div className="p-4 pt-3 flex flex-col gap-3">
        <p className="text-sm font-semibold leading-snug" style={{ color: "#f5f5f7" }}>{game.name}</p>

        {duration && (
          <p className="text-xs" style={{ color: "#515154" }}>{duration} played · {game.playCount} sessions</p>
        )}

        {pct !== null ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "#86868b" }}>
                {game.trophy!.earnedTrophies.bronze + game.trophy!.earnedTrophies.silver + game.trophy!.earnedTrophies.gold + game.trophy!.earnedTrophies.platinum}
                /{game.trophy!.definedTrophies.bronze + game.trophy!.definedTrophies.silver + game.trophy!.definedTrophies.gold + game.trophy!.definedTrophies.platinum} trophies
              </span>
              <span className="text-xs font-semibold" style={{ color: pct === 100 ? "#B8C5D6" : "#003087" }}>{pct}%</span>
            </div>
            <ProgressBar value={pct} color={pct === 100 ? "#B8C5D6" : "#003087"} />
            <div className="flex gap-3">
              {(["platinum", "gold", "silver", "bronze"] as const).map((t) => (
                <TrophyPip key={t} type={t} count={game.trophy!.earnedTrophies[t]} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs" style={{ color: "#515154" }}>No trophy data</p>
        )}
      </div>
    </motion.div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="rounded-3xl h-64" style={{ background: "#111" }} />
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-44 h-56 rounded-xl" style={{ background: "#111" }} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl h-64" style={{ background: "#111" }} />
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type FilterStatus = "all" | "completed" | "in-progress" | "not-started";

export default function GamingPage() {
  const [data, setData] = useState<PSNData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Library controls
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");

  useEffect(() => {
    fetch("/api/psn")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d as PSNData);
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  const currentlyPlayingGames = data?.recentlyPlayed?.slice(0, 2) ?? [];
  const recentlyPlayed = data?.recentlyPlayed?.slice(2) ?? [];

  const filteredLibrary = useMemo(() => {
    if (!data) return [];
    let games = [...data.library];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      games = games.filter((g) => g.name.toLowerCase().includes(q));
    }

    // Status — based on play time, not trophy progress
    if (status === "completed") games = games.filter((g) => g.trophy?.progress === 100);
    if (status === "in-progress") games = games.filter((g) => parseDurationHours(g.playDuration) > 0 && (g.trophy?.progress ?? 0) < 100);
    if (status === "not-started") games = games.filter((g) => parseDurationHours(g.playDuration) === 0);

    return games;
  }, [data, search, status]);

  const summary = data?.trophySummary;

  const STATUS_OPTIONS: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "in-progress", label: "In Progress" },
    { key: "not-started", label: "Not Started" },
  ];

  return (
    <main className="min-h-screen" style={{ background: "#000" }}>
      <Nav />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="bg-blob absolute" style={{
          top: "-15%", left: "-10%", width: "55%", height: "55%",
          background: "radial-gradient(ellipse, rgba(0,48,135,0.18) 0%, transparent 70%)",
          willChange: "transform", transform: "translateZ(0)",
        }} />
        <div className="bg-blob absolute" style={{
          top: "30%", right: "-10%", width: "45%", height: "45%",
          background: "radial-gradient(ellipse, rgba(0,64,180,0.12) 0%, transparent 70%)",
          willChange: "transform", transform: "translateZ(0)",
        }} />
        <div className="bg-blob absolute" style={{
          bottom: "-10%", left: "20%", width: "50%", height: "40%",
          background: "radial-gradient(ellipse, rgba(0,32,100,0.15) 0%, transparent 70%)",
          willChange: "transform", transform: "translateZ(0)",
        }} />

        {/* Physics-driven PS buttons — hidden on mobile via CSS, rAF skipped on touch */}
        <div className="physics-ps-buttons">
          <PhysicsPSButtons />
        </div>
      </div>

      <div className="relative z-10 px-5 sm:px-8 lg:px-16 pt-32 pb-0 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          {/* Eyebrow row */}
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Mobile: "Gaming Dashboard" | Desktop: "Gaming Dashboard · PlayStation" */}
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#003087" }}>
              <span className="sm:hidden">Gaming Dashboard</span>
              <span className="hidden sm:inline">Gaming Dashboard&nbsp;&nbsp;·&nbsp;&nbsp;PlayStation</span>
            </p>
            {/* Mobile: Photo Mode button | Desktop: PS button icons */}
            <a
              href="https://instagram.com/technonaut.frames"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: "rgba(0,48,135,0.18)",
                border: "1px solid rgba(0,48,135,0.45)",
                color: "#f5f5f7",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Photo Mode
            </a>
            <div className="hidden sm:block">
              <PSButtons opacity={0.5} />
            </div>
          </motion.div>

          {/* Headline row */}
          <div className="flex items-center justify-between gap-4">
            <motion.h1
              className="text-3xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight flex items-center gap-3"
              style={{ color: "#f5f5f7" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            >
              {/* Mobile: "Techno_Naut" | Desktop: "I am Techno_Naut!" */}
              <span className="sm:hidden">Techno_Naut</span>
              <span className="hidden sm:inline">I am Techno_Naut!</span>
              {/* PS Plus logo — slightly smaller on mobile */}
              <img src="/PS-Plus.png" alt="PlayStation Plus" style={{ flexShrink: 0, marginBottom: "0.1em", objectFit: "contain" }} className="w-9 h-9 sm:w-[52px] sm:h-[52px]" />
            </motion.h1>

            {/* Photo Mode — desktop only (mobile is in eyebrow row) */}
            <motion.a
              href="https://instagram.com/technonaut.frames"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(0,48,135,0.18)",
                border: "1px solid rgba(0,48,135,0.45)",
                color: "#f5f5f7",
                cursor: "pointer",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
              whileHover={{ y: -3, background: "rgba(0,48,135,0.35)", borderColor: "rgba(0,48,135,0.75)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Photo Mode
            </motion.a>
          </div>
        </div>

        {/* Trophy Dashboard */}
        {summary && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          >
            <TrophyDashboard summary={summary} />
          </motion.div>
        )}

        {/* Content */}
        {error ? (
          <div className="rounded-2xl p-8 text-center"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", color: "#86868b" }}>
            <p className="text-lg mb-1" style={{ color: "#f5f5f7" }}>Could not load PSN data</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : !data ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col gap-14">

            {/* Currently Playing */}
            {currentlyPlayingGames.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                {currentlyPlayingGames.map((game) => (
                  <CurrentlyPlaying key={game.titleId} game={game} />
                ))}
              </motion.div>
            )}

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-5" style={{ color: "#f5f5f7" }}>Recently Played</h2>
                <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none", paddingTop: "4px", paddingBottom: "2px", alignItems: "flex-start" }}>
                  {recentlyPlayed.map((g, i) => (
                    <RecentCard key={g.titleId} game={g} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Library */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold flex items-baseline gap-2" style={{ color: "#f5f5f7" }}>
                  My Library
                  <span className="text-sm font-normal" style={{ color: "#515154" }}>
                    {filteredLibrary.length !== data.library.length
                      ? `${filteredLibrary.length} of ${data.totalLibraryCount?.toLocaleString() ?? data.library.length} games`
                      : `${data.totalLibraryCount?.toLocaleString() ?? data.library.length} games`}
                  </span>
                </h2>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 rounded-xl text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f5f5f7",
                    }}
                  />
                </div>
              </div>

              {/* Status filter */}
              <div className="flex gap-1.5 flex-wrap mb-6">
                {STATUS_OPTIONS.map(({ key, label }) => (
                  <button key={key} onClick={() => setStatus(key)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: status === key ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                      color: status === key ? "#f5f5f7" : "#86868b",
                      border: status === key ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {filteredLibrary.length === 0 ? (
                <p className="text-sm py-12 text-center" style={{ color: "#515154" }}>No games found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLibrary.map((game, i) => (
                    <LibraryCard key={game.titleId} game={game} index={i} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <div className="mt-24">
        <Contact />
      </div>
    </main>
  );
}
