// Gallery data — shared between the /gallery UI (client) and server-side
// store code (catalog, download API). No "use client" directive: this module
// must stay importable from route handlers.

// URL slug helpers — convert a game category to its /gallery/[slug] path part
// and back. Slugs are kebab-case, ascii-only, with common prefixes stripped
// ("Clair Obscur:", "Marvel's") so the URL stays short and clean.
export function slugFor(category: string): string {
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

export type Tab = "photography" | "illustrations";

export type Photo = {
  id: number;
  tab: Tab;
  title: string;
  category: string;
  description: string;
  src: string;
  w: number;
  h: number;
};

export const VP = "/Gallery/Photography/Virtual%20Photography";
export const RP = "/Gallery/Photography/Real%20Photography";
export const ILL = "/Gallery/Illustrations";
export const VIRTUAL_DESC = "Clicked on Playstation 5.";
export const ILLUS_TOOL = "Made on Procreate, on iPad Pro, with Apple Pencil Pro.";

export const PHOTOGRAPHY: Photo[] = [
  { id: 50, tab: "photography", w: 2157, h: 3834, title: "Crystal Sentinel",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9518.JPG` },
  { id: 71, tab: "photography", w: 1656, h: 2943, title: "Highland Vigil",           category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9640.JPG` },
  { id: 13, tab: "photography", w: 1682, h: 2243, title: "Plumed Sentinel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8564.JPG` },
  { id: 86, tab: "photography", w: 2039, h: 2719, title: "Tallneck at Dusk",         category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9730.JPG` },
  { id: 82, tab: "photography", w: 2157, h: 2876, title: "The Painted Hunter",       category: "Horizon Forbidden West",       description: VIRTUAL_DESC, src: `${VP}/Horizon%20Forbidden%20West/IMG_9716.jpg` },
  { id: 58, tab: "photography", w: 3840, h: 2160, title: "Runebearer",               category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9556%202.JPG` },
  { id: 1,  tab: "photography", w: 3840, h: 2160, title: "Together at 33",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg` },
  { id: 97, tab: "photography", w: 1246, h: 1661, title: "The Bearer",               category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9767.JPG` },
  { id: 2,  tab: "photography", w: 3840, h: 2160, title: "Lumière Glance",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7685.jpg` },
  { id: 3,  tab: "photography", w: 3814, h: 2145, title: "Stillness Beneath the Falls", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8199.JPG` },
  { id: 72, tab: "photography", w: 2157, h: 2876, title: "Inside the Ribcage",       category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9643.JPG` },
  { id: 87, tab: "photography", w: 3840, h: 2160, title: "Aurora Over the Glow",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9736.JPG` },
  { id: 4,  tab: "photography", w: 3840, h: 2160, title: "Through the Veil",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7858.jpg` },
  { id: 49, tab: "photography", w: 3840, h: 2160, title: "Crimson Path",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8978.JPG` },
  { id: 6,  tab: "photography", w: 2157, h: 2876, title: "The First Spark",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8255.jpg` },
  { id: 7,  tab: "photography", w: 3840, h: 2160, title: "Symbiote Showdown",        category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7733.JPG` },
  { id: 102, tab: "photography", w: 1620, h: 2160, title: "The Focus Lights Up",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9781.JPG` },
  { id: 73, tab: "photography", w: 1916, h: 2554, title: "The Lorekeeper Kneels",    category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9647.JPG` },
  { id: 98, tab: "photography", w: 1620, h: 2160, title: "Marked Witness",           category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9768.JPG` },
  { id: 20, tab: "photography", w: 2157, h: 2876, title: "Petals at Midnight",       category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8652.jpg` },
  { id: 10, tab: "photography", w: 2305, h: 1297, title: "Plains Lily",              category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8200.JPG` },
  { id: 11, tab: "photography", w: 1683, h: 2992, title: "Into the Light",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8392%202.JPG` },
  { id: 88, tab: "photography", w: 2157, h: 2876, title: "Salute to the Sky",        category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9737.JPG` },
  { id: 12, tab: "photography", w: 1844, h: 3278, title: "Ginkgo Storm",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8858.JPG` },
  { id: 103, tab: "photography", w: 3840, h: 2160, title: "Mesa with the Tallneck",   category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9782.JPG` },
  { id: 74, tab: "photography", w: 2152, h: 2869, title: "Runes and Embers",         category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9648.JPG` },
  { id: 95, tab: "photography", w: 1888, h: 2517, title: "Trailing the Glow",        category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9743.JPG` },
  { id: 54, tab: "photography", w: 1814, h: 3225, title: "Blood Memory",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9531.JPG` },
  { id: 51, tab: "photography", w: 1952, h: 2602, title: "Lunar Pilgrim",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9510.jpg` },
  { id: 55, tab: "photography", w: 3840, h: 2160, title: "Echoes of 33",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9542.JPG` },
  { id: 15, tab: "photography", w: 1882, h: 2510, title: "Cloaked in Gold",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8582.JPG` },
  { id: 16, tab: "photography", w: 3610, h: 2031, title: "Defiant Stand",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8607.JPG` },
  { id: 89, tab: "photography", w: 3840, h: 2160, title: "Bones of the Thunderjaw",  category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9738.JPG` },
  { id: 17, tab: "photography", w: 2160, h: 3840, title: "Through the Ferns",        category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8867.JPG` },
  { id: 104, tab: "photography", w: 3840, h: 2160, title: "Sundom Crown",             category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9783.JPG` },
  { id: 18, tab: "photography", w: 1971, h: 2628, title: "The Approach",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8643.jpg` },
  { id: 19, tab: "photography", w: 3840, h: 2160, title: "Venom Rising",             category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7735.JPG` },
  { id: 75, tab: "photography", w: 2157, h: 2876, title: "The Offering",             category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9650.JPG` },
  { id: 9,  tab: "photography", w: 2157, h: 3834, title: "After the Battle",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8381%203.JPG` },
  { id: 21, tab: "photography", w: 3840, h: 2160, title: "Roots of Pandora",         category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8204.JPG` },
  { id: 84, tab: "photography", w: 3840, h: 2160, title: "Embers Over the Arches",   category: "Horizon Zero Dawn Remastered",            description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9723.JPG` },
  { id: 83, tab: "photography", w: 3840, h: 2160, title: "Under Ancient Stars",      category: "Horizon Zero Dawn Remastered",            description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9722.JPG` },
  { id: 22, tab: "photography", w: 3840, h: 2160, title: "The Last Bloom",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8682.jpg` },
  { id: 23, tab: "photography", w: 2109, h: 2812, title: "Beneath the 33",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8690.JPG` },
  { id: 99, tab: "photography", w: 3840, h: 2160, title: "The Cauldron's Heart",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9769.JPG` },
  { id: 24, tab: "photography", w: 2160, h: 3840, title: "Bluebell Stand",           category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8869.JPG` },
  { id: 76, tab: "photography", w: 1605, h: 2852, title: "Half Made",                category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9651.JPG` },
  { id: 105, tab: "photography", w: 3840, h: 2160, title: "Aim at the Glinthawk",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9785.JPG` },
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
  { id: 94, tab: "photography", w: 1450, h: 1933, title: "Forge of the Horus",       category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9740.JPG` },
  { id: 91, tab: "photography", w: 1893, h: 2524, title: "Wading at Golden Hour",    category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9748.JPG` },
  { id: 34, tab: "photography", w: 1860, h: 2480, title: "Burning Forward",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9338.jpg` },
  { id: 35, tab: "photography", w: 3840, h: 2160, title: "Aerial Confrontation",     category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7743.JPG` },
  { id: 36, tab: "photography", w: 3840, h: 2160, title: "Patchwork Idol",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9343.JPG` },
  { id: 53, tab: "photography", w: 2087, h: 2783, title: "The Great Wheel",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9522.jpg` },
  { id: 57, tab: "photography", w: 3840, h: 2160, title: "The Lampmaster",           category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9548.JPG` },
  { id: 106, tab: "photography", w: 1620, h: 2160, title: "Sharpshot at Sunset",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9786.JPG` },
  { id: 25, tab: "photography", w: 1811, h: 2415, title: "Faceless Watcher",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8699.JPG` },
  { id: 38, tab: "photography", w: 3840, h: 2160, title: "A Quiet Moment",           category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8210.JPG` },
  { id: 92, tab: "photography", w: 1933, h: 2578, title: "Bow at Dawn",              category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9751.JPG` },
  { id: 79, tab: "photography", w: 3840, h: 2160, title: "The Hunter Lowers Its Head", category: "Hellblade: Senua's Sacrifice",             description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9657.JPG` },
  { id: 39, tab: "photography", w: 1971, h: 3504, title: "Ember Stare",              category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9436.JPG` },
  { id: 40, tab: "photography", w: 1601, h: 2135, title: "Resting Companions",       category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8901.JPG` },
  { id: 41, tab: "photography", w: 2160, h: 2880, title: "First Meeting",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9452.jpg` },
  { id: 100, tab: "photography", w: 1432, h: 1909, title: "Override",                 category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9770.JPG` },
  { id: 42, tab: "photography", w: 3840, h: 2160, title: "Wings of Dread",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7745.JPG` },
  { id: 80, tab: "photography", w: 2157, h: 2876, title: "Gramr in Her Hand",        category: "Hellblade: Senua's Sacrifice",               description: VIRTUAL_DESC, src: `${VP}/Hellblade%20Senua%27s%20Sacrifice/IMG_9661.JPG` },
  { id: 43, tab: "photography", w: 3840, h: 2160, title: "Behind the Mask",          category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9457.JPG` },
  { id: 96, tab: "photography", w: 1531, h: 2041, title: "Daughter of the Hunt",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9750.JPG` },
  { id: 44, tab: "photography", w: 2157, h: 2876, title: "Pilgrim Mound",            category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9492.jpg` },
  { id: 45, tab: "photography", w: 1914, h: 3402, title: "Maple Strike",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8948.JPG` },
  { id: 101, tab: "photography", w: 3840, h: 2160, title: "Through the Corruption",   category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9771.JPG` },
  { id: 46, tab: "photography", w: 2157, h: 2876, title: "The Last Embrace",         category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9497.jpg` },
  { id: 47, tab: "photography", w: 3840, h: 2160, title: "The Final Grip",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7746.JPG` },
  { id: 93, tab: "photography", w: 1850, h: 2467, title: "Charger in Twilight",      category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9752.JPG` },
  { id: 48, tab: "photography", w: 1344, h: 756,  title: "Festival Day",             category: "Clair Obscur: Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Post%203.png` },
  { id: 107, tab: "photography", w: 1903, h: 2537, title: "Crowned in Red Dust",     category: "Horizon Zero Dawn Remastered", description: VIRTUAL_DESC, src: `${VP}/Horizon%20Zero%20Dawn/IMG_9788.JPG` },
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

export const ILLUSTRATIONS: Photo[] = [
  { id: 1, tab: "illustrations", w: 2732, h: 2048, title: "Aurora",             category: ILLUS_TOOL, description: "A woman's face peers through a tropical canopy, framed by deep blues and warm coral leaves.", src: `${ILL}/Aurora%20-%20Chirayu%20Arya.PNG` },
  { id: 2, tab: "illustrations", w: 2048, h: 2732, title: "Chromatic Enigma",   category: ILLUS_TOOL, description: "A surreal kiss between two figures in violet and crimson, faces fragmented into bold colour blocks.", src: `${ILL}/Chromatic%20Enigma.PNG` },
  { id: 10, tab: "illustrations", w: 2048, h: 2732, title: "Emilia Clarke",     category: ILLUS_TOOL, description: "A portrait of Emilia Clarke as Daenerys Targaryen, fair braided hair framing her face, a silver dragon clasp at her collar.", src: `${ILL}/Emilia%20Clarke.png` },
  { id: 9, tab: "illustrations", w: 2048, h: 2732, title: "Veiled Petals",      category: ILLUS_TOOL, description: "A blindfolded woman crowned in tangled flowers, lips parted toward the warm horizon.", src: `${ILL}/Veiled%20Petals.PNG` },
  { id: 7, tab: "illustrations", w: 2048, h: 2732, title: "Scarlet Pout",       category: ILLUS_TOOL, description: "A close-up portrait, red sunglasses askew over glossy crimson lips.", src: `${ILL}/Scarlet%20Pout.PNG` },
  { id: 11, tab: "illustrations", w: 2732, h: 2048, title: "Eye",               category: ILLUS_TOOL, description: "An extreme close-up of a brown eye, the iris striated with amber and copper, the reflection of a window curving across the cornea.", src: `${ILL}/Eye.png` },
  { id: 5, tab: "illustrations", w: 2048, h: 2732, title: "Emerald Reflections",category: ILLUS_TOOL, description: "A weathered green statue rendered in painterly strokes against a soft brown gradient.", src: `${ILL}/Emerald%20Reflections.png` },
  { id: 12, tab: "illustrations", w: 2048, h: 2732, title: "Maelle",            category: ILLUS_TOOL, description: "Maelle in profile against deep black, her hair scattering into a cascade of grey and coral petals, gold geometry framing the canvas.", src: `${ILL}/Maelle.png` },
  { id: 6, tab: "illustrations", w: 2048, h: 2732, title: "Golden Reverie",     category: ILLUS_TOOL, description: "A face dripping with molten honey, lips parted in quiet awe.", src: `${ILL}/Golden%20Reverie.PNG` },
  { id: 4, tab: "illustrations", w: 2048, h: 2732, title: "Contour",            category: ILLUS_TOOL, description: "An upturned face caught mid-breath, eyes pooling with colour and light.", src: `${ILL}/Contour.PNG` },
  { id: 13, tab: "illustrations", w: 2048, h: 2732, title: "Roman III",         category: ILLUS_TOOL, description: "A classical marble bust reimagined in bold pop colour, blue planes carved through the face, pink and ochre curls dripping into the dark.", src: `${ILL}/Roman%20III.png` },
  { id: 8, tab: "illustrations", w: 2048, h: 2732, title: "Sunlit Chapters",    category: ILLUS_TOOL, description: "A woman lounging poolside, half-asleep behind a pink magazine titled 'All About Miami'.", src: `${ILL}/Sunlit%20Chapters.PNG` },
  { id: 3, tab: "illustrations", w: 2048, h: 2732, title: "Citrus Muse",        category: ILLUS_TOOL, description: "A woman cradling a sliced orange, eyelids painted with the same glowing pulp.", src: `${ILL}/Citrus%20Muse.PNG` },
  { id: 14, tab: "illustrations", w: 2048, h: 2732, title: "Shimmer",           category: ILLUS_TOOL, description: "A woman's face caught in a wash of orange light and deep blue shadow, one hand raised across her brow, hair streaking through the frame.", src: `${ILL}/Shimmer.png` },
];

export const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Game metadata for photography grouping — ordered as they should appear in the gallery.
// `category` must match the exact string used in PHOTOGRAPHY entries.
// `coverId` optionally overrides the tier-1 cover photo (defaults to the first photo in source order).
// `coverObjectPosition` shifts the visible region inside the 4:3 cover frame (CSS `object-position`).
export const GAMES: { category: string; studio: string; coverId?: number; coverObjectPosition?: string; pinTopIds?: number[] }[] = [
  { category: "Clair Obscur: Expedition 33", studio: "Sandfall Interactive / Kepler Interactive", coverId: 53, pinTopIds: [57, 6] }, // The Great Wheel; pin Lampmaster + The First Spark to top row
  { category: "Ghost of Yōtei", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverId: 45, coverObjectPosition: "50% 62%" }, // Maple Strike
  { category: "Hellblade: Senua's Sacrifice", studio: "Ninja Theory / Xbox Game Studios", coverId: 65, coverObjectPosition: "50% 55%" }, // Crown of Memory
  { category: "Avatar: Frontiers of Pandora", studio: "Massive Entertainment / Ubisoft" },
  { category: "Ghost of Tsushima", studio: "Sucker Punch Productions / Sony Interactive Entertainment", coverObjectPosition: "50% 80%" },
  { category: "Marvel's Spider-Man 2", studio: "Insomniac Games / Sony Interactive Entertainment" },
  { category: "Horizon Zero Dawn Remastered", studio: "Guerrilla Games / Sony Interactive Entertainment", coverId: 83, pinTopIds: [92, 86, 85, 93, 91, 88, 97, 98, 95, 94, 100, 96, 90, 89, 83, 101, 99, 84, 87] }, // All HZD pinned: portraits first (rows 1-4), then landscapes — trailing landscapes order: Cauldron, Embers, Aurora
  { category: "Horizon Forbidden West", studio: "Guerrilla Games / Sony Interactive Entertainment" },
  { category: "Real Photography", studio: "iPhone 16 Pro" },
];

// Photos grouped by game, in GAMES order, preserving source order within each group.
// `cover` is the resolved photo to use on the tier-1 game card (override or first photo).
export const PHOTOGRAPHY_GROUPS = GAMES
  .map(g => {
    const photos = PHOTOGRAPHY.filter(p => p.category === g.category);
    const cover = (g.coverId != null && photos.find(p => p.id === g.coverId)) || photos[0];
    return { ...g, photos, cover };
  })
  .filter(g => g.photos.length > 0);

// Per-photo description copy, keyed by photo id. Used by the lightbox when the
// photo's `description` field is still the default VIRTUAL_DESC placeholder.
// Override per-row by setting a custom string on the PHOTOGRAPHY entry instead.
export const PHOTO_DESCRIPTIONS: Record<number, string> = {
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
  94: "The carcass of a Horus catches in the dark, fire still bleeding through its plating from somewhere deep inside. The iron arc above looks less like architecture and more like a rib that forgot to fall. You stand at the edge of it and you can feel the heat the metal still carries.",
  95: "Aloy stops at the tree line, the cultists below already lit blue by whatever ritual they're feeding. Her bow stays low; the snow is too quiet to break first. She picks her line through the trees and lets them keep singing for a moment longer.",
  96: "Aloy stands waist-deep in the river at golden hour, war paint and quill catching the same light as the water. She isn't waiting for anything; the pose is just what's left when the hunt drops away for a breath. Behind her, the canyon walls hold the day a little longer than they should.",
  97: "Aloy stands inside a Cauldron, the blue cathedral light catching the gold of her armour. Behind her the machines that built her world hum in their old work. She wears the moment like she's already used to it.",
  98: "An elder of the Banuk holds the camera with eyes that have seen more winters than most. The blood-smear war paint is fresh; the tracks across her cheeks are older. She does not look at you so much as through you.",
  99: "Aloy faces the core at the bottom of a Cauldron, a glass sphere lit from inside by an old idea of progress. The walkways curve around her like ribs, the blue light too steady to be natural. She is here to take what she needs and leave it standing.",
  100: "Aloy crouches mid-override, her spear locked into a machine's spine, the air around her tool spitting red and white. The world blurs out behind her; what matters is the timing. A few more seconds and this one is hers.",
  101: "A hunter draws her bow through a curtain of corrupted purple shards, the light fracturing around her like broken glass. The Daemon-touched site warps the air; the arrow finds its line anyway. Out here, faith and aim are the same act.",
  102: "Aloy's focus catches the light at her temple, a small ring of cyan against the warm autumn at her back. She has stopped to listen to something the machines hear before anyone else does. The world holds still for her, the way it usually does just before it doesn't.",
  103: "Aloy walks the edge of a jungle mesa, a Tallneck just visible past the next ridge of stone teeth. The land out here keeps proportions she has had to relearn from scratch. She will find her angle and climb when the wind cooperates.",
  104: "Aloy wears the Carja Sundom crown like it has always been hers, the jungle rising in slabs behind her shoulder. The headdress is new; the look in her eye is older. She is not playing dress-up; she is making a point.",
  105: "Aloy draws on a Daemonic Glinthawk through the heavy garden air, the bowstring already gone quiet in her hand. The machine bleeds red against the night cathedral behind it. One arrow, one line of sight, one breath she has been holding for a while.",
  106: "Aloy crosses a ridge at sunset in full Carja warrior dress, sharpshot bow loose at her hip. The horizon is on fire and she is moving with it. Whatever she is hunting tonight has already lost the light.",
  107: "Aloy stands on a wooden platform in the red dust of the Sundom, a Tallneck small in the haze behind her. Her armour holds the dying light better than the sky does. She is exactly where she meant to be.",
};

// Lightbox description for any photo. Illustrations use their inline copy;
// photography always uses the PHOTO_DESCRIPTIONS map (the array's `description`
// field is used elsewhere for platform tagging, not the scene caption).
export function descFor(p: Photo): string {
  if (p.tab === "illustrations") return p.description;
  return PHOTO_DESCRIPTIONS[p.id] ?? `${p.title}, captured in ${p.category}.`;
}

// Hardware tier for the "Shot on PlayStation®..." sentence in the lightbox.
// Senua's Sacrifice and both Horizon entries were captured on a PS5 Pro;
// everything else on a base PS5.
export function platformFor(p: Photo): string {
  if (/senua|hellblade|horizon/i.test(p.category)) return "5 Pro";
  return "5";
}
