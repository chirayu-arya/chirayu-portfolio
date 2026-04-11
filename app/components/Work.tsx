"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    index: "01",
    title: "Brand Identity",
    category: "Design",
    description:
      "Full visual identity system for a tech startup: logo, type system, color palette, and brand guidelines.",
    tags: ["Branding", "Logo", "Guidelines"],
    accent: "#B8E207",
    aspect: "aspect-[4/3]",
  },
  {
    index: "02",
    title: "Campaign Strategy",
    category: "Marketing",
    description:
      "Multi-channel launch campaign for a consumer product. Strategy, creative direction, and performance analytics.",
    tags: ["Strategy", "Creative", "Paid Media"],
    accent: "#B8E207",
    aspect: "aspect-square",
  },
  {
    index: "03",
    title: "Portrait Series",
    category: "Photography",
    description:
      "Editorial portrait series exploring light, texture, and character. Shot on medium format film.",
    tags: ["Editorial", "Portrait", "Film"],
    accent: "#B8E207",
    aspect: "aspect-[3/4]",
  },
  {
    index: "04",
    title: "Product Launch",
    category: "Design + Marketing",
    description:
      "End-to-end design and marketing for a DTC brand launch: packaging, digital ads, landing page.",
    tags: ["Packaging", "Digital", "DTC"],
    accent: "#B8E207",
    aspect: "aspect-[4/3]",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      {/* Image placeholder */}
      <div
        className={`${project.aspect} w-full bg-[--color-surface-1] rounded-2xl mb-5 overflow-hidden relative`}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        {/* Category pill */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs px-3 py-1 rounded-full bg-black/40 text-[--color-text-secondary] backdrop-blur-sm border border-white/10">
            {project.category}
          </span>
        </div>
        {/* Index */}
        <div className="absolute bottom-4 right-4 z-10">
          <span className="text-5xl font-bold text-white/5 select-none">{project.index}</span>
        </div>
        {/* Hover accent */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${project.accent}10 0%, transparent 60%)` }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
          <p className="text-sm text-[--color-text-secondary] leading-relaxed max-w-xs">
            {project.description}
          </p>
        </div>
        <motion.div
          className="shrink-0 w-9 h-9 rounded-full border border-[--color-surface-3] flex items-center justify-center text-[--color-text-muted] group-hover:border-[--color-brand] group-hover:text-[--color-brand] transition-colors"
          whileHover={{ rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[--color-surface-2] text-[--color-text-muted]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="work" className="py-32 px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div ref={ref} className="flex items-end justify-between mb-16 border-b border-[--color-surface-2] pb-8">
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.25em] uppercase text-[--color-brand] mb-3 block"
          >
            Selected Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold"
          >
            Projects
          </motion.h2>
        </div>
        <motion.a
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          href="#"
          className="text-sm text-[--color-text-secondary] cursor-pointer hover:text-[--color-text-primary] transition-colors"
        >
          All work →
        </motion.a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
        {projects.map((project, i) => (
          <ProjectCard key={project.index} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
