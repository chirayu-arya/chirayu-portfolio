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
};

const VP = "/Gallery/Photography/Virtual%20Photography";
const RP = "/Gallery/Photography/Real%20Photography";
const ILL = "/Gallery/Illustrations";
const VIRTUAL_DESC = "Clicked on Playstation 5.";
const ILLUS_TOOL = "Made on Procreate, on iPad Pro, with Apple Pencil Pro.";

// Photography — 49 items, interleaved so the same game rarely sits next to itself.
// Expedition 33 makes up 28/49 shots, so a few same-game neighbors are mathematically unavoidable.
const PHOTOGRAPHY: Photo[] = [
  { id: 1, tab: "photography", title: "Together at 33", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg` },
  { id: 2, tab: "photography", title: "Lumière Glance", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7685.jpg` },
  { id: 3, tab: "photography", title: "Stillness Beneath the Falls", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8199.JPG` },
  { id: 4, tab: "photography", title: "Through the Veil", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_7858.jpg` },
  { id: 5, tab: "photography", title: "The Wildflower Ride", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG` },
  { id: 6, tab: "photography", title: "The First Spark", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8255.jpg` },
  { id: 7, tab: "photography", title: "Symbiote Showdown", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7733.JPG` },
  { id: 8, tab: "photography", title: "The Quiet Heir", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8367%202.jpg` },
  { id: 9, tab: "photography", title: "After the Battle", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8381%203.JPG` },
  { id: 10, tab: "photography", title: "Plains Lily", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8200.JPG` },
  { id: 11, tab: "photography", title: "Into the Light", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8392%202.JPG` },
  { id: 12, tab: "photography", title: "Ginkgo Storm", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8858.JPG` },
  { id: 13, tab: "photography", title: "Plumed Sentinel", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8564.JPG` },
  { id: 14, tab: "photography", title: "Moonrise Over the Sea", category: "Real Photography", description: "Shot on iPhone 16 Pro.", src: `${RP}/IMG_6865.jpg` },
  { id: 15, tab: "photography", title: "Cloaked in Gold", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8582.JPG` },
  { id: 16, tab: "photography", title: "Defiant Stand", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8607.JPG` },
  { id: 17, tab: "photography", title: "Through the Ferns", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8867.JPG` },
  { id: 18, tab: "photography", title: "The Approach", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8643.jpg` },
  { id: 19, tab: "photography", title: "Venom Rising", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7735.JPG` },
  { id: 20, tab: "photography", title: "Petals at Midnight", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8652.jpg` },
  { id: 21, tab: "photography", title: "Roots of Pandora", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8204.JPG` },
  { id: 22, tab: "photography", title: "The Last Bloom", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8682.jpg` },
  { id: 23, tab: "photography", title: "Beneath the 33", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8690.JPG` },
  { id: 24, tab: "photography", title: "Bluebell Stand", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8869.JPG` },
  { id: 25, tab: "photography", title: "Faceless Watcher", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8699.JPG` },
  { id: 26, tab: "photography", title: "Skyline Patrol", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7739.JPG` },
  { id: 27, tab: "photography", title: "Strings by Firelight", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_8812.JPG` },
  { id: 28, tab: "photography", title: "Lantern Watch", category: "Ghost of Tsushima", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG` },
  { id: 29, tab: "photography", title: "The Cradle", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9171.jpg` },
  { id: 30, tab: "photography", title: "Three of Us", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9172.jpg` },
  { id: 31, tab: "photography", title: "Sun Through the Canopy", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8205.JPG` },
  { id: 32, tab: "photography", title: "The Officer", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9332.JPG` },
  { id: 33, tab: "photography", title: "Camp at Dusk", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8871.JPG` },
  { id: 34, tab: "photography", title: "Burning Forward", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9338.jpg` },
  { id: 35, tab: "photography", title: "Aerial Confrontation", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7743.JPG` },
  { id: 36, tab: "photography", title: "Patchwork Idol", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9343.JPG` },
  { id: 37, tab: "photography", title: "Cliffside Conversation", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9360.jpg` },
  { id: 38, tab: "photography", title: "A Quiet Moment", category: "Avatar: Frontiers of Pandora", description: VIRTUAL_DESC, src: `${VP}/Avatar/IMG_8210.JPG` },
  { id: 39, tab: "photography", title: "Ember Stare", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9436.JPG` },
  { id: 40, tab: "photography", title: "Resting Companions", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8901.JPG` },
  { id: 41, tab: "photography", title: "First Meeting", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9452.jpg` },
  { id: 42, tab: "photography", title: "Wings of Dread", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7745.JPG` },
  { id: 43, tab: "photography", title: "Behind the Mask", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9457.JPG` },
  { id: 44, tab: "photography", title: "Pilgrim Mound", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9492.jpg` },
  { id: 45, tab: "photography", title: "Maple Strike", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8948.JPG` },
  { id: 46, tab: "photography", title: "The Last Embrace", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/IMG_9497.jpg` },
  { id: 47, tab: "photography", title: "The Final Grip", category: "Marvel's Spider-Man 2", description: VIRTUAL_DESC, src: `${VP}/Spider%20Man%202/IMG_7746.JPG` },
  { id: 48, tab: "photography", title: "Festival Day", category: "Expedition 33", description: VIRTUAL_DESC, src: `${VP}/Expedition%2033/Post%203.png` },
  { id: 49, tab: "photography", title: "Crimson Path", category: "Ghost of Yōtei", description: VIRTUAL_DESC, src: `${VP}/Ghost%20of%20Yotei/IMG_8978.JPG` },
];

const ILLUSTRATIONS: Photo[] = [
  { id: 1, tab: "illustrations", title: "Aurora", category: ILLUS_TOOL, description: "A woman's face peers through a tropical canopy, framed by deep blues and warm coral leaves.", src: `${ILL}/Aurora%20-%20Chirayu%20Arya.PNG` },
  { id: 2, tab: "illustrations", title: "Chromatic Enigma", category: ILLUS_TOOL, description: "A surreal kiss between two figures in violet and crimson, faces fragmented into bold colour blocks.", src: `${ILL}/Chromatic%20Enigma.PNG` },
  { id: 3, tab: "illustrations", title: "Citrus Muse", category: ILLUS_TOOL, description: "A woman cradling a sliced orange, eyelids painted with the same glowing pulp.", src: `${ILL}/Citrus%20Muse.PNG` },
  { id: 4, tab: "illustrations", title: "Contour", category: ILLUS_TOOL, description: "An upturned face caught mid-breath, eyes pooling with colour and light.", src: `${ILL}/Contour.PNG` },
  { id: 5, tab: "illustrations", title: "Emerald Reflections", category: ILLUS_TOOL, description: "A weathered green statue rendered in painterly strokes against a soft brown gradient.", src: `${ILL}/Emerald%20Reflections.png` },
  { id: 6, tab: "illustrations", title: "Golden Reverie", category: ILLUS_TOOL, description: "A face dripping with molten honey, lips parted in quiet awe.", src: `${ILL}/Golden%20Reverie.PNG` },
  { id: 7, tab: "illustrations", title: "Scarlet Pout", category: ILLUS_TOOL, description: "A close-up portrait, red sunglasses askew over glossy crimson lips.", src: `${ILL}/Scarlet%20Pout.PNG` },
  { id: 8, tab: "illustrations", title: "Sunlit Chapters", category: ILLUS_TOOL, description: "A woman lounging poolside, half-asleep behind a pink magazine titled 'All About Miami'.", src: `${ILL}/Sunlit%20Chapters.PNG` },
  { id: 9, tab: "illustrations", title: "Veiled Petals", category: ILLUS_TOOL, description: "A blindfolded woman crowned in tangled flowers, lips parted toward the warm horizon.", src: `${ILL}/Veiled%20Petals.PNG` },
];

const COLS = 3;
const MAX_SLOTS = Math.max(PHOTOGRAPHY.length, ILLUSTRATIONS.length);

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function getDiagDelay(i: number): number {
  return (Math.floor(i / COLS) + (i % COLS)) * 0.055;
}

function CardFace({
  photo,
  hovered,
}: {
  photo: Photo | null;
  hovered: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
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
      ) : (
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

      {/* Text */}
      {photo && (
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
      )}
    </div>
  );
}

function CardSlot({
  i,
  activeTab,
  onSelect,
  onCursorEnter,
  onMouseMove,
  onCursorLeave,
}: {
  i: number;
  activeTab: Tab;
  onSelect: (photo: Photo) => void;
  onCursorEnter: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCursorLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const photo = PHOTOGRAPHY[i] ?? null;
  const illus = ILLUSTRATIONS[i] ?? null;
  const diagDelay = getDiagDelay(i);
  const flipRotate = activeTab === "photography" ? 0 : 180;

  const activePhoto = activeTab === "photography" ? photo : illus;
  const hasActive = activePhoto !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: hasActive ? 1 : 0, y: 0 }}
      transition={{
        duration: 0.6,
        delay: i * 0.03,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={hasActive ? { y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } : undefined}
      className={hasActive ? "cursor-none" : "pointer-events-none"}
      style={{ aspectRatio: "4/3", perspective: "1200px" }}
      onMouseEnter={() => { if (hasActive) { setHovered(true); onCursorEnter(); } }}
      onMouseMove={(e) => { if (hasActive) onMouseMove(e); }}
      onMouseLeave={() => { setHovered(false); onCursorLeave(); }}
      onClick={() => { if (activePhoto) onSelect(activePhoto); }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Flipper */}
      <motion.div
        animate={{ rotateY: flipRotate }}
        transition={{
          duration: 0.3,
          delay: diagDelay,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face — Photography */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardFace photo={photo} hovered={hovered && activeTab === "photography"} />
        </div>

        {/* Back face — Illustrations */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFace photo={illus} hovered={hovered && activeTab === "illustrations"} />
        </div>
      </motion.div>
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

  function switchTab(tab: Tab) {
    if (tab === activeTab || isTransitioning) return;
    setIsTransitioning(true);
    setActiveTab(tab);
    const lockMs = (getDiagDelay(MAX_SLOTS - 1) + 0.35) * 1000;
    setTimeout(() => setIsTransitioning(false), lockMs);
  }

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Detect touch device once on mount — hides the desktop "View" cursor pill
  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Reset measured lightbox dimensions + loaded image when selection clears
  useEffect(() => {
    if (!selected) {
      setImgRect(null);
      loadedImgRef.current = null;
    }
  }, [selected]);

  // Re-measure the lightbox canvas on viewport resize so the wrapper stays
  // locked to the canvas's rendered width across breakpoints
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

  // === Canvas-based lightbox renderer ===
  // Paints the loaded image to the lightbox canvas. When `withWatermark`
  // is true, tiles a diagonal "© Chirayu Arya" overlay across the bitmap.
  // The watermark is drawn synchronously inside the `contextmenu` handler
  // so the browser's "Save image as…" action samples the watermarked
  // pixel buffer instead of the clean original.
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
      ctx.rotate(-Math.PI / 6); // ~-30°
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

  // Load the selected image into an off-DOM Image, paint it to the canvas,
  // and measure the canvas's rendered size for the wrapper.
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
    // Synchronously stamp the watermark into the canvas bitmap before the
    // browser's native "Save image as…" menu samples the pixels.
    drawCanvas(true);
  }, [drawCanvas]);

  const handleCanvasMouseLeave = useCallback(() => {
    // Revert to clean view once the pointer leaves the canvas.
    drawCanvas(false);
  }, [drawCanvas]);

  // === Screenshot deterrents ===
  // Imperative blackout — flips a pre-mounted overlay <div> directly via ref
  // instead of going through React's render loop. Skips reconciliation and
  // paints in the same frame as the triggering keydown, giving us the best
  // shot at beating the OS screenshot capture.
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

    // Codes that signal a real screenshot/save shortcut. macOS intercepts
    // Shift+Digit3/4/5 at the OS level so those keydowns *never* arrive in
    // the browser — we catch them indirectly via the Cmd/Shift modifier
    // press below, and they stay because the digit never arrives to
    // "cancel" the blackout.
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
      // Modifier keys themselves (Shift / Cmd / Ctrl / Alt) — trigger
      // blackout proactively. We don't yet know if this is the start of a
      // screenshot combo (Cmd+Shift+3) or a benign one (Cmd+T) — we'll
      // decide when the follow-up key arrives.
      if (e.key === "Shift" || e.key === "Meta" || e.key === "Control" || e.key === "Alt") {
        triggerBlackout();
        return;
      }
      // Follow-up key while a modifier is held — decide.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        if (SCREENSHOT_CODES.has(e.code)) {
          // Real screenshot/save key — keep the blackout (re-trigger).
          triggerBlackout();
        } else {
          // Benign shortcut (Cmd+T, Cmd+R, Cmd+Shift+], typed capital
          // letter, etc.) — cancel the blackout we just triggered.
          cancelBlackout();
        }
      }
    };
    const onKeyup = (e: KeyboardEvent) => {
      // PrintScreen on Windows often only fires keyup
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        triggerBlackout();
      }
    };
    // Freeze the overlay on — no auto-hide timer. Used when another app
    // has likely stolen focus (Screenshot.app, Snipping Tool, region-
    // select crosshair, screen recorders) and the page is still visible
    // behind it. Held until focus returns.
    const freezeBlackout = () => {
      const el = blackoutOverlayRef.current;
      if (el) el.style.display = "flex";
      if (blackoutTimerRef.current !== null) {
        window.clearTimeout(blackoutTimerRef.current);
        blackoutTimerRef.current = null;
      }
    };

    // mouseleave — only trigger when cursor exits *downward* (toward the
    // Dock, where Launchpad / Screenshot.app icons live) or sideways.
    // Exits *upward* are ignored because that's where the URL bar, tabs,
    // and browser chrome live — those are normal browser actions.
    // We freeze (no auto-fade) on exit; mouseenter below decides whether
    // to start the 2s fade based on whether anything overlaying us has
    // taken focus.
    const onMouseLeave = (e: MouseEvent) => {
      if (e.relatedTarget !== null) return;
      const clientY = e.clientY;
      const clientX = e.clientX;
      const downward = clientY >= window.innerHeight - 1;
      const sideways = clientX <= 0 || clientX >= window.innerWidth - 1;
      if (downward || sideways) freezeBlackout();
    };

    // mouseenter — cursor returned to the page. If the browser still has
    // focus (no Screenshot.app / Spotlight / other overlay actively stole
    // it), start the 2s fade. If focus is gone, leave it frozen — the
    // onFocus handler will start the fade once focus returns.
    const onMouseEnter = () => {
      if (
        isBlackoutShowing() &&
        blackoutTimerRef.current === null &&
        document.hasFocus()
      ) {
        startHideTimer();
      }
    };

    // When the tab becomes hidden (Cmd+T to a new tab, clicking another
    // tab, etc.), forcibly clear any blackout that may have just been
    // painted by an incidental blur/poll firing in the brief window
    // between focus loss and visibility change. This is what was leaving
    // the overlay "stuck" — by the time the tab came back, we'd already
    // have shown the overlay with no timer.
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelBlackout();
      }
    };

    // When focus returns, start the standard 2s fade timer
    const onFocus = () => {
      if (isBlackoutShowing() && blackoutTimerRef.current === null) {
        startHideTimer();
      }
    };

    // Capture phase + window AND document listeners so we beat any
    // intermediate handlers that might stopPropagation.
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

    // rAF-based focus polling — catches apps (Launchpad, Mission Control,
    // Screenshot.app toolbar) that take focus without firing a reliable
    // blur event on the browser window. Polling every animation frame
    // (~16ms) instead of setInterval(200ms) closes the window where a
    // user could click "capture" before the blackout paints.
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
      {/* Anti-save / anti-screenshot CSS (scoped to this page) */}
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

      {/* Instant blackout overlay — always mounted, toggled imperatively via
          ref in the keydown handler so the paint happens in the same frame
          as the screenshot shortcut (no React reconciliation in the path). */}
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

        {/* Custom "View" cursor pill — desktop / mouse only */}
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

        {/* Photo grid */}
        <section className="px-8 sm:px-14 lg:px-20 pb-24">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ pointerEvents: isTransitioning ? "none" : undefined }}
          >
            {Array.from({ length: MAX_SLOTS }, (_, i) => (
              <CardSlot
                key={i}
                i={i}
                activeTab={activeTab}
                onSelect={setSelected}
                onCursorEnter={() => { if (!isTouchDevice) setCursorVisible(true); }}
                onMouseMove={handleMouseMove}
                onCursorLeave={() => { if (!isTouchDevice) setCursorVisible(false); }}
              />
            ))}
          </div>
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
                  // Lock wrapper width to the image's actual rendered width once measured
                  // so portrait artwork doesn't get padded out by the info text below.
                  width: imgRect ? `${imgRect.w}px` : "fit-content",
                  maxWidth: "calc(100vw - 64px)",
                  minWidth: imgRect ? undefined : "min(320px, calc(100vw - 64px))",
                  maxHeight: "calc(100vh - 64px)",
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Close button */}
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

                {/* Canvas — renders the image at full natural resolution.
                    On right-click we stamp a diagonal "© Chirayu Arya"
                    watermark into the bitmap before the browser samples
                    pixels for "Save image as…". Reverts on mouseleave. */}
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

                {/* Info */}
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
