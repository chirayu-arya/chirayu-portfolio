"use client";

import Nav from "../components/Nav";
import Contact from "../components/Contact";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

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

const TAG = {
  construction:    { label: "Construction",         color: "#FCD34D", bg: "rgba(252,211,77,0.1)",   border: "rgba(252,211,77,0.28)"  },
  cryptoWeb3:      { label: "Crypto & Web3",         color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.28)" },
  insurance:       { label: "Insurance",             color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.28)"  },
  hrTech:          { label: "HR Tech",               color: "#FB923C", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.28)"  },
  govtInitiative:  { label: "Government Initiative", color: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.28)"  },
};

const experience = [
  {
    role: "Marketing Manager",
    company: "SiteMarker",
    dates: "Jan 2026 - Present  |  Charleston, USA",
    description: "Building and scaling marketing systems for a SaaS construction tech platform. Connecting product, sales, and marketing through full-funnel strategies, UX improvements, and structured processes that turn demand into measurable growth.",
    tag: TAG.construction,
  },
  {
    role: "Marketing Manager",
    company: "Enso Homes",
    dates: "May 2025 - Jan 2026  |  Austin, USA",
    description: "Worked closely with founders to shape the brand and growth engine of a wellness-focused homebuilding company. From website experience to paid ads and SEO, focused on making the product more compelling, leading to meaningful increases in leads and engagement.",
    tag: TAG.construction,
  },
  {
    role: "Marketing Lead",
    company: "Scalis",
    dates: "Feb 2024 - Apr 2025  |  Miami / Durham, USA",
    description: "Built Apex, a student newsletter supporting 200K+ students, through content, campaigns, and community. Evolved from consulting on growth to leading marketing, expanding audience and turning content into a strong distribution channel. Helped build a $1.47M sales pipeline in under 6 months.",
    tag: TAG.hrTech,
  },
  {
    role: "Marketing Manager",
    company: "Gain Ventures",
    dates: "Jun 2023 - Jan 2024  |  Durham, USA",
    description: "Led marketing and growth across paid channels and outbound for clients. Worked on UI/UX design for ICAREUM, creating wireframes and interactive components while collaborating with engineering and product teams to make complex, emerging tech feel intuitive.",
    tag: TAG.cryptoWeb3,
  },
  {
    role: "Research Assistant",
    company: "Duke University",
    dates: "2023  |  Durham, USA",
    description: "Researched innovation and crypto ventures under Prof. Campbell Harvey, collaborating on blockchain applications in emerging technologies and exploring how new technologies translate into real-world use cases.",
    tag: TAG.cryptoWeb3,
  },
  {
    role: "Product Marketing Analyst Intern",
    company: "NatureServe",
    dates: "Jan 2023 - Apr 2023  |  Durham, USA",
    description: "Conducted market research and worked on positioning for a SaaS product. Focused on customer segments, demand analysis, and competitive landscape to help shape go-to-market strategy.",
    tag: TAG.govtInitiative,
  },
  {
    role: "Marketing Manager",
    company: "MGA Insurance",
    dates: "Sep 2021 - Mar 2022  |  New Delhi, India",
    description: "Led campaigns, managed a small team, and improved customer targeting and visibility. Built campaigns, tracked performance, and refined strategy based on data.",
    tag: TAG.insurance,
  },
  {
    role: "Social Media Manager",
    company: "Matchain",
    dates: "Jul 2021 - Mar 2022  |  Lisbon, Portugal (Remote)",
    description: "Worked on global launch campaigns in the Web3 space. Helped position the product, simplify complex ideas, and create content that made blockchain more accessible to a wider audience.",
    tag: TAG.cryptoWeb3,
  },
  {
    role: "Marketing Lead",
    company: "AIESEC",
    dates: "2020 - 2021  |  India & Malaysia",
    description: "Early leadership and marketing roles managing communications, leading small teams, and working on recruitment and partnerships. Where I first learned how to build and lead from scratch.",
    tag: TAG.govtInitiative,
  },
];

const education = [
  {
    degree: "Master's in Management Studies (MMS)",
    school: "Duke University, The Fuqua School of Business",
    dates: "July 2022 - May 2023  |  Durham, USA",
    description: "Spent the year building a strong foundation in business while working on hands-on projects across marketing, product, and emerging tech, with a focus on how ideas translate into real-world execution.",
  },
  {
    degree: "CORe (Credential of Readiness)",
    school: "Harvard Business School",
    dates: "June 2021 - September 2021  |  Online",
    description: "Completed an intensive program covering business analytics, economics, and financial accounting, helping me understand how businesses operate from the ground up.",
  },
  {
    degree: "B.A. (Hons) Business Economics",
    school: "University of Delhi",
    dates: "2018 - 2021  |  Delhi, India",
    description: "Studied economics with a focus on markets, behavior, and decision-making, which shaped how I approach growth and strategy today.",
  },
  {
    degree: "Higher Secondary Education",
    school: "The Heritage School, New Delhi",
    dates: "2004 - 2018  |  New Delhi, India",
    description: "Built my early foundation in commerce and developed an interest in business, economics, and problem-solving.",
  },
  {
    degree: "Global Summer Program, International Economics",
    school: "National University of Singapore",
    dates: "June 2017 - July 2017  |  Singapore",
    description: "Gained early exposure to global markets and international economics through an immersive summer program.",
  },
];


function PillItem({ item, delay }: { item: { label: string; emoji: string }; delay: number }) {
  const [entered, setEntered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={entered ? { duration: 0.15, ease: "easeOut" } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay }}
      onAnimationComplete={() => setEntered(true)}
      whileHover={{ y: -4 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#f5f5f7",
        transition: "background 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      <span style={{ fontSize: "0.85em" }}>{item.emoji}</span>
      {item.label}
    </motion.span>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 mb-6">
      <p
        className="text-xs tracking-[0.22em] uppercase font-medium whitespace-nowrap"
        style={{ color: "#86868b" }}
      >
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

type Tag = { label: string; color: string; bg: string; border: string };

function ExpCard({
  role, company, dates, description, inView, delay, lastRow, tag,
}: {
  role: string; company: string; dates: string; description: string; inView: boolean; delay: number; lastRow?: boolean; tag?: Tag;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay }}
      className="py-8"
      style={lastRow ? undefined : { borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-base font-semibold" style={{ color: "#f5f5f7" }}>{role}</p>
        {tag && (
          <span
            className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ color: tag.color, background: tag.bg, border: `1px solid ${tag.border}` }}
          >
            {tag.label}
          </span>
        )}
      </div>
      <p className="text-sm mb-0.5" style={{ color: "#86868b" }}>{company}</p>
      <p className="text-xs mb-5" style={{ color: "#515154" }}>{dates}</p>
      <p className="text-sm leading-relaxed" style={{ color: "#a1a1a6" }}>{description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const expRef = useRef<HTMLDivElement>(null);
  const expInView = useInView(expRef, { once: true, margin: "-8%" });

  const eduRef = useRef<HTMLDivElement>(null);
  const eduInView = useInView(eduRef, { once: true, margin: "-8%" });

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7" }}>
      <Nav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-24 px-8">

        {/* Warm gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute rounded-full"
            style={{
              width: "65vmax", height: "65vmax",
              top: "-25vmax", right: "-10vmax",
              background: "radial-gradient(ellipse, rgba(251,191,36,0.25) 0%, transparent 68%)",
              filter: "blur(80px)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "55vmax", height: "55vmax",
              top: "-15vmax", left: "-15vmax",
              background: "radial-gradient(ellipse, rgba(251,113,133,0.22) 0%, transparent 68%)",
              filter: "blur(80px)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "50vmax", height: "50vmax",
              bottom: "-10vmax", left: "35%",
              background: "radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 68%)",
              filter: "blur(70px)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 1 }}>

          {/* Headline — full width, centered */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 }}
            className="font-bold tracking-tight leading-tight text-center mb-16"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#f5f5f7" }}
          >
            I believe in <span className="glow-bluepurple">infinite possibilities.</span>
          </motion.h1>

          {/* 2-col: bio + photos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 lg:gap-x-20 gap-y-12 lg:gap-y-0 items-stretch">

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
              className="order-1 lg:col-start-1 lg:col-span-7 flex flex-col gap-5 text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              <p>I grew up in India, in a fairly traditional environment where the path ahead often feels predefined. But my parents gave me something different - they gave me the space to choose. They trusted me to carve my own path, even when it didn&apos;t look conventional, and stood behind me with a kind of quiet strength that never wavered.</p>
              <p>Maybe that&apos;s where it started, the belief that you don&apos;t have to stay on a path.<br /><em><strong>You can carve your own path.</strong></em></p>
              <p>I studied economics, trying to understand how the world works. But somewhere along the way, I found myself building things, designing, writing, experimenting, growing ideas from scratch. That curiosity took me 8,000 miles away from home to attend Duke, and into environments where I had to rebuild everything: my work, my identity, and my sense of direction.</p>
              <p>There were moments of uncertainty. Of not knowing if I was on the <em>right</em> path. But through it all, my parents remained my backbone. Steady, grounded, and always there, no matter how far I was.</p>
              <p>Over time, things started to connect in unexpected ways. <strong>An economics student turned into someone working at the intersection of marketing, product, and design. A side interest in creativity turned into being featured on the Times Square billboard. A few experiments turned into platforms that helped and inspired hundreds of thousands of people.</strong></p>
              <p>None of it was planned. But now when I look back, it all makes sense.</p>
              <p>What I enjoy most now is <strong>building, understanding why something works, why people care, and creating systems</strong> that turn that attention into something meaningful.</p>
              <p>I&apos;m still figuring things out. But if there&apos;s one thing I&apos;ve learned, it&apos;s this:<br /><em><strong>There&apos;s always more than one path.</strong></em></p>
            </motion.div>

            {/* 3 photos — equal size, top/middle/bottom aligned to text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
              className="order-2 lg:col-start-8 lg:col-span-5 flex flex-col gap-4 h-full"
            >
              {[
                { bg: "#0f0f12" },
                { bg: "#0c0c10" },
                { bg: "#0a0a0e" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="w-full flex-1 min-h-0 rounded-3xl overflow-hidden"
                  style={{
                    background: item.bg,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </motion.div>

          </div>

          {/* Interests — full width, centered, below grid */}
          <div className="mt-16 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-xs tracking-[0.18em] uppercase font-medium mb-5"
              style={{ color: "#515154" }}
            >
              Things I love
            </motion.p>

            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((item, i) => (
                <PillItem key={item.label} item={item} delay={0.42 + i * 0.045} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Marquee ── */}
      <div
        className="py-12 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium text-center mb-8"
          style={{ color: "#515154" }}
        >
          Worked with
        </p>
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                style={{
                  width: 128,
                  height: 52,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#515154",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Experience ── */}
      <section className="pt-24 pb-8 px-8">
        <div className="max-w-6xl mx-auto" ref={expRef}>
          <SectionHeader label="Experience" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {experience.map((item, i) => (
              <ExpCard key={i} {...item} inView={expInView} delay={i * 0.1} lastRow={i >= experience.length - 2} tag={item.tag} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="pt-16 pb-28 px-8">
        <div className="max-w-6xl mx-auto" ref={eduRef}>
          <SectionHeader label="Education" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {education.map((item, i) => (
              <ExpCard
                key={i}
                role={item.degree}
                company={item.school}
                dates={item.dates}
                description={item.description}
                inView={eduInView}
                delay={i * 0.12}
                lastRow={i >= education.length - 2}
              />
            ))}
          </div>
        </div>
      </section>

      <Contact />

    </main>
  );
}
