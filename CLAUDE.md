# Chirayu Arya Portfolio — Project Notes

## Stack
- Next.js (App Router), React, TypeScript
- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css)
- Framer Motion for all animations
- Deployed on Vercel, production on `main` branch
- Site URL: https://chirayuarya.com

## Local Dev
- Run: `npm run dev` on port 3000
- Launch config: `.claude/launch.json` (server name: "Portfolio")

## Design System
- Background: `#000`
- Text primary: `#f5f5f7`
- Text secondary: `#86868b`
- Text muted: `#515154`
- No box shadows on cards, badges, or components
- No em-dashes — use commas, colons, or periods instead
- Hover states: cursor pointer only, no color changes or shadows
- Animations: Framer Motion with `ease: [0.16, 1, 0.3, 1]`, `useInView` with `once: true, margin: "-8%"`
- Responsive breakpoint for layout changes: `lg:` (1024px)

## Custom CSS (globals.css)
- `glow-bluepurple` — pulsing blue/purple text shadow animation, used on hero and about headline
- `animate-marquee` — infinite horizontal scroll (`@keyframes marquee-scroll`), used on /about logo strip

## Images (public/)
- `Chirayu Full.png` — main portrait photo, used in home About section and /about hero
- `Chirayu Reveal.png` — photo revealed on hover under Memoji in home Hero
- `Memoji 3.png` — Memoji used in home Hero
- `Chirayu Square.png` — square crop (unused currently)
- `favicon.svg`

## Pages

### `/` (Home — app/page.tsx)
Components rendered in order: Nav, Hero, About, Featured, Work, Photography, Contact

### `/about` (app/about/page.tsx)
Sections in order:
1. Hero — warm gradient blobs (amber/coral/teal), 3-part grid (label+headline+bio | portrait | currently chips+interests pills)
2. Marquee — infinite scrolling logo strip (placeholders, user to supply real logos)
3. Experience — 2-col grid, `borderBottom` dividers between rows, no divider above first entries
4. Education — same pattern as Experience

Mobile order on /about hero: label+headline+bio → portrait → currently chips+interests pills

## Components

### Nav (app/components/Nav.tsx)
- Desktop: floating glass pill, centered, fixed top. Links: Home, About, Work (dropdown), LinkedIn, Get In Touch
- Mobile: glass bar with Home, About left; LinkedIn + hamburger right
- Work dropdown: 2 columns (Branding & Marketing, UI & UX, Photography | Illustrations, Virtual Photography)
- "Get In Touch" CTA in mobile hamburger dropdown
- Nav label is "About" (not "About Me")

### Hero (app/components/Hero.tsx)
- Full-screen, Spline 3D background fades to 20% opacity after load (fallback: 4.5s)
- Gradient blobs: purple, blue, pink, teal
- Memoji (Memoji 3.png) with cursor reveal effect (hover/touch reveals Chirayu Reveal.png underneath)
- Wave bubble on headline hover
- Footer line: role + location

### About (app/components/About.tsx)
- Section on home page, links to /about via "Learn More" button
- 3-part CSS grid on desktop: headline (col 1-7 row 1) | portrait (col 8-12 row 1-2) | bio+pills+stats (col 1-7 row 2)
- Mobile order: headline → portrait → bio+pills+stats
- Portrait: `Chirayu Full.png`, `object-cover`, rounded-3xl
- Tech stack pills: Design (Figma, Photoshop, Illustrator, Spline, Blender), Video & Motion (Final Cut Pro, Premiere Pro, After Effects), AI (Claude, ChatGPT)
- Stats: 4+ Years, 3M+ Community, 5M+ Monthly Reach, $1.7M Sales Pipeline
- Stats: `text-2xl sm:text-4xl`, gap `gap-4 sm:gap-10`, divider `rgba(255,255,255,0.18)`

## Content Placeholders (still needed from user)
- `/about` hero: personal bio paragraph
- `/about` hero: "Listening to" chip content
- `/about` marquee: real company/brand logos
- `/about` experience: all 4 role entries (role, company, dates, description)
- `/about` education: both degree entries (degree, school, dates, description)

## Git
- Branch: `main` (production)
- Git identity: Chirayu Arya, chirayuarya21@gmail.com (set globally)
- GitHub repo: chirayu-arya/chirayu-portfolio
