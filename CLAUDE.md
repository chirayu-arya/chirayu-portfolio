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
5. Contact footer

Mobile order on /about hero: label+headline+bio → portrait → currently chips+interests pills

### `/gallery` (app/gallery/page.tsx)
- Headline: "Take a deep dive!" (centered, bold, clamp font size)
- Centered Photography | Illustrations segmented toggle with animated sliding pill
- 30 photography cards, 18 illustration cards (placeholder)
- True double-sided card flip on toggle: each card has front (photo) and back (illustration), rotates 0deg to 180deg with diagonal stagger (top-left to bottom-right, `delay = (row + col) * 0.055s`)
- Cards: 4:3 aspect ratio, noise texture, hover lift + glow + gradient + text overlay, custom "View" cursor pill
- Lightbox modal on card click
- Colourful background blobs (purple, pink, blue, teal, amber)
- Contact footer at bottom

## Components

### Nav (app/components/Nav.tsx)
- Desktop: floating glass pill, centered, fixed top. Links: Home, About, Gallery, Work (dropdown), LinkedIn, Get In Touch
- Mobile: glass bar with Home, About, Gallery left; LinkedIn + hamburger right
- Work dropdown: single column — Branding & Marketing, UI & UX, Visual Arts (→ /gallery)
- "Get In Touch" CTA in mobile hamburger dropdown
- Nav label is "About" (not "About Me")

### Hero (app/components/Hero.tsx)
- Full-screen, Spline 3D background fades to 0% opacity after load (fallback: 4.5s)
- 3 gradient blobs: purple (top-left), blue (top-right), pink (bottom-center)
- No bottom vignette
- Footer line: role + location, `font-medium`, two-line on mobile
- Memoji (Memoji 3.png) with cursor/touch reveal effect (reveals Chirayu Reveal.png underneath via radial mask)
- Wave bubble (👋) on hover/touch:
  - Desktop: appears top-right of headline (`bottom: calc(100% - 20px), right: -2.5rem`), size via clamp, `hidden sm:block`
  - Mobile: appears diagonally above top-right of Memoji (`top: -1rem, right: -1rem`), `w-10 h-10`, `sm:hidden`
- StarField canvas fades in with content after Spline intro completes (wrapped in `motion.div` gated on `introDone`)

### StarField (app/components/StarField.tsx)
- HTML5 Canvas, `pointer-events: none`, `zIndex: 2` (above blobs at z:1, below content at z:10)
- 420 stars across 3 depth layers: far (220), mid (140), near (60)
- Star colours: white, blue-white, soft purple-white palette
- Twinkle: each star breathes opacity at its own random speed/phase
- Vertical fade: stars fully visible at top, completely gone by ~88% of canvas height (canvas `destination-out` gradient mask)
- Desktop behaviour:
  - Stars do NOT move with mouse
  - Scroll drives parallax: near stars drift up faster (`SCROLL_PARALLAX = [0.03, 0.08, 0.18]`), far stars barely move
  - Cursor proximity glow within 148px: purple/blue/lavender per star's assigned palette colour
- Mobile behaviour:
  - Stars distributed evenly (no default parallax offset)
  - `deviceorientation` drives parallax: gamma (left/right tilt) → x shift, beta (front/back, centered at 45°) → y shift
  - iOS 13+: permission requested on first `touchstart`; Android/iOS≤12: immediate
  - No proximity glow on mobile
- Shooting stars: spawn every 10-12s, random position in upper 50% of canvas, 10-40° downward angle, tail grows in then fades out

### About (app/components/About.tsx)
- Section on home page, links to /about via "Learn More" button
- Desktop layout: 12-col grid
  - Row 1: headline (col 1-7) | portrait (col 8-12, row-span-2)
  - Row 2: bio + pills (col 1-7, `self-end` — bottom-aligned to portrait footer)
  - Below grid (full width, centered): stats row with divider above
- Mobile: headline → portrait → bio+pills → stats (all centered)
- Portrait: `Chirayu Full.png`, `aspect-[3/4]`, `rounded-3xl`
- Tech stack pills:
  - Desktop: grouped by category in separate rows
  - Mobile: all pills flat in one continuous centered wrap (no category separation)
  - Categories: Design (Figma, Photoshop, Illustrator, Spline, Blender), Video & Motion (Final Cut Pro, Premiere Pro, After Effects), Analytics (Power BI, Tableau), AI (Claude, ChatGPT, Gemini), CRM (HubSpot, Apollo.io, Salesforce)
- Stats (full-width, centered, each stat text-center): 4+ Years, 3M+ Community, 5M+ Impressions, $1.7M Sales Pipeline
- Stats use `justify-center gap-8 sm:gap-16`, divider `rgba(255,255,255,0.18)` above

### Photography (app/components/Photography.tsx)
- Polaroid scatter section on home page
- "Gallery Mode" button links to `/gallery`

## Content Placeholders (still needed from user)
- `/about` hero: personal bio paragraph
- `/about` hero: "Listening to" chip content
- `/about` marquee: real company/brand logos

## Git
- Branch: `main` (production)
- Git identity: Chirayu Arya, chirayuarya21@gmail.com (set globally)
- GitHub repo: chirayu-arya/chirayu-portfolio
