"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const interests = [
  { label: "Photography", emoji: "📷" },
  { label: "Movies", emoji: "🍿" },
  { label: "Travel", emoji: "✈️" },
  { label: "Music", emoji: "🎵" },
  { label: "Writing", emoji: "✍️" },
  { label: "Fitness", emoji: "🏋️" },
  { label: "Design", emoji: "🎨" },
  { label: "Cooking", emoji: "🍳" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Guitar", emoji: "🎸" },
  { label: "Vibe-coding", emoji: "🧑‍💻" },
];

const logos = ["Logo 1", "Logo 2", "Logo 3", "Logo 4", "Logo 5", "Logo 6", "Logo 7", "Logo 8"];


const experience = [
  {
    year: "2026",
    role: "Marketing Manager",
    company: "SiteMarker",
    dates: "Jan 2026 - Present  |  Charleston, USA",
    description: "Building and scaling marketing systems for a SaaS construction tech platform. Connecting product, sales, and marketing through full-funnel strategies, UX improvements, and structured processes that turn demand into measurable growth.",
    tag: { label: "Construction | SaaS" },
  },
  {
    year: "2025",
    role: "Marketing Manager",
    company: "Enso Homes",
    dates: "May 2025 - Jan 2026  |  Austin, USA",
    description: "Worked closely with founders to shape the brand and growth engine of a wellness-focused homebuilding company. From website experience to paid ads and SEO, focused on making the product more compelling, leading to meaningful increases in leads and engagement.",
    tag: { label: "Construction | Real Estate" },
  },
  {
    year: "2024",
    role: "Marketing Lead",
    company: "Scalis",
    dates: "Feb 2024 - Apr 2025  |  Miami / Durham, USA",
    description: "Built Apex, a student newsletter supporting 200K+ students, through content, campaigns, and community. Evolved from consulting on growth to leading marketing, expanding audience and turning content into a strong distribution channel. Helped build a $1.47M sales pipeline in under 6 months.",
    tag: { label: "HR Tech | SaaS" },
  },
  {
    year: "2023",
    role: "Marketing Manager",
    company: "Gain Ventures",
    dates: "Jun 2023 - Jan 2024  |  Durham, USA",
    description: "Led marketing and growth across paid channels and outbound for clients. Worked on UI/UX design for ICAREUM, creating wireframes and interactive components while collaborating with engineering and product teams to make complex, emerging tech feel intuitive.",
    tag: { label: "Crypto | Web 3 | Venture Capital" },
  },
  {
    year: "2023",
    role: "Research Assistant",
    company: "Duke University",
    dates: "2023  |  Durham, USA",
    description: "Researched innovation and crypto ventures under Prof. Campbell Harvey, collaborating on blockchain applications in emerging technologies and exploring how new technologies translate into real-world use cases.",
    tag: { label: "Crypto | Web 3" },
  },
  {
    year: "2023",
    role: "Product Marketing Analyst Intern",
    company: "NatureServe",
    dates: "Jan 2023 - Apr 2023  |  Durham, USA",
    description: "Conducted market research and worked on positioning for a SaaS product. Focused on customer segments, demand analysis, and competitive landscape to help shape go-to-market strategy.",
    tag: { label: "Environmental Science | SaaS" },
  },
  {
    year: "2021",
    role: "Marketing Manager",
    company: "MGA Insurance",
    dates: "Sep 2021 - Mar 2022  |  New Delhi, India",
    description: "Led campaigns, managed a small team, and improved customer targeting and visibility. Built campaigns, tracked performance, and refined strategy based on data.",
    tag: { label: "Insurance" },
  },
  {
    year: "2021",
    role: "Social Media Manager",
    company: "Matchain",
    dates: "Jul 2021 - Mar 2022  |  Lisbon, Portugal (Remote)",
    description: "Worked on global launch campaigns in the Web3 space. Helped position the product, simplify complex ideas, and create content that made blockchain more accessible to a wider audience.",
    tag: { label: "Blockchain | Crypto | Web 3" },
  },
  {
    year: "2020",
    role: "Marketing Lead",
    company: "AIESEC",
    dates: "2020 - 2021  |  India & Malaysia",
    description: "Early leadership and marketing roles managing communications, leading small teams, and working on recruitment and partnerships. Where I first learned how to build and lead from scratch.",
    tag: { label: "UNESCO Initiative" },
  },
];

const education = [
  {
    year: "2023",
    degree: "Master's in Management Studies (MMS)",
    school: "Duke University, The Fuqua School of Business",
    dates: "July 2022 - May 2023  |  Durham, USA",
    description: "Spent the year building a strong foundation in business while working on hands-on projects across marketing, product, and emerging tech, with a focus on how ideas translate into real-world execution.",
  },
  {
    year: "2021",
    degree: "CORe (Credential of Readiness)",
    school: "Harvard Business School",
    dates: "June 2021 - September 2021  |  Online",
    description: "Completed an intensive program covering business analytics, economics, and financial accounting, helping me understand how businesses operate from the ground up.",
  },
  {
    year: "2018",
    degree: "B.A. (Hons) Business Economics",
    school: "University of Delhi",
    dates: "2018 - 2021  |  Delhi, India",
    description: "Studied economics with a focus on markets, behavior, and decision-making, which shaped how I approach growth and strategy today.",
  },
  {
    year: "2017",
    degree: "Global Summer Program, International Economics",
    school: "National University of Singapore",
    dates: "June 2017 - July 2017  |  Singapore",
    description: "Gained early exposure to global markets and international economics through an immersive summer program.",
  },
  {
    year: "2004",
    degree: "Higher Secondary Education",
    school: "The Heritage School, New Delhi",
    dates: "2004 - 2018  |  New Delhi, India",
    description: "Built my early foundation in commerce and developed an interest in business, economics, and problem-solving.",
  },
];


function PillItem({ item, delay }: { item: { label: string; emoji: string }; delay: number }) {
  const [entered, setEntered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={entered ? { duration: 0.15, ease: "easeOut" } : { duration: 0.55, ease: EASE, delay }}
      onAnimationComplete={() => setEntered(true)}
      whileHover={{ y: -4 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm cursor-pointer font-medium"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#f5f5f7",
        transition: "background 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(220,20,60,0.12)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(220,20,60,0.35)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <span style={{ fontSize: "0.9em" }}>{item.emoji}</span>
      {item.label}
    </motion.span>
  );
}

type Tag = { label: string };

function EditorialRow({
  year, title, subtitle, dates, description, inView, delay, tag, logo,
}: {
  year: string; title: string; subtitle: string; dates: string; description: string; inView: boolean; delay: number; tag?: Tag; logo?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.0, ease: EASE, delay }}
      className="flex items-start gap-6 sm:gap-12 py-8 sm:py-10"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Year */}
      <span
        className="font-black tracking-tight select-none shrink-0 pt-1"
        style={{ fontSize: "clamp(0.75rem, 1vw, 0.85rem)", color: "#515154", minWidth: "3.2rem" }}
      >
        {year}
      </span>

      {/* Title + subtitle + description */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-black tracking-tight leading-[0.96] mb-2"
          style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: "#f5f5f7" }}
        >
          {title}
        </h3>
        <p className="text-sm font-medium mb-1" style={{ color: "#a1a1a6" }}>
          {subtitle}
        </p>
        <p className="text-xs mb-4" style={{ color: "#515154" }}>
          {dates}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#86868b", maxWidth: "44rem" }}>
          {description}
        </p>
      </div>

      {/* Tag */}
      {tag && (
        <div className="hidden sm:flex shrink-0 pt-1.5">
          <span
            className="text-xs uppercase tracking-[0.16em] font-medium"
            style={{ color: "#515154" }}
          >
            {tag.label}
          </span>
        </div>
      )}

      {/* Logo */}
      {logo && (
        <div
          className="hidden sm:flex shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{
            width: 72,
            height: 72,
            background: "#fff",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: 8,
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-5%" });

  const expRef = useRef<HTMLDivElement>(null);
  const expInView = useInView(expRef, { once: true, margin: "-8%" });

  const eduRef = useRef<HTMLDivElement>(null);
  const eduInView = useInView(eduRef, { once: true, margin: "-8%" });

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7" }}>
      <Nav />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden pt-36 pb-12 px-8 sm:px-14 lg:px-20"
        style={{ isolation: "isolate" }}
      >
        {/* Crimson blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "70vmax", height: "70vmax",
              top: "-25vmax", right: "-15vmax",
              background: "radial-gradient(ellipse, rgba(220,20,60,0.28) 0%, transparent 68%)",
            }}
          />
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "55vmax", height: "55vmax",
              bottom: "-15vmax", left: "-10vmax",
              background: "radial-gradient(ellipse, rgba(139,0,0,0.22) 0%, transparent 68%)",
            }}
          />
        </div>

        <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            About
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            className="font-black tracking-tight leading-[0.92] mb-16 lg:mb-20"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", color: "#f5f5f7" }}
          >
            <span style={{ display: "block" }}>I believe in</span>
            <span style={{ display: "block" }}>infinite possibilities.</span>
          </motion.h1>

          {/* Bio + portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-20 gap-y-12 lg:gap-y-0 lg:items-start mb-20">

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, ease: EASE, delay: 0.5 }}
              className="order-2 lg:order-1 lg:col-span-7 flex flex-col gap-5 text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              <p>I grew up in India, in a fairly traditional environment where the path ahead often feels predefined. But my parents gave me something different, they gave me the space to choose. They trusted me to carve my own path, even when it didn&apos;t look conventional, and stood behind me with a kind of quiet strength that never wavered.</p>
              <p>Maybe that&apos;s where it started, the belief that you don&apos;t have to stay on a path.<br /><em><strong>You can carve your own path.</strong></em></p>
              <p>I studied economics, trying to understand how the world works. But somewhere along the way, I found myself building things, designing, writing, experimenting, growing ideas from scratch. That curiosity took me 8,000 miles away from home to attend Duke, and into environments where I had to rebuild everything: my work, my identity, and my sense of direction.</p>
              <p>There were moments of uncertainty. Of not knowing if I was on the <em>right</em> path. But through it all, my parents remained my backbone. Steady, grounded, and always there, no matter how far I was.</p>
              <p>Over time, things started to connect in unexpected ways. <strong>An economics student turned into someone working at the intersection of marketing, product, and design. A side interest in creativity turned into being featured on the Times Square billboard. A few experiments turned into platforms that helped and inspired hundreds of thousands of people.</strong></p>
              <p>None of it was planned. But now when I look back, it all makes sense.</p>
              <p>What I enjoy most now is <strong>building, understanding why something works, why people care, and creating systems</strong> that turn that attention into something meaningful.</p>
              <p>I&apos;m still figuring things out. But if there&apos;s one thing I&apos;ve learned, it&apos;s this:<br /><em><strong>There&apos;s always more than one path.</strong></em></p>
            </motion.div>

            {/* Photo stack */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
              className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-4"
              style={{ height: "clamp(420px, 70vh, 720px)" }}
            >
              {[
                { src: "/Chirayu Full.png", pos: "center top" },
                { src: "/Chirayu Square.png", pos: "center" },
                { src: "/Chirayu Reveal.png", pos: "center" },
              ].map((img, i) => (
                <div key={i} className="w-full flex-1 min-h-0 overflow-hidden">
                  <img
                    src={img.src}
                    alt="Chirayu Arya"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: img.pos }}
                  />
                </div>
              ))}
            </motion.div>

          </div>

          {/* Things I love */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2.5rem" }} className="flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-xs tracking-[0.22em] uppercase font-medium mb-6"
              style={{ color: "#86868b" }}
            >
              Things I love
            </motion.p>
            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((item, i) => (
                <PillItem key={item.label} item={item} delay={0.75 + i * 0.04} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Marquee ── */}
      <section
        className="py-16 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium text-center mb-10"
          style={{ color: "#86868b" }}
        >
          Associations
        </p>
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 140,
                  height: 56,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#515154",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 12,
                }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section
        className="relative overflow-hidden pt-20 pb-16 px-8 sm:px-14 lg:px-20"
        style={{ background: "#000", isolation: "isolate" }}
      >
        {/* Crimson blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "80vmax", height: "80vmax",
              top: "-30vmax", left: "-25vmax",
              background: "radial-gradient(ellipse, rgba(220,20,60,0.32) 0%, transparent 68%)",
            }}
          />
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "70vmax", height: "70vmax",
              bottom: "-25vmax", right: "-20vmax",
              background: "radial-gradient(ellipse, rgba(139,0,0,0.28) 0%, transparent 68%)",
            }}
          />
        </div>
        <div ref={expRef} className="relative" style={{ zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={expInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Experience
          </motion.p>
          <div className="flex items-end justify-between gap-8 mb-10">
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={expInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
            >
              Roles I&apos;ve owned.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={expInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "16rem", textAlign: "right" }}
            >
              Nine roles, five industries, one obsession.
            </motion.p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {experience.map((item, i) => (
              <EditorialRow
                key={i}
                year={item.year}
                title={item.role}
                subtitle={item.company}
                dates={item.dates}
                description={item.description}
                inView={expInView}
                delay={0.4 + i * 0.08}
                tag={item.tag}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section
        className="relative overflow-hidden pt-24 pb-28 px-8 sm:px-14 lg:px-20"
        style={{ background: "#000", isolation: "isolate" }}
      >
        {/* Crimson blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "80vmax", height: "80vmax",
              top: "-30vmax", right: "-25vmax",
              background: "radial-gradient(ellipse, rgba(180,0,40,0.32) 0%, transparent 68%)",
            }}
          />
          <div
            className="bg-blob absolute rounded-full"
            style={{
              width: "70vmax", height: "70vmax",
              bottom: "-25vmax", left: "-20vmax",
              background: "radial-gradient(ellipse, rgba(220,20,60,0.28) 0%, transparent 68%)",
            }}
          />
        </div>
        <div ref={eduRef} className="relative" style={{ zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={eduInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Education
          </motion.p>
          <div className="flex items-end justify-between gap-8 mb-10">
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={eduInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
            >
              Where I&apos;ve learned.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={eduInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "16rem", textAlign: "right" }}
            >
              Five schools, four countries.
            </motion.p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {education.map((item, i) => (
              <EditorialRow
                key={i}
                year={item.year}
                title={item.degree}
                subtitle={item.school}
                dates={item.dates}
                description={item.description}
                inView={eduInView}
                delay={0.4 + i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <Contact />

    </main>
  );
}
