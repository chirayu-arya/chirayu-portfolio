"use client";

import Nav from "../components/Nav";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const interests = [
  { label: "Photography", emoji: "📷" },
  { label: "Film", emoji: "🎬" },
  { label: "Podcasts", emoji: "🎙️" },
  { label: "Startups", emoji: "🚀" },
  { label: "Coffee", emoji: "☕" },
  { label: "Travel", emoji: "✈️" },
  { label: "Music", emoji: "🎵" },
  { label: "Writing", emoji: "✍️" },
  { label: "Fitness", emoji: "🏋️" },
  { label: "Design", emoji: "🎨" },
  { label: "Tech", emoji: "💻" },
  { label: "Cooking", emoji: "🍳" },
];

const logos = ["Logo 1", "Logo 2", "Logo 3", "Logo 4", "Logo 5", "Logo 6", "Logo 7", "Logo 8"];

const experience = [
  {
    role: "Role Placeholder",
    company: "Company Name",
    dates: "2024 - Present",
    description: "Placeholder: Describe your responsibilities, key projects, and the impact you made in this role.",
  },
  {
    role: "Role Placeholder",
    company: "Company Name",
    dates: "2022 - 2024",
    description: "Placeholder: Describe your responsibilities, key projects, and the impact you made in this role.",
  },
  {
    role: "Role Placeholder",
    company: "Company Name",
    dates: "2020 - 2022",
    description: "Placeholder: Describe your responsibilities, key projects, and the impact you made in this role.",
  },
  {
    role: "Role Placeholder",
    company: "Company Name",
    dates: "2019 - 2020",
    description: "Placeholder: Describe your responsibilities, key projects, and the impact you made in this role.",
  },
];

const education = [
  {
    degree: "Degree Placeholder",
    school: "University Name",
    dates: "2019 - 2023",
    description: "Placeholder: Brief description of your program, focus areas, and what you gained from this education.",
  },
  {
    degree: "Degree Placeholder",
    school: "University Name",
    dates: "2017 - 2019",
    description: "Placeholder: Brief description of your program, focus areas, and what you gained from this education.",
  },
];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 mb-6">
      <p
        className="text-xs tracking-[0.22em] uppercase font-medium whitespace-nowrap"
        style={{ color: "#86868b" }}
      >
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function ExpCard({
  role, company, dates, description, inView, delay, lastRow,
}: {
  role: string; company: string; dates: string; description: string; inView: boolean; delay: number; lastRow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay }}
      className="py-8"
      style={lastRow ? undefined : { borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-base font-semibold mb-1" style={{ color: "#f5f5f7" }}>{role}</p>
      <p className="text-sm mb-0.5" style={{ color: "#86868b" }}>{company}</p>
      <p className="text-xs mb-5" style={{ color: "#515154" }}>{dates}</p>
      <p className="text-sm leading-relaxed" style={{ color: "#a1a1a6" }}>{description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const expRef = useRef<HTMLDivElement>(null);
  const expInView = useInView(expRef, { once: true, margin: "-8%" });

  const eduRef = useRef<HTMLDivElement>(null);
  const eduInView = useInView(eduRef, { once: true, margin: "-8%" });

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7" }}>
      <Nav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-24 px-8">

        {/* Warm gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute rounded-full"
            style={{
              width: "65vmax", height: "65vmax",
              top: "-25vmax", right: "-10vmax",
              background: "radial-gradient(ellipse, rgba(251,191,36,0.25) 0%, transparent 68%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "55vmax", height: "55vmax",
              top: "-15vmax", left: "-15vmax",
              background: "radial-gradient(ellipse, rgba(251,113,133,0.22) 0%, transparent 68%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "50vmax", height: "50vmax",
              bottom: "-10vmax", left: "35%",
              background: "radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 68%)",
              filter: "blur(70px)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left: text + pills */}
            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
                style={{ color: "#86868b" }}
              >
                About Me
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 }}
                className="font-bold tracking-tight leading-tight mb-8"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#f5f5f7" }}
              >
                Most people pick a lane.{" "}
                <span style={{ color: "#86868b" }}>I refused to.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
                className="text-base leading-relaxed mb-10"
                style={{ color: "#a1a1a6", maxWidth: "52ch" }}
              >
                Placeholder bio. Tell your story here. Where you grew up, what drives you, what makes you tick. Keep it real, keep it human. This is the place where people decide if they like you.
              </motion.p>

              {/* Currently chips */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="flex flex-wrap gap-2 mb-12"
              >
                {[
                  { icon: "📍", text: "Charleston, SC" },
                  { icon: "🚧", text: "Marketing @ SiteMarker" },
                  { icon: "🎧", text: "Listening to: placeholder" },
                ].map(item => (
                  <span
                    key={item.text}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "#86868b",
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.text}
                  </span>
                ))}
              </motion.div>

              {/* Interests */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-xs tracking-[0.18em] uppercase font-medium mb-4"
                style={{ color: "#515154" }}
              >
                Things I love
              </motion.p>

              <div className="flex flex-wrap gap-2">
                {interests.map((item, i) => (
                  <motion.span
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.42 + i * 0.045 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f5f5f7",
                    }}
                  >
                    <span style={{ fontSize: "0.85em" }}>{item.emoji}</span>
                    {item.label}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Right: portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div
                className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative"
                style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)" }}
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
        </div>
      </section>

      {/* ── Marquee ── */}
      <div
        className="py-12 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium text-center mb-8"
          style={{ color: "#515154" }}
        >
          Worked with
        </p>
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                style={{
                  width: 128,
                  height: 52,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#515154",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Experience ── */}
      <section className="pt-24 pb-8 px-8">
        <div className="max-w-6xl mx-auto" ref={expRef}>
          <SectionHeader label="Experience" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {experience.map((item, i) => (
              <ExpCard key={i} {...item} inView={expInView} delay={i * 0.1} lastRow={i >= experience.length - 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="pt-16 pb-28 px-8">
        <div className="max-w-6xl mx-auto" ref={eduRef}>
          <SectionHeader label="Education" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {education.map((item, i) => (
              <ExpCard
                key={i}
                role={item.degree}
                company={item.school}
                dates={item.dates}
                description={item.description}
                inView={eduInView}
                delay={i * 0.12}
                lastRow={i >= education.length - 2}
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
