"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  slugFor,
  type Tab,
  type Photo,
  ILLUSTRATIONS,
  NOISE,
  GAMES,
  PHOTOGRAPHY_GROUPS,
  descFor,
  platformFor,
} from "./data";
import { wallpaperPriceCents, formatPrice } from "@/lib/store/catalog";

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

        {/* Editorial split-text toggle — centered, in flow, between the page
            header area and the items grid. Active word is bright, inactive is
            muted, an underline slides between them via layoutId. Fades out on
            tier 2 (game detail). */}
        <AnimatePresence initial={false}>
          {activeGame === null && (
            <motion.div
              key="gallery-toggle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="flex justify-center items-center gap-5 pt-28 md:pt-36 pb-10"
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
                    className="relative text-sm sm:text-base font-medium tracking-tight cursor-pointer transition-colors duration-200"
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
          )}
        </AnimatePresence>

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
                        <p className="text-xs mt-3" style={{ color: "#86868b" }}>
                          {selected.category === "Real Photography" ? (
                            <>Shot on iPhone 16 Pro.</>
                          ) : (
                            <>Shot on PlayStation<sup style={{ fontSize: "0.6em", verticalAlign: "super" }}>®</sup> {platformFor(selected)}.</>
                          )}
                        </p>
                      )}

                      {/* Purchase — deep-links to /store and opens this item's modal */}
                      {(() => {
                        const productId = `wallpaper-${selected.tab === "photography" ? "photo" : "illustration"}-${selected.id}`;
                        return (
                          <a
                            href={`/store?buy=${productId}`}
                            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer ${isPortrait ? "mt-auto pt-0" : "mt-5"}`}
                            style={{ background: "#f5f5f7", color: "#000", alignSelf: "flex-start", marginTop: isPortrait ? "auto" : undefined }}
                          >
                            Purchase · {formatPrice(wallpaperPriceCents(selected.w, selected.h))}
                          </a>
                        );
                      })()}
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
