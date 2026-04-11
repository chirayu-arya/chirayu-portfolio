"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { category: "Design", items: ["Brand Identity", "Visual Systems", "UI/UX", "Motion", "Typography"] },
  { category: "Marketing", items: ["Strategy", "Campaign Planning", "Content", "Paid Media", "Analytics"] },
  { category: "Photography", items: ["Editorial", "Product", "Portrait", "Film", "Post-processing"] },
];

const stats = [
  { value: "5+", label: "Years of experience" },
  { value: "40+", label: "Projects delivered" },
  { value: "3", label: "Disciplines" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="about" className="py-32 px-8 bg-[--color-surface-1]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={ref}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.25em] uppercase text-[--color-brand] mb-3 block"
          >
            About
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mt-8">
          {/* Left: bio */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-bold leading-tight mb-8"
            >
              A creative with a strategic mind
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="space-y-5 text-[--color-text-secondary] leading-relaxed"
            >
              <p>
                I sit at the intersection of design, marketing, and photography. That means I don't just
                make things look good. I make them work.
              </p>
              <p>
                Whether it's building a brand from the ground up, directing a campaign, or finding the
                perfect frame, my work is driven by curiosity and a deep respect for craft.
              </p>
              <p>
                I've worked with startups, agencies, and independent creators to bring ideas to life
                across every medium. Let's make something worth looking at.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex gap-10 mt-12 pt-10 border-t border-[--color-surface-2]"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-[--color-brand]">{stat.value}</div>
                  <div className="text-xs text-[--color-text-secondary] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-8"
          >
            {skills.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 + gi * 0.1 }}
              >
                <div className="text-xs tracking-[0.2em] uppercase text-[--color-text-muted] mb-4">
                  {group.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm px-3.5 py-1.5 rounded-full border border-[--color-surface-3] text-[--color-text-secondary]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Portrait placeholder */}
            <div className="mt-8 rounded-2xl bg-[--color-surface-2] aspect-[3/2] overflow-hidden relative">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[--color-text-muted] text-sm">
                Portrait photo
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
