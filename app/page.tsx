"use client";

import AppleNav from "./components/AppleNav";
import AppleFooter from "./components/AppleFooter";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Light Apple palette ──
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

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;

// ── Hero — Apple name + tagline ──
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-8"
      style={{ background: C.page, fontFamily: SF }}
    >
      <div className="relative" style={{ maxWidth: "96rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-8"
          style={{ color: C.ink3 }}
        >
          Portfolio · 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="font-semibold"
          style={{
            fontSize: "clamp(3rem, 9vw, 9rem)",
            color: C.ink,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            margin: 0,
          }}
        >
          Chirayu Arya.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.65 }}
          className="mx-auto mt-8"
          style={{
            color: C.ink2,
            fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            maxWidth: "70rem",
            fontWeight: 400,
          }}
        >
          Designer and marketer working at the intersection of craft, product, and growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <a href="#about" style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}>
            See the work <span style={{ marginLeft: 4 }}>›</span>
          </a>
          <a href="/about" style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}>
            About me <span style={{ marginLeft: 4 }}>›</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.0, delay: 1.6 }}
        className="absolute bottom-10"
        style={{ color: C.ink3, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}
      >
        Scroll
      </motion.div>
    </section>
  );
}

// ── StoryTile — the Apple section pattern: eyebrow → headline → supporting → blue link → visual ──
function StoryTile({
  id,
  eyebrow,
  headline,
  supporting,
  linkLabel,
  linkHref,
  linkTarget,
  bg,
  ink,
  ink2,
  visual,
  align = "center",
  minHeight = "min-h-screen",
}: {
  id?: string;
  eyebrow: string;
  headline: React.ReactNode;
  supporting?: string;
  linkLabel?: string;
  linkHref?: string;
  linkTarget?: string;
  bg: string;
  ink: string;
  ink2: string;
  visual?: React.ReactNode;
  align?: "center" | "left";
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${minHeight} flex flex-col`}
      style={{ background: bg, fontFamily: SF }}
    >
      <div
        className={`flex flex-col ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        } justify-start px-8 sm:px-14 lg:px-20 pt-28 pb-10`}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-6"
          style={{ color: ink2 }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.08 }}
          className="font-semibold"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 6rem)",
            color: ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            maxWidth: align === "center" ? "72rem" : "62rem",
          }}
        >
          {headline}
        </motion.h2>

        {supporting && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-5"
            style={{
              color: ink2,
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              maxWidth: "58rem",
              fontWeight: 400,
            }}
          >
            {supporting}
          </motion.p>
        )}

        {linkLabel && linkHref && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            href={linkHref}
            target={linkTarget}
            rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
            className="mt-7"
            style={{ color: C.link, fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            {linkLabel} <span style={{ marginLeft: 4 }}>›</span>
          </motion.a>
        )}
      </div>

      {visual && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          className="flex-1 w-full flex items-end justify-center"
        >
          {visual}
        </motion.div>
      )}
    </section>
  );
}

// Featured image visual — rounded top, clipped at bottom of tile
function ImageVisual({ src, alt, maxW = "60rem" }: { src: string; alt: string; maxW?: string }) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: maxW,
        margin: "0 auto",
        aspectRatio: "16 / 10",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "18px 18px 0 0",
        background: src ? undefined : C.alt,
      }}
    />
  );
}

function YouTubeVisual({ id, maxW = "60rem" }: { id: string; maxW?: string }) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: maxW,
        margin: "0 auto",
        aspectRatio: "16 / 10",
        borderRadius: "18px 18px 0 0",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: "100%", height: "100%", display: "block", border: "none" }}
      />
    </div>
  );
}

// ── At a Glance stats visual ──
function StatNumber({ value, inView, delay }: { value: string; inView: boolean; delay: number }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", lineHeight: 1, paddingBottom: "0.08em" }}>
      <motion.span
        style={{ display: "block", lineHeight: 1, whiteSpace: "nowrap" }}
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1.0, ease: EASE, delay }}
      >
        {value}
      </motion.span>
    </span>
  );
}

function StatsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const stats = [
    { value: "4+", label: "Years of Experience" },
    { value: "3M+", label: "Members Across Communities" },
    { value: "5M+", label: "Monthly Impressions" },
    { value: "$1.7M", label: "Sales Pipeline Built" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 w-full max-w-7xl mx-auto pt-12 pb-20 px-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div
            className="font-semibold leading-none mb-4"
            style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: C.ink, letterSpacing: "-0.04em" }}
          >
            <StatNumber value={stat.value} inView={inView} delay={0.15 + i * 0.12} />
          </div>
          <p className="text-xs uppercase tracking-[0.16em] font-medium" style={{ color: C.ink3 }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Polaroid scatter (only old-visual kept per request) ──
const VP = "/Gallery/Photography/Virtual%20Photography";
const RP = "/Gallery/Photography/Real%20Photography";

const POLAROIDS = [
  { id: 1, src: `${VP}/Expedition%2033/Gustave%20%26%20Sophie%20-%20Chirayu%20Arya.jpg`, rotation: -14, left: "0%",  top: "2%",  fromX: -900, z: 2, w: "22vw", delay: 0 },
  { id: 2, src: `${VP}/Ghost%20of%20Yotei/IMG_8852.JPG`,                                  rotation: 9,   left: "24%", top: "-3%", fromX: 900,  z: 3, w: "21vw", delay: 0.07 },
  { id: 3, src: `${VP}/Spider%20Man%202/IMG_7733.JPG`,                                    rotation: -5,  left: "48%", top: "4%",  fromX: -900, z: 2, w: "22vw", delay: 0.14 },
  { id: 4, src: `${VP}/Avatar/IMG_8200.JPG`,                                              rotation: 17,  left: "72%", top: "-2%", fromX: 900,  z: 1, w: "20vw", delay: 0.04 },
  { id: 5, src: `${RP}/IMG_6865.jpg`,                                                     rotation: -18, left: "3%",  top: "46%", fromX: -900, z: 4, w: "23vw", delay: 0.19 },
  { id: 6, src: `${VP}/Ghost%20of%20Tsushima/IMG_8519.JPG`,                               rotation: 7,   left: "27%", top: "43%", fromX: 900,  z: 3, w: "21vw", delay: 0.11 },
  { id: 7, src: `${VP}/Expedition%2033/IMG_9360.jpg`,                                     rotation: -11, left: "54%", top: "50%", fromX: -900, z: 2, w: "20vw", delay: 0.23 },
  { id: 8, src: `${VP}/Spider%20Man%202/IMG_7743.JPG`,                                    rotation: 13,  left: "76%", top: "45%", fromX: 900,  z: 1, w: "21vw", delay: 0.16 },
];
const MOBILE_ROT = [-8, 5, -12, 9, -4, 14, -7, 11];

function Polaroid({ p, inView }: { p: (typeof POLAROIDS)[0]; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ x: p.fromX, opacity: 0, rotate: p.rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: p.rotation } : {}}
      transition={{ duration: 1.0, ease: EASE, delay: p.delay }}
      whileHover={{ scale: 1.1, rotate: p.rotation * 0.1, zIndex: 50, transition: { duration: 0.28, ease: EASE } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "absolute", left: p.left, top: p.top, zIndex: p.z, width: p.w, cursor: "pointer", willChange: "transform" }}
    >
      <div
        style={{
          background: "#fff",
          padding: "10px 10px 44px 10px",
          filter: hovered
            ? "drop-shadow(0 14px 36px rgba(0,0,0,0.18)) drop-shadow(0 4px 14px rgba(0,0,0,0.10))"
            : "drop-shadow(0 10px 28px rgba(0,0,0,0.14)) drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
          transition: "filter 0.3s ease",
        }}
      >
        <img src={p.src} alt={`Photography ${p.id}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
      </div>
    </motion.div>
  );
}

function MobilePolaroid({ p, rotation, inView, delay }: { p: (typeof POLAROIDS)[0]; rotation: number; inView: boolean; delay: number }) {
  const fromX = rotation > 0 ? 400 : -400;
  return (
    <motion.div
      initial={{ x: fromX, opacity: 0, rotate: rotation }}
      animate={inView ? { x: 0, opacity: 1, rotate: rotation } : {}}
      transition={{ duration: 0.95, ease: EASE, delay }}
      whileHover={{ scale: 1.08, rotate: rotation * 0.1, zIndex: 50, transition: { duration: 0.25 } }}
      style={{ cursor: "pointer", willChange: "transform" }}
    >
      <div
        style={{
          background: "#fff",
          padding: "8px 8px 34px 8px",
          filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.14)) drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
        }}
      >
        <img src={p.src} alt={`Photography ${p.id}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
      </div>
    </motion.div>
  );
}

function PolaroidVisual() {
  const scatterRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const inView = useInView(scatterRef, { once: true, margin: "-5%" });
  const mobileInView = useInView(mobileRef, { once: true, margin: "-5%" });

  return (
    <div className="w-full">
      <div ref={mobileRef} className="md:hidden grid grid-cols-2 gap-6 px-8" style={{ paddingBottom: "2rem" }}>
        {POLAROIDS.map((p, i) => (
          <MobilePolaroid key={p.id} p={p} rotation={MOBILE_ROT[i]} inView={mobileInView} delay={i * 0.07} />
        ))}
      </div>
      <div ref={scatterRef} className="hidden md:block" style={{ position: "relative", height: "54vw" }}>
        {POLAROIDS.map((p) => (
          <Polaroid key={p.id} p={p} inView={inView} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden" style={{ background: C.page, fontFamily: SF }}>
      <AppleNav />
      <Hero />

      {/* About */}
      <StoryTile
        id="about"
        eyebrow="About Me"
        headline={
          <>
            I make things people. <span style={{ color: C.ink2 }}>actually pay attention to.</span>
          </>
        }
        supporting="Designing things that create an impact, and figuring out how to grow them. A few years across startups, communities, newsletters, and campaigns that reached millions."
        linkLabel="More about me"
        linkHref="/about"
        bg={C.page}
        ink={C.ink}
        ink2={C.ink2}
        visual={<ImageVisual src="/chirayu-wide.png" alt="Chirayu Arya" />}
      />

      {/* Featured 1 — Aurora */}
      <StoryTile
        eyebrow="Featured · Times Square Showcase, June 2025"
        headline={
          <>
            Aurora. <span style={{ color: C.ink2 }}>On the billboard in Times Square.</span>
          </>
        }
        supporting="A personal illustration, picked up and shown across the Times Square Showcase in June 2025."
        linkLabel="See the moment"
        linkHref="#"
        bg={C.alt}
        ink={C.ink}
        ink2={C.ink2}
        visual={<ImageVisual src="/TS-feature-1.png" alt="Aurora at Times Square" />}
      />

      {/* Featured 2 — Web3 at Duke */}
      <StoryTile
        eyebrow="Featured · Fuqua MMS Blogs, April 2023"
        headline={
          <>
            Becoming a leader in Web3 at Duke.
          </>
        }
        supporting="A reflection on building Web3 conviction during the year at Fuqua, written for the official MMS blog."
        linkLabel="Read the story"
        linkHref="https://blogs.fuqua.duke.edu/duke-mms/2023/04/05/chirayu-arya/becoming-a-leader-in-web3-at-fuqua"
        linkTarget="_blank"
        bg={C.page}
        ink={C.ink}
        ink2={C.ink2}
        visual={<ImageVisual src="/Chirayu-Arya-Becoming-a-Leader-in-Web3-at-Fuqua.png" alt="Becoming a leader in Web3 at Duke" />}
      />

      {/* Featured 3 — Blue Devil Coin */}
      <StoryTile
        eyebrow="Featured · March 2023"
        headline={
          <>
            Blue Devil Coin. <span style={{ color: C.ink2 }}>A Duke crypto project.</span>
          </>
        }
        supporting="Concepting and producing the launch film for a student-led crypto project at Duke."
        linkLabel="Watch on YouTube"
        linkHref="https://www.youtube.com/watch?v=qDZOsjGx39k"
        linkTarget="_blank"
        bg={C.alt}
        ink={C.ink}
        ink2={C.ink2}
        visual={<YouTubeVisual id="qDZOsjGx39k" />}
      />

      {/* At a Glance + Stats */}
      <StoryTile
        id="work"
        eyebrow="At a Glance"
        headline={
          <>
            Projects that speak <span style={{ color: C.ink2 }}>for themselves.</span>
          </>
        }
        bg={C.page}
        ink={C.ink}
        ink2={C.ink2}
        visual={<StatsVisual />}
        minHeight=""
      />

      {/* Photography */}
      <StoryTile
        id="photography"
        eyebrow="Photography"
        headline={
          <>
            Capturing moments, <span style={{ color: C.ink2 }}>both real &amp; virtual.</span>
          </>
        }
        supporting="Shot on a camera. Or a television. The best shots don't ask which world they're from."
        linkLabel="Gallery Mode"
        linkHref="/gallery"
        bg={C.alt}
        ink={C.ink}
        ink2={C.ink2}
        visual={<PolaroidVisual />}
      />

      <AppleFooter />
    </main>
  );
}
