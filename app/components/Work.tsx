"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function StatNumber({ value, inView, delay }: { value: string; inView: boolean; delay: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        lineHeight: 1,
        paddingBottom: "0.08em",
      }}
    >
      <motion.span
        style={{ display: "block", lineHeight: 1, whiteSpace: "nowrap" }}
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {value}
      </motion.span>
    </span>
  );
}

const projects = [
  {
    index: "01",
    title: "Brand Identity",
    category: "Design",
    description:
      "Full visual identity system for a tech startup. Logo, type system, color palette, and brand guidelines.",
    img: "https://picsum.photos/seed/work01/480/300",
  },
  {
    index: "02",
    title: "Campaign Strategy",
    category: "Marketing",
    description:
      "Multi-channel launch campaign for a consumer product. Strategy, creative direction, and performance analytics.",
    img: "https://picsum.photos/seed/work02/480/300",
  },
  {
    index: "03",
    title: "Portrait Series",
    category: "Photography",
    description:
      "Editorial portrait series exploring light, texture, and character. Shot on medium format film.",
    img: "https://picsum.photos/seed/work03/480/300",
  },
  {
    index: "04",
    title: "Product Launch",
    category: "Design + Marketing",
    description:
      "End-to-end design and marketing for a DTC brand launch. Packaging, digital ads, landing page.",
    img: "https://picsum.photos/seed/work04/480/300",
  },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function ProjectRow({ project, index, inView }: { project: (typeof projects)[0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.0, ease: EASE, delay: 0.4 + index * 0.12 }}
      className="group cursor-pointer flex items-start gap-6 sm:gap-12 py-8 sm:py-10"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Thumbnail */}
      <div
        className="hidden sm:block shrink-0 overflow-hidden rounded-xl"
        style={{ width: "clamp(220px, 28vw, 380px)", height: "clamp(140px, 18vw, 240px)" }}
      >
        <img
          src={project.img}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Index */}
      <span
        className="font-black tracking-tight select-none shrink-0 pt-1"
        style={{ fontSize: "clamp(0.75rem, 1vw, 0.85rem)", color: "#515154", minWidth: "2rem" }}
      >
        {project.index}
      </span>

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-black tracking-tight leading-none mb-3"
          style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)", color: "#f5f5f7" }}
        >
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#86868b", maxWidth: "38rem" }}>
          {project.description}
        </p>
      </div>

      {/* Category + arrow */}
      <div className="hidden sm:flex flex-col items-end gap-3 shrink-0 self-center">
        <span
          className="text-xs uppercase tracking-[0.16em] font-medium"
          style={{ color: "#515154" }}
        >
          {project.category}
        </span>
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#515154" }}
          whileHover={{ rotate: 45 }}
          transition={{ duration: 0.18 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
            (e.currentTarget as HTMLElement).style.color = "#f5f5f7";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLElement).style.color = "#515154";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    <section id="work" className="relative pt-36 pb-0 px-8 sm:px-14 lg:px-20">
      <div>
        {/* Header */}
        <div ref={ref} className="mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            At a Glance
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
            >
              Projects that speak
              <br />for themselves.
            </motion.h2>
            <motion.a
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              href="#"
              className="text-sm cursor-pointer whitespace-nowrap hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem" }}
            >
              All work →
            </motion.a>
          </div>
        </div>

        {/* Editorial rows */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {projects.map((project, i) => (
            <ProjectRow key={project.index} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 mt-20 pb-24"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { value: "4+", label: "Years of Experience" },
            { value: "3M+", label: "Members Across Communities" },
            { value: "5M+", label: "Monthly Impressions" },
            { value: "$1.7M", label: "Sales Pipeline Built" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.1 }}
              className="flex flex-col pt-8 pb-4 px-4 min-w-0"
              style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="font-black tracking-tight leading-none mb-4 min-w-0"
                style={{ fontSize: "clamp(3rem, 6vw, 6.5rem)", color: "#f5f5f7" }}
              >
                <StatNumber value={stat.value} inView={statsInView} delay={0.15 + i * 0.12} />
              </div>
              <p className="text-xs uppercase tracking-[0.16em] font-medium" style={{ color: "#515154" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
