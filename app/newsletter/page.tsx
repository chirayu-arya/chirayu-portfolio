"use client";

import Nav from "../components/Nav";
import SocialIcons from "../components/SocialIcons";
import StarField from "../components/StarField";
import PageBlobs from "../components/PageBlobs";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, FormEvent } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  status: string;
  publish_date: number;
  web_url: string;
  thumbnail_url?: string;
  preview_text?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ── Issue sections ───────────────────────────────────────────────────────────

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ── "Break the cycle" — cluster of clichés we're done with ──────────────────
// Each entry is a fragment of generic advice positioned absolutely behind the
// section headline. Varying blur / opacity / size / rotation create a depth
// effect, like reading clearly through a fog of recycled platitudes.
const CYCLE_QUOTES: {
  text: string;
  top: string;
  left: string;
  rot: number;
  size: string;
  blur: number;
  opacity: number;
  weight: number;
  color: string;
  mobile: boolean;
}[] = [
  { text: '"Follow your passion."', top: "14%", left: "6%", rot: -5, size: "clamp(1.3rem, 2.4vw, 2.2rem)", blur: 3, opacity: 0.34, weight: 600, color: "#f5f5f7", mobile: true },
  { text: '"Just network more."', top: "8%", left: "52%", rot: 3, size: "clamp(1.4rem, 2.6vw, 2.4rem)", blur: 1, opacity: 0.50, weight: 700, color: "#f5f5f7", mobile: true },
  { text: '"Trust the journey."', top: "18%", left: "76%", rot: -4, size: "clamp(1rem, 1.8vw, 1.6rem)", blur: 6, opacity: 0.26, weight: 400, color: "#f5f5f7", mobile: false },
  { text: '"Keep grinding."', top: "38%", left: "3%", rot: 4, size: "clamp(1.4rem, 2.8vw, 2.6rem)", blur: 1, opacity: 0.52, weight: 700, color: "rgba(245,140,160,1)", mobile: true },
  { text: '"Manifest it."', top: "36%", left: "82%", rot: -3, size: "clamp(1.2rem, 2.2vw, 2rem)", blur: 4, opacity: 0.32, weight: 500, color: "#f5f5f7", mobile: false },
  { text: '"Build your personal brand."', top: "22%", left: "28%", rot: 2, size: "clamp(0.9rem, 1.6vw, 1.4rem)", blur: 7, opacity: 0.24, weight: 400, color: "#f5f5f7", mobile: false },
  { text: '"Stay positive."', top: "60%", left: "86%", rot: 5, size: "clamp(1rem, 1.7vw, 1.5rem)", blur: 5, opacity: 0.30, weight: 500, color: "#f5f5f7", mobile: false },
  { text: '"Everything happens for a reason."', top: "76%", left: "38%", rot: -2, size: "clamp(1.1rem, 2vw, 1.9rem)", blur: 2, opacity: 0.42, weight: 600, color: "#f5f5f7", mobile: true },
  { text: '"Get out of your comfort zone."', top: "82%", left: "5%", rot: 5, size: "clamp(1.1rem, 2vw, 1.9rem)", blur: 1, opacity: 0.46, weight: 600, color: "#f5f5f7", mobile: true },
  { text: '"Just put yourself out there."', top: "86%", left: "60%", rot: -4, size: "clamp(1rem, 1.9vw, 1.7rem)", blur: 3, opacity: 0.36, weight: 500, color: "rgba(245,140,160,1)", mobile: true },
  { text: '"What’s meant for you won’t pass you."', top: "52%", left: "10%", rot: 3, size: "clamp(0.9rem, 1.5vw, 1.3rem)", blur: 8, opacity: 0.22, weight: 400, color: "#f5f5f7", mobile: false },
  { text: '"Just be yourself."', top: "66%", left: "22%", rot: -6, size: "clamp(1rem, 1.7vw, 1.5rem)", blur: 5, opacity: 0.28, weight: 500, color: "#f5f5f7", mobile: false },
];

type Section = { name: string; desc: string; icon: React.ReactNode };

const ROW_1: Section[] = [
  {
    name: "The Lead",
    desc: "The main piece of every issue. One subject, examined honestly, with the time it actually deserves.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
  },
  {
    name: "The Reframe",
    desc: "Common advice torn down. What's wrong with it, and what to think instead.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 12a9 9 0 0 1 15.5-6.36L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15.5 6.36L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
  },
  {
    name: "Field Notes",
    desc: "Stories from inside the mess. The internship that fell through. The pivot that actually worked.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    name: "Office Hours",
    desc: "Real reader questions answered honestly. Visa, jobs, offers, the right time to quit.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const ROW_2: Section[] = [
  {
    name: "Cultural Translation",
    desc: "The unwritten rules nobody explains. Email culture, how networking really works, what your manager actually means.",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: "The Sharpener",
    desc: "One concrete tool or framework. Cold emails, salary negotiation on OPT, asking for a raise without overthinking it.",
    icon: (
      <svg {...ICON_PROPS}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "Permission Slip",
    desc: "One thing you're allowed to stop doing, feeling, or worrying about this week.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    name: "Building",
    desc: "Behind the curtain of something I shipped or rebuilt. The design choices, the failures, what actually worked.",
    icon: (
      <svg {...ICON_PROPS}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Section card (used in the "What's Inside" marquee rows) ─────────────────

function SectionCard({ name, desc, icon }: Section) {
  return (
    <div
      className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl p-5 sm:p-6 mr-4 sm:mr-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.22s ease, background 0.22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(220,20,60,0.3)";
        e.currentTarget.style.background = "rgba(220,20,60,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(220,20,60,0.1)",
          border: "1px solid rgba(220,20,60,0.25)",
          color: "rgba(245,80,110,1)",
        }}
      >
        {icon}
      </div>
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: "#f5f5f7" }}
      >
        {name}
      </h3>
      <p
        className="text-sm leading-snug"
        style={{ color: "#86868b", textWrap: "pretty" }}
      >
        {desc}
      </p>
    </div>
  );
}

// ── Subscriber counter ───────────────────────────────────────────────────────

function SubscriberCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [target, setTarget] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/newsletter/stats")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setTarget(typeof d?.count === "number" ? d.count : 0);
      })
      .catch(() => {
        if (cancelled) return;
        setTarget(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!inView || target === null) return;
    const startTime = performance.now();
    const duration = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 px-8 sm:px-14 lg:px-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="text-center"
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium mb-8"
          style={{ color: "#86868b" }}
        >
          The Crew
        </p>
        <p
          className="font-black tracking-tight leading-none"
          style={{
            fontSize: "clamp(4.5rem, 14vw, 11rem)",
            color: "#f5f5f7",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {target === null ? "—" : display.toLocaleString()}
        </p>
        <p
          className="mt-6 sm:mt-7 text-sm sm:text-base tracking-[0.18em] uppercase font-medium"
          style={{ color: "rgba(220,20,60,0.9)" }}
        >
          Subscribers and counting
        </p>
      </motion.div>
    </section>
  );
}

// ── Subscribe form ────────────────────────────────────────────────────────────

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="rounded-2xl px-6 py-6"
            style={{
              background: "rgba(220,20,60,0.08)",
              border: "1px solid rgba(220,20,60,0.35)",
            }}
          >
            <p className="text-base sm:text-lg font-semibold mb-1" style={{ color: "#f5f5f7" }}>
              You're in.
            </p>
            <p className="text-sm" style={{ color: "#86868b" }}>
              Check your inbox for the welcome note. Issue #001 drops soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Drop your email here..."
              disabled={status === "loading"}
              className="flex-1 px-5 py-3.5 rounded-full text-sm sm:text-base outline-none transition-colors duration-200 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f5f5f7",
                backdropFilter: "blur(34px)",
                WebkitBackdropFilter: "blur(34px)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(220,20,60,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
              style={{ background: "#a00d28", color: "#ffffff" }}
            >
              {status === "loading" ? "Subscribing" : "Subscribe"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 text-sm"
            style={{ color: "rgba(220,80,100,0.95)" }}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <p
        className="mt-4 text-xs sm:text-sm text-center"
        style={{ color: "#86868b" }}
      >
        Biweekly. No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsletterPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const breakRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);
  const issuesRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-8%" });
  const breakInView = useInView(breakRef, { once: true, margin: "-15%" });
  const insideInView = useInView(insideRef, { once: true, margin: "-8%" });
  const issuesInView = useInView(issuesRef, { once: true, margin: "-8%" });

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/newsletter/posts")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setPosts(Array.isArray(d?.posts) ? d.posts : []);
        setPostsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setPostsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Cinematic black overlay — lifts on load */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{ zIndex: 999 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: "easeInOut" }}
      />

      <Nav />
      <PageBlobs palette="crimson" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative px-8 sm:px-14 lg:px-20"
      >
        {/* StarField — twinkling stars overlay (hero-scoped) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <StarField />
        </div>

        {/* CTA block — fills full viewport height */}
        <div className="min-h-[100svh] flex flex-col justify-center pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12">
          {/* Eyebrow — centered */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
            className="text-xs tracking-[0.22em] uppercase font-medium text-center"
            style={{ color: "#86868b" }}
          >
            Newsletter by Chirayu Arya
          </motion.p>

          {/* "Unscripted" — Rockybilly, full-width fluid, centered */}
          <motion.h1
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 }}
            transition={{ duration: 1.4, ease: EASE, delay: 1.4 }}
            className="mt-24 sm:mt-32 lg:mt-44 text-center select-none"
            style={{
              fontFamily: "var(--font-rockybilly)",
              color: "#f5f5f7",
              fontSize: "clamp(1.5rem, calc(12.5vw - 0.5rem), 12.5rem)",
              lineHeight: 1.1,
              paddingBottom: "0.08em",
            }}
          >
            Unscripted
          </motion.h1>

          {/* Subscribe + socials block — centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, ease: EASE, delay: 2.4 }}
            className="mt-20 sm:mt-24 lg:mt-20 flex flex-col items-center gap-12 sm:gap-14 lg:gap-10"
          >
            <SubscribeForm />

            <div className="flex justify-center pt-2">
              <SocialIcons />
            </div>
          </motion.div>
        </div>

        {/* Premise — headline + multi-paragraph body, left-aligned */}
        <div className="pt-14 sm:pt-20 lg:pt-24 pb-10 sm:pb-20 lg:pb-24">
          <motion.h2
            initial={{ opacity: 0, x: -60 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
            className="font-black tracking-tight leading-[0.92] whitespace-normal lg:whitespace-nowrap"
            style={{
              fontSize: "clamp(3rem, 7vw, 7rem)",
              color: "#f5f5f7",
            }}
          >
            No one handed us a script.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="mt-6 sm:mt-7 text-base sm:text-lg lg:text-xl"
            style={{ color: "#86868b", textWrap: "pretty" }}
          >
            For students, job seekers, and purpose seekers figuring it out&hellip;
          </motion.p>

          <div className="mt-6 sm:mt-10 lg:mt-14 flex flex-col gap-5 sm:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            You came here with a plan. <strong style={{ fontWeight: 700 }}>A degree, a visa, a city, a timeline</strong> that promised the next thing if you just kept moving. Then the market shifted, the political climate turned, and the internship that was supposed to anchor your year disappeared in a polite email. The plan stopped being the plan, and nobody handed you the next one.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            Most of what gets written for people in your shoes is useless. The same lines, recycled on a loop: <strong style={{ fontWeight: 700 }}>&ldquo;follow your passion,&rdquo; &ldquo;network more,&rdquo; &ldquo;trust the journey.&rdquo;</strong> Written by people who haven&rsquo;t sat with real uncertainty in years, who confuse comfort with help.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            Unscripted is different. It&rsquo;s written from inside the same fog, by someone still inside it. Not advice from someone who arrived. <strong style={{ fontWeight: 700 }}>Perspective</strong> from someone still walking.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 1.05 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            This is a newsletter for the path nobody mapped. No playbook, because there isn&rsquo;t one. No filler, because your inbox is already full. Just the things worth saying, and a quiet reminder that the version of you who figures this out is closer than it feels.
          </motion.p>
        </div>
        </div>
      </section>

      {/* ── Break the cycle — fog of clichés with focal headline ─────────── */}
      <section
        ref={breakRef}
        className="relative min-h-[80vh] flex items-center justify-center px-8 sm:px-14 lg:px-20 py-24 sm:py-32 overflow-hidden"
      >
        {/* Cloud of cliché quotes — scattered, layered, blurred for depth */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {CYCLE_QUOTES.map((q, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={breakInView ? { opacity: q.opacity, y: 0 } : {}}
              transition={{
                duration: 1,
                ease: EASE,
                delay: 0.15 + (i % 4) * 0.08,
              }}
              className={`absolute whitespace-nowrap ${q.mobile ? "" : "hidden sm:block"}`}
              style={{
                top: q.top,
                left: q.left,
                fontSize: q.size,
                fontWeight: q.weight,
                color: q.color,
                filter: `blur(${q.blur}px)`,
                transform: `rotate(${q.rot}deg)`,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {q.text}
            </motion.span>
          ))}
        </div>

        {/* Focal headline + subheadline */}
        <div className="relative text-center" style={{ zIndex: 2 }}>
          <motion.h2
            initial={{ opacity: 0, scale: 0.94 }}
            animate={breakInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="font-black tracking-tight leading-none"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: "#f5f5f7",
              letterSpacing: "-0.02em",
            }}
          >
            Break the cycle.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={breakInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl font-medium leading-snug whitespace-normal sm:whitespace-nowrap"
            style={{ color: "#c5c5c8" }}
          >
            You don&rsquo;t need more motivation. You need a different conversation.
          </motion.p>
        </div>
      </section>

      {/* ── What's Inside ────────────────────────────────────────────────── */}
      <section
        ref={insideRef}
        className="relative py-16 sm:py-20 px-8 sm:px-14 lg:px-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={insideInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
          style={{ color: "#86868b" }}
        >
          What's Inside
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          animate={insideInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="font-black tracking-tight leading-[0.92] mb-16 sm:mb-20"
          style={{
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            color: "#f5f5f7",
            textWrap: "balance",
          }}
        >
          What's in every issue.
        </motion.h2>

        {/* Two looped marquee rows scrolling in opposite directions.
            Each row's content is duplicated so the translate(-50%) loop
            stays seamless. Hovering a row pauses its animation. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={insideInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="flex flex-col gap-4 sm:gap-5"
        >
          {/* Row 1 — scrolls left. No flex gap: each SectionCard has its
              own mr-* so the trailing gap is identical at every position
              (including after the last card), which keeps the -50% loop
              seamless. */}
          <div className="overflow-hidden">
            <div
              className="flex animate-marquee hover:[animation-play-state:paused]"
              style={{
                width: "max-content",
                animationDuration: "55s",
                willChange: "transform",
              }}
            >
              {[...ROW_1, ...ROW_1].map((s, i) => (
                <SectionCard key={`r1-${i}`} {...s} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right (reverse) */}
          <div className="overflow-hidden">
            <div
              className="flex animate-marquee hover:[animation-play-state:paused]"
              style={{
                width: "max-content",
                animationDuration: "60s",
                animationDirection: "reverse",
                willChange: "transform",
              }}
            >
              {[...ROW_2, ...ROW_2].map((s, i) => (
                <SectionCard key={`r2-${i}`} {...s} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Subscriber counter ───────────────────────────────────────────── */}
      <SubscriberCounter />

      {/* ── Latest Issues ────────────────────────────────────────────────── */}
      <section
        ref={issuesRef}
        className="relative py-16 sm:py-20 px-8 sm:px-14 lg:px-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={issuesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
          style={{ color: "#86868b" }}
        >
          Latest Issues
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          animate={issuesInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="font-black tracking-tight leading-[0.92] mb-16 sm:mb-20"
          style={{
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            color: "#f5f5f7",
            textWrap: "balance",
          }}
        >
          From the archive.
        </motion.h2>

        {!postsLoaded ? (
          <div className="h-40" />
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={issuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="rounded-2xl px-8 py-14 sm:py-20 text-center max-w-2xl mx-auto"
            style={{
              background: "rgba(220,20,60,0.05)",
              border: "1px solid rgba(220,20,60,0.22)",
            }}
          >
            <p
              className="text-xs tracking-[0.22em] uppercase font-medium mb-4"
              style={{ color: "rgba(220,20,60,0.85)" }}
            >
              Coming Soon
            </p>
            <p
              className="text-xl sm:text-2xl font-semibold leading-snug mb-3"
              style={{ color: "#f5f5f7", textWrap: "balance" }}
            >
              Issue #001 drops soon.
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
              style={{ color: "#86868b", textWrap: "pretty" }}
            >
              Subscribe above to get it the moment it lands. Past issues will live here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.web_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={issuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -6 }}
                className="block rounded-2xl p-6 sm:p-7 cursor-pointer transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-xs tracking-[0.18em] uppercase font-medium mb-4"
                  style={{ color: "#515154" }}
                >
                  {formatDate(p.publish_date)}
                </p>
                <h3
                  className="text-lg sm:text-xl font-bold leading-snug mb-3"
                  style={{ color: "#f5f5f7", textWrap: "balance" }}
                >
                  {p.title}
                </h3>
                {p.preview_text && (
                  <p
                    className="text-sm leading-relaxed mb-5 line-clamp-3"
                    style={{ color: "#86868b", textWrap: "pretty" }}
                  >
                    {p.preview_text}
                  </p>
                )}
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: "rgba(220,20,60,0.95)" }}
                >
                  Read issue
                  <span aria-hidden>→</span>
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </section>

      <div className="h-24" />
    </main>
  );
}
