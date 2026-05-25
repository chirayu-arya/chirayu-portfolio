"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from "react";

type Tab = "photography" | "illustrations";

type Photo = {
  id: number;
  tab: Tab;
  title: string;
  category: string;
  description: string;
  src: string;
  w: number;
  h: number;
};

const VP = "/Gallery/Photography/Virtual%20Photography";
const RP = "/Gallery/Photography/Real%20Photography";
const ILL = "/Gallery/Illustrations";
const VIRTUAL_DESC = "Clicked on Playstation 5.";
const ILLUS_TOOL = "Made on Procreate, on iPad Pro, with Apple Pencil Pro.";

const PHOTOGRAPHY: Photo[] = [
  { id: 50, tab: "photography", w: 2157, h: 3834, title: "Crystal Sentinel",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9518.JPG` },
  { id: 13, tab: "photography", w: 1682, h: 2243, title: "Plumed Sentinel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8564.JPG` },
  { id: 58, tab: "photography", w: 3840, h: 2160, title: "Runebearer",               category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9556%202.JPG` },
  { id: 1,  tab: "photography", w: 3840, h: 2160, title: "Together at 33",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg` },
  { id: 2,  tab: "photography", w: 3840, h: 2160, title: "Lumière Glance",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7685.jpg` },
  { id: 3,  tab: "photography", w: 3814, h: 2145, title: "Stillness Beneath the Falls", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8199.JPG` },
  { id: 4,  tab: "photography", w: 3840, h: 2160, title: "Through the Veil",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7858.jpg` },
  { id: 5,  tab: "photography", w: 3840, h: 2160, title: "The Wildflower Ride",      category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG` },
  { id: 6,  tab: "photography", w: 2157, h: 2876, title: "The First Spark",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8255.jpg` },
  { id: 7,  tab: "photography", w: 3840, h: 2160, title: "Symbiote Showdown",        category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7733.JPG` },
  { id: 8,  tab: "photography", w: 2071, h: 2761, title: "The Quiet Heir",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8367%202.jpg` },
  { id: 9,  tab: "photography", w: 2157, h: 3834, title: "After the Battle",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8381%203.JPG` },
  { id: 10, tab: "photography", w: 2305, h: 1297, title: "Plains Lily",              category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8200.JPG` },
  { id: 11, tab: "photography", w: 1683, h: 2992, title: "Into the Light",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8392%202.JPG` },
  { id: 12, tab: "photography", w: 1844, h: 3278, title: "Ginkgo Storm",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8858.JPG` },
  { id: 54, tab: "photography", w: 1814, h: 3225, title: "Blood Memory",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9531.JPG` },
  { id: 51, tab: "photography", w: 1952, h: 2602, title: "Lunar Pilgrim",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9510.jpg` },
  { id: 55, tab: "photography", w: 3840, h: 2160, title: "Echoes of 33",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9542.JPG` },
  { id: 15, tab: "photography", w: 1882, h: 2510, title: "Cloaked in Gold",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8582.JPG` },
  { id: 16, tab: "photography", w: 3610, h: 2031, title: "Defiant Stand",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8607.JPG` },
  { id: 17, tab: "photography", w: 2160, h: 3840, title: "Through the Ferns",        category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8867.JPG` },
  { id: 18, tab: "photography", w: 1971, h: 2628, title: "The Approach",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8643.jpg` },
  { id: 19, tab: "photography", w: 3840, h: 2160, title: "Venom Rising",             category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7735.JPG` },
  { id: 20, tab: "photography", w: 2157, h: 2876, title: "Petals at Midnight",       category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8652.jpg` },
  { id: 21, tab: "photography", w: 3840, h: 2160, title: "Roots of Pandora",         category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8204.JPG` },
  { id: 22, tab: "photography", w: 3840, h: 2160, title: "The Last Bloom",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8682.jpg` },
  { id: 23, tab: "photography", w: 2109, h: 2812, title: "Beneath the 33",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8690.JPG` },
  { id: 24, tab: "photography", w: 2160, h: 3840, title: "Bluebell Stand",           category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8869.JPG` },
  { id: 52, tab: "photography", w: 2017, h: 2689, title: "Sundered Sky",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9519.JPG` },
  { id: 56, tab: "photography", w: 1890, h: 2835, title: "Renoir",     category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9543.jpg` },
  { id: 37, tab: "photography", w: 2160, h: 2700, title: "Cliffside Conversation",   category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9360.jpg` },
  { id: 26, tab: "photography", w: 3840, h: 2160, title: "Skyline Patrol",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7739.JPG` },
  { id: 27, tab: "photography", w: 1978, h: 3517, title: "Strings by Firelight",     category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8812.JPG` },
  { id: 28, tab: "photography", w: 1506, h: 2008, title: "Lantern Watch",            category: "Ghost of Tsushima",            description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG` },
  { id: 29, tab: "photography", w: 1954, h: 2606, title: "The Cradle",               category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9171.jpg` },
  { id: 30, tab: "photography", w: 1991, h: 2655, title: "Three of Us",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9172.jpg` },
  { id: 31, tab: "photography", w: 3840, h: 2160, title: "Sun Through the Canopy",   category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8205.JPG` },
  { id: 32, tab: "photography", w: 3840, h: 2160, title: "The Officer",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9332.JPG` },
  { id: 33, tab: "photography", w: 1601, h: 2135, title: "Camp at Dusk",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8871.JPG` },
  { id: 34, tab: "photography", w: 1860, h: 2480, title: "Burning Forward",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9338.jpg` },
  { id: 35, tab: "photography", w: 3840, h: 2160, title: "Aerial Confrontation",     category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7743.JPG` },
  { id: 36, tab: "photography", w: 3840, h: 2160, title: "Patchwork Idol",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9343.JPG` },
  { id: 53, tab: "photography", w: 2087, h: 2783, title: "The Great Wheel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9522.jpg` },
  { id: 57, tab: "photography", w: 3840, h: 2160, title: "The Lampmaster",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9548.JPG` },
  { id: 25, tab: "photography", w: 1811, h: 2415, title: "Faceless Watcher",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8699.JPG` },
  { id: 38, tab: "photography", w: 3840, h: 2160, title: "A Quiet Moment",           category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8210.JPG` },
  { id: 39, tab: "photography", w: 1971, h: 3504, title: "Ember Stare",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9436.JPG` },
  { id: 40, tab: "photography", w: 1601, h: 2135, title: "Resting Companions",       category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8901.JPG` },
  { id: 41, tab: "photography", w: 2160, h: 2880, title: "First Meeting",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9452.jpg` },
  { id: 42, tab: "photography", w: 3840, h: 2160, title: "Wings of Dread",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7745.JPG` },
  { id: 43, tab: "photography", w: 3840, h: 2160, title: "Behind the Mask",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9457.JPG` },
  { id: 44, tab: "photography", w: 2157, h: 2876, title: "Pilgrim Mound",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9492.jpg` },
  { id: 45, tab: "photography", w: 1914, h: 3402, title: "Maple Strike",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8948.JPG` },
  { id: 46, tab: "photography", w: 2157, h: 2876, title: "The Last Embrace",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9497.jpg` },
  { id: 47, tab: "photography", w: 3840, h: 2160, title: "The Final Grip",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7746.JPG` },
  { id: 48, tab: "photography", w: 1344, h: 756,  title: "Festival Day",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Post%203.png` },
  { id: 49, tab: "photography", w: 3840, h: 2160, title: "Crimson Path",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8978.JPG` },
  // — New batch: 3 Expedition 33 + 9 Hellblade —
  { id: 59, tab: "photography", w: 2157, h: 3834, title: "Hour of the Sun",          category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9585.JPG` },
  { id: 60, tab: "photography", w: 2157, h: 3834, title: "Verso's Gaze",             category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9587.JPG` },
  { id: 61, tab: "photography", w: 2157, h: 3834, title: "Touching 33",              category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9588.JPG` },
  { id: 64, tab: "photography", w: 2160, h: 2880, title: "Bridge of Trials",         category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9613.jpg` },
  { id: 69, tab: "photography", w: 2064, h: 3669, title: "Surt's Wrath",             category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9624.JPG` },
  { id: 63, tab: "photography", w: 2917, h: 1945, title: "Edge of Madness",          category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9612.JPG` },
  { id: 65, tab: "photography", w: 2160, h: 3840, title: "Crown of Memory",          category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9617.JPG` },
  { id: 62, tab: "photography", w: 1495, h: 2492, title: "The Vessel",               category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9608.jpg` },
  { id: 68, tab: "photography", w: 2160, h: 3840, title: "Hearthfire",               category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9623.JPG` },
  { id: 70, tab: "photography", w: 1344, h: 2390, title: "Quiet Resolve",            category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9625.JPG` },
];

const ILLUSTRATIONS: Photo[] = [
  { id: 1, tab: "illustrations", w: 2732, h: 2048, title: "Aurora",             category: ILLUS_TOOL, description: "A woman's face peers through a tropical canopy, framed by deep blues and warm coral leaves.", src: `${ILL}/Aurora%20-%20Chirayu%20Arya.PNG` },
  { id: 2, tab: "illustrations", w: 2048, h: 2732, title: "Chromatic Enigma",   category: ILLUS_TOOL, description: "A surreal kiss between two figures in violet and crimson, faces fragmented into bold colour blocks.", src: `${ILL}/Chromatic%20Enigma.PNG` },
  { id: 3, tab: "illustrations", w: 2048, h: 2732, title: "Citrus Muse",        category: ILLUS_TOOL, description: "A woman cradling a sliced orange, eyelids painted with the same glowing pulp.", src: `${ILL}/Citrus%20Muse.PNG` },
  { id: 4, tab: "illustrations", w: 2048, h: 2732, title: "Contour",            category: ILLUS_TOOL, description: "An upturned face caught mid-breath, eyes pooling with colour and light.", src: `${ILL}/Contour.PNG` },
  { id: 5, tab: "illustrations", w: 2048, h: 2732, title: "Emerald Reflections",category: ILLUS_TOOL, description: "A weathered green statue rendered in painterly strokes against a soft brown gradient.", src: `${ILL}/Emerald%20Reflections.png` },
  { id: 6, tab: "illustrations", w: 2048, h: 2732, title: "Golden Reverie",     category: ILLUS_TOOL, description: "A face dripping with molten honey, lips parted in quiet awe.", src: `${ILL}/Golden%20Reverie.PNG` },
  { id: 7, tab: "illustrations", w: 2048, h: 2732, title: "Scarlet Pout",       category: ILLUS_TOOL, description: "A close-up portrait, red sunglasses askew over glossy crimson lips.", src: `${ILL}/Scarlet%20Pout.PNG` },
  { id: 8, tab: "illustrations", w: 2048, h: 2732, title: "Sunlit Chapters",    category: ILLUS_TOOL, description: "A woman lounging poolside, half-asleep behind a pink magazine titled 'All About Miami'.", src: `${ILL}/Sunlit%20Chapters.PNG` },
  { id: 9, tab: "illustrations", w: 2048, h: 2732, title: "Veiled Petals",      category: ILLUS_TOOL, description: "A blindfolded woman crowned in tangled flowers, lips parted toward the warm horizon.", src: `${ILL}/Veiled%20Petals.PNG` },
];

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Game metadata for photography grouping — ordered as they should appear in the gallery.
// `category` must match the exact string used in PHOTOGRAPHY entries.
// `coverId` optionally overrides the tier-1 cover photo (defaults to the first photo in source order).
// `coverObjectPosition` shifts the visible region inside the 4:3 cover frame (CSS `object-position`).
const GAMES: { category: string; studio: string; coverId?: number; coverObjectPosition?: string; pinTopIds?: number[] }[] = [
  { category: "Clair Obscur: Expedition 33", studio: "Sandfall Interactive / Kepler Interactive", coverId: 53, pinTopIds: [57, 53] }, // The Great Wheel; pin Lampmaster + Great Wheel to top row
  { category: "Ghost of Yōtei", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverId: 45, coverObjectPosition: "50% 62%" }, // Maple Strike
  { category: "Hellblade: Senua's Sacrifice", studio: "Ninja Theory / Xbox Game Studios", coverId: 65, coverObjectPosition: "50% 55%" }, // Crown of Memory
  { category: "Avatar: Frontiers of Pandora", studio: "Massive Entertainment / Ubisoft" },
  { category: "Ghost of Tsushima", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverObjectPosition: "50% 80%" },
  { category: "Marvel's Spider-Man 2", studio: "Insomniac Games / Sony Interactive Entertainment" },
  { category: "Real Photography", studio: "iPhone 16 Pro" },
];

// Photos grouped by game, in GAMES order, preserving source order within each group.
// `cover` is the resolved photo to use on the tier-1 game card (override or first photo).
const PHOTOGRAPHY_GROUPS = GAMES
  .map(g => {
    const photos = PHOTOGRAPHY.filter(p => p.category === g.category);
    const cover = (g.coverId != null && photos.find(p => p.id === g.coverId)) || photos[0];
    return { ...g, photos, cover };
  })
  .filter(g => g.photos.length > 0);

// Auto-generated description for photography rows whose `description` is still
// the default VIRTUAL_DESC. Override per-row by replacing the description string
// in the PHOTOGRAPHY array with custom copy.
function descFor(p: Photo): string {
  if (p.tab === "illustrations") return p.description;
  if (p.description !== VIRTUAL_DESC) return p.description;
  return `${p.title}, a moment captured in ${p.category}.`;
}

// Hardware tier for the "Shot on PlayStation®..." sentence in the lightbox.
// Senua's Sacrifice was captured on a PS5 Pro; everything else on a base PS5.
function platformFor(p: Photo): string {
  if (/senua|hellblade/i.test(p.category)) return "5 Pro";
  return "5";
}

// Returns the active masonry column count for the current viewport. Mirrors
// the Tailwind responsive breakpoints used elsewhere on the page.
function useColumnCount(): number {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return count;
}

// True Pinterest-style masonry that supports column spans. Wide photos
// (w/h > 1.7) occupy 2 adjacent columns; portraits occupy 1. Each photo lands
// at the position with the lowest current top among the column window it needs.
type MasonryItem = { photo: Photo; top: number; left: number; width: number; height: number };
type MasonryLayout = { items: MasonryItem[]; totalHeight: number };

function MasonryGrid({
  photos,
  columnCount,
  isTouchDevice,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
  startDelayOffset = 0,
  pinTopIds,
}: {
  photos: Photo[];
  columnCount: number;
  isTouchDevice: boolean;
  onSelect: (p: Photo) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
  startDelayOffset?: number;
  pinTopIds?: number[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const GAP = 6;

  // Measure synchronously after first commit so the initial render has a real
  // width (height: 0 collapses the container, so we read width via getBCR rather
  // than relying on ResizeObserver to fire on the collapsed element).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setContainerWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const layout = useMemo<MasonryLayout>(() => {
    if (!containerWidth || columnCount < 1) return { items: [], totalHeight: 0 };
    const colW = (containerWidth - GAP * (columnCount - 1)) / columnCount;
    const heights = new Array<number>(columnCount).fill(0);
    const items: MasonryItem[] = [];

    // Track the span (1 or 2) of the most recent item placed in each column so
    // we can discourage stacking two landscape (span-2) items directly on top
    // of one another — a portrait between them reads as more varied rhythm.
    const lastSpanByCol = new Array<number>(columnCount).fill(0);

    // Helper: place a single photo at the best position. Score is lexicographic
    // [stackPenalty, postMax, -postMin]: avoid landscape-on-landscape if any
    // alternative exists, then minimize max column height, then maximize min.
    const placePhoto = (p: Photo) => {
      const wideEligible = p.w / p.h > 1.7 && columnCount >= 2;
      const span = wideEligible ? 2 : 1;
      const width = colW * span + GAP * (span - 1);
      const height = width * (p.h / p.w);
      let bestStart = 0;
      let bestTop = 0;
      let bestStack = Infinity;
      let bestMax = Infinity;
      let bestMin = -Infinity;
      for (let i = 0; i <= columnCount - span; i++) {
        let top = 0;
        for (let j = i; j < i + span; j++) if (heights[j] > top) top = heights[j];
        const newTop = top + height + GAP;
        let postMax = 0;
        let postMin = Infinity;
        for (let k = 0; k < columnCount; k++) {
          const v = k >= i && k < i + span ? newTop : heights[k];
          if (v > postMax) postMax = v;
          if (v < postMin) postMin = v;
        }
        // Anti-stack: penalize landscape directly on top of another landscape.
        let stack = 0;
        if (span === 2) {
          for (let j = i; j < i + span; j++) {
            if (lastSpanByCol[j] === 2) { stack = 1; break; }
          }
        }
        const better =
          stack < bestStack - 0.001 ||
          (Math.abs(stack - bestStack) < 0.001 && postMax < bestMax - 0.001) ||
          (Math.abs(stack - bestStack) < 0.001 && Math.abs(postMax - bestMax) < 0.001 && postMin > bestMin + 0.001);
        if (better) {
          bestStack = stack;
          bestMax = postMax;
          bestMin = postMin;
          bestStart = i;
          bestTop = top;
        }
      }
      const left = bestStart * (colW + GAP);
      items.push({ photo: p, top: bestTop, left, width, height });
      for (let j = bestStart; j < bestStart + span; j++) {
        heights[j] = bestTop + height + GAP;
        lastSpanByCol[j] = span;
      }
    };

    // Phase 1: place pinned photos in pinned order so they land in the top row.
    const pinnedIds = pinTopIds ?? [];
    const pinnedSet = new Set(pinnedIds);
    for (const id of pinnedIds) {
      const p = photos.find(ph => ph.id === id);
      if (p) placePhoto(p);
    }

    // Phase 2: reorder remaining photos for tight packing — at each step pick
    // the (photo, position) that minimizes the resulting max column height,
    // tiebreak by maximizing the resulting min. Landscape photos (w/h > 1.7)
    // span 2 columns so they read prominently; portraits stay in 1 column.
    const remaining = photos.filter(p => !pinnedSet.has(p.id));
    while (remaining.length) {
      let bestQI = 0;
      let bestStart = 0;
      let bestTop = 0;
      let bestSpan = 1;
      let bestStack = Infinity;
      let bestMax = Infinity;
      let bestMin = -Infinity;
      for (let qi = 0; qi < remaining.length; qi++) {
        const p = remaining[qi];
        const wideEligible = p.w / p.h > 1.7 && columnCount >= 2;
        const span = wideEligible ? 2 : 1;
        const width = colW * span + GAP * (span - 1);
        const height = width * (p.h / p.w);
        for (let i = 0; i <= columnCount - span; i++) {
          let top = 0;
          for (let j = i; j < i + span; j++) if (heights[j] > top) top = heights[j];
          const newTop = top + height + GAP;
          let postMax = 0;
          let postMin = Infinity;
          for (let k = 0; k < columnCount; k++) {
            const v = k >= i && k < i + span ? newTop : heights[k];
            if (v > postMax) postMax = v;
            if (v < postMin) postMin = v;
          }
          let stack = 0;
          if (span === 2) {
            for (let j = i; j < i + span; j++) {
              if (lastSpanByCol[j] === 2) { stack = 1; break; }
            }
          }
          const better =
            stack < bestStack - 0.001 ||
            (Math.abs(stack - bestStack) < 0.001 && postMax < bestMax - 0.001) ||
            (Math.abs(stack - bestStack) < 0.001 && Math.abs(postMax - bestMax) < 0.001 && postMin > bestMin + 0.001);
          if (better) {
            bestStack = stack;
            bestMax = postMax;
            bestMin = postMin;
            bestQI = qi;
            bestStart = i;
            bestTop = top;
            bestSpan = span;
          }
        }
      }
      const p = remaining[bestQI];
      const width = colW * bestSpan + GAP * (bestSpan - 1);
      const height = width * (p.h / p.w);
      const left = bestStart * (colW + GAP);
      items.push({ photo: p, top: bestTop, left, width, height });
      for (let j = bestStart; j < bestStart + bestSpan; j++) {
        heights[j] = bestTop + height + GAP;
        lastSpanByCol[j] = bestSpan;
      }
      remaining.splice(bestQI, 1);
    }

    const totalHeight = Math.max(0, ...heights) - (heights.some(h => h > 0) ? GAP : 0);
    return { items, totalHeight };
  }, [containerWidth, columnCount, photos, pinTopIds]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: layout.totalHeight }}
    >
      {layout.items.map((item, i) => (
        <div
          key={`m-${item.photo.id}`}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            width: item.width,
            height: item.height,
          }}
        >
          <GalleryCard
            photo={item.photo}
            delay={Math.min((startDelayOffset + i) * 0.025, 0.7)}
            isTouchDevice={isTouchDevice}
            onSelect={onSelect}
            onCursorEnter={onCursorEnter}
            onMouseMove={onMouseMove}
            onCursorLeave={onCursorLeave}
            skipEntry
            noMargin
          />
        </div>
      ))}
    </div>
  );
}

function GameCard({
  group,
  cover,
  delay,
  isTouchDevice,
  onOpen,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  group: { category: string; studio: string; photos: Photo[]; coverObjectPosition?: string };
  cover: Photo;
  delay: number;
  isTouchDevice: boolean;
  onOpen: () => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`text-left ${isTouchDevice ? "" : "cursor-none"}`}
      style={{ background: "transparent", padding: 0, border: "none" }}
    >
      {/* Cover — image only by default; editorial overlay appears on hover */}
      <div
        style={{
          aspectRatio: "4 / 3",
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.src}
          alt={group.category}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
            objectPosition: group.coverObjectPosition ?? "50% 50%",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.7s ease",
            // @ts-expect-error vendor-prefixed property not in CSS types
            WebkitUserDrag: "none",
          }}
        />

        {/* Black tint — fades from opaque at the bottom to transparent at the top */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0) 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Editorial overlay — anchored to the bottom, hover only */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 pb-8 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p
            className="font-black tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", color: "#f5f5f7" }}
          >
            {group.category}
          </p>
          <p className="text-sm mt-3" style={{ color: "rgba(245,245,247,0.7)" }}>
            {group.studio}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function GalleryCard({
  photo,
  delay,
  isTouchDevice,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
  aspect,
  noMargin,
  skipEntry,
}: {
  photo: Photo;
  delay: number;
  isTouchDevice: boolean;
  onSelect: (p: Photo) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
  aspect?: string;     // override card aspect ratio (e.g. "3 / 4" for featured row)
  noMargin?: boolean;  // skip masonry marginBottom when used in a grid
  skipEntry?: boolean; // skip entry fade/slide animation (used inside game detail page)
}) {
  const [hovered, setHovered] = useState(false);
  const cardAspect = aspect ?? `${photo.w} / ${photo.h}`;

  return (
    <motion.div
      className={`break-inside-avoid ${isTouchDevice ? "" : "cursor-none"}`}
      style={{ marginBottom: noMargin ? 0 : "6px" }}
      initial={skipEntry ? false : { opacity: 0, y: 16 }}
      animate={skipEntry ? undefined : { opacity: 1, y: 0 }}
      transition={skipEntry ? undefined : {
        delay,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => { if (!isTouchDevice) onSelect(photo); }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        style={{
          aspectRatio: cardAspect,
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
            // @ts-expect-error vendor-prefixed property not in CSS types
            WebkitUserDrag: "none",
          }}
        />

        {/* Noise texture on empty placeholder */}
        {!photo.src && (
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
          />
        )}

        {/* Glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 48px rgba(255,255,255,0.07)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "65%",
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Title + category */}
        <div
          className="absolute inset-x-0 bottom-0 p-5 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#f5f5f7" }}>
            {photo.title}
          </p>
          <p className="text-xs" style={{ color: "#a1a1a6" }}>
            {photo.category}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photography");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imgRect, setImgRect] = useState<{ w: number; h: number } | null>(null);
  const lightboxCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const blackoutTimerRef = useRef<number | null>(null);
  const blackoutOverlayRef = useRef<HTMLDivElement>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const LENS_SIZE = 300;
  const LENS_ZOOM = 2.5;

  // Two-tier photography: null = game-cards grid; string = that game's photos
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const columnCount = useColumnCount();

  function switchTab(tab: Tab) {
    if (tab === activeTab || isTransitioning) return;
    setIsTransitioning(true);
    setActiveTab(tab);
    setTimeout(() => setIsTransitioning(false), 800);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!selected) {
      setImgRect(null);
      loadedImgRef.current = null;
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const handler = () => {
      const c = lightboxCanvasRef.current;
      if (c && c.offsetWidth > 0) {
        setImgRect({ w: c.offsetWidth, h: c.offsetHeight });
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [selected]);

  const drawCanvas = useCallback((withWatermark: boolean) => {
    const canvas = lightboxCanvasRef.current;
    const img = loadedImgRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    if (withWatermark) {
      const w = canvas.width;
      const h = canvas.height;
      const baseSize = Math.min(w, h);
      const fontSize = Math.max(40, baseSize / 18);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, fontSize / 16);
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "rgba(245,245,247,0.65)";
      const text = "© Chirayu Arya · chirayuarya.com";
      const stepX = fontSize * 14;
      const stepY = fontSize * 7;
      const diag = Math.ceil(Math.sqrt(w * w + h * h)) + stepX;
      for (let y = -diag; y < diag; y += stepY) {
        for (let x = -diag; x < diag; x += stepX) {
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      loadedImgRef.current = img;
      requestAnimationFrame(() => {
        if (cancelled) return;
        drawCanvas(false);
        const c = lightboxCanvasRef.current;
        if (c && c.offsetWidth > 0) {
          setImgRect({ w: c.offsetWidth, h: c.offsetHeight });
        }
      });
    };
    img.src = selected.src;
    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [selected, drawCanvas]);

  const handleCanvasContextMenu = useCallback(() => {
    drawCanvas(true);
  }, [drawCanvas]);

  const handleCanvasMouseLeave = useCallback(() => {
    drawCanvas(false);
    setLensPos(null);
  }, [drawCanvas]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouchDevice) return;
    const mainCanvas = e.currentTarget;
    const rect = mainCanvas.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    setLensPos({ x: cursorX, y: cursorY });

    const lensCanvas = lensCanvasRef.current;
    if (!lensCanvas) return;
    const lensCtx = lensCanvas.getContext("2d");
    if (!lensCtx) return;
    const dpr = window.devicePixelRatio || 1;
    const internalSize = LENS_SIZE * dpr;
    if (lensCanvas.width !== internalSize || lensCanvas.height !== internalSize) {
      lensCanvas.width = internalSize;
      lensCanvas.height = internalSize;
    }
    // No transform — draw at full internal pixel size for true 1:1 device-pixel mapping
    lensCtx.clearRect(0, 0, internalSize, internalSize);

    // Sharpness and zoom decoupled:
    //   • Lens canvas internal size = LENS_SIZE × dpr   (sharpness — Retina-aware)
    //   • Source crop in CSS pixels = LENS_SIZE / LENS_ZOOM   (zoom — consistent across displays)
    // The main canvas is sized to the image's natural dimensions, so its internal pixels
    // ARE natural pixels. Convert the CSS-pixel source crop to natural pixels via naturalScale,
    // then paint that crop into the full device-pixel lens internal size.
    const naturalScale = mainCanvas.width / mainCanvas.offsetWidth;
    const sourceSizeNatural = (LENS_SIZE / LENS_ZOOM) * naturalScale;
    const sx = Math.round(cursorX * naturalScale - sourceSizeNatural / 2);
    const sy = Math.round(cursorY * naturalScale - sourceSizeNatural / 2);
    lensCtx.drawImage(mainCanvas, sx, sy, sourceSizeNatural, sourceSizeNatural, 0, 0, internalSize, internalSize);
  }, [isTouchDevice]);

  const startHideTimer = useCallback(() => {
    if (blackoutTimerRef.current !== null) {
      window.clearTimeout(blackoutTimerRef.current);
    }
    blackoutTimerRef.current = window.setTimeout(() => {
      const node = blackoutOverlayRef.current;
      if (node) node.style.display = "none";
      blackoutTimerRef.current = null;
    }, 2000);
  }, []);

  const triggerBlackout = useCallback(() => {
    const el = blackoutOverlayRef.current;
    if (el) el.style.display = "flex";
    startHideTimer();
  }, [startHideTimer]);

  useEffect(() => {
    const isBlackoutShowing = () => {
      const el = blackoutOverlayRef.current;
      return el !== null && el.style.display !== "none";
    };

    const SCREENSHOT_CODES = new Set(["Digit3", "Digit4", "Digit5", "KeyS", "KeyP"]);

    const cancelBlackout = () => {
      const el = blackoutOverlayRef.current;
      if (el && el.style.display !== "none") {
        el.style.display = "none";
      }
      if (blackoutTimerRef.current !== null) {
        window.clearTimeout(blackoutTimerRef.current);
        blackoutTimerRef.current = null;
      }
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "Meta" || e.key === "Control" || e.key === "Alt") {
        triggerBlackout();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        if (SCREENSHOT_CODES.has(e.code)) {
          triggerBlackout();
        } else {
          cancelBlackout();
        }
      }
    };
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        triggerBlackout();
      }
    };
    const freezeBlackout = () => {
      const el = blackoutOverlayRef.current;
      if (el) el.style.display = "flex";
      if (blackoutTimerRef.current !== null) {
        window.clearTimeout(blackoutTimerRef.current);
        blackoutTimerRef.current = null;
      }
    };
    const onMouseLeave = (e: MouseEvent) => {
      if (e.relatedTarget !== null) return;
      const clientY = e.clientY;
      const clientX = e.clientX;
      const downward = clientY >= window.innerHeight - 1;
      const sideways = clientX <= 0 || clientX >= window.innerWidth - 1;
      if (downward || sideways) freezeBlackout();
    };
    const onMouseEnter = () => {
      if (
        isBlackoutShowing() &&
        blackoutTimerRef.current === null &&
        document.hasFocus()
      ) {
        startHideTimer();
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelBlackout();
      }
    };
    const onFocus = () => {
      if (isBlackoutShowing() && blackoutTimerRef.current === null) {
        startHideTimer();
      }
    };

    window.addEventListener("keydown", onKeydown, { capture: true });
    document.addEventListener("keydown", onKeydown, { capture: true });
    window.addEventListener("keyup", onKeyup, { capture: true });
    document.addEventListener("keyup", onKeyup, { capture: true });
    window.addEventListener("focus", onFocus);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseout", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);

    let lastHasFocus = typeof document !== "undefined" ? document.hasFocus() : true;
    let pollRaf = 0;
    const poll = () => {
      const now = document.hasFocus();
      if (now !== lastHasFocus) {
        lastHasFocus = now;
        if (!now && !document.hidden) {
          freezeBlackout();
        } else if (now && isBlackoutShowing() && blackoutTimerRef.current === null) {
          startHideTimer();
        }
      }
      pollRaf = requestAnimationFrame(poll);
    };
    pollRaf = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener("keydown", onKeydown, { capture: true } as EventListenerOptions);
      document.removeEventListener("keydown", onKeydown, { capture: true } as EventListenerOptions);
      window.removeEventListener("keyup", onKeyup, { capture: true } as EventListenerOptions);
      document.removeEventListener("keyup", onKeyup, { capture: true } as EventListenerOptions);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseout", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(pollRaf);
    };
  }, [triggerBlackout, startHideTimer]);

  useEffect(() => () => {
    if (blackoutTimerRef.current !== null) {
      window.clearTimeout(blackoutTimerRef.current);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, [isTouchDevice]);

  return (
    <main
      className="gallery-protected gallery-no-print"
      style={{ background: "#ededf0", minHeight: "100vh", color: "#1d1d1f", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        .gallery-protected,
        .gallery-protected * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .gallery-protected img,
        .gallery-protected canvas {
          -webkit-user-drag: none;
          user-drag: none;
        }
        @media print {
          .gallery-no-print { visibility: hidden !important; }
        }
      `}</style>

      <div
        ref={blackoutOverlayRef}
        className="fixed inset-0 items-center justify-center"
        style={{ background: "#000", zIndex: 99999, display: "none" }}
        aria-hidden
      >
        <p style={{ color: "#86868b", fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 }}>
          Screenshot protection active
        </p>
      </div>

      <div className="relative">
        <Nav />

        {/* Custom "View" cursor pill */}
        {!isTouchDevice && (
          <div
            className="fixed pointer-events-none z-[60]"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(-50%, -50%)",
              opacity: cursorVisible ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            <div
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ background: "#1d1d1f", color: "#fff" }}
            >
              View
            </div>
          </div>
        )}

        {/* Page header + tab toggle — animates out smoothly when entering a game (tier 2) */}
        <AnimatePresence initial={false}>
        {activeGame === null && (
          <motion.div
            key="gallery-header"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: "hidden" }}
          >
        <section className="pt-24 pb-8 px-8 sm:px-14 lg:px-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Gallery
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#2a2a2d" }}
            >
              Take a deep dive.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "18rem", textAlign: "right" }}
            >
              A scrapbook for the chronically curious.
            </motion.p>
          </div>
        </section>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex justify-center pb-10"
        >
          <div
            className="flex items-center p-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.09)",
            }}
          >
            {(["photography", "illustrations"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: activeTab === tab ? "#f5f5f0" : "rgba(0,0,0,0.4)" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%), rgba(12,12,14,0.55)",
                      backdropFilter: "blur(30px) saturate(2.2) brightness(1.08)",
                      WebkitBackdropFilter: "blur(30px) saturate(2.2) brightness(1.08)",
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Two-tier photography: game cards → game detail. Illustrations stays as a single masonry. */}
        <section className="px-8 sm:px-14 lg:px-20 pb-16">
          <AnimatePresence mode="wait">
            {activeTab === "illustrations" ? (
              <motion.div
                key="illustrations-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
                style={{ columnGap: "6px", pointerEvents: isTransitioning ? "none" : undefined }}
              >
                {ILLUSTRATIONS.map((photo, i) => (
                  <GalleryCard
                    key={`illus-${photo.id}`}
                    photo={photo}
                    delay={Math.min(i * 0.025, 0.7)}
                    isTouchDevice={isTouchDevice}
                    onSelect={setSelected}
                    onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                    onMouseMove={handleMouseMove}
                    onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
                  />
                ))}
              </motion.div>
            ) : activeGame === null ? (
              // Tier 1 — game cards grid
              <motion.div
                key="game-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {PHOTOGRAPHY_GROUPS.map((group, gi) => {
                  return (
                    <GameCard
                      key={group.category}
                      group={group}
                      cover={group.cover}
                      delay={gi * 0.06}
                      isTouchDevice={isTouchDevice}
                      onOpen={() => setActiveGame(group.category)}
                      onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                      onMouseMove={handleMouseMove}
                      onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
                    />
                  );
                })}
              </motion.div>
            ) : (() => {
              // Tier 2 — single game detail
              const group = PHOTOGRAPHY_GROUPS.find(g => g.category === activeGame);
              if (!group) return null;
              return (
                <motion.div
                  key={`game-${activeGame}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="pt-36"
                  style={{ pointerEvents: isTransitioning ? "none" : undefined }}
                >
                  {/* Heading row: back arrow at left, centered game title; byline centered below */}
                  <div className="mb-20">
                    <div className="relative">
                      <button
                        onClick={() => setActiveGame(null)}
                        aria-label="Back to all projects"
                        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer leading-none transition-colors"
                        style={{ color: "#86868b", fontSize: "clamp(1.75rem, 2.4vw, 2.5rem)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1d1d1f")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#86868b")}
                      >
                        ←
                      </button>
                      <h2
                        className="text-center font-black tracking-tight leading-[0.92] px-16 lg:whitespace-nowrap"
                        style={{ fontSize: "clamp(2rem, 4vw, 4rem)", color: "#1d1d1f" }}
                      >
                        {group.category}
                      </h2>
                    </div>
                    <p className="text-center text-lg sm:text-xl mt-6" style={{ color: "#a1a1a6" }}>
                      {group.studio} · {group.photos.length} {group.photos.length === 1 ? "shot" : "shots"}
                    </p>
                  </div>
                  <MasonryGrid
                    photos={group.photos}
                    columnCount={columnCount}
                    isTouchDevice={isTouchDevice}
                    onSelect={setSelected}
                    onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                    onMouseMove={handleMouseMove}
                    onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
                    pinTopIds={group.pinTopIds}
                  />
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selected && (
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
              onClick={() => setSelected(null)}
            >
              {(() => {
                const isPortrait = selected.h > selected.w;
                const INFO_W = 320;
                const outerWidth = imgRect
                  ? isPortrait
                    ? `${imgRect.w + INFO_W}px`
                    : `${imgRect.w}px`
                  : "fit-content";
                const canvasMaxWidth = isPortrait
                  ? `calc(100vw - 64px - ${INFO_W}px)`
                  : "calc(100vw - 64px)";
                const canvasMaxHeight = isPortrait
                  ? "calc(100vh - 64px)"
                  : "calc(100vh - 64px - 160px)";
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 16 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className={`relative rounded-3xl overflow-hidden ${isPortrait ? "flex flex-row items-stretch" : "flex flex-col"}`}
                    style={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.08)",
                      width: outerWidth,
                      maxWidth: "calc(100vw - 64px)",
                      minWidth: imgRect ? undefined : "min(320px, calc(100vw - 64px))",
                      maxHeight: "calc(100vh - 64px)",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelected(null)}
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

                    <div className="relative shrink-0" style={{ background: "#0a0a0a" }}>
                      <canvas
                        ref={lightboxCanvasRef}
                        onContextMenu={handleCanvasContextMenu}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseLeave={handleCanvasMouseLeave}
                        aria-label={selected.title}
                        role="img"
                        style={{
                          display: "block",
                          maxWidth: canvasMaxWidth,
                          maxHeight: canvasMaxHeight,
                          width: "auto",
                          height: "auto",
                          cursor: lensPos && !isTouchDevice ? "none" : "default",
                        }}
                      />
                      {/* Magnifier lens — follows cursor over the lightbox image */}
                      <canvas
                        ref={lensCanvasRef}
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: (lensPos?.x ?? 0) - LENS_SIZE / 2,
                          top: (lensPos?.y ?? 0) - LENS_SIZE / 2,
                          width: LENS_SIZE,
                          height: LENS_SIZE,
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.7)",
                          pointerEvents: "none",
                          opacity: lensPos && !isTouchDevice ? 1 : 0,
                          transition: "opacity 0.12s ease",
                        }}
                      />
                    </div>

                    <div
                      className={`p-6 shrink-0 ${isPortrait ? "flex flex-col overflow-y-auto" : ""}`}
                      style={isPortrait ? { width: INFO_W } : undefined}
                    >
                      <h2 className="text-lg font-semibold mb-1" style={{ color: "#f5f5f7" }}>
                        {selected.title}
                      </h2>
                      <p className="text-sm mb-4" style={{ color: "#86868b" }}>{selected.category}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#a1a1a6" }}>
                        {descFor(selected)}
                      </p>
                      {selected.tab === "photography" && (
                        <p
                          className={`text-xs ${isPortrait ? "mt-auto pt-6" : "mt-3"}`}
                          style={{ color: "#86868b" }}
                        >
                          Shot on PlayStation<sup style={{ fontSize: "0.6em", verticalAlign: "super" }}>®</sup> {platformFor(selected)}.
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <Contact />
      </div>
    </main>
  );
}
