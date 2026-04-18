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
- `Resume.pdf` — resume file, linked from Nav "View Resume" and accessible at /Resume.pdf

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
- Desktop: floating glass pill, centered, fixed top. Links: Home, About, Gallery, Work (dropdown), LinkedIn, View Resume
- Mobile: glass bar with Home, About, Gallery left; LinkedIn + hamburger right
- Work dropdown: single column — Branding & Marketing, UI & UX, Visual Arts (→ /gallery)
- Mobile hamburger dropdown: work items + "View Resume" CTA (links to /Resume.pdf, target _blank)
- Desktop "View Resume" pill links to /Resume.pdf (target _blank)
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
- CTAs: "View Work" (→ #work) and "Get in Touch" (→ mailto:chirayuarya21@gmail.com)

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
- Desktop layout: 12-col grid with a SINGLE flex-col div spanning both rows (col 1-7, row-span-2) using `justify-between` to pin headline to top, pills to bottom, and bio in middle with equal gaps
  - Single col 1-7 div: `hidden lg:flex flex-col justify-between`, `row-start-1 row-span-2` — contains headline, bio, pills
  - Portrait col 8-12: `row-span-2`, `aspect-[3/4]`
  - This pattern is CRITICAL: do NOT split into separate grid rows for desktop or the equal-gap layout breaks
- Mobile: headline (order-1) → portrait (order-2) → bio+pills (order-3), all in separate `lg:hidden` divs
- Portrait: `Chirayu Full.png`, `aspect-[3/4]`, `rounded-3xl`
- Tech stack pills:
  - Desktop: grouped by category in separate rows
  - Mobile: all pills flat in one continuous centered wrap (no category separation)
  - Categories: Design (Figma, Photoshop, Illustrator, Spline, Blender), Video & Motion (Final Cut Pro, Premiere Pro, After Effects), Analytics (Power BI, Tableau), AI (Claude, ChatGPT, Gemini), CRM (HubSpot, Apollo.io, Salesforce)
- Interest tiles (2-col grid on mobile, 4-col on desktop), BELOW the portrait/bio grid:
  - Layout: `flex flex-row items-center gap-4` (icon left, text right) inside each card
  - Gaming: icon purple (#a78bfa), "Currently playing", "Clair Obscur: Expedition 33"
  - Guitar: icon sky-blue (#7dd3fc), "Currently playing and listening to", "Coldplay"
  - Photography: icon amber (#fbbf24), "Currently exploring", "Virtual Photography"
  - Digital Art: icon rose (#fb7185), "Currently working on", "NFT NYC Showcase 2026"
  - Hover: `whileHover={{ y: -5, transition: { duration: 0.18, ease: "easeOut" } }}`, border changes to glowColor, box-shadow glow (NOT filter: drop-shadow — Framer Motion interferes)
- "Learn More" button below interest tiles links to /about

### Work (app/components/Work.tsx)
- Section: eyebrow "At a Glance", headline "Projects that speak for themselves."
- 4 project cards in 2-col grid (placeholder projects, to be replaced with real work)
- Stats block at bottom (dedicated `statsRef`/`statsInView` — separate from header ref so it triggers independently):
  - 4+ Years, 3M+ Community, 5M+ Impressions, $1.7M Sales Pipeline
  - Uses `SlotNumber` component: slot-machine digit animation, overflow:hidden per digit, translateY strips from 0 to -N*10%
  - Divider `rgba(255,255,255,0.18)` above stats

### Photography (app/components/Photography.tsx)
- Polaroid scatter section on home page
- Eyebrow: "Photography"
- Headline: "Capturing the moments, both real & virtual."
- "Gallery Mode" button uses its own dedicated `btnRef`/`btnInView` (NOT the scatter ref which is `hidden md:block` and never triggers on mobile)
- "Gallery Mode" button links to `/gallery`

### Contact (app/components/Contact.tsx)
- Eyebrow: "Connect With Me"
- Headline: "If it's worth building, it's worth talking about." at `clamp(2rem, 5.5vw, 5rem)` — NOT a job-seeking headline
- CTA: "Get in Touch" with email icon (14×14 SVG), `px-8 py-3 text-sm`, links to `mailto:chirayuarya21@gmail.com`
- Footer: © year Chirayu Arya | Instagram, Medium, X (social links currently #, to be updated)

## Known Gotchas
- **Next.js build cache**: if a component is deleted and its import removed from page.tsx but the error persists, run `rm -rf .next` and restart the dev server.
- **Framer Motion + box-shadow**: use CSS `box-shadow` for glow effects on hover cards, NOT `filter: drop-shadow`. Framer Motion's animation system can interfere with `filter` when `whileHover` is active.
- **useInView on hidden elements**: if a ref is on a `hidden md:block` element, `useInView` never triggers on mobile. Always give mobile-visible elements their own dedicated ref.
- **whileHover transition speed**: add `transition: { duration, ease }` INSIDE the `whileHover` object to decouple hover speed from entrance animation speed.
- **About desktop layout**: must use a single flex-col div spanning row-span-2 with justify-between. Do NOT split headline and bio into separate grid rows — the visual gap calculation breaks.

## Content Placeholders (still needed from user)
- `/about` hero: personal bio paragraph
- `/about` hero: "Listening to" chip content
- `/about` marquee: real company/brand logos
- Contact footer: real social media links (Instagram, Medium, X)
- Work section: real project cards to replace placeholders

## Git
- Branch: `main` (production)
- Git identity: Chirayu Arya, chirayuarya21@gmail.com (set globally)
- GitHub repo: chirayu-arya/chirayu-portfolio
- Last session commits: resume PDF added, CTAs swapped between Nav/Hero, interest tiles, slot machine stats, contact footer revamp, photography copy, About layout fix
