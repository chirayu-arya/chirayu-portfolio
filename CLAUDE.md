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
- `shimmer-text` — aurora sweep gradient animation (defined but currently unused)
- `@media (pointer: fine) { cursor: none !important }` — hides default cursor for CustomCursor component
- `.bg-blob` — standard class for all background gradient blobs across every page. Desktop: `filter: blur(60px)`. Mobile (`pointer: coarse`): `filter: none !important; opacity: 0.55`. Always use this class instead of inline `filter: blur()` — inline blur on absolute divs forces GPU repaint on every scroll frame.
- `.mobile-no-backdrop` — strips `backdrop-filter` and `-webkit-backdrop-filter` on touch devices. Applied to glass bubble overlays in Hero that sit over complex content.
- `.physics-ps-buttons` — wrapper for the `PhysicsPSButtons` component on /gaming. Set to `display: none` on mobile (`pointer: coarse`) to skip the rAF physics loop entirely.
- `.library-card-wrap` — outer wrapper for /gaming library cards; owns CSS hover lift (`translateY(-8px)`, `transition: 0.32s`). Kept separate from the inner `motion.div` so Framer Motion's inline transform never conflicts with the CSS hover transform (which causes a GPU layer-swap seam mid-animation)

## Images (public/)
- `Chirayu Full.png` — main portrait photo, used in home About section and /about hero
- `Chirayu Reveal.png` — photo revealed on hover under Memoji in home Hero (also used as placeholder in /about 3-photo panel)
- `Memoji 3.png` — Memoji used in home Hero
- `Chirayu Square.png` — square crop (used as placeholder in /about 3-photo panel)
- `favicon.svg` — original SVG favicon (kept for reference)
- `Resume.pdf` — resume file, linked from Nav "View Resume" and accessible at /Resume.pdf
- `PS-Plus.png` — PlayStation Plus logo, used in /gaming headline badge

## Pages

### `/` (Home — app/page.tsx)
Components rendered in order: Nav, Hero, About, Featured, Work, Photography, Contact

### `/about` (app/about/page.tsx)
Sections in order:
1. Hero — warm gradient blobs (amber/coral/teal), GPU-accelerated (`will-change: transform, translateZ(0)`)
   - Centered headline: "I believe in infinite possibilities." with `glow-bluepurple` on "infinite possibilities."
   - 2-col layout below: bio text (col 1-7) | 3 placeholder images (col 8-12, equal height via flex-col + flex-1 + min-h-0)
   - Full-width centered "Things I love" pills below the grid
2. Marquee — infinite scrolling logo strip (placeholders, user to supply real logos)
3. Experience — 2-col grid, `borderBottom` dividers between rows, no divider above first entries
4. Education — same pattern as Experience
5. Contact footer

Bio text: full personal story with italic phrases ("You can carve your own path.", "There's always more than one path.") and bold highlights. Color: `#f5f5f7`.

"Things I love" pills: Photography, Movies, Travel, Music, Writing, Fitness, Design, Cooking, Gaming, Guitar, Vibe-coding (11 pills, 2 rows). Each pill has hover elevation (`whileHover: { y: -4 }`) and background brighten via `onMouseEnter/Leave`. Uses `PillItem` component with `onAnimationComplete` pattern to avoid hover exit delay.

### `/gallery` (app/gallery/page.tsx)
- Headline: "Take a deep dive!" (centered, bold, clamp font size)
- Centered Photography | Illustrations segmented toggle with animated sliding pill
- 30 photography cards, 18 illustration cards (placeholder)
- True double-sided card flip on toggle: each card has front (photo) and back (illustration), rotates 0deg to 180deg with diagonal stagger (top-left to bottom-right, `delay = (row + col) * 0.055s`)
- Cards: 4:3 aspect ratio, noise texture, hover lift + glow + gradient + text overlay, custom "View" cursor pill
- Lightbox modal on card click
- Colourful background blobs (purple, pink, blue, teal, amber)
- Contact footer at bottom

### `/gaming` (app/gaming/page.tsx) — BUILT 2026-04-25
Full PlayStation gaming dashboard connected to live PSN API.

**Header (responsive):**
- Desktop eyebrow: "GAMING DASHBOARD · PLAYSTATION" left-aligned, `PSButtons` component right-aligned (`hidden sm:block`)
- Mobile eyebrow: "Gaming Dashboard" only (shorter, no PlayStation suffix), Photo Mode button replaces PSButtons (`sm:hidden`)
- Headline: desktop = "I am Techno_Naut!" (`hidden sm:inline`), mobile = "Techno_Naut" only (`sm:hidden`), both at smaller size (`text-3xl sm:text-6xl lg:text-7xl`)
- `PS-Plus.png` badge: `w-9 h-9 sm:w-[52px] sm:h-[52px]`, `objectFit: contain`
- "Photo Mode" button (camera icon): appears right of desktop headline and in mobile eyebrow row, links to `instagram.com/technonaut.frames`

**Background:**
- 3 PS blue radial gradient blobs (fixed, GPU-accelerated)
- `PhysicsPSButtons` component: 4 giant PS button SVGs (cross/circle/triangle/square, 160–280px) with real physics — `requestAnimationFrame` loop, elastic circle-circle collision, wall bounce. Velocities: ~1.3–1.7 px/frame. Each has colored `drop-shadow` glow in its own color. Positions driven via `useMotionValue` for zero-overhead rendering.

**Trophy Dashboard (`TrophyDashboard` component):**
- Left: 160×160 SVG ring animated with `stroke-dashoffset`, gradient (platinum→gold→bronze), level number centered
- Right: animated horizontal bars — order is **Platinum, Gold, Silver, Bronze** (top to bottom)
- 🏆 emoji before total trophy count
- Amber/gold gradient overlay (`rgba(212,168,67,0.13)`) in top-left corner, amber tint on border
- `whileHover: { y: -4, borderColor: gold tint }` on outer card

**Currently Playing:**
- 2-column grid, 2 most recent games from `recentlyPlayed`
- Layout: `lg:items-stretch` + `justify-between` on content column — "Currently Playing" eyebrow pinned to top, stats pinned to bottom, both cards align uniformly regardless of content
- `whileHover: { y: -8, scale: 1.015 }` on each card
- Game name: `text-xl lg:text-2xl`

**Recently Played strip:**
- Games 3–10 from `recentlyPlayed`, horizontal scroll only — no vertical hover movement
- Entrance animation: `x: 16 → 0` (not y) — natural for a horizontal strip
- Container: `alignItems: flex-start`, `paddingTop: 4px`, `paddingBottom: 2px` — cards align to natural height, no extra gap below
- Platform tag: white text (`#f5f5f7`), rendered after gradient div in DOM so it paints on top

**My Library:**
- Full `library` array (played games enriched with trophy data)
- Count shows `totalLibraryCount` (from `getPurchasedGames`, ~1,396)
- Search bar + status filter only: **All, Completed, In Progress, Not Started** — sort and platform filter removed
- Filter logic based on **play time** (not trophy progress): In Progress = `parseDurationHours > 0 && trophy < 100`, Not Started = `parseDurationHours === 0`
- 3-column grid of `LibraryCard` components
- Hover: outer `div.library-card-wrap` (CSS `translateY(-8px)`) wraps inner `motion.div` (entrance only) — keeps CSS hover and FM entrance animation on separate elements to prevent GPU layer-swap seam
- Image container: fixed `height: 160px` (not `aspect-video`) to eliminate fractional-pixel gap
- `object-cover object-top` on images
- Platform tag: white text, gradient div rendered before tag divs in DOM so tags always appear on top
- No Contact footer

**API Route (`app/api/psn/route.ts`):**
- Server-side, 5-min in-memory cache
- Calls: `exchangeNpssoForAccessCode` → `exchangeAccessCodeForAuthTokens`
- Fetches in parallel: `getUserTitles(limit:200)`, `getUserTrophyProfileSummary`, `getUserPlayedGames(limit:200, offset:0)`, `getPurchasedGames(size:2000)`
- Merges trophy data into played games by lowercase name match
- Returns: `{ titles, trophySummary, recentlyPlayed, library, totalLibraryCount }`
- Env var: `PSN_NPSSO` (in `.env.local` and Vercel production). Token expires ~every 60 days — refresh at `https://ca.account.sony.com/api/v1/ssocookie`

**PSButtons component:** 4 inline SVG PS button icons (cross=blue `#6B8ED6`, circle=red `#C44B4B`, triangle=teal `#4BAE8A`, square=purple `#BA7CC4`), used in eyebrow row at `opacity={0.5}`

### `/bookshelf` (app/bookshelf/page.tsx) — BUILT 2026-04-27
Personal reading page. Warm amber/sepia design system (same dark bg, but amber blobs and accents instead of blue/purple). No Contact footer.

**Sections:**
1. **Hero** — eyebrow "Bookshelf", headline "The books that built me.", warm subtitle. Amber radial gradient blobs.
2. **Currently Reading** — 2-col grid of `CurrentlyReadingCard`. Blurred cover as background with sepia overlay, amber progress bar (page-based), quote. Mirrors Currently Playing layout on /gaming.
3. **All-Time Favourites** — 2-col grid of `AllTimeCard`. Noise texture, amber gradient overlay, "★ All-Time" amber badge, cover + quote with hairline divider.
4. **Library** — 3-col grid of `LibraryBookCard` with category filter pills (All, Fiction, Non-Fiction, Self-Help, Biography, Psychology, Classics, Mystery).

**Book data (hardcoded in page — no API):**
- Currently Reading: The Let Them Theory (Mel Robbins), Mind Magic (James R. Doty)
- All-Time: Steve Jobs (Walter Isaacson), Atomic Habits (James Clear)
- Library: Harry Potter Series (7), Percy Jackson Series (5), The Complete Sherlock Holmes, The Psychology of Money, The Secret Series (4), The Iliad, The Odyssey

**Cover images:** `BookCover` component with 3-tier fallback:
1. Google Books CDN (`books.google.com/books/content?vid=ISBN{isbn}`) — reliable for new/recent books
2. Open Library (`covers.openlibrary.org/b/isbn/{isbn}-L.jpg`) — fallback
3. Spine-color placeholder div — final fallback, never shows broken image

**`Book` type fields:** `id, title, author, cover, coverFallback, spineColor, categories, reading?, allTime?, pages?, currentPage?, bookCount?, quote?`

**Accent color:** `#D4A843` (amber/gold) — used for eyebrows, progress bars, active filter pills, badges, borders

## Components

### Nav (app/components/Nav.tsx)
- Desktop: floating glass pill, centered, fixed top. Links: Home, About, Gallery, Work (dropdown), LinkedIn, View Resume
- Mobile: glass bar with Home, About, Gallery left; LinkedIn + hamburger right
- Work dropdown: **2-column layout**
  - Left col eyebrow "Professional": Branding & Marketing (→ #brand-marketing), UI & UX (→ #ui-ux), Visual Arts (→ /gallery)
  - Right col eyebrow "Interest Areas": Gaming (→ /gaming), Bookshelf (→ /bookshelf)
  - Vertical divider between columns: `rgba(255,255,255,0.07)`
- Mobile hamburger: same 2-col layout + "View Resume" CTA below divider
- Desktop "View Resume" pill links to /Resume.pdf (target _blank)
- `dropdownGlassStyle`: same blur/border/shadow as `glassStyle` but background opacity `0.82` — needed because the dropdown sits over colorful hero content where backdrop-filter alone isn't enough
- `NavColumn` component handles each column (label, items, startDelay, onClose)
- **Mobile style (no backdrop-filter)**: `mobileGlassStyle` = `{ background: "rgba(10,10,12,0.94)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }`. Mobile nav bar and hamburger dropdown use these styles instead of the blur-heavy desktop styles — `backdrop-filter: blur(64px)` was causing severe frame drops on mobile.

### Hero (app/components/Hero.tsx)
- Full-screen, Spline 3D background fades to 0% opacity after load (fallback: 4.5s)
- 3 gradient blobs: purple (top-left), blue (top-right), pink (bottom-center)
- Footer line: role + location, `font-medium`, two-line on mobile
- Memoji (Memoji 3.png) with cursor/touch reveal effect (reveals Chirayu Reveal.png underneath via radial mask)
- Wave bubble (👋) on hover/touch:
  - Desktop: appears top-right of headline (`bottom: calc(100% - 20px), right: -2.5rem`), `hidden sm:block`
  - Mobile: appears diagonally above top-right of Memoji (`top: -1rem, right: -1rem`), `sm:hidden`
- StarField canvas fades in with content after Spline intro completes
- CTAs wrapped in `MagneticButton`: "View Work" (→ #work) and "Get in Touch" (→ mailto:chirayuarya21@gmail.com)
- Bio copy (desktop): "Most people treat design & marketing as separate things. I don't. / Design without strategy is decoration. Marketing without craft is noise. / I believe in working at the intersection, and creating an impact." (`hidden sm:inline`)
- Bio copy (mobile): "Most people treat design & marketing as separate things. / I believe in working at the intersection." — condensed 2-line version (`sm:hidden`)

### CustomCursor (app/components/CustomCursor.tsx)
- Global component, mounted in `app/layout.tsx`
- **Redesigned 2026-04-25, refined 2026-04-26**: two layers, both snap exactly via `useMotionValue` (no `useSpring`, zero lag)
  - Layer 1 (z:99997): **16px** transparent div, `box-shadow: "0 0 10px 5px rgba(168,85,247,0.6), 0 0 24px 10px rgba(139,92,246,0.22)"` — **purple** glow spreads outward only
  - Layer 2 (z:99998): **16px** white circle, `mixBlendMode: "difference"` — inverts underlying colors
  - On hover (`a, button, [role='button'], input, select, textarea, [data-magnetic]`): both scale to 1.5x, transition 0.18–0.22s
- Touch devices (`pointer: coarse`): returns null, default cursor shown
- Mouse leave/enter page: fades in/out
- **Key gotcha**: glow must use `box-shadow` on a transparent div, NOT a filled circle or radial gradient — filled center gets inverted by the blend mode layer and looks wrong

### MagneticButton (app/components/MagneticButton.tsx)
- Wraps any element with spring-physics pull toward cursor
- `strength` prop (default 0.38) controls pull intensity
- Springs: stiffness 220, damping 18, mass 0.5
- On mouse leave: springs back to center
- Applied to hero CTAs; can be added to any button

### StarField (app/components/StarField.tsx)
- HTML5 Canvas, `pointer-events: none`, `zIndex: 2`
- 420 stars across 3 depth layers: far (220), mid (140), near (60)
- Twinkle, vertical fade, scroll parallax, cursor proximity glow (desktop)
- Mobile: deviceorientation parallax, no glow
- Shooting stars every 10-12s
- **Mobile skip**: `useEffect` returns early if `window.matchMedia("(pointer: coarse)").matches` — entire rAF loop is never started on touch devices, eliminating a major source of mobile jank.

### About (app/components/About.tsx)
- Section on home page, links to /about via "Learn More" button
- Desktop layout: single flex-col div spanning row-span-2 with `justify-between` (CRITICAL — do not split)
- Interest tiles hover: `onAnimationComplete` pattern to fix hover exit delay
  - `entered` state: after entrance anim completes, switches to fast `{ duration: 0.18 }` transition
  - This prevents the entrance delay from applying on hover exit

### Work (app/components/Work.tsx)
- Eyebrow "At a Glance", headline "Projects that speak for themselves."
- 4 placeholder project cards, 2-col grid
- Stats: SlotNumber slot-machine animation, dedicated `statsRef`/`statsInView`
  - 4+ Years, 3M+ Community, 5M+ Impressions, $1.7M Sales Pipeline

### Photography (app/components/Photography.tsx)
- Eyebrow: "Photography", Headline: "Capturing the moments, both real & virtual."
- "Gallery Mode" button: dedicated `btnRef`/`btnInView`

### Contact (app/components/Contact.tsx)
- Eyebrow: "Connect With Me"
- Headline: "If it's worth building, it's worth talking about."
- CTA: "Get in Touch" → `mailto:chirayuarya21@gmail.com`
- Footer: © year Chirayu Arya | Instagram, Medium, X (links still #)

## SEO & Meta (app/layout.tsx)
- `app/opengraph-image.tsx` — dynamic OG image (1200×630): dark bg with blue/purple gradient blobs, "CA" logo mark, name, tagline "Marketing · Design · Photography"
- `app/icon.tsx` — dynamic PNG favicon (32×32): dark bg, blue/purple glows, "CA" text — replaces globe icon in Google Search
- JSON-LD Person schema in `<head>`
- `metadataBase`, `openGraph`, `twitter` card all wired up
- `app/robots.ts` — `allow: "/"`, points to sitemap
- `app/sitemap.ts` — uses `existsSync` to only include routes that have an actual `page.tsx` or `page.js` file. Skips `components/` and `api/`. Priority: `/` = 1.0, all others = 0.8.
- **Per-page metadata** via route-level `layout.tsx` files (metadata can't be exported from `"use client"` pages — layouts are server components):
  - `app/about/layout.tsx` — "About | Chirayu Arya"
  - `app/gallery/layout.tsx` — "Gallery | Chirayu Arya"
  - `app/gaming/layout.tsx` — "Gaming | Chirayu Arya"
  - `app/bookshelf/layout.tsx` — "Bookshelf | Chirayu Arya"
- Google Search Console: sitemap submitted, /gaming and /bookshelf need manual "Request Indexing" via URL Inspection tool

## Known Gotchas
- **Next.js build cache**: if a component is deleted and its import removed, run `rm -rf .next` and restart.
- **Framer Motion + box-shadow**: use CSS `box-shadow` for glow on hover, NOT `filter: drop-shadow`.
- **useInView on hidden elements**: refs on `hidden md:block` elements never trigger on mobile. Always use dedicated refs.
- **whileHover exit delay**: when `transition` prop has a `delay`, hover exit inherits it. Fix: use `onAnimationComplete` to swap to a fast `transition` after entrance completes.
- **About desktop layout**: single flex-col spanning row-span-2 with justify-between. Never split into separate grid rows.
- **Backdrop-filter on dropdown**: even with identical CSS, the dropdown looks more transparent than the nav because it sits over lighter hero content. Fix: higher background opacity (`0.82`) on the dropdown.
- **Blur blobs + scroll lag**: `filter: blur()` on absolute divs forces repaint on scroll. Fix: `will-change: transform` + `transform: translateZ(0)` on each blob.
- **Framer Motion hover + CSS seam (CRITICAL)**: using `whileHover` with `y` or `scale` on a card that has `overflow-hidden` + nested divs causes a 1px glitch line between sections mid-animation. This is a GPU layer-swap artifact. Fix: split into two elements — outer plain `div` owns CSS hover (`will-change: transform`, `transition`, `:hover { transform: translateY() }`) and inner `motion.div` owns entrance only. CSS transitions are compositor-only and never cause layer swaps.
- **aspect-ratio fractional pixel gap**: `aspect-video` / `aspect-square` on image containers produces fractional pixel heights (e.g. 159.75px) that render as a 1px gap between the image and adjacent content. Fix: use a fixed pixel `height` instead of aspect-ratio classes.
- **Framer Motion filter in style prop**: CSS `filter` set on a `motion.div`'s `style` prop can be overridden by FM's own transform handling. Fix: wrap in an inner plain `div` and put the filter there.
- **PSN NPSSO token**: expires roughly every 60 days. When `/api/psn` returns an error, refresh at `https://ca.account.sony.com/api/v1/ssocookie` and update both `.env.local` and Vercel (`vercel env add PSN_NPSSO production`). Restart dev server after to clear in-memory cache.
- **psn-api getUserPlayedGames**: requires both `limit` AND `offset` in options object — `{ limit: 200, offset: 0 }`. Omitting `offset` fails TypeScript build.
- **Turbopack stale cache**: if a file change isn't reflected after save, restart the dev server. Turbopack can hold compiled output for files that had syntax errors before the fix.
- **Mobile performance audit pattern**: the three main culprits of mobile jank are (1) `backdrop-filter: blur()` on nav/dropdowns — replace with opaque solid background on mobile, (2) `filter: blur()` on background blobs — use `.bg-blob` class which strips blur on `pointer: coarse`, (3) `requestAnimationFrame` loops running on mobile — add early `return` if `pointer: coarse` matches. All three were causing drops to ~20fps on the site before the 2026-04-26 fix.
- **`filter: drop-shadow` on motion.div**: Framer Motion's transform handling can override CSS `filter` set directly on a `motion.div` style prop. Fix: put the filter on a plain inner `div`, not on the `motion.div` itself. This was why PS button glows weren't showing.
- **Physics buttons + rAF**: `requestAnimationFrame` with `useMotionValue.set()` is the correct pattern for physics animations — zero React re-renders, compositor-thread updates only. Always guard the rAF loop with `(pointer: coarse)` check to avoid running on mobile.

## Content Placeholders (still needed from user)
- `/about` hero: 3 real photos for the right-column image panel (currently using Chirayu Full/Square/Reveal as placeholders)
- `/about` marquee: real company/brand logos
- Contact footer: real social media links (Instagram, Medium, X)
- Work section: real project cards
- `/bookshelf`: update `currentPage` values as reading progresses, add more books to the BOOKS array as remembered

## Future Ideas (brainstormed)
- Custom cursor: done
- Magnetic buttons: done (hero CTAs)
- Page transitions between routes
- Scroll-linked bio images on /about (images swap as you scroll through paragraphs)
- Horizontal scroll work/projects carousel
- Noise/grain texture CSS overlay
- "Now" page (/now) for SEO + personal touch
- Testimonials section
- Blog / writing section (/writing)

## Git
- Branch: `main` (production)
- Git identity: Chirayu Arya, chirayuarya21@gmail.com (set globally)
- GitHub repo: chirayu-arya/chirayu-portfolio
- Last session commits (2026-04-25 to 2026-04-27):
  - `a5203ed` — Add /gaming page with live PSN integration and physics background
  - `023e212` — Fix: add required offset param to getUserPlayedGames for TypeScript build
  - `0af74395` — Comprehensive mobile performance fix across all pages (blob blur, Nav backdrop-filter, StarField rAF)
  - `c9de92ca` — Mobile UX polish and cursor redesign (16px purple cursor, gaming mobile header, hero mobile bio)
  - `c2d995ef` — Gaming: simplify library filters and fix recently played strip
  - `c2d8f813` — Fix: reduce recently played bottom padding to match section gap rhythm
  - `a2aac403` — Trophy dashboard: reverse tier order (platinum first) and add trophy emoji
  - `b6e9a88f` — Fix library filters: base In Progress and Not Started on play time
  - `6e1aa224` — Library cards: make platform tag text white
  - `9b4f031c` — Fix library cards: render gradient before tags so tags appear in front
  - `820ab9bd` — Fix recently played cards: platform tag in front of gradient, text white
  - `8faa8d1c` — Gaming: amber gradient on trophy section, align currently playing cards uniformly
  - `ba39284b` — Add /bookshelf page and remove Contact footer from gaming page
  - `8a7f9588` — Bookshelf: fix missing covers with Google Books CDN and onError fallback chain
  - `c3dd2f66` — SEO: add robots.txt, per-page metadata, fix sitemap route detection
