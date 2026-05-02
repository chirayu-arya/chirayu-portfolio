"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function SlotNumber({ value, inView, delay }: { value: string; inView: boolean; delay: number }) {
  return (
    <div
      className="text-2xl sm:text-4xl font-bold tracking-tight flex items-center justify-center"
      style={{ color: "#f5f5f7", lineHeight: 1 }}
    >
      {value.split("").map((char, i) => {
        if (/\d/.test(char)) {
          const target = parseInt(char);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", height: "1em" }}>
              <motion.span
                style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
                initial={{ y: "0%" }}
                animate={inView ? { y: `-${target * 10}%` } : { y: "0%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.05 }}
              >
                {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                  <span key={d} style={{ display: "block", height: "1em" }}>{d}</span>
                ))}
              </motion.span>
            </span>
          );
        }
        return <span key={i} style={{ lineHeight: 1 }}>{char}</span>;
      })}
    </div>
  );
}

const projects = [
  {
    index: "01",
    title: "Brand Identity",
    category: "Design",
    description:
      "Full visual identity system for a tech startup. Logo, type system, color palette, and brand guidelines.",
    tags: ["Branding", "Logo", "Guidelines"],
    bg: "#0a0a0a",
    accent: "#ffffff",
  },
  {
    index: "02",
    title: "Campaign Strategy",
    category: "Marketing",
    description:
      "Multi-channel launch campaign for a consumer product. Strategy, creative direction, and performance analytics.",
    tags: ["Strategy", "Creative", "Paid Media"],
    bg: "#0c0c0e",
    accent: "#ffffff",
  },
  {
    index: "03",
    title: "Portrait Series",
    category: "Photography",
    description:
      "Editorial portrait series exploring light, texture, and character. Shot on medium format film.",
    tags: ["Editorial", "Portrait", "Film"],
    bg: "#0a0a0a",
    accent: "#ffffff",
  },
  {
    index: "04",
    title: "Product Launch",
    category: "Design + Marketing",
    description:
      "End-to-end design and marketing for a DTC brand launch. Packaging, digital ads, landing page.",
    tags: ["Packaging", "Digital", "DTC"],
    bg: "#0c0c0e",
    accent: "#ffffff",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: index * 0.08,
      }}
      className="group cursor-pointer"
    >
      {/* Card image area */}
      <div
        className="w-full aspect-[4/3] rounded-3xl mb-5 overflow-hidden relative"
        style={{ background: project.bg, border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Category chip */}
        <div className="absolute top-5 left-5">
          <span
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f5f5f7",
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Index */}
        <span
          className="absolute bottom-5 right-5 font-black select-none"
          style={{ fontSize: "4.5rem", lineHeight: 1, color: "rgba(255,255,255,0.04)" }}
        >
          {project.index}
        </span>

        {/* Hover accent glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 70%, ${project.accent}12 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <h3
            className="text-xl font-semibold mb-1.5 tracking-tight"
            style={{ color: "#f5f5f7" }}
          >
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#f5f5f7" }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#f5f5f7",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f5f5f7",
          }}
          whileHover={{ rotate: 45 }}
          transition={{ duration: 0.18 }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(255,255,255,0.4)";
            el.style.color = "#f5f5f7";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(255,255,255,0.1)";
            el.style.color = "#515154";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M2 11L11 2M11 2H4M11 2V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-5%" });

  return (
    <section id="work" className="pt-36 pb-0 px-8 sm:px-14 lg:px-20" style={{ background: "#000" }}>
      <div>
        {/* Header */}
        <div ref={ref} className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-5"
            style={{ color: "#86868b" }}
          >
            At a Glance
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-bold tracking-tight leading-tight"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", color: "#f5f5f7" }}
            >
              Projects that speak
              <br />
              <span style={{ color: "#f5f5f7" }}>for themselves.</span>
            </motion.h2>
            <motion.a
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              href="#"
              className="text-sm cursor-pointer whitespace-nowrap transition-colors duration-200 hidden sm:block"
              style={{ color: "#f5f5f7" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
              onMouseLeave={e => (e.currentTarget.style.color = "#f5f5f7")}
            >
              All work →
            </motion.a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-20">
          {projects.map((project, i) => (
            <ProjectCard key={project.index} project={project} index={i} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 16 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex justify-center gap-8 sm:gap-16 mt-24 pt-10 pb-24"
          style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}
        >
          {[
            { value: "4+", label: "Years" },
            { value: "3M+", label: "Community" },
            { value: "5M+", label: "Impressions" },
            { value: "$1.7M", label: "Sales Pipeline" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 + i * 0.07 }}
              className="flex flex-col items-center text-center"
            >
              <SlotNumber value={stat.value} inView={statsInView} delay={0.15 + i * 0.1} />
              <div className="text-xs mt-1" style={{ color: "#86868b" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
