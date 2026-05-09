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

const TOPICS = [
  "Marketing",
  "Design",
  "International Student Life",
  "Visa",
  "Travel",
  "Virtual Photography",
  "Gaming",
  "Music",
];

const SECTIONS: { num: string; name: string; desc: string; icon: React.ReactNode }[] = [
  {
    num: "01",
    name: "The Lead",
    desc: "The main piece of every issue. One subject, examined honestly, with the time and care it actually deserves. A career lesson learned the hard way, an observation about industries shifting under your feet, or a reframe on something you've been told a hundred times that turns out to be wrong. 400 to 600 words. Always opinionated, never preachy.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
  },
  {
    num: "02",
    name: "Building",
    desc: "Behind the curtain of something built, broken, or rebuilt. A design choice that took longer than it should have, a project that failed in an interesting way, a small tool I made because nothing existed for the job. The real texture of making things, not the LinkedIn version where everything goes to plan.",
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

// ── Topic pill ───────────────────────────────────────────────────────────────

function PillItem({
  label,
  index,
  inView,
}: {
  label: string;
  index: number;
  inView: boolean;
}) {
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: 0.6 + index * 0.04 }}
      onAnimationComplete={() => setEntered(true)}
      whileHover={{ y: -3 }}
      className="rounded-full text-sm font-medium"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#f5f5f7",
        padding: "10px 20px",
        cursor: "default",
        transition: entered
          ? "background 0.18s ease, border-color 0.18s ease"
          : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(220,20,60,0.12)";
        e.currentTarget.style.borderColor = "rgba(220,20,60,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {label}
    </motion.div>
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
      className="relative py-24 sm:py-32 px-8 sm:px-14 lg:px-20"
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
              placeholder="you@email.com"
              disabled={status === "loading"}
              className="flex-1 px-5 py-3.5 rounded-full text-sm sm:text-base outline-none transition-colors duration-200 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f5f5f7",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(220,20,60,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
              style={{ background: "#dc143c", color: "#f5f5f7" }}
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
  const insideRef = useRef<HTMLDivElement>(null);
  const issuesRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-8%" });
  const insideInView = useInView(insideRef, { once: true, margin: "-8%" });
  const issuesInView = useInView(issuesRef, { once: true, margin: "-8%" });

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);

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
      <Nav />
      <PageBlobs palette="crimson" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-28 sm:pt-32 lg:pt-36 pb-28 sm:pb-36 px-8 sm:px-14 lg:px-20"
      >
        {/* StarField — twinkling stars overlay (hero-scoped) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <StarField />
        </div>

        {/* Eyebrow — centered */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs tracking-[0.22em] uppercase font-medium text-center"
          style={{ color: "#86868b" }}
        >
          Newsletter by Chirayu Arya
        </motion.p>

        {/* "Unscripted" — Rockybilly, full-width fluid, centered */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="mt-28 sm:mt-36 lg:mt-48 text-center select-none"
          style={{
            fontFamily: "var(--font-rockybilly)",
            color: "#f5f5f7",
            fontSize: "clamp(3rem, 13vw, 13.5rem)",
            lineHeight: 1.1,
            paddingBottom: "0.08em",
          }}
        >
          Unscripted
        </motion.h1>

        {/* Subscribe + socials block — centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
          className="mt-12 sm:mt-14 lg:mt-16 flex flex-col items-center gap-8"
        >
          <SubscribeForm />

          <div className="flex justify-center pt-2">
            <SocialIcons />
          </div>
        </motion.div>

        {/* Premise — headline + multi-paragraph body, left-aligned */}
        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="mt-20 sm:mt-24 lg:mt-28 font-black tracking-tight leading-[0.92] whitespace-normal lg:whitespace-nowrap"
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
          A biweekly letter for students, job seekers, and purpose seekers figuring it out without one.
        </motion.p>

        <div className="mt-20 sm:mt-24 lg:mt-28 flex flex-col gap-5 sm:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            You came here with a plan, the kind that fits neatly on a single page. <strong style={{ fontWeight: 700 }}>A degree, a visa, a city, a timeline</strong> that promised everything would fall into place if you just kept moving. Then reality showed up uninvited. The job market shifted under your feet, the political climate turned colder than the brochures had suggested, and the internship that was supposed to anchor your year fell through in a single polite email. Slowly, almost without you noticing, the plan stopped being the plan.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            Most of what gets written for people in your shoes is aspirational to the point of being useless. The same recycled lines on a loop, dressed up in different fonts: <strong style={{ fontWeight: 700 }}>&ldquo;follow your passion,&rdquo; &ldquo;network more,&rdquo; &ldquo;trust the journey.&rdquo;</strong> Written by people who haven&rsquo;t sat with real uncertainty in years, who&rsquo;ve forgotten what it actually feels like to not know what comes next, and who confuse motivational reassurance with something useful.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            Unscripted is different because it&rsquo;s written from inside the same fog. <strong style={{ fontWeight: 700 }}>Nine roles across five industries</strong> before most students have wrapped their first internship, ranging from construction SaaS to HR tech, from crypto and Web3 to environmental software, and a UNESCO initiative that almost didn&rsquo;t happen. Not a tidy set of lessons polished for a LinkedIn carousel, but the actual texture of figuring it out while it&rsquo;s still being figured out. Not advice from someone who has arrived. <strong style={{ fontWeight: 700 }}>Perspective</strong> from someone still walking.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 1.05 }}
            className="text-base sm:text-lg lg:text-xl leading-relaxed"
            style={{ color: "#f5f5f7", textWrap: "pretty" }}
          >
            This is a biweekly letter for the path nobody handed you a map for. No playbook, because there isn&rsquo;t one to hand out. No filler, because your inbox is already full enough. Just the things worth saying when there&rsquo;s finally something honest worth saying, and a small reminder that the version of you who figures it out is closer than it feels right now.
          </motion.p>
        </div>
      </section>

      {/* ── What's Inside ────────────────────────────────────────────────── */}
      <section
        ref={insideRef}
        className="relative py-24 sm:py-32 px-8 sm:px-14 lg:px-20"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              animate={insideInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-6 sm:p-7 flex flex-col"
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
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(220,20,60,0.1)",
                    border: "1px solid rgba(220,20,60,0.25)",
                    color: "rgba(245,80,110,1)",
                  }}
                >
                  {s.icon}
                </div>
                <span
                  className="text-xs tracking-[0.22em] font-medium pt-1"
                  style={{ color: "#515154" }}
                >
                  {s.num}
                </span>
              </div>
              <h3
                className="text-lg sm:text-xl font-bold mb-2.5"
                style={{ color: "#f5f5f7" }}
              >
                {s.name}
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "#86868b", textWrap: "pretty" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Topic pills */}
        <div
          className="mt-16 sm:mt-20 pt-12 sm:pt-14"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={insideInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium text-center mb-8"
            style={{ color: "#86868b" }}
          >
            Things we&rsquo;ll talk about
          </motion.p>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {TOPICS.map((label, i) => (
              <PillItem
                key={label}
                label={label}
                index={i}
                inView={insideInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscriber counter ───────────────────────────────────────────── */}
      <SubscriberCounter />

      {/* ── Latest Issues ────────────────────────────────────────────────── */}
      <section
        ref={issuesRef}
        className="relative py-24 sm:py-32 px-8 sm:px-14 lg:px-20"
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
