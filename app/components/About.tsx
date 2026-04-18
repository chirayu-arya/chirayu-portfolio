"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const techStack = [
  {
    category: "Design",
    tools: [
      { name: "Figma", color: "#F24E1E" },
      { name: "Photoshop", color: "#31A8FF" },
      { name: "Illustrator", color: "#FF9A00" },
      { name: "Spline", color: "#7C6EFA" },
      { name: "Blender", color: "#E87D0D" },
    ],
  },
  {
    category: "Video & Motion",
    tools: [
      { name: "Final Cut Pro", color: "#d4d4d4" },
      { name: "Premiere Pro", color: "#9999FF" },
      { name: "After Effects", color: "#9999FF" },
    ],
  },
  {
    category: "Analytics",
    tools: [
      { name: "Power BI", color: "#F2C811" },
      { name: "Tableau", color: "#E97627" },
    ],
  },
  {
    category: "AI",
    tools: [
      { name: "Claude", color: "#D4A574" },
      { name: "ChatGPT", color: "#74AA9C" },
      { name: "Gemini", color: "#8AB4F8" },
    ],
  },
  {
    category: "CRM",
    tools: [
      { name: "HubSpot", color: "#FF7A59" },
      { name: "Apollo.io", color: "#6C63FF" },
      { name: "Salesforce", color: "#00A1E0" },
    ],
  },
];

const interests = [
  {
    title: "Gaming",
    currently: "Currently playing",
    detail: "Clair Obscur: Expedition 33",
    iconBg: "rgba(139,92,246,0.18)",
    glowColor: "#a78bfa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="13" rx="5" />
        <path d="M7 13h4M9 11v4" />
        <circle cx="15" cy="12" r="1" fill="#a78bfa" stroke="none" />
        <circle cx="18" cy="14" r="1" fill="#a78bfa" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Guitar",
    currently: "Currently playing and listening to",
    detail: "Coldplay",
    iconBg: "rgba(56,189,248,0.15)",
    glowColor: "#7dd3fc",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Photography",
    currently: "Currently exploring",
    detail: "Virtual Photography",
    iconBg: "rgba(251,191,36,0.15)",
    glowColor: "#fbbf24",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: "Digital Art",
    currently: "Currently working on",
    detail: "NFT NYC Showcase 2026",
    iconBg: "rgba(251,113,133,0.15)",
    glowColor: "#fb7185",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="1.5" />
        <circle cx="17.5" cy="10.5" r="1.5" />
        <circle cx="8.5" cy="7.5" r="1.5" />
        <circle cx="6.5" cy="12.5" r="1.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
];

function InterestCard({ item, inView, delay }: { item: typeof interests[0]; inView: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay }}
      whileHover={{ y: -5, transition: { duration: 0.18, ease: "easeOut" } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-row items-center gap-4 rounded-2xl p-4"
      style={{
        background: hovered ? `rgba(255,255,255,0.07)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? item.glowColor + "60" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered ? `0 0 28px 4px ${item.glowColor}44, 0 0 8px 0px ${item.glowColor}33` : "none",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        cursor: "default",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 40, height: 40, background: item.iconBg }}
      >
        {item.icon}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{item.title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>{item.currently}</p>
        <p className="text-xs font-medium mt-1" style={{ color: "#c7c7cc" }}>{item.detail}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const disciplineRef = useRef<HTMLDivElement>(null);
  const disciplineInView = useInView(disciplineRef, { once: true, margin: "-8%" });

  return (
    <section id="about" className="pt-36 pb-0 px-8" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto">

        {/* Top: label */}
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-16"
            style={{ color: "#86868b" }}
          >
            About Me
          </motion.p>
        </div>

        {/* Bio block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 lg:gap-x-24 gap-y-8 lg:gap-y-0 mb-0">

          {/* ── DESKTOP LEFT COLUMN: headline + bio + pills in one flex-col spanning both rows ── */}
          <div className="hidden lg:flex lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-2 flex-col justify-between">
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-bold tracking-tight leading-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "#f5f5f7" }}
            >
              A{" "}<span className="glow-bluepurple">creative</span>{" "}with
              <br />a{" "}
              <span style={{ color: "#f5f5f7", textDecoration: "underline wavy rgba(52,211,153,0.9)", textDecorationThickness: "2px", textUnderlineOffset: "10px" }}>
                strategic
              </span>{" "}mind.
            </motion.h2>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
              className="text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              I like designing things that create an impact and people actually pay attention to, and figuring out how to grow them. Over the last few years, I&apos;ve worked across industries in startups, built communities, grew newsletters, curated podcasts, and designed campaigns that reached millions.
            </motion.p>

            {/* Pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
              className="flex flex-col items-start gap-4"
            >
              {techStack.map((group) => (
                <div key={group.category} className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#f5f5f7" }}
                    >
                      <span className="inline-block rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: tool.color }} />
                      {tool.name}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── PORTRAIT (both breakpoints) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
            className="order-2 lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:row-span-2"
          >
            <div
              className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative"
              style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <img src="/Chirayu Full.png" alt="Chirayu Arya" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* ── MOBILE ONLY: headline → (portrait above) → bio + pills ── */}
          <div className="order-1 lg:hidden">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-bold tracking-tight leading-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "#f5f5f7" }}
            >
              A{" "}<span className="glow-bluepurple">creative</span>{" "}with
              <br />a{" "}
              <span style={{ color: "#f5f5f7", textDecoration: "underline wavy rgba(52,211,153,0.9)", textDecorationThickness: "2px", textUnderlineOffset: "10px" }}>
                strategic
              </span>{" "}mind.
            </motion.h2>
          </div>

          <div className="order-3 lg:hidden flex flex-col gap-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
              className="text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              I like designing things that create an impact and people actually pay attention to, and figuring out how to grow them. Over the last few years, I&apos;ve worked across industries in startups, built communities, grew newsletters, curated podcasts, and designed campaigns that reached millions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {techStack.flatMap((group) => group.tools).map((tool) => (
                <span
                  key={tool.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#f5f5f7" }}
                >
                  <span className="inline-block rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: tool.color }} />
                  {tool.name}
                </span>
              ))}
            </motion.div>
          </div>

        </div>

        {/* Interest tiles */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-12 mb-12"
          style={{ borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: "2.5rem" }}
        >
          {interests.map((item, i) => (
            <InterestCard key={item.title} item={item} inView={inView} delay={0.35 + i * 0.07} />
          ))}
        </div>

        {/* Learn More button */}
        <motion.div
          ref={disciplineRef}
          initial={{ opacity: 0, y: 16 }}
          animate={disciplineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex justify-center pb-20"
        >
          <a
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold cursor-pointer"
            style={{
              background: "#f5f5f7",
              color: "#000",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Learn More
          </a>
        </motion.div>

      </div>
    </section>
  );
}
