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

// Parallax multipliers per layer (far → near)
const PARALLAX = [0.007, 0.017, 0.036];
// Star counts per layer
const COUNTS = [130, 85, 35];

// Base star colours: white, blue-white, soft purple-white
const STAR_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [232, 240, 254],
  [199, 210, 254],
  [221, 214, 254],
  [240, 249, 255],
];

// Cursor proximity glow palette: purple, blue, lavender
const GLOW_RGB: [number, number, number][] = [
  [139, 92, 246],
  [37, 99, 235],
  [167, 139, 250],
];

const GLOW_RADIUS = 148;
const FADE_START = 0.56; // canvas fraction where stars start fading out
const FADE_END = 0.88;   // canvas fraction where stars are fully gone

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const shootingRef = useRef<ShootingStar | null>(null);
  const nextShootRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    COUNTS.forEach((count, layer) => {
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const el = canvas.parentElement;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Schedule first shooting star (10-12s)
    nextShootRef.current = performance.now() + 10000 + Math.random() * 2000;

    const spawnShootingStar = (now: number, w: number, h: number) => {
      // Angle: mostly rightward, 10-35 degrees downward
      const angleDeg = 10 + Math.random() * 25;
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = 480 + Math.random() * 320;
      // Start anywhere in the upper 55% of the canvas
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

      const cx = w / 2;
      const cy = h / 2;
      const mdx = mouseRef.current.x - cx;
      const mdy = mouseRef.current.y - cy;

      // ── Stars ──
      starsRef.current.forEach(star => {
        // Parallax shift (clamp to avoid excessive offsets on huge screens)
        const sx = star.x + Math.max(-60, Math.min(60, PARALLAX[star.layer] * mdx));
        const sy = star.y + Math.max(-40, Math.min(40, PARALLAX[star.layer] * mdy));

        // Skip stars fully below fade zone
        if (sy / h >= FADE_END) return;

        // Twinkle (sine breathing)
        const twinkle = 0.55 + 0.45 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);

        // Cursor proximity
        const dx = sx - mouseRef.current.x;
        const dy = sy - mouseRef.current.y;
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

      // ── Shooting star ──
      if (now >= nextShootRef.current && !shootingRef.current) {
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
          // Tail grows in then holds full length
          const currentTail = Math.min(ss.tailLength, ss.tailLength * progress * 4);
          const tailX = headX - nx * currentTail;
          const tailY = headY - ny * currentTail;

          // Alpha: fade in 0→0.18, full 0.18→0.75, fade out 0.75→1
          const alpha =
            progress < 0.18
              ? progress / 0.18
              : progress > 0.75
              ? (1 - progress) / 0.25
              : 1;

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
      // Erases everything below FADE_START, fully gone by FADE_END
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
