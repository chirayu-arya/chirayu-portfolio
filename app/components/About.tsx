"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const disciplines = [
  {
    label: "Design",
    description:
      "Brand identity, visual systems, and UI that make people stop scrolling.",
  },
  {
    label: "Marketing",
    description:
      "Strategy-first campaigns that connect the right idea to the right audience.",
  },
  {
    label: "Photography",
    description:
      "Editorial, product, and portrait work that finds the moment before it happens.",
  },
];

const stats = [
  { value: "5+", label: "Years" },
  { value: "40+", label: "Projects" },
  { value: "3", label: "Disciplines" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const disciplineRef = useRef<HTMLDivElement>(null);
  const disciplineInView = useInView(disciplineRef, { once: true, margin: "-8%" });

  return (
    <section id="about" className="pt-36 pb-0 px-8" style={{ background: "#0a0a0a" }}>
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
            About
          </motion.p>
        </div>

        {/* Bio block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-28">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="font-bold tracking-tight leading-tight mb-10"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "#f5f5f7" }}
            >
              A creative with
              <br />
              <span style={{ color: "#86868b" }}>a strategic mind.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#86868b" }}
            >
              <p>
                I sit at the intersection of design, marketing, and photography.
                That means I don't just make things look good. I make them work.
              </p>
              <p>
                Whether it's building a brand from scratch, directing a campaign, or finding
                the perfect frame, my work is driven by curiosity and a deep respect for craft.
              </p>
              <p>
                I've worked with startups, agencies, and independent creators to bring ideas
                to life across every medium. Let's make something worth looking at.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex gap-10 mt-12 pt-10"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              {stats.map(stat => (
                <div key={stat.label}>
                  <div
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: "#f5f5f7" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#515154" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div
              className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative"
              style={{ background: "#1d1d1f", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "180px 180px",
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center text-sm"
                style={{ color: "#515154" }}
              >
                Portrait photo
              </div>
            </div>
          </motion.div>
        </div>

        {/* Disciplines */}
        <div ref={disciplineRef}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={disciplineInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-8"
            style={{ color: "#515154" }}
          >
            Disciplines
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {disciplines.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 24 }}
                animate={disciplineInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  delay: i * 0.1,
                }}
                className="rounded-3xl p-8"
                style={{
                  background: "#1d1d1f",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="text-lg font-semibold mb-3 tracking-tight"
                  style={{ color: "#f5f5f7" }}
                >
                  {d.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#86868b" }}>
                  {d.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
