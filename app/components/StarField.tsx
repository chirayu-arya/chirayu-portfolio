"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  baseSize: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: 0 | 1 | 2;
  r: number;
  g: number;
  b: number;
  glowColorIdx: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tailLength: number;
  startTime: number;
  duration: number;
}

// Gyroscope / mouse parallax multipliers (mobile only)
const PARALLAX = [0.007, 0.017, 0.036];
// Scroll parallax multipliers per layer (desktop) — far moves least, near moves most
const SCROLL_PARALLAX = [0.03, 0.08, 0.18];
const COUNTS = [220, 140, 60];
const COUNTS_TOUCH = [80, 50, 20];

const STAR_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [232, 240, 254],
  [199, 210, 254],
  [221, 214, 254],
  [240, 249, 255],
];

const GLOW_RGB: [number, number, number][] = [
  [139, 92, 246],
  [37, 99, 235],
  [167, 139, 250],
];

const GLOW_RADIUS = 148;
const FADE_START = 0.56;
const FADE_END = 0.88;

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  // Gyroscope parallax offset (mobile only) — { x, y } from device orientation
  const parallaxRef = useRef({ x: 0, y: 0 });
  // Absolute mouse position for proximity glow (desktop only)
  const mouseAbsRef = useRef({ x: -99999, y: -99999 });
  // Scroll position for desktop parallax
  const scrollRef = useRef(0);

  const shootingRef = useRef<ShootingStar | null>(null);
  const nextShootRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback((w: number, h: number, counts = COUNTS) => {
    const stars: Star[] = [];
    counts.forEach((count, layer) => {
      const [sizeMin, sizeMax] =
        layer === 0 ? [0.3, 0.8] : layer === 1 ? [0.6, 1.25] : [0.9, 2.0];
      for (let i = 0; i < count; i++) {
        const [r, g, b] = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseSize: sizeMin + Math.random() * (sizeMax - sizeMin),
          baseOpacity: 0.2 + Math.random() * 0.75,
          twinkleSpeed: 0.2 + Math.random() * 1.1,
          twinklePhase: Math.random() * Math.PI * 2,
          layer: layer as 0 | 1 | 2,
          r, g, b,
          glowColorIdx: Math.floor(Math.random() * GLOW_RGB.length),
        });
      }
    });
    starsRef.current = stars;
    sizeRef.current = { w, h };
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      "ontouchstart" in window;

    const resize = () => {
      const el = canvas.parentElement;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(w, h, isTouch ? COUNTS_TOUCH : COUNTS);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ── Desktop: mouse drives proximity glow only (no parallax) ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseAbsRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // ── Desktop: scroll drives parallax ──
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Mobile: gyroscope drives parallax ──
    // beta (~45-90 when held upright), gamma (-90 to 90 side tilt)
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      parallaxRef.current = {
        x: e.gamma * 10,         // ~10px per degree of left/right tilt
        y: (e.beta - 45) * 7,    // centered around natural ~45° upright hold
      };
    };

    let cleanupOrientation = () => {};

    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    } else {
      const attachOrientation = () => {
        window.addEventListener("deviceorientation", onOrientation, { passive: true });
        cleanupOrientation = () =>
          window.removeEventListener("deviceorientation", onOrientation);
      };

      // iOS 13+ requires permission from a user gesture
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          .requestPermission === "function"
      ) {
        const requestPerm = () => {
          (
            DeviceOrientationEvent as unknown as {
              requestPermission: () => Promise<string>;
            }
          )
            .requestPermission()
            .then((result) => {
              if (result === "granted") attachOrientation();
            })
            .catch(() => {});
        };
        window.addEventListener("touchstart", requestPerm, { once: true });
        cleanupOrientation = () =>
          window.removeEventListener("touchstart", requestPerm);
      } else {
        // Android / iOS ≤12 — no permission needed
        attachOrientation();
      }
    }

    nextShootRef.current = performance.now() + 10000 + Math.random() * 2000;

    const spawnShootingStar = (now: number, w: number, h: number) => {
      const angleDeg = 10 + Math.random() * 25;
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = 480 + Math.random() * 320;
      shootingRef.current = {
        x: Math.random() * w,
        y: Math.random() * h * 0.5,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed,
        tailLength: 80 + Math.random() * 110,
        startTime: now,
        duration: 0.55 + Math.random() * 0.45,
      };
      nextShootRef.current = now + 10000 + Math.random() * 2000;
    };

    const draw = (now: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) { rafRef.current = requestAnimationFrame(draw); return; }

      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // Mobile gyroscope offsets (clamped)
      const gyroDx = Math.max(-80, Math.min(80, parallaxRef.current.x));
      const gyroDy = Math.max(-50, Math.min(50, parallaxRef.current.y));

      // ── Stars ──
      starsRef.current.forEach(star => {
        // Desktop: x stays fixed, y shifts with scroll (near stars move more)
        // Mobile: x+y shift with gyroscope
        const sx = isMobile
          ? star.x + PARALLAX[star.layer] * gyroDx
          : star.x;
        const sy = isMobile
          ? star.y + PARALLAX[star.layer] * gyroDy
          : star.y - SCROLL_PARALLAX[star.layer] * scrollRef.current;

        if (sy / h >= FADE_END) return;

        const twinkle = 0.55 + 0.45 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);

        const dx = sx - mouseAbsRef.current.x;
        const dy = sy - mouseAbsRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = dist < GLOW_RADIUS ? Math.pow(1 - dist / GLOW_RADIUS, 1.6) : 0;

        const alpha = Math.min(1, star.baseOpacity * twinkle + prox * 0.35);
        const radius = star.baseSize * (1 + prox * 0.9);

        ctx.save();
        if (prox > 0.04) {
          const [gr, gg, gb] = GLOW_RGB[star.glowColorIdx];
          ctx.shadowBlur = 4 + prox * 22;
          ctx.shadowColor = `rgba(${gr},${gg},${gb},${Math.min(1, prox * 1.1).toFixed(2)})`;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${star.r},${star.g},${star.b})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Shooting star (desktop only) ──
      if (!isTouch && now >= nextShootRef.current && !shootingRef.current) {
        spawnShootingStar(now, w, h);
      }

      if (shootingRef.current) {
        const ss = shootingRef.current;
        const age = (now - ss.startTime) / 1000;
        const progress = age / ss.duration;

        if (progress >= 1) {
          shootingRef.current = null;
        } else {
          const headX = ss.x + ss.vx * age;
          const headY = ss.y + ss.vy * age;
          const speed = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
          const nx = ss.vx / speed;
          const ny = ss.vy / speed;
          const currentTail = Math.min(ss.tailLength, ss.tailLength * progress * 4);
          const tailX = headX - nx * currentTail;
          const tailY = headY - ny * currentTail;

          const alpha =
            progress < 0.18 ? progress / 0.18 : progress > 0.75 ? (1 - progress) / 0.25 : 1;

          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(0.55, `rgba(200,220,255,${(alpha * 0.45).toFixed(2)})`);
          grad.addColorStop(1, `rgba(255,255,255,${(alpha * 0.95).toFixed(2)})`);

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8 + alpha;
          ctx.lineCap = "round";
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(200,220,255,${(alpha * 0.85).toFixed(2)})`;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── Vertical fade mask ──
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      const fadeGrad = ctx.createLinearGradient(0, h * FADE_START, 0, h * FADE_END);
      fadeGrad.addColorStop(0, "rgba(0,0,0,0)");
      fadeGrad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cleanupOrientation();
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
