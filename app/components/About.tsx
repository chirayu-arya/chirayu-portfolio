"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={entered ? { duration: 0.18, ease: "easeOut" } : { duration: 0.6, ease: EASE, delay }}
      onAnimationComplete={() => { if (inView) setEntered(true); }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-row items-center gap-4 rounded-2xl p-4"
      style={{
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? item.glowColor + "60" : "rgba(255,255,255,0.07)"}`,
        boxShadow: "none",
        transition: "border-color 0.2s ease, background 0.2s ease",
        cursor: "default",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
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

  return (
    <section
      id="about"
      className="relative pt-36 pb-20 px-8 sm:px-14 lg:px-20 overflow-hidden"
      style={{ background: "#000", isolation: "isolate" }}
    >
      {/* Crimson blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full bg-blob"
          style={{
            width: "70vmax", height: "70vmax",
            top: "-25vmax", left: "-20vmax",
            background: "radial-gradient(ellipse, rgba(220,20,60,0.28) 0%, transparent 68%)",
          }}
        />
        <div
          className="absolute rounded-full bg-blob"
          style={{
            width: "55vmax", height: "55vmax",
            bottom: "-15vmax", right: "-10vmax",
            background: "radial-gradient(ellipse, rgba(139,0,0,0.22) 0%, transparent 68%)",
          }}
        />
      </div>

      <div ref={ref} className="relative" style={{ zIndex: 1 }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
          style={{ color: "#86868b" }}
        >
          About Me
        </motion.p>

        {/* Full-width headline */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
          className="font-black tracking-tight leading-[0.92] mb-16 lg:mb-20"
          style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", color: "#f5f5f7" }}
        >
          <span style={{ display: "block" }}>I make things people</span>
          <span style={{ display: "block" }}>actually pay attention to.</span>
        </motion.h2>

        {/* 2-col: bio + portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-20 lg:items-stretch mb-12">

          {/* Left: bio + pills + CTA */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-between gap-10 lg:gap-0 lg:pb-4">

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              I like designing things that create an impact and people actually pay
              attention to, and figuring out how to grow them. Over the last few
              years, I&apos;ve worked across industries in startups, built
              communities, grew newsletters, curated podcasts, and designed
              campaigns that reached millions.
            </motion.p>

            {/* Tech stack pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
              className="flex flex-col items-start gap-3"
            >
              {techStack.map((group) => (
                <div key={group.category} className="flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#f5f5f7" }}
                    >
                      <span className="inline-block rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: tool.color }} />
                      {tool.name}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
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

          {/* Right: portrait */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: EASE, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-5 mb-10 lg:mb-0"
          >
            <div
              className="w-full overflow-hidden"
              style={{ height: "clamp(300px, 48vh, 520px)" }}
            >
              <img
                src="/Chirayu Full.png"
                alt="Chirayu Arya"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 10%" }}
              />
            </div>
          </motion.div>

        </div>

        {/* Interest cards — full-width 4-col strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2.5rem", marginTop: "0.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {interests.map((item, i) => (
              <InterestCard key={item.title} item={item} inView={inView} delay={0.55 + i * 0.07} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
