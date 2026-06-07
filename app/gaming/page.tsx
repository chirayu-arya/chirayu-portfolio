"use client";

import AppleNav from "../components/AppleNav";
import AppleFooter from "../components/AppleFooter";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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

// ── Design tokens (light Apple) ──────────────────────────────────────────────

const C = {
  page: "#fbfbfd",
  alt: "#f5f5f7",
  card: "#ffffff",
  hairline: "rgba(0,0,0,0.08)",
  hairlineSoft: "rgba(0,0,0,0.06)",
  ink: "#1d1d1f",
  ink2: "#6e6e73",
  ink3: "#86868b",
  link: "#0066cc",
};

const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;
const EASE = [0.16, 1, 0.3, 1] as const;

// Trophy tier colors retuned for light theme (deeper variants of the originals).
const TROPHY_COLORS: Record<keyof TrophyCounts, string> = {
  platinum: "#5a6a82",
  gold: "#b08a2e",
  silver: "#6e6e73",
  bronze: "#9c5a2c",
};
const TROPHY_ICONS: Record<keyof TrophyCounts, string> = {
  platinum: "🏆", gold: "🥇", silver: "🥈", bronze: "🥉",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Small UI bits ────────────────────────────────────────────────────────────

function TrophyPip({ type, count }: { type: keyof TrophyCounts; count: number }) {
  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: TROPHY_COLORS[type] }}>
      <span>{TROPHY_ICONS[type]}</span>
      <span>{count}</span>
    </span>
  );
}

function ProgressBar({ value, color = "#1d1d1f" }: { value: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div ref={ref} className="w-full h-1 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
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

// ── Trophy Dashboard ─────────────────────────────────────────────────────────

function TrophyDashboard({ summary }: { summary: TrophySummary }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const tiers = [
    { type: "platinum" as const, label: "Platinum" },
    { type: "gold" as const,     label: "Gold" },
    { type: "silver" as const,   label: "Silver" },
    { type: "bronze" as const,   label: "Bronze" },
  ];

  const counts = tiers.map((t) => summary.earnedTrophies[t.type]);
  const total = counts.reduce((s, c) => s + c, 0);
  const maxCount = Math.max(...counts);

  const R = 66;
  const circum = 2 * Math.PI * R;
  const levelProgress = (summary.trophyLevel % 100) / 100;

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: C.card, border: `1px solid ${C.hairlineSoft}` }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Level ring */}
        <div
          className="flex flex-col items-center justify-center gap-3 p-8 lg:p-10 lg:w-64 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="ringGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5a6a82" />
                <stop offset="50%" stopColor="#b08a2e" />
                <stop offset="100%" stopColor="#9c5a2c" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="9" />
            <motion.circle
              cx="80" cy="80" r={R} fill="none"
              stroke="url(#ringGradLight)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circum}
              initial={{ strokeDashoffset: circum }}
              animate={inView ? { strokeDashoffset: circum * (1 - levelProgress) } : {}}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
              style={{ rotate: "-90deg", transformOrigin: "80px 80px" }}
            />
            <text x="80" y="75" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: C.ink, fontSize: "38px", fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "inherit" }}>
              {summary.trophyLevel}
            </text>
            <text x="80" y="98" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: C.ink3, fontSize: "9px", fontWeight: 500, letterSpacing: "0.18em", fontFamily: "inherit" }}>
              LEVEL
            </text>
          </svg>
          <p className="text-xs uppercase tracking-widest text-center" style={{ color: C.ink3 }}>Trophy Level</p>
        </div>

        {/* Bars */}
        <div
          className="flex-1 p-8 lg:p-10 flex flex-col justify-center gap-5"
          style={{ borderLeft: `1px solid ${C.hairlineSoft}` }}
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl" style={{ lineHeight: 1 }}>🏆</span>
            <motion.span
              className="text-3xl font-semibold"
              style={{ color: C.ink, letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {total.toLocaleString()}
            </motion.span>
            <span className="text-sm" style={{ color: C.ink3 }}>trophies earned</span>
          </div>

          {tiers.map(({ type, label }, i) => {
            const count = summary.earnedTrophies[type];
            const barPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const color = TROPHY_COLORS[type];
            return (
              <div key={type} className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider w-16 text-right flex-shrink-0" style={{ color }}>
                  {label}
                </span>
                <div className="flex-1 relative h-2.5 rounded-full" style={{ background: "rgba(0,0,0,0.05)" }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${barPct}%` } : { width: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.07 }}
                  />
                </div>
                <motion.span
                  className="text-sm font-semibold w-10 flex-shrink-0"
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

// ── Currently Playing ────────────────────────────────────────────────────────

function CurrentlyPlaying({ game }: { game: LibraryGame }) {
  const pct = game.trophy?.progress ?? 0;
  const duration = parseDuration(game.playDuration);
  const img = gameImage(game);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: C.card, border: `1px solid ${C.hairlineSoft}` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 p-8 items-start lg:items-stretch">
        <div className="flex-shrink-0 flex items-center">
          <div
            className="relative w-36 h-36 lg:w-40 lg:h-40 rounded-xl overflow-hidden"
            style={{ border: `1px solid ${C.hairlineSoft}` }}
          >
            {img ? (
              <img src={img} alt={game.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: C.alt }}>
                <span className="text-5xl">🎮</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xl lg:text-2xl font-semibold leading-tight" style={{ color: C.ink, letterSpacing: "-0.02em" }}>
              {game.name}
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-6">
              {duration && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.ink3 }}>Play Time</p>
                  <p className="text-lg font-semibold" style={{ color: C.ink }}>{duration}</p>
                </div>
              )}
              {game.playCount > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.ink3 }}>Sessions</p>
                  <p className="text-lg font-semibold" style={{ color: C.ink }}>{game.playCount}</p>
                </div>
              )}
              {game.trophy && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.ink3 }}>Trophy Progress</p>
                  <p className="text-lg font-semibold" style={{ color: C.ink }}>{pct}%</p>
                </div>
              )}
            </div>
            {game.trophy && (
              <div className="flex flex-col gap-2 max-w-sm">
                <ProgressBar value={pct} color={C.ink} />
                <div className="flex gap-4">
                  {(["platinum", "gold", "silver", "bronze"] as const).map((t) => (
                    <TrophyPip key={t} type={t} count={game.trophy!.earnedTrophies[t]} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Recently Played Strip ────────────────────────────────────────────────────

function RecentCard({ game, index }: { game: LibraryGame; index: number }) {
  const img = gameImage(game);
  const duration = parseDuration(game.playDuration);
  const pct = game.trophy?.progress ?? null;

  return (
    <motion.div
      className="flex-shrink-0 w-44 flex flex-col gap-2"
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
    >
      <div
        className="relative w-full aspect-square rounded-xl overflow-hidden"
        style={{ border: `1px solid ${C.hairlineSoft}`, background: C.alt }}
      >
        {img ? (
          <img src={img} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">🎮</span></div>
        )}
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium"
          style={{
            background: "rgba(255,255,255,0.85)",
            color: C.ink,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {platformLabel(game.category)}
        </div>
        {pct !== null && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="w-full h-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.18)" }}>
              <div
                className="h-0.5 rounded-full"
                style={{ width: `${pct}%`, background: pct === 100 ? TROPHY_COLORS.platinum : C.ink }}
              />
            </div>
          </div>
        )}
      </div>
      <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: C.ink, letterSpacing: "-0.01em" }}>
        {game.name}
      </p>
      {duration && <p className="text-xs" style={{ color: C.ink3 }}>{duration}</p>}
    </motion.div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="rounded-2xl h-64" style={{ background: C.alt }} />
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-44 h-56 rounded-xl" style={{ background: C.alt }} />
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GamingPage() {
  const [data, setData] = useState<PSNData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const summary = data?.trophySummary;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.page, fontFamily: SF }}
    >
      <AppleNav />

      <div className="relative z-10 px-8 sm:px-14 lg:px-20 pt-32 pb-24">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <motion.h1
              className="font-semibold flex items-end gap-3 sm:gap-5"
              style={{
                fontSize: "clamp(3rem, 7vw, 7rem)",
                color: C.ink,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                padding: "0.1em 0",
              }}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            >
              <span>Techno_Naut</span>
              <img
                src="/PS-Plus.png"
                alt="PlayStation Plus"
                style={{ flexShrink: 0, marginBottom: "0.18em", objectFit: "contain" }}
                className="w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
              />
            </motion.h1>

            <motion.a
              href="https://instagram.com/technonaut.frames"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium cursor-pointer"
              style={{
                background: C.card,
                color: C.ink,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                marginBottom: "0.4rem",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.08)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          >
            <TrophyDashboard summary={summary} />
          </motion.div>
        )}

        {/* Content */}
        {error ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: C.card, border: `1px solid ${C.hairlineSoft}`, color: C.ink3 }}
          >
            <p className="text-lg mb-1" style={{ color: C.ink, fontWeight: 600 }}>Could not load PSN data</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : !data ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col gap-20">

            {/* Currently Playing */}
            {currentlyPlayingGames.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 1.0, ease: EASE }}
                  className="font-semibold mb-10"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                    color: C.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.1,
                    padding: "0.1em 0",
                  }}
                >
                  What&apos;s on right now.
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {currentlyPlayingGames.map((game) => (
                    <CurrentlyPlaying key={game.titleId} game={game} />
                  ))}
                </motion.div>
              </div>
            )}

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 1.0, ease: EASE }}
                  className="font-semibold mb-10"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                    color: C.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.1,
                    padding: "0.1em 0",
                  }}
                >
                  Lately on the controller.
                </motion.h2>
                <div
                  className="flex gap-4 overflow-x-auto"
                  style={{ scrollbarWidth: "none", paddingTop: "4px", paddingBottom: "2px", alignItems: "flex-start" }}
                >
                  {recentlyPlayed.map((g, i) => (
                    <RecentCard key={g.titleId} game={g} index={i} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <AppleFooter />
    </main>
  );
}
