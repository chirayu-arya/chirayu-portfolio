"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// URL slug helpers — convert a game category to its /gallery/[slug] path part
// and back. Slugs are kebab-case, ascii-only, with common prefixes stripped
// ("Clair Obscur:", "Marvel's") so the URL stays short and clean.
function slugFor(category: string): string {
  return category
    .toLowerCase()
    .replace(/^clair obscur:\s*/, "")
    .replace(/^marvel's\s*/, "")
    .replace(/[:'']/g, "")
    .replace(/ō/g, "o")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

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
  { id: 71, tab: "photography", w: 1656, h: 2943, title: "Highland Vigil",           category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9640.JPG` },
  { id: 13, tab: "photography", w: 1682, h: 2243, title: "Plumed Sentinel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8564.JPG` },
  { id: 86, tab: "photography", w: 2039, h: 2719, title: "Tallneck at Dusk",         category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9730.JPG` },
  { id: 82, tab: "photography", w: 2157, h: 2876, title: "The Painted Hunter",       category: "Horizon Forbidden West",       description: VIRTUAL_DESC, src: `${VP}/Horizon%20Forbidden%20West/IMG_9716.jpg` },
  { id: 58, tab: "photography", w: 3840, h: 2160, title: "Runebearer",               category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9556%202.JPG` },
  { id: 1,  tab: "photography", w: 3840, h: 2160, title: "Together at 33",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg` },
  { id: 2,  tab: "photography", w: 3840, h: 2160, title: "Lumière Glance",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7685.jpg` },
  { id: 3,  tab: "photography", w: 3814, h: 2145, title: "Stillness Beneath the Falls", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8199.JPG` },
  { id: 72, tab: "photography", w: 2157, h: 2876, title: "Inside the Ribcage",       category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9643.JPG` },
  { id: 87, tab: "photography", w: 3840, h: 2160, title: "Aurora Over the Glow",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9736.JPG` },
  { id: 4,  tab: "photography", w: 3840, h: 2160, title: "Through the Veil",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7858.jpg` },
  { id: 49, tab: "photography", w: 3840, h: 2160, title: "Crimson Path",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8978.JPG` },
  { id: 6,  tab: "photography", w: 2157, h: 2876, title: "The First Spark",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8255.jpg` },
  { id: 7,  tab: "photography", w: 3840, h: 2160, title: "Symbiote Showdown",        category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7733.JPG` },
  { id: 73, tab: "photography", w: 1916, h: 2554, title: "The Lorekeeper Kneels",    category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9647.JPG` },
  { id: 20, tab: "photography", w: 2157, h: 2876, title: "Petals at Midnight",       category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8652.jpg` },
  { id: 10, tab: "photography", w: 2305, h: 1297, title: "Plains Lily",              category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8200.JPG` },
  { id: 11, tab: "photography", w: 1683, h: 2992, title: "Into the Light",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8392%202.JPG` },
  { id: 88, tab: "photography", w: 2157, h: 2876, title: "Salute to the Sky",        category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9737.JPG` },
  { id: 12, tab: "photography", w: 1844, h: 3278, title: "Ginkgo Storm",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8858.JPG` },
  { id: 74, tab: "photography", w: 2152, h: 2869, title: "Runes and Embers",         category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9648.JPG` },
  { id: 54, tab: "photography", w: 1814, h: 3225, title: "Blood Memory",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9531.JPG` },
  { id: 51, tab: "photography", w: 1952, h: 2602, title: "Lunar Pilgrim",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9510.jpg` },
  { id: 55, tab: "photography", w: 3840, h: 2160, title: "Echoes of 33",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9542.JPG` },
  { id: 15, tab: "photography", w: 1882, h: 2510, title: "Cloaked in Gold",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8582.JPG` },
  { id: 16, tab: "photography", w: 3610, h: 2031, title: "Defiant Stand",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8607.JPG` },
  { id: 89, tab: "photography", w: 3840, h: 2160, title: "Bones of the Thunderjaw",  category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9738.JPG` },
  { id: 17, tab: "photography", w: 2160, h: 3840, title: "Through the Ferns",        category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8867.JPG` },
  { id: 18, tab: "photography", w: 1971, h: 2628, title: "The Approach",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8643.jpg` },
  { id: 19, tab: "photography", w: 3840, h: 2160, title: "Venom Rising",             category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7735.JPG` },
  { id: 75, tab: "photography", w: 2157, h: 2876, title: "The Offering",             category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9650.JPG` },
  { id: 9,  tab: "photography", w: 2157, h: 3834, title: "After the Battle",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8381%203.JPG` },
  { id: 21, tab: "photography", w: 3840, h: 2160, title: "Roots of Pandora",         category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8204.JPG` },
  { id: 84, tab: "photography", w: 3840, h: 2160, title: "Embers Over the Arches",   category: "Horizon Zero Dawn Remastered",            description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9723.JPG` },
  { id: 83, tab: "photography", w: 3840, h: 2160, title: "Under Ancient Stars",      category: "Horizon Zero Dawn Remastered",            description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9722.JPG` },
  { id: 22, tab: "photography", w: 3840, h: 2160, title: "The Last Bloom",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8682.jpg` },
  { id: 23, tab: "photography", w: 2109, h: 2812, title: "Beneath the 33",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8690.JPG` },
  { id: 24, tab: "photography", w: 2160, h: 3840, title: "Bluebell Stand",           category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8869.JPG` },
  { id: 76, tab: "photography", w: 1605, h: 2852, title: "Half Made",                category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9651.JPG` },
  { id: 52, tab: "photography", w: 2017, h: 2689, title: "Sundered Sky",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9519.JPG` },
  { id: 90, tab: "photography", w: 3840, h: 2160, title: "Inside the Horus",         category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9739.JPG` },
  { id: 56, tab: "photography", w: 1890, h: 2835, title: "Renoir",     category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9543.jpg` },
  { id: 37, tab: "photography", w: 2160, h: 2700, title: "Cliffside Conversation",   category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9360.jpg` },
  { id: 26, tab: "photography", w: 3840, h: 2160, title: "Skyline Patrol",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7739.JPG` },
  { id: 27, tab: "photography", w: 1978, h: 3517, title: "Strings by Firelight",     category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8812.JPG` },
  { id: 28, tab: "photography", w: 1506, h: 2008, title: "Lantern Watch",            category: "Ghost of Tsushima",            description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG` },
  { id: 77, tab: "photography", w: 1856, h: 2475, title: "Garm in the Rain",         category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9655.JPG` },
  { id: 29, tab: "photography", w: 1954, h: 2606, title: "The Cradle",               category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9171.jpg` },
  { id: 30, tab: "photography", w: 1991, h: 2655, title: "Three of Us",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9172.jpg` },
  { id: 31, tab: "photography", w: 3840, h: 2160, title: "Sun Through the Canopy",   category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8205.JPG` },
  { id: 32, tab: "photography", w: 3840, h: 2160, title: "The Officer",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9332.JPG` },
  { id: 33, tab: "photography", w: 1601, h: 2135, title: "Camp at Dusk",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8871.JPG` },
  { id: 78, tab: "photography", w: 2157, h: 2876, title: "Trophy of the Slain",      category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9656.JPG` },
  { id: 91, tab: "photography", w: 1893, h: 2524, title: "Wading at Golden Hour",    category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9748.JPG` },
  { id: 34, tab: "photography", w: 1860, h: 2480, title: "Burning Forward",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9338.jpg` },
  { id: 35, tab: "photography", w: 3840, h: 2160, title: "Aerial Confrontation",     category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7743.JPG` },
  { id: 36, tab: "photography", w: 3840, h: 2160, title: "Patchwork Idol",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9343.JPG` },
  { id: 53, tab: "photography", w: 2087, h: 2783, title: "The Great Wheel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9522.jpg` },
  { id: 57, tab: "photography", w: 3840, h: 2160, title: "The Lampmaster",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9548.JPG` },
  { id: 25, tab: "photography", w: 1811, h: 2415, title: "Faceless Watcher",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8699.JPG` },
  { id: 38, tab: "photography", w: 3840, h: 2160, title: "A Quiet Moment",           category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8210.JPG` },
  { id: 92, tab: "photography", w: 1933, h: 2578, title: "Bow at Dawn",              category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9751.JPG` },
  { id: 79, tab: "photography", w: 3840, h: 2160, title: "The Hunter Lowers Its Head", category: "Hellblade: Senua's Sacrifice",             description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9657.JPG` },
  { id: 39, tab: "photography", w: 1971, h: 3504, title: "Ember Stare",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9436.JPG` },
  { id: 40, tab: "photography", w: 1601, h: 2135, title: "Resting Companions",       category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8901.JPG` },
  { id: 41, tab: "photography", w: 2160, h: 2880, title: "First Meeting",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9452.jpg` },
  { id: 42, tab: "photography", w: 3840, h: 2160, title: "Wings of Dread",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7745.JPG` },
  { id: 80, tab: "photography", w: 2157, h: 2876, title: "Gramr in Her Hand",        category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9661.JPG` },
  { id: 43, tab: "photography", w: 3840, h: 2160, title: "Behind the Mask",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9457.JPG` },
  { id: 44, tab: "photography", w: 2157, h: 2876, title: "Pilgrim Mound",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9492.jpg` },
  { id: 45, tab: "photography", w: 1914, h: 3402, title: "Maple Strike",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8948.JPG` },
  { id: 46, tab: "photography", w: 2157, h: 2876, title: "The Last Embrace",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9497.jpg` },
  { id: 47, tab: "photography", w: 3840, h: 2160, title: "The Final Grip",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7746.JPG` },
  { id: 93, tab: "photography", w: 1850, h: 2467, title: "Charger in Twilight",      category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9752.JPG` },
  { id: 48, tab: "photography", w: 1344, h: 756,  title: "Festival Day",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Post%203.png` },
  { id: 5,  tab: "photography", w: 3840, h: 2160, title: "The Wildflower Ride",      category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG` },
  // — New batch: 3 Expedition 33 + 9 Hellblade —
  { id: 59, tab: "photography", w: 2157, h: 3834, title: "Hour of the Sun",          category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9585.JPG` },
  { id: 60, tab: "photography", w: 2157, h: 3834, title: "Verso's Gaze",             category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9587.JPG` },
  { id: 61, tab: "photography", w: 2157, h: 3834, title: "Touching 33",              category: "Clair Obscur: Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9588.JPG` },
  { id: 64, tab: "photography", w: 2160, h: 2880, title: "Bridge of Trials",         category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9613.jpg` },
  { id: 69, tab: "photography", w: 2064, h: 3669, title: "Surt's Wrath",             category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9624.JPG` },
  { id: 65, tab: "photography", w: 2160, h: 3840, title: "Crown of Memory",          category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9617.JPG` },
  { id: 62, tab: "photography", w: 1495, h: 2492, title: "The Vessel",               category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9608.jpg` },
  { id: 68, tab: "photography", w: 2160, h: 3840, title: "Hearthfire",               category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9623.JPG` },
  { id: 70, tab: "photography", w: 1344, h: 2390, title: "Quiet Resolve",            category: "Hellblade: Senua's Sacrifice", description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9625.JPG` },
  { id: 85, tab: "photography", w: 2160, h: 2880, title: "Red Bloom Country",        category: "Horizon Zero Dawn Remastered",            description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9724.JPG` },
];

const ILLUSTRATIONS: Photo[] = [
  { id: 1, tab: "illustrations", w: 2732, h: 2048, title: "Aurora",             category: ILLUS_TOOL, description: "A woman's face peers through a tropical canopy, framed by deep blues and warm coral leaves.", src: `${ILL}/Aurora%20-%20Chirayu%20Arya.PNG` },
  { id: 2, tab: "illustrations", w: 2048, h: 2732, title: "Chromatic Enigma",   category: ILLUS_TOOL, description: "A surreal kiss between two figures in violet and crimson, faces fragmented into bold colour blocks.", src: `${ILL}/Chromatic%20Enigma.PNG` },
  { id: 9, tab: "illustrations", w: 2048, h: 2732, title: "Veiled Petals",      category: ILLUS_TOOL, description: "A blindfolded woman crowned in tangled flowers, lips parted toward the warm horizon.", src: `${ILL}/Veiled%20Petals.PNG` },
  { id: 7, tab: "illustrations", w: 2048, h: 2732, title: "Scarlet Pout",       category: ILLUS_TOOL, description: "A close-up portrait, red sunglasses askew over glossy crimson lips.", src: `${ILL}/Scarlet%20Pout.PNG` },
  { id: 5, tab: "illustrations", w: 2048, h: 2732, title: "Emerald Reflections",category: ILLUS_TOOL, description: "A weathered green statue rendered in painterly strokes against a soft brown gradient.", src: `${ILL}/Emerald%20Reflections.png` },
  { id: 6, tab: "illustrations", w: 2048, h: 2732, title: "Golden Reverie",     category: ILLUS_TOOL, description: "A face dripping with molten honey, lips parted in quiet awe.", src: `${ILL}/Golden%20Reverie.PNG` },
  { id: 4, tab: "illustrations", w: 2048, h: 2732, title: "Contour",            category: ILLUS_TOOL, description: "An upturned face caught mid-breath, eyes pooling with colour and light.", src: `${ILL}/Contour.PNG` },
  { id: 8, tab: "illustrations", w: 2048, h: 2732, title: "Sunlit Chapters",    category: ILLUS_TOOL, description: "A woman lounging poolside, half-asleep behind a pink magazine titled 'All About Miami'.", src: `${ILL}/Sunlit%20Chapters.PNG` },
  { id: 3, tab: "illustrations", w: 2048, h: 2732, title: "Citrus Muse",        category: ILLUS_TOOL, description: "A woman cradling a sliced orange, eyelids painted with the same glowing pulp.", src: `${ILL}/Citrus%20Muse.PNG` },
];

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Game metadata for photography grouping — ordered as they should appear in the gallery.
// `category` must match the exact string used in PHOTOGRAPHY entries.
// `coverId` optionally overrides the tier-1 cover photo (defaults to the first photo in source order).
// `coverObjectPosition` shifts the visible region inside the 4:3 cover frame (CSS `object-position`).
const GAMES: { category: string; studio: string; coverId?: number; coverObjectPosition?: string; pinTopIds?: number[] }[] = [
  { category: "Clair Obscur: Expedition 33", studio: "Sandfall Interactive / Kepler Interactive", coverId: 53, pinTopIds: [57, 6] }, // The Great Wheel; pin Lampmaster + The First Spark to top row
  { category: "Ghost of Yōtei", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverId: 45, coverObjectPosition: "50% 62%" }, // Maple Strike
  { category: "Hellblade: Senua's Sacrifice", studio: "Ninja Theory / Xbox Game Studios", coverId: 65, coverObjectPosition: "50% 55%" }, // Crown of Memory
  { category: "Avatar: Frontiers of Pandora", studio: "Massive Entertainment / Ubisoft" },
  { category: "Ghost of Tsushima", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverObjectPosition: "50% 80%" },
  { category: "Marvel's Spider-Man 2", studio: "Insomniac Games / Sony Interactive Entertainment" },
  { category: "Horizon Zero Dawn Remastered", studio: "Guerrilla Games / Sony Interactive Entertainment", coverId: 83, pinTopIds: [92, 86, 85, 93, 91, 88, 90, 89, 83, 84, 87] }, // Under Ancient Stars; pinned portrait order, then landscapes
  { category: "Horizon Forbidden West", studio: "Guerrilla Games / Sony Interactive Entertainment" },
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

// Per-photo description copy, keyed by photo id. Used by the lightbox when the
// photo's `description` field is still the default VIRTUAL_DESC placeholder.
// Override per-row by setting a custom string on the PHOTOGRAPHY entry instead.
const PHOTO_DESCRIPTIONS: Record<number, string> = {
  // Clair Obscur: Expedition 33
  50: "A towering crystalline guardian catches the last of the light, frozen mid-stride at the edge of a forgotten battlefield. Up close, its surface refracts whole pieces of the painted sky, fragments of a world that no longer matches itself. You can feel the threat in its stillness as much as in its scale.",
  13: "A feathered titan stands sentinel over the painted world, plumage drifting like ink through still water. Its silhouette barely separates from the dusk behind it, the kind of creature you only notice once it's already noticed you. The expedition slows without anyone saying why.",
  58: "A lone wanderer drifts across an unfinished landscape, runes of living light coiled around their arms. The horizon ahead is half-painted, half-blank canvas, as if the Paintress walked away mid-stroke. They move like they have an appointment with whatever comes next.",
  1:  "Gustave and Sophie hold the last weightless second before the expedition begins, foreheads almost touching. Behind them, Lumière is already counting down to the number that ends them all. They are pretending, just for the length of this frame, that the year isn't 33.",
  2:  "A glance back through the lantern-lit streets of Lumière, where every face already knows the year that's coming. The colors are warm but the city is not; it's the warmth of a held breath. You can almost hear the soft, patient ticking under the cobblestones.",
  4:  "A figure steps through the painted veil, the world thinning back into brushstrokes behind them. On the other side, the colors are bolder but less true, as if someone is still deciding what they should look like. The vellum at the edges curls, just slightly, with their passing.",
  6:  "The first ember of Pictos magic flickers to life in cupped hands, the dark of Lumière pressing in around it. The light catches the soft tremble of the fingers, the discipline it takes to hold something that wants to bloom. In a moment it will either steady or consume.",
  9:  "A survivor kneels in the aftermath, blade lowered, lungs catching up with what just happened. Smoke threads quietly through the broken pillars around them, taking its time. They are not crying yet; they have not yet allowed themselves to.",
  11: "A silhouette walks toward a door of pure light, leaving a trail of fading pigment behind them. The painted world thins with every step, brushstrokes peeling off like late autumn leaves. Whatever waits on the other side isn't bothering to introduce itself.",
  54: "A scarlet memory bleeds across the canvas, a figure caught mid-reach for something the painted world refuses to render. The red pools where it shouldn't, defying perspective, defying gravity. Some memories don't ask permission to come back.",
  51: "A wanderer walks toward a swollen moon over silver dunes, no horizon line and no shadow but their own. The whole composition feels paused, as if the brush lifted off the canvas mid-step. They keep walking anyway.",
  55: "The ruins of an earlier expedition still hum with their final breath, scattered relics half-claimed by the painted world. Cloth and metal and bone, settled into the configuration of someone's last decision. The wind has not yet figured out what to do with the silence.",
  15: "Gold-trimmed robes catch a column of late light, a figure poised between ceremony and combat. The drape of the cloth is too still, like it already knows what's about to happen. The shoulders beneath it have decided.",
  16: "Three expeditioners hold the line against a shapeless threat, weapons raised, ground stained beneath them. Whatever they're facing isn't shown; the photo trusts your imagination more than the threat probably deserves. Their posture is what carries the scene.",
  18: "A solitary figure approaches an impossible structure on the horizon, the true scale of the painted world finally visible. The building reads as a smudge of color until you understand the speck at its base. The expedition just got smaller.",
  20: "Petals drift in slow motion across a moonlit courtyard, a figure half-hidden among them. The composition is more about the in-between than the figure: the negative space of the night, the gentle interference of falling color. A duel is about to start, or a kiss, or both.",
  22: "A single bloom opens at the edge of a charred field, the painted world insisting on one more breath. The contrast between the ash and the petal is almost too on-the-nose, but the world refuses to apologize for it. Beauty here is always a thesis statement.",
  23: "The numeral 33 looms above a lone figure, stone-cut and final. There is no other detail in the frame, just the number, the figure, and a great deal of empty sky. You don't need the rest.",
  52: "A jagged seam splits the sky in two: painted clouds on one side, raw canvas on the other. The seam is fresh; you can see the brushwork hesitating along its edge. The world is mid-decision.",
  56: "A portrait of Renoir caught mid-thought, the painter's certainty already cracking at the edges. His hand is paused mid-gesture, an idea retreating instead of arriving. You can see what he doesn't want to admit yet.",
  37: "Two figures speak at the edge of a sheer drop, the conversation carried off by the wind before it lands. They sit at a careful distance: close enough for honesty, far enough for plausible deniability. The drop does most of the listening.",
  27: "A musician hunches over their instrument by a low campfire, every note bending toward the dark beyond the circle. The flames cast their face in two halves, neither one fully visible. The music is not for the others around the fire.",
  29: "A figure cradles what's left of a friend, the canvas around them slowly losing color. The painted world drains backward through the frame, like the canvas itself is mourning. There is no dramatic pose, no big swing of grief; just gravity.",
  30: "Three expeditioners share a fireside silence, knowing the next morning won't bring all of them back. The fire is small and honest; nobody is performing. They have not said it yet, but they all know which one.",
  32: "An officer turns, half-shadowed, the medals on his coat catching a sliver of cold light. The medals are clearly important to him; the man wearing them is no longer certain why. The turn is the moment of the photo, not the face.",
  34: "A figure runs straight through a curtain of fire, weapon drawn, refusing to slow. The flames don't part politely for them; they have to argue their way through. There is no plan past the other side of the heat.",
  36: "A massive idol stitched from mismatched cloth and bone looms over a clearing, its eyes painted with unusual care. Whoever made it loved it more than they should have. It loves them back, in its own way.",
  53: "The Great Wheel turns slowly above the city of Lumière, its spokes catching the last of the painted day. From below, you can hear the slow, deliberate creak of the mechanism, like the city's own pulse. It has always turned; it has always been counting.",
  57: "The Lampmaster lights a row of paper lanterns one by one, each flame revealing more of his quiet domain. He doesn't hurry, and he never skips one. The order of the lighting matters to him in a way nobody else has bothered to learn.",
  25: "A masked figure watches without eyes, the porcelain face giving nothing back. Their stillness is the kind that's been practiced. You are being measured by something you can't see measuring you.",
  39: "Embers from a banked fire catch a single, unblinking stare, the rest of the face lost to shadow. The eye does not soften when the light shifts. Whatever is being decided in this stare has already been decided.",
  41: "Two strangers meet on a painted road, neither yet certain whether to draw the blade or extend the hand. They take longer than they should to decide, and the longer they take, the more it matters. The choice is already part of the road behind them.",
  43: "A character lifts their mask just enough to reveal an expression they'd rather no one saw. The mask is the lie; the face under it is the cost. They put the mask back before the photo loads.",
  44: "A small mound of stones marks where a pilgrim stopped, prayer flags above it fraying in the painted wind. The flags are old, the colors fading, but the knots are still tight. Whoever stacked the stones meant it.",
  46: "Two figures hold each other in front of a vanishing horizon, the canvas itself letting them go. The colors thin around them, not violent, just patient. They are not asking for more time; they are using what's left.",
  48: "Lumière's festival fills the square with lantern light, ribbons and music covering for what everyone knows is coming. The crowd is doing a wonderful job of pretending. The musicians are too.",
  59: "Late sunlight pours across a painted hillside, turning every blade of grass into something almost holy. The composition is shamelessly beautiful, and the photo knows it. Some moments don't need to be subtle to be earned.",
  60: "Verso looks just off-camera, a half-smile that knows more than he's planning to say. The eyes hold a punchline that hasn't quite arrived. You start to suspect you're the joke.",
  61: "A hand presses against the carved numeral 33, half in reverence, half in defiance. The stone is cold; the gesture is not. Whatever the touch is asking of the number, the number is not answering.",

  // Avatar: Frontiers of Pandora
  3:  "The mist of a Pandoran waterfall settles into a perfect breath, the canopy holding still around it. The whole frame slows down to the rhythm of the falling water. Even the bioluminescence seems to hush.",
  10: "A single Pandoran lily glows blue against the grassland dusk, its petals lit from within. The night air picks up the light and carries it farther than it should. The plain feels enormous around something this small.",
  21: "The bioluminescent roots of a Hometree pulse with the quiet rhythm of a living planet. Each pulse runs just slightly out of sync with the next, like a network catching up with itself. You can almost feel it under your feet.",
  31: "Pandoran sunlight pierces the upper canopy in long, painterly shafts, the forest floor lit in jewel tones. Dust and pollen drift through the beams in slow currents. The forest is breathing in this much light, slow and deep.",
  38: "A Na'vi exhales beside a slow river, the forest already breathing with them. There is no event in the frame, which is the point. Peace is rare enough on Pandora to be a kind of photograph in itself.",

  // Ghost of Yōtei
  5:  "Atsu rides knee-deep through a sea of summer wildflowers, the wind carrying nothing but petals and hooves. The horse moves as if the field is parting for them out of courtesy. For a few seconds the war isn't here.",
  12: "Atsu cuts through a swirling vortex of golden ginkgo leaves mid-duel, autumn turned weather. The leaves move faster than wind alone could carry them. Something else is conducting the storm, and she is answering it with steel.",
  17: "Atsu pushes through waist-high ferns at dawn, dew darkening her hakama, the forest still asleep. Her steps are quiet but deliberate; she is choosing each one. The forest will know she was here only by the bent stems she leaves behind.",
  24: "Atsu pauses in a clearing of bluebells, the field swaying around her in a soundless wind. She is not enjoying the view so much as listening to it. The hand on the saya hasn't moved.",
  33: "Atsu's camp glows against a violet dusk, smoke from a small fire braided up toward the first stars. The horse drowses a few paces off. For one full hour she is just a person sitting near a fire.",
  40: "Atsu sits with her horse in the lee of a pine, both of them watching the same far valley. Neither moves; both are listening. The companionship is older than either of them admits.",
  45: "Atsu's blade cleaves through a downpour of maple leaves, the strike held a half-second longer than it needs to be. The leaves part around the arc of the sword instead of through it. It is the kind of strike you only land once.",
  49: "A path of red maple leaves runs straight up the mountainside, drawing Atsu toward whatever waits at the top. The trail is too tidy to be natural; someone, or something, laid the leaves. She follows anyway.",

  // Marvel's Spider-Man 2
  7:  "Spider-Man squares up against the symbiote across a rain-slick rooftop, both readings of the same body about to collide. The rain doesn't help anyone; it just makes the choice slipperier. The next move sets the tone of the rest of the city's night.",
  19: "The symbiote unspools upward in a tangle of teeth and tendrils, Manhattan lit blue behind it. The city below has no idea yet. The skyline keeps doing its little routine while something new finishes assembling itself above it.",
  26: "Spider-Man swings between the towers at golden hour, the city stretched out and small beneath him. The arc is loose and confident, the kind only practiced loneliness teaches. For a beat, nothing in the city is wrong.",
  35: "Spider-Man and a winged adversary trade hits midair, the skyline tilting around their fight. Neither is using a wall to stand on; the choreography is gravity's problem. Manhattan rotates politely behind them.",
  42: "A winged silhouette eclipses the sun above midtown, the city below stalling mid-step. The shadow moves faster than the body casting it, which is the wrong order of things. The pedestrians do not know yet, but the pigeons do.",
  47: "Spider-Man clings to a falling beam with one hand, the other already reaching for the next save. There is never just one thing falling at a time. The shot is held the half-second before the rescue lands.",

  // Ghost of Tsushima
  28: "Jin stands beneath a paper lantern at the edge of a stone bridge, the night holding its breath around him. The lantern light barely reaches him; he is mostly silhouette. The bridge is empty in both directions, which is its own kind of answer.",

  // Hellblade: Senua's Sacrifice
  64: "Senua crosses a narrow stone bridge with the voices walking step for step beside her. The bridge has no railing and the voices have no manners. She does not look down, and she does not look back.",
  69: "Surt's volcanic blade splits the night with a wall of flame, Senua small and unmoving in its glow. The heat distorts the air between them, making the giant tremble at his own edges. She is the one who picked this fight, and she remembers it.",
  65: "A crown of antlers and bone rests on a cairn, the memory it holds heavier than the metal. Someone she loved wore this. The crown is small, but the photo makes you understand the weight.",
  62: "Senua stands before the carved vessel, runes glowing along its rim, the offering already half made. Her face says she does not entirely believe in what she's about to do. Her hands say she's going to do it anyway.",
  68: "Firelight finds Senua's face in a moment of rare quiet, the warmth older than any of the gods she's chasing. For a moment there are no voices, no goals, no journey. Just the fire and a woman remembering she has a face.",
  70: "Senua tightens her grip on her blade and starts walking again; resolve is the only thing she has left. The light behind her does not promise anything. She doesn't ask it to.",
  71: "Senua walks the high pass with a talisman at her hip, the mountains stretching out behind her in unbroken white. The blood on her armor has dried into the rune work; she has been moving for days. The cold is the only voice not arguing with her right now.",
  72: "Senua stands inside the curving wooden hull of a beached longship, looking up through the broken ribs at a thin slice of sky. The boards groan under her, holding less than they were built to hold. She closes her eyes and listens for the next instruction.",
  73: "A faceless stone lorekeeper kneels in a shaft of pale light, cradling a small skull in both hands. Glowing runes trace the seams of its body like memory leaking back to the surface. The story it carries is older than the language she will need to hear it in.",
  74: "The stone effigy turns half-profile, the hollow of its skull catching what little light there is. Embers smolder along the cracks in its limbs, and the runes etched into its arms still bleed soft orange. It is half made of words and half made of fire.",
  75: "The faceless guardian lifts a small bundle wrapped in pale cloth, its glowing seams pulsing in time with whatever it is about to give away. Senua's lessons are never told to her directly; they are placed in her hands and walked away from. She steps closer.",
  76: "A face that is half flesh and half stone stares straight back, the seam between the two materials uneven and recent. Tar-dark streaks run from the human eye, slow and patient. It is unclear which half is winning, or whether anyone is keeping score.",
  77: "Senua plants her stance against the storm, her sword raised and lit, a massive horned beast emerging from the downpour behind it. The rain falls in straight lines, indifferent to either of them. The fight begins the moment she lets out the breath she's been holding.",
  78: "Senua kneels over the proof of her last kill, holding a stone skull aloft with a snarl that is both grief and defiance. The fur at her shoulders is matted with rain and ash. The voices in her head are quiet for once; they're letting her have this.",
  79: "The horned beast lowers its monstrous head into the rain, antlers and fangs picking up the cold light around it. Every muscle is held in the kind of stillness that ends in motion. The bones scattered on the ground are evidence of how many tried to outwait it.",
  80: "Senua holds Gramr aloft, the sword burning cold blue against the warm gold of the cave fire behind her. Sparks and snow fall in the same frame, the impossible weather of a place that exists mostly in her head. For the first time in a long time her face is steady.",

  // Horizon Forbidden West
  82: "Aloy draws the bow with the arrow's fletching pressed against her teeth, war paint stark across her face. The world outside the frame falls away, and so does any doubt about what comes next. The shot will land before she lets the breath go.",

  // Horizon Zero Dawn
  83: "Aloy slows her Charger under a swirl of Milky Way, the desert glow and her bone-and-wire saddle the only warmth for miles. The old machines below the ground are quiet for once. She tips her head back the way people used to, back when looking up was still a kind of answer.",
  84: "Aloy turns her mount toward the arches at golden hour, embers drifting past in the warm air. The cybernetic charger beneath her hums like an animal that hasn't decided which side it's on yet. She is in no hurry; the land out here remembers everything.",
  85: "Aloy looks out across a mesa carpeted in red bloom, the far cliffs catching late light. Her mount holds still beside her, the kind of stillness that lets the wind do the talking. The view is hers because nothing else out here can read it.",
  86: "A Tallneck stands sentinel above the pine line, its great dish still slowly turning against the misty hills. From the base of the cliff you can hear the soft whirr of its joints, older than anyone living. Climbing one always feels less like a hunt and more like asking permission.",
  87: "An aurora unfurls over a snowbound clearing, the glow stones at the heart of the grove answering it in turquoise. The branches catch the colour like they've been waiting for it all winter. Standing there, you forget that the lights are made of the same long-dead machines you've been pulling apart all day.",
  88: "Aloy raises her bow toward the aurora as if to thank it, the green sky pulling every bit of colour out of the night. The wind has dropped; the lights move for her alone. It is the closest thing to prayer she allows herself.",
  89: "Aloy walks the spine of a fallen Thunderjaw, the snow already softening its broken plating. Around her the mountains hold their breath, indifferent to whose bones these were. She finds her footing the way she always does, by trusting that nothing this big stays buried for long.",
  90: "Aloy steps into the belly of a long-dead Horus, embers from the foundries below painting the iron in copper light. The vaults arc overhead like ribs that forgot what they were holding up. Somewhere deeper, the past is still warm.",
  91: "Aloy wades through a sunset cove, bow drawn low, the Snapmaw ahead unaware it has already been chosen. The water carries the warmth of the day and the cold of what's coming next. She breathes once, finds the line, and the world quiets down.",
  92: "Aloy looses an arrow against a sky of molten cloud, knee-deep in still water, her silhouette repeated in the surface. The reflection looks like a second hunter sharing the same breath. For a moment there is no machine, no quarry, just the curve of the bow and the sun coming down.",
  93: "Aloy rides her Charger through a shallow river at twilight, the machine's running lights cooling the dark to blue. A campfire burns small on the far bank, the only warm thing for a long way. She isn't going toward it; she's just keeping moving, the way the land seems to ask her to.",
};

// Lightbox description for any photo. Illustrations use their inline copy;
// photography always uses the PHOTO_DESCRIPTIONS map (the array's `description`
// field is used elsewhere for platform tagging, not the scene caption).
function descFor(p: Photo): string {
  if (p.tab === "illustrations") return p.description;
  return PHOTO_DESCRIPTIONS[p.id] ?? `${p.title}, captured in ${p.category}.`;
}

// Hardware tier for the "Shot on PlayStation®..." sentence in the lightbox.
// Senua's Sacrifice and both Horizon entries were captured on a PS5 Pro;
// everything else on a base PS5.
function platformFor(p: Photo): string {
  if (/senua|hellblade|horizon/i.test(p.category)) return "5 Pro";
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
  landscapeThreshold = 1.7,
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
  // Photos with w/h above this ratio go into their own full-width row. Default
  // tuned for ultra-wide game stills (1.7); illustrations pass 1.0 so every
  // true landscape gets a full row instead of being cropped to fit a portrait
  // row's averaged height.
  landscapeThreshold?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const GAP = 0;

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

    const isLandscape = (p: Photo) => p.w / p.h > landscapeThreshold;
    const pinnedIds = pinTopIds ?? [];
    const pinnedSet = new Set(pinnedIds);

    // Order photos: pinned first (in pinned order), then the remaining set in
    // its source order. Each pinned id is resolved against the photo list.
    const ordered: Photo[] = [];
    for (const id of pinnedIds) {
      const p = photos.find(ph => ph.id === id);
      if (p) ordered.push(p);
    }
    for (const p of photos) if (!pinnedSet.has(p.id)) ordered.push(p);

    // Build rows by FIRST splitting the ordered list into portrait-rows and
    // landscapes (each preserving source order), THEN evenly interleaving the
    // two streams. Walking source order one-by-one wastes a landscape that
    // appears early (e.g. Aurora at index 0) before any portrait rows exist
    // to be separated. Bresenham-style distribution guarantees the minimum
    // number of back-to-back rows possible given the available counts.
    type Row =
      | { kind: "L"; photo: Photo }
      | { kind: "P"; photos: Photo[] };

    const pRows: Photo[][] = [];
    const landscapes: Photo[] = [];
    let buf: Photo[] = [];
    for (const p of ordered) {
      if (isLandscape(p)) {
        landscapes.push(p);
      } else {
        buf.push(p);
        if (buf.length === columnCount) {
          pRows.push(buf);
          buf = [];
        }
      }
    }
    if (buf.length > 0) pRows.push(buf);

    // Interleave by perfectly alternating majority/minority until the minority
    // stream is exhausted, then dump the leftover majority at the end. This
    // pushes ALL unavoidable back-to-back rows to the tail of the layout
    // instead of scattering them in the middle. Back-to-back count is still
    // the math minimum (max(0, |L - P| - 1)); only the placement changes.
    const pItems: Row[] = pRows.map(p => ({ kind: "P", photos: p }));
    const lItems: Row[] = landscapes.map(p => ({ kind: "L", photo: p }));
    const [majItems, minItems] =
      pItems.length >= lItems.length ? [pItems, lItems] : [lItems, pItems];
    const rows: Row[] = [];
    let mi = 0, Mi = 0;
    while (mi < minItems.length) {
      rows.push(majItems[Mi++]);
      rows.push(minItems[mi++]);
    }
    while (Mi < majItems.length) rows.push(majItems[Mi++]);

    // Render rows into absolute-positioned items. Landscape row = full width
    // at the photo's natural aspect. Portrait row = each portrait at colW with
    // a uniform row height equal to the average aspect of that row's photos,
    // so cards in the same row line up bottom-to-bottom with no gaps.
    const items: MasonryItem[] = [];
    let y = 0;
    for (const row of rows) {
      if (row.kind === "L") {
        const w = containerWidth;
        const h = w * (row.photo.h / row.photo.w);
        items.push({ photo: row.photo, top: y, left: 0, width: w, height: h });
        y += h + GAP;
      } else {
        const avgRatio =
          row.photos.reduce((s, p) => s + p.h / p.w, 0) / row.photos.length;
        const h = colW * avgRatio;
        row.photos.forEach((p, i) => {
          items.push({
            photo: p,
            top: y,
            left: i * (colW + GAP),
            width: colW,
            height: h,
          });
        });
        y += h + GAP;
      }
    }

    const totalHeight = y > 0 ? y - GAP : 0;
    return { items, totalHeight };
  }, [containerWidth, columnCount, photos, pinTopIds, landscapeThreshold]);

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
            aspect={`${item.width} / ${item.height}`}
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
  isTablet,
  previewed,
  onPreview,
  onOpen,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  group: { category: string; studio: string; photos: Photo[]; coverObjectPosition?: string };
  cover: Photo;
  delay: number;
  isTouchDevice: boolean;
  isTablet: boolean;
  previewed: boolean;
  onPreview: () => void;
  onOpen: () => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  // Tablet two-tap pattern: first tap shows the editorial overlay (previewed),
  // second tap actually opens the collection. Desktop falls through directly.
  const isShown = hovered || previewed;
  const handleClick = () => {
    if (isTablet && !previewed) {
      onPreview();
      return;
    }
    onOpen();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
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
            transform: isShown ? "scale(1.05)" : "scale(1)",
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
            opacity: isShown ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Editorial overlay — anchored to the bottom, hover (desktop) or first-tap (tablet) */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 pb-8 pointer-events-none"
          style={{
            opacity: isShown ? 1 : 0,
            transform: isShown ? "translateY(0)" : "translateY(8px)",
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
      onMouseEnter={onCursorEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onCursorLeave}
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
          border: "12px solid #f5f1e6",
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
  const [cursorLabel, setCursorLabel] = useState<"View" | "View Collection">("View");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [previewedCategory, setPreviewedCategory] = useState<string | null>(null);
  const [imgRect, setImgRect] = useState<{ w: number; h: number } | null>(null);
  const lightboxCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const blackoutTimerRef = useRef<number | null>(null);
  const blackoutOverlayRef = useRef<HTMLDivElement>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const LENS_SIZE = 300;
  const LENS_ZOOM = 2.5;

  // Two-tier photography is now driven by the URL: /gallery shows tier-1, and
  // /gallery/[slug] resolves a game category for tier-2. Navigating between
  // them via the Next.js router gives us scroll-to-top + browser back/forward
  // for free, plus shareable deep links.
  const pathname = usePathname();
  const router = useRouter();
  const activeGame = useMemo<string | null>(() => {
    if (!pathname || !pathname.startsWith("/gallery/")) return null;
    const slug = pathname.replace("/gallery/", "").split("/")[0];
    if (!slug) return null;
    const match = GAMES.find(g => slugFor(g.category) === slug);
    return match?.category ?? null;
  }, [pathname]);
  const columnCount = useColumnCount();

  const openGame = useCallback((category: string) => {
    router.push(`/gallery/${slugFor(category)}`);
  }, [router]);

  const closeGame = useCallback(() => {
    // Prefer router.back() so the browser restores tier-1 scroll position if
    // the user arrived via a card click. Fall back to a fresh push otherwise.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/gallery");
    }
  }, [router]);

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
    // Phones only — tablets (iPad ≥ 768px) keep the desktop lightbox + cursor
    // behavior even though they're touch devices.
    setIsTouchDevice(window.matchMedia("(pointer: coarse) and (max-width: 767px)").matches);
    setIsTablet(window.matchMedia("(pointer: coarse) and (min-width: 768px)").matches);
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
      style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}
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
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              {cursorLabel}
            </div>
          </div>
        )}

        {/* Editorial split-text toggle — fixed top-right, aligned with the Nav
            at top-5. Two lowercase words separated by a hairline; active word
            is bright, inactive is muted, an underline pill slides between
            them via layoutId. Mobile gets a centered in-flow version. Fades
            out on tier 2 (game detail). */}
        <AnimatePresence initial={false}>
          {activeGame === null && (
            <>
              {/* Desktop: fixed top-right, vertically aligned with Nav */}
              <motion.div
                key="gallery-toggle-desktop"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="hidden md:flex fixed top-[28px] left-6 lg:left-10 z-50 items-center gap-5 py-2"
              >
                {(["photography", "illustrations"] as Tab[]).map((tab, i) => (
                  <div key={tab} className="flex items-center gap-5">
                    {i > 0 && (
                      <span
                        aria-hidden
                        style={{
                          width: "1px",
                          height: "18px",
                          background: "rgba(245,245,247,0.18)",
                        }}
                      />
                    )}
                    <button
                      onClick={() => switchTab(tab)}
                      className="relative text-sm font-medium tracking-tight cursor-pointer transition-colors duration-200"
                      style={{
                        color: activeTab === tab ? "#f5f5f7" : "#515154",
                        padding: "2px 0",
                      }}
                    >
                      <span className="relative z-10 capitalize">{tab}</span>
                      {activeTab === tab && (
                        <motion.div
                          layoutId="gallery-tab-underline"
                          className="absolute left-0 right-0"
                          style={{
                            bottom: -2,
                            height: 1,
                            background: "#f5f5f7",
                          }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        />
                      )}
                    </button>
                  </div>
                ))}
              </motion.div>

              {/* Mobile: centered in flow, sits below the mobile nav bar */}
              <motion.div
                key="gallery-toggle-mobile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="md:hidden flex justify-center items-center gap-5 pt-24 pb-10"
              >
                {(["photography", "illustrations"] as Tab[]).map((tab, i) => (
                  <div key={tab} className="flex items-center gap-5">
                    {i > 0 && (
                      <span
                        aria-hidden
                        style={{
                          width: "1px",
                          height: "18px",
                          background: "rgba(245,245,247,0.18)",
                        }}
                      />
                    )}
                    <button
                      onClick={() => switchTab(tab)}
                      className="relative text-base font-medium tracking-tight cursor-pointer transition-colors duration-200"
                      style={{
                        color: activeTab === tab ? "#f5f5f7" : "#515154",
                        padding: "2px 0",
                      }}
                    >
                      <span className="relative z-10 capitalize">{tab}</span>
                      {activeTab === tab && (
                        <motion.div
                          layoutId="gallery-tab-underline-mobile"
                          className="absolute left-0 right-0"
                          style={{
                            bottom: -2,
                            height: 1,
                            background: "#f5f5f7",
                          }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        />
                      )}
                    </button>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop spacer — the toggle is fixed-positioned and out of flow,
            so we add top padding before the cards. */}
        {activeGame === null && <div className="hidden md:block pt-36" />}

        {/* Two-tier photography: game cards → game detail. Illustrations stays as a single masonry. */}
        <section className="px-8 sm:px-0 pb-16">
          <AnimatePresence mode="wait">
            {activeTab === "illustrations" ? (
              <motion.div
                key="illustrations-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                style={{ pointerEvents: isTransitioning ? "none" : undefined }}
              >
                <div style={{ background: "#f5f1e6", padding: 12 }}>
                  <MasonryGrid
                    photos={ILLUSTRATIONS}
                    columnCount={columnCount}
                    isTouchDevice={isTouchDevice}
                    onSelect={setSelected}
                    onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                    onMouseMove={handleMouseMove}
                    onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
                    landscapeThreshold={1.0}
                  />
                </div>
              </motion.div>
            ) : activeGame === null ? (
              // Tier 1 — game cards grid
              <motion.div
                key="game-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-0"
              >
                {PHOTOGRAPHY_GROUPS.map((group, gi) => {
                  return (
                    <GameCard
                      key={group.category}
                      group={group}
                      cover={group.cover}
                      delay={gi * 0.06}
                      isTouchDevice={isTouchDevice}
                      isTablet={isTablet}
                      previewed={previewedCategory === group.category}
                      onPreview={() => setPreviewedCategory(group.category)}
                      onOpen={() => { setPreviewedCategory(null); openGame(group.category); }}
                      onCursorEnter={() => {
                        if (isTouchDevice) return;
                        setCursorLabel("View Collection");
                        setCursorVisible(true);
                      }}
                      onMouseMove={handleMouseMove}
                      onCursorLeave={() => {
                        if (isTouchDevice) return;
                        setCursorVisible(false);
                        setCursorLabel("View");
                      }}
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
                  <div className="mb-20 sm:px-14 lg:px-20">
                    <div className="relative">
                      <button
                        onClick={closeGame}
                        aria-label="Back to all projects"
                        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer leading-none transition-colors"
                        style={{ color: "#86868b", fontSize: "clamp(1.75rem, 2.4vw, 2.5rem)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f5f7")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#86868b")}
                      >
                        ←
                      </button>
                      <h2
                        className="text-center font-black tracking-tight leading-[0.92] px-16 lg:whitespace-nowrap"
                        style={{ fontSize: "clamp(2rem, 4vw, 4rem)", color: "#f5f5f7" }}
                      >
                        {group.category}
                      </h2>
                    </div>
                    <p className="text-center text-lg sm:text-xl mt-6" style={{ color: "#a1a1a6" }}>
                      {group.studio} · {group.photos.length} {group.photos.length === 1 ? "shot" : "shots"}
                    </p>
                  </div>
                  <div style={{ background: "#f5f1e6", padding: 12 }}>
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
                  </div>
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
                  : "calc(100vh - 64px - 240px)";
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
                      className={`p-6 shrink-0 overflow-y-auto ${isPortrait ? "flex flex-col" : ""}`}
                      style={isPortrait ? { width: INFO_W } : { maxHeight: 240 }}
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
                          {selected.category === "Real Photography" ? (
                            <>Shot on iPhone 16 Pro.</>
                          ) : (
                            <>Shot on PlayStation<sup style={{ fontSize: "0.6em", verticalAlign: "super" }}>®</sup> {platformFor(selected)}.</>
                          )}
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
