"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
              color: "#86868b",
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
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#86868b" }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#515154",
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
            color: "#515154",
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

  return (
    <section id="work" className="pt-36 pb-0 px-8" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto">
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
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#f5f5f7" }}
            >
              Projects that speak
              <br />
              <span style={{ color: "#86868b" }}>for themselves.</span>
            </motion.h2>
            <motion.a
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              href="#"
              className="text-sm cursor-pointer whitespace-nowrap transition-colors duration-200 hidden sm:block"
              style={{ color: "#86868b" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
              onMouseLeave={e => (e.currentTarget.style.color = "#86868b")}
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
      </div>
    </section>
  );
}
