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
    glowColor: "#a78bfa",
  },
  {
    title: "Music",
    currently: "Currently listening to",
    detail: "Coldplay",
    glowColor: "#7dd3fc",
  },
  {
    title: "Photography",
    currently: "Currently exploring",
    detail: "Virtual Photography",
    glowColor: "#fbbf24",
  },
  {
    title: "Digital Art",
    currently: "Currently working on",
    detail: "Times Square Showcase 2026",
    glowColor: "#fb7185",
  },
];

function InterestCard({ item, inView, delay }: { item: typeof interests[0]; inView: boolean; delay: number }) {
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={entered ? { duration: 0.18, ease: "easeOut" } : { duration: 0.6, ease: EASE, delay }}
      onAnimationComplete={() => { if (inView) setEntered(true); }}
      style={{
        borderLeft: `2px solid ${item.glowColor}`,
        paddingLeft: "1rem",
        cursor: "default",
      }}
    >
      <p className="text-xs uppercase tracking-[0.18em] font-medium mb-2" style={{ color: "#515154" }}>
        {item.currently}
      </p>
      <p className="font-bold leading-tight mb-1" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)", color: "#f5f5f7" }}>
        {item.title}
      </p>
      <p className="text-sm" style={{ color: "#86868b" }}>
        {item.detail}
      </p>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      id="about"
      className="relative pt-36 pb-20 px-8 sm:px-14 lg:px-20"
    >
      <div ref={ref} className="relative">

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

        {/* Full-width headline — slides in from left */}
        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
          className="font-black tracking-tight leading-[0.92] mb-16 lg:mb-20"
          style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", color: "#f5f5f7" }}
        >
          <span style={{ display: "block" }}>I make things people</span>
          <span style={{ display: "block" }}>actually pay attention to.</span>
        </motion.h2>

        {/* 2-col: bio + portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-20 lg:items-stretch mb-12">

          {/* Left: bio + pills + CTA — cascade down after headline lands */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-between gap-10 lg:gap-0">

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, ease: EASE, delay: 0.5 }}
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
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
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
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
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

          {/* Right: portrait — slides in from right simultaneously with headline */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            className="order-1 lg:order-2 lg:col-span-5 mb-10 lg:mb-0 lg:h-full"
          >
            <div
              className="w-full h-full overflow-hidden"
              style={{ minHeight: "clamp(300px, 48vh, 520px)" }}
            >
              <img
                src="/chirayu-wide.png"
                alt="Chirayu Arya"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

        </div>

        {/* Interest cards — stagger in last */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2.5rem", marginTop: "0.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {interests.map((item, i) => (
              <InterestCard key={item.title} item={item} inView={inView} delay={1.0 + i * 0.08} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
