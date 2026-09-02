"use client";

import Nav from "../../components/Nav";
import Contact from "../../components/Contact";
import PageBlobs from "../../components/PageBlobs";
import StoryModal, { type StoryCard } from "../../components/StoryModal";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const ACCENT = "43,92,255"; // Scalis blue — swap once exact brand hex is confirmed

const APEX_CARDS: StoryCard[] = [
  {
    label: "01 / The Problem",
    headline: "Scalis had no way to reach job seekers.",
    body: "The platform served two sides of hiring, employers and job seekers, and there was already a plan for acquiring employers. Job seekers were the gap, and scaling ad spend wasn't going to close it efficiently. So instead of buying that audience, I built a media brand to own it directly. We called it Apex, and it launched with a newsletter, CareerWatch, on Beehiiv.",
  },
  {
    label: "02 / The Mechanic",
    headline: "It earned trust before it asked for anything.",
    body: "Every issue carried twenty to thirty curated internship and job links, pulled from any company's own career page, any ATS. Students opened it because the list was genuinely useful. Once an issue had built up enough trust, we'd swap those same postings for the identical roles re-listed on Scalis, so clicking through sent students straight into building a profile on the platform.",
  },
  {
    label: "03 / The Growth Loop",
    headline: "A LinkedIn loop that ran on comments.",
    body: "The list started with a single LinkedIn post: drop your email in the comments to get the newsletter. It worked well enough to become a recurring format, not a one-off. Individual posts routinely cleared 100,000 impressions, and each one pulled two to three thousand comments with a student email attached. Duke's own network gave the first post its push, but the comment-gated format is what kept the list compounding after that.",
  },
  {
    label: "04 / The Network",
    headline: "A paid-on-performance campus network.",
    body: "Once my own posting cadence plateaued, I recruited student reps at Boston University, UCLA, Northeastern, Howard, and Princeton, picked to cover the major regional hotspots of the U.S. student population. Each rep ran the same comment-gated post on their own personal LinkedIn, and only got paid after clearing a minimum bar on both reach and the number of student emails that post generated. The list kept compounding without the fixed cost of an in-house team.",
  },
  {
    label: "05 / The Revenue",
    headline: "The audience became the business.",
    body: "Beehiiv's own ad network covered the early revenue. After crossing 100,000 subscribers, I built a media kit and pitched it directly to brand and PR teams at companies that already spend heavily to reach college students: Discover, North Face, fitness and nutrition labels, a few fashion names. Some of those deals closed through an agency that brokers affiliate and PR placements for that exact audience. Every dollar it made went back into building Scalis.",
  },
  {
    label: "06 / The SEO Engine",
    headline: "An organic search channel that cost nothing to run.",
    body: "The newsletter's landing page grew an SEO-driven article section: three keyword-targeted pieces a day, written to rank in search rather than to serve the existing subscriber list. By the twenty-fifth article, in month one, that section alone had pulled in fifty thousand organic visitors with zero paid spend behind it.",
  },
  {
    label: "07 / The Results",
    headline: "What six months added up to.",
    body: "",
    stats: [
      { value: "250,000+", label: "Subscribers" },
      { value: "$200K", label: "Revenue, 2 years" },
      { value: "1.5M", label: "Monthly impressions" },
      { value: "44%", label: "Open rate" },
      { value: "50K", label: "Organic visitors, month 1" },
    ],
    closing: "It's still growing, last I checked.",
  },
];

// Placeholder — swap for the real story once it's written up.
const PIPELINE_CARDS: StoryCard[] = [
  {
    label: "01 / The Problem",
    headline: "Placeholder — the other side of the platform.",
    body: "Apex solved acquisition on the job seeker side. Employers still needed a repeatable way to get found, reached, and into a demo. Final copy on the problem statement is pending.",
  },
  {
    label: "02 / The Tooling",
    headline: "Placeholder — HubSpot as the system of record.",
    body: "HubSpot ran as the CRM, with a defined ICP guiding which accounts were worth chasing. Final copy on how that ICP got built is pending.",
  },
  {
    label: "03 / The Sourcing",
    headline: "Placeholder — building the lists in Apollo.",
    body: "Apollo sourced the contact lists against the ICP. Final copy on the targeting criteria is pending.",
  },
  {
    label: "04 / The Outreach",
    headline: "Placeholder — sequences that booked demos.",
    body: "Sequenced outbound in Apollo turned those lists into booked demos. Final copy on cadence and messaging is pending.",
  },
  {
    label: "05 / The Results",
    headline: "Placeholder — results.",
    body: "",
    stats: [{ value: "$1.47M", label: "Pipeline built, under 6 months" }],
    closing: "Full results pending final copy.",
  },
];

function ChapterCard({
  index,
  eyebrow,
  title,
  teaser,
  stats,
  inView,
  delay,
  onOpen,
}: {
  index: string;
  eyebrow: string;
  title: string;
  teaser: string;
  stats: { value: string; label: string }[];
  inView: boolean;
  delay: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <div
        onClick={onOpen}
        className="group relative cursor-pointer overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "border-color 0.24s ease, transform 0.24s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${ACCENT},0.4)`;
          (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Placeholder visual — swap for real screenshots/graphics */}
        <div
          className="relative flex items-end p-8"
          style={{
            height: "clamp(220px, 28vw, 320px)",
            background: `linear-gradient(135deg, rgba(${ACCENT},0.22) 0%, rgba(0,0,0,0.4) 100%)`,
          }}
        >
          <span
            className="font-black tracking-tight select-none"
            style={{ fontSize: "clamp(4rem, 9vw, 7rem)", color: "rgba(255,255,255,0.08)", lineHeight: 1 }}
          >
            {index}
          </span>
        </div>

        <div className="p-8">
          <p
            className="text-xs tracking-[0.22em] uppercase font-medium mb-3"
            style={{ color: `rgba(${ACCENT},0.9)` }}
          >
            {eyebrow}
          </p>
          <h3
            className="font-black tracking-tight leading-none mb-3"
            style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", color: "#f5f5f7" }}
          >
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#86868b", maxWidth: "34rem" }}>
            {teaser}
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
            {stats.map(stat => (
              <div key={stat.label}>
                <div
                  className="font-black tracking-tight leading-none mb-1"
                  style={{ fontSize: "1.5rem", color: `rgb(${ACCENT})` }}
                >
                  {stat.value}
                </div>
                <p className="text-xs uppercase tracking-[0.12em] font-medium" style={{ color: "#515154" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <span
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#f5f5f7" }}
          >
            Read the story
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ScalisPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-5%" });

  const chaptersRef = useRef<HTMLDivElement>(null);
  const chaptersInView = useInView(chaptersRef, { once: true, margin: "-8%" });

  const [openChapter, setOpenChapter] = useState<"apex" | "pipeline" | null>(null);

  return (
    <main className="relative overflow-x-hidden" style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7" }}>
      <Nav />
      <PageBlobs palette="scalis-blue" />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-8 sm:px-14 lg:px-20">
        <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
          >
            Scalis
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            className="font-black tracking-tight leading-[0.92] mb-8"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", color: "#f5f5f7" }}
          >
            <span style={{ display: "block" }}>Building the</span>
            <span style={{ display: "block" }}>growth engine.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="text-base leading-relaxed"
            style={{ color: "#a1a1a6" }}
          >
            Scalis builds AI-powered recruiting software, an ATS that helps companies source, screen, and hire candidates faster. I joined as Marketing Manager to solve one specific problem: get job seekers into the platform without touching the employer-side ad budget. That grew into Apex, a media brand I built from scratch, and eventually into an outbound sales engine for the employer side too. I ended up owning both halves of the same funnel, the audience going in and the revenue coming out.
          </motion.p>
        </div>
      </section>

      {/* ── Chapters ── */}
      <section className="relative pt-4 pb-24 px-8 sm:px-14 lg:px-20">
        <div ref={chaptersRef} className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChapterCard
              index="01"
              eyebrow="Media Brand"
              title="Apex"
              teaser="Built from zero to a real subscriber base, then turned into the acquisition engine that funneled students onto Scalis."
              stats={[
                { value: "250K", label: "Subscribers" },
                { value: "$200K", label: "Revenue" },
                { value: "1.5M", label: "Impressions" },
                { value: "44%", label: "Open rate" },
              ]}
              inView={chaptersInView}
              delay={0.1}
              onOpen={() => setOpenChapter("apex")}
            />
            <ChapterCard
              index="02"
              eyebrow="Go-to-Market"
              title="The Sales Pipeline"
              teaser="The outbound engine that turned employer accounts into real pipeline, built on HubSpot and Apollo in under six months."
              stats={[{ value: "$1.47M", label: "Pipeline, < 6 months" }]}
              inView={chaptersInView}
              delay={0.22}
              onOpen={() => setOpenChapter("pipeline")}
            />
          </div>
        </div>
      </section>

      <Contact />

      <StoryModal
        open={openChapter === "apex"}
        onClose={() => setOpenChapter(null)}
        eyebrow="Media Brand"
        title="Apex"
        cards={APEX_CARDS}
        accent={ACCENT}
      />
      <StoryModal
        open={openChapter === "pipeline"}
        onClose={() => setOpenChapter(null)}
        eyebrow="Go-to-Market"
        title="The Sales Pipeline"
        cards={PIPELINE_CARDS}
        accent={ACCENT}
      />
    </main>
  );
}
