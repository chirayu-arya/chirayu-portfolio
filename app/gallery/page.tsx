"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import PageBlobs from "../components/PageBlobs";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

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
  { id: 1,  tab: "photography", w: 3840, h: 2160, title: "Together at 33",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg` },
  { id: 2,  tab: "photography", w: 3840, h: 2160, title: "Lumière Glance",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7685.jpg` },
  { id: 3,  tab: "photography", w: 3814, h: 2145, title: "Stillness Beneath the Falls", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8199.JPG` },
  { id: 4,  tab: "photography", w: 3840, h: 2160, title: "Through the Veil",         category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7858.jpg` },
  { id: 5,  tab: "photography", w: 3840, h: 2160, title: "The Wildflower Ride",      category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG` },
  { id: 6,  tab: "photography", w: 2157, h: 2876, title: "The First Spark",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8255.jpg` },
  { id: 7,  tab: "photography", w: 3840, h: 2160, title: "Symbiote Showdown",        category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7733.JPG` },
  { id: 8,  tab: "photography", w: 2071, h: 2761, title: "The Quiet Heir",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8367%202.jpg` },
  { id: 9,  tab: "photography", w: 2157, h: 3834, title: "After the Battle",         category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8381%203.JPG` },
  { id: 10, tab: "photography", w: 2305, h: 1297, title: "Plains Lily",              category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8200.JPG` },
  { id: 11, tab: "photography", w: 1683, h: 2992, title: "Into the Light",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8392%202.JPG` },
  { id: 12, tab: "photography", w: 1844, h: 3278, title: "Ginkgo Storm",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8858.JPG` },
  { id: 13, tab: "photography", w: 1682, h: 2243, title: "Plumed Sentinel",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8564.JPG` },
  { id: 14, tab: "photography", w: 1866, h: 3317, title: "Moonrise Over the Sea",    category: "Real Photography",             description: "Shot on iPhone 16 Pro.", src: `${RP}/IMG_6865.jpg` },
  { id: 15, tab: "photography", w: 1882, h: 2510, title: "Cloaked in Gold",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8582.JPG` },
  { id: 16, tab: "photography", w: 3610, h: 2031, title: "Defiant Stand",            category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8607.JPG` },
  { id: 17, tab: "photography", w: 2160, h: 3840, title: "Through the Ferns",        category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8867.JPG` },
  { id: 18, tab: "photography", w: 1971, h: 2628, title: "The Approach",             category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8643.jpg` },
  { id: 19, tab: "photography", w: 3840, h: 2160, title: "Venom Rising",             category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7735.JPG` },
  { id: 20, tab: "photography", w: 2157, h: 2876, title: "Petals at Midnight",       category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8652.jpg` },
  { id: 21, tab: "photography", w: 3840, h: 2160, title: "Roots of Pandora",         category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8204.JPG` },
  { id: 22, tab: "photography", w: 3840, h: 2160, title: "The Last Bloom",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8682.jpg` },
  { id: 23, tab: "photography", w: 2109, h: 2812, title: "Beneath the 33",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8690.JPG` },
  { id: 24, tab: "photography", w: 2160, h: 3840, title: "Bluebell Stand",           category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8869.JPG` },
  { id: 25, tab: "photography", w: 1811, h: 2415, title: "Faceless Watcher",         category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8699.JPG` },
  { id: 26, tab: "photography", w: 3840, h: 2160, title: "Skyline Patrol",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7739.JPG` },
  { id: 27, tab: "photography", w: 1978, h: 3517, title: "Strings by Firelight",     category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8812.JPG` },
  { id: 28, tab: "photography", w: 1506, h: 2008, title: "Lantern Watch",            category: "Ghost of Tsushima",            description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG` },
  { id: 29, tab: "photography", w: 1954, h: 2606, title: "The Cradle",               category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9171.jpg` },
  { id: 30, tab: "photography", w: 1991, h: 2655, title: "Three of Us",              category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9172.jpg` },
  { id: 31, tab: "photography", w: 3840, h: 2160, title: "Sun Through the Canopy",   category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8205.JPG` },
  { id: 32, tab: "photography", w: 3840, h: 2160, title: "The Officer",              category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9332.JPG` },
  { id: 33, tab: "photography", w: 1601, h: 2135, title: "Camp at Dusk",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8871.JPG` },
  { id: 34, tab: "photography", w: 1860, h: 2480, title: "Burning Forward",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9338.jpg` },
  { id: 35, tab: "photography", w: 3840, h: 2160, title: "Aerial Confrontation",     category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7743.JPG` },
  { id: 36, tab: "photography", w: 3840, h: 2160, title: "Patchwork Idol",           category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9343.JPG` },
  { id: 37, tab: "photography", w: 2160, h: 2700, title: "Cliffside Conversation",   category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9360.jpg` },
  { id: 38, tab: "photography", w: 3840, h: 2160, title: "A Quiet Moment",           category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8210.JPG` },
  { id: 39, tab: "photography", w: 1971, h: 3504, title: "Ember Stare",              category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9436.JPG` },
  { id: 40, tab: "photography", w: 1601, h: 2135, title: "Resting Companions",       category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8901.JPG` },
  { id: 41, tab: "photography", w: 2160, h: 2880, title: "First Meeting",            category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9452.jpg` },
  { id: 42, tab: "photography", w: 3840, h: 2160, title: "Wings of Dread",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7745.JPG` },
  { id: 43, tab: "photography", w: 3840, h: 2160, title: "Behind the Mask",          category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9457.JPG` },
  { id: 44, tab: "photography", w: 2157, h: 2876, title: "Pilgrim Mound",            category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9492.jpg` },
  { id: 45, tab: "photography", w: 1914, h: 3402, title: "Maple Strike",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8948.JPG` },
  { id: 46, tab: "photography", w: 2157, h: 2876, title: "The Last Embrace",         category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9497.jpg` },
  { id: 47, tab: "photography", w: 3840, h: 2160, title: "The Final Grip",           category: "Marvel's Spider-Man 2",        description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7746.JPG` },
  { id: 48, tab: "photography", w: 1344, h: 756,  title: "Festival Day",             category: "Expedition 33",                description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Post%203.png` },
  { id: 49, tab: "photography", w: 3840, h: 2160, title: "Crimson Path",             category: "Ghost of Yōtei",               description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8978.JPG` },
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

function GalleryCard({
  photo,
  delay,
  isTouchDevice,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  photo: Photo;
  delay: number;
  isTouchDevice: boolean;
  onSelect: (p: Photo) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`break-inside-avoid ${isTouchDevice ? "" : "cursor-none"}`}
      style={{ marginBottom: "12px" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }}
      onMouseEnter={() => { setHovered(true); onCursorEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => onSelect(photo)}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        style={{
          aspectRatio: `${photo.w} / ${photo.h}`,
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.05)",
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

  const activePhotos = activeTab === "photography" ? PHOTOGRAPHY : ILLUSTRATIONS;

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
  }, [drawCanvas]);

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

      <PageBlobs palette="magenta-orange" />

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
              View
            </div>
          </div>
        )}

        {/* Page header */}
        <section className="pt-36 pb-12 px-8 sm:px-14 lg:px-20">
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
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
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
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {(["photography", "illustrations"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ color: activeTab === tab ? "#000" : "rgba(255,255,255,0.5)" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#f5f5f7" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                )}
                <span className="relative z-10 capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry grid */}
        <section className="px-8 sm:px-14 lg:px-20 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.1 }}
              className="columns-1 sm:columns-2 lg:columns-3"
              style={{
                columnGap: "12px",
                pointerEvents: isTransitioning ? "none" : undefined,
              }}
            >
              {activePhotos.map((photo, i) => (
                <GalleryCard
                  key={`${activeTab}-${photo.id}`}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative rounded-3xl overflow-hidden flex flex-col"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: imgRect ? `${imgRect.w}px` : "fit-content",
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

                <div className="relative" style={{ background: "#0a0a0a" }}>
                  <canvas
                    ref={lightboxCanvasRef}
                    onContextMenu={handleCanvasContextMenu}
                    onMouseLeave={handleCanvasMouseLeave}
                    aria-label={selected.title}
                    role="img"
                    style={{
                      display: "block",
                      maxWidth: "calc(100vw - 64px)",
                      maxHeight: "calc(100vh - 64px - 160px)",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>

                <div className="p-6 shrink-0">
                  <h2 className="text-lg font-semibold mb-1" style={{ color: "#f5f5f7" }}>
                    {selected.title}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: "#86868b" }}>{selected.category}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#a1a1a6" }}>{selected.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Contact />
      </div>
    </main>
  );
}
