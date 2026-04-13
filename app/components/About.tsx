"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

const stats = [
  { value: "4+", label: "Years" },
  { value: "3M+", label: "Community" },
  { value: "5M+", label: "Impressions" },
  { value: "$1.7M", label: "Sales Pipeline" },
];

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
          {/* Headline */}
          <div className="order-1 lg:col-start-1 lg:col-span-7 lg:row-start-1">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-bold tracking-tight leading-tight mb-0 lg:mb-10"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "#f5f5f7" }}
            >
              A{" "}
              <span className="glow-bluepurple">creative</span>{" "}with
              <br />
              a{" "}
              <span
                style={{
                  color: "#f5f5f7",
                  textDecoration: "underline wavy rgba(52,211,153,0.9)",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "10px",
                }}
              >
                strategic
              </span>{" "}mind.
            </motion.h2>
          </div>

          {/* Portrait placeholder — order-2 on mobile, right column spanning both rows on desktop */}
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
              <img
                src="/Chirayu Full.png"
                alt="Chirayu Arya"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Bio + pills */}
          <div className="order-3 lg:col-start-1 lg:col-span-7 lg:row-start-2 flex flex-col lg:self-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#f5f5f7" }}
            >
              <p>
                I like designing things that create an impact and people actually pay attention to, and figuring out how to grow them. Over the last few years, I&apos;ve worked across industries in startups, built communities, grew newsletters, curated podcasts, and designed campaigns that reached millions.
              </p>
            </motion.div>

            {/* Tech stack pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
              className="mt-8 flex flex-col items-center lg:items-start gap-4"
            >
              {techStack.map((group) => (
                <div key={group.category} className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {group.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#f5f5f7",
                      }}
                    >
                      <span
                        className="inline-block rounded-full flex-shrink-0"
                        style={{ width: 7, height: 7, background: tool.color }}
                      />
                      {tool.name}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats — full width, centered below the two-column block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex justify-center gap-8 sm:gap-16 mt-12 pt-10 mb-12"
          style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}
        >
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div
                className="text-2xl sm:text-4xl font-bold tracking-tight"
                style={{ color: "#f5f5f7" }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "#86868b" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

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
