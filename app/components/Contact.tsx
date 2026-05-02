"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Medium", href: "#" },
  { label: "X", href: "#" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="contact" className="pt-36 pb-24 px-8 sm:px-14 lg:px-20" style={{ background: "#000" }}>
      <div>

        {/* Big CTA */}
        <div ref={ref} className="text-center mb-28">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-8"
            style={{ color: "#86868b" }}
          >
            Connect With Me
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-bold tracking-tight leading-[0.9] mb-12"
            style={{ fontSize: "clamp(3rem, 6.5vw, 6rem)", color: "#f5f5f7" }}
          >
            If it's worth building,
            <br />
            <span style={{ color: "#f5f5f7" }}>it's worth talking about.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
          >
            <motion.a
              href="mailto:chirayuarya21@gmail.com"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85"
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Get in Touch
            </motion.a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-sm" style={{ color: "#f5f5f7" }}>
            © {new Date().getFullYear()} Chirayu Arya
          </span>
          <div className="flex items-center gap-7">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm transition-colors duration-200 cursor-pointer"
                style={{ color: "#f5f5f7" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
                onMouseLeave={e => (e.currentTarget.style.color = "#f5f5f7")}
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
