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
- `animate-marquee` — infinite horizontal scroll, used on /about logo strip

## Pages

### `/` (Home — app/page.tsx)
Components rendered in order: Nav, Hero, About, Featured, Work, Photography, Contact

### `/about` (app/about/page.tsx)
Sections in order:
1. Hero — warm gradient blobs (amber/coral/teal), headline, bio, "currently" chips, stagger-animated interests pills, portrait photo placeholder
2. Marquee — infinite scrolling logo strip (placeholders, user to supply real logos)
3. Experience — 2-col grid, `borderBottom` dividers between rows, no divider before first entries
4. Education — same pattern as Experience

## Components

### Nav (app/components/Nav.tsx)
- Desktop: floating glass pill, centered, fixed top
- Mobile: glass bar with Home, About left; LinkedIn + hamburger right
- Work dropdown with 2 columns of links
- "Get In Touch" CTA in mobile hamburger dropdown

### Hero (app/components/Hero.tsx)
- Full-screen, Spline 3D background fades to 20% opacity after load (fallback: 4.5s)
- Gradient blobs: purple, blue, pink, teal
- Memoji with cursor reveal effect (hover reveals photo underneath)
- Wave bubble on headline hover
- Footer line: role + location

### About (app/components/About.tsx)
- Section on home page, links to /about via "Learn More" button
- 3-item grid layout on desktop (headline, portrait, bio — reordered on mobile: headline, portrait, bio)
- Tech stack pills: Design, Video & Motion, AI (Claude + ChatGPT)
- Stats: 4+ Years, 3M+ Community, 5M+ Monthly Reach, $1.7M Sales Pipeline
- Stats divider: `rgba(255,255,255,0.18)` (prominent)

## Content Placeholders (still needed from user)
- `/about` hero: personal bio paragraph (replace placeholder text)
- `/about` hero: "Listening to" chip content
- `/about` marquee: real company/brand logos
- `/about` experience: all 4 role entries (role, company, dates, description)
- `/about` education: both degree entries (degree, school, dates, description)
- Portrait photo for both home About section and /about hero

## Git
- Branch: `main` (production)
- Git identity: Chirayu Arya, chirayuarya21@gmail.com (set globally)
- GitHub repo: chirayu-arya/chirayu-portfolio
