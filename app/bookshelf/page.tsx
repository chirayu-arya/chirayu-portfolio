"use client";

import AppleNav from "../components/AppleNav";
import AppleFooter from "../components/AppleFooter";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";

// Resolves a cover URL — Google Books for reliable coverage, falls back to Open Library
function gbCover(isbn: string) {
  return `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`;
}
function olCover(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

// Cover image with automatic fallback to spine-color placeholder on load error
function BookCover({
  src, fallbackSrc, alt, spineColor, className, style,
}: {
  src: string; fallbackSrc?: string; alt: string; spineColor: string;
  className?: string; style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!triedFallback && fallbackSrc) {
      setTriedFallback(true);
      (e.target as HTMLImageElement).src = fallbackSrc;
    } else {
      setFailed(true);
    }
  }, [fallbackSrc, triedFallback]);

  if (failed) {
    return (
      <div className={className} style={{ ...style, background: spineColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "2rem", opacity: 0.55 }}>📖</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={handleError} />;
}

// ── Design tokens (light Apple) ──────────────────────────────────────────────

const C = {
  page: "#fbfbfd",
  alt: "#f5f5f7",
  card: "#ffffff",
  hairline: "rgba(0,0,0,0.08)",
  hairlineSoft: "rgba(0,0,0,0.06)",
  ink: "#1d1d1f",
  ink2: "#6e6e73",
  ink3: "#86868b",
  amber: "#b08a2e",       // deeper gold for legibility on white
  amberSoft: "rgba(176,138,46,0.12)",
  amberBorder: "rgba(176,138,46,0.32)",
};

const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Types ────────────────────────────────────────────────────────────────────

type BookCategory = "fiction" | "non-fiction" | "self-help" | "biography" | "psychology" | "classics" | "mystery";

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverFallback?: string;
  spineColor: string;
  categories: BookCategory[];
  reading?: boolean;
  allTime?: boolean;
  pages?: number;
  currentPage?: number; // update manually as you read
  bookCount?: number;   // for collections
  quote?: string;       // favourite line or personal take
};

// ── Book data ────────────────────────────────────────────────────────────────

const BOOKS: Book[] = [
  // ── Currently Reading ──
  {
    id: "let-them-theory",
    title: "The Let Them Theory",
    author: "Mel Robbins",
    cover: gbCover("9781401983376"),
    coverFallback: olCover("9781401983376"),
    spineColor: "#C4773B",
    categories: ["self-help"],
    reading: true,
    pages: 272,
    currentPage: 120,
    quote: "Stop managing other people's behaviour and start focusing on your own.",
  },
  {
    id: "mind-magic",
    title: "Mind Magic",
    author: "James R. Doty",
    cover: gbCover("9780593578612"),
    coverFallback: olCover("9780593578612"),
    spineColor: "#6B8ED6",
    categories: ["psychology", "self-help"],
    reading: true,
    pages: 304,
    currentPage: 80,
    quote: "The mind has the power to shape our reality in ways we are only beginning to understand.",
  },

  // ── All-Time Favourites ──
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    cover: gbCover("9781451648539"),
    coverFallback: olCover("9781451648539"),
    spineColor: "#A0A0A0",
    categories: ["biography"],
    allTime: true,
    pages: 656,
    quote: "The people who are crazy enough to think they can change the world are the ones who do.",
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    cover: gbCover("9780735211292"),
    coverFallback: olCover("9780735211292"),
    spineColor: "#E8A030",
    categories: ["self-help"],
    allTime: true,
    pages: 320,
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
  },

  // ── Library ──
  {
    id: "harry-potter",
    title: "Harry Potter Series",
    author: "J.K. Rowling",
    cover: gbCover("9780439708180"),
    coverFallback: olCover("9780439708180"),
    spineColor: "#8B2635",
    categories: ["fiction"],
    bookCount: 7,
    quote: "It does not do to dwell on dreams and forget to live.",
  },
  {
    id: "percy-jackson",
    title: "Percy Jackson Series",
    author: "Rick Riordan",
    cover: gbCover("9780786838653"),
    coverFallback: olCover("9780786838653"),
    spineColor: "#2B6CB0",
    categories: ["fiction"],
    bookCount: 5,
    quote: "Even a half-blood can change the world.",
  },
  {
    id: "sherlock-holmes",
    title: "The Complete Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: gbCover("9780762457816"),
    coverFallback: olCover("9780762457816"),
    spineColor: "#5C4A1E",
    categories: ["fiction", "mystery"],
    quote: "When you eliminate the impossible, whatever remains, however improbable, must be the truth.",
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: gbCover("9780857197689"),
    coverFallback: olCover("9780857197689"),
    spineColor: "#2D6A4F",
    categories: ["non-fiction", "psychology"],
    pages: 256,
    quote: "Doing well with money has little to do with how smart you are and a lot to do with how you behave.",
  },
  {
    id: "the-secret-series",
    title: "The Secret Series",
    author: "Rhonda Byrne",
    cover: gbCover("9781582701707"),
    coverFallback: olCover("9781582701707"),
    spineColor: "#B8860B",
    categories: ["self-help"],
    bookCount: 4,
    quote: "Whatever you think about, you bring about.",
  },
  {
    id: "iliad",
    title: "The Iliad",
    author: "Homer",
    cover: gbCover("9780140275360"),
    coverFallback: olCover("9780140275360"),
    spineColor: "#8B0000",
    categories: ["fiction", "classics"],
    quote: "Even brave men weep.",
  },
  {
    id: "odyssey",
    title: "The Odyssey",
    author: "Homer",
    cover: gbCover("9780140268867"),
    coverFallback: olCover("9780140268867"),
    spineColor: "#1A3A5C",
    categories: ["fiction", "classics"],
    quote: "There is a time for many words, and there is also a time for sleep.",
  },
];

const CATEGORY_FILTERS: { key: BookCategory | "all"; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "fiction",     label: "Fiction" },
  { key: "non-fiction", label: "Non-Fiction" },
  { key: "self-help",   label: "Self-Help" },
  { key: "biography",   label: "Biography" },
  { key: "psychology",  label: "Psychology" },
  { key: "classics",    label: "Classics" },
  { key: "mystery",     label: "Mystery" },
];

// ── Currently Reading Card ───────────────────────────────────────────────────

function CurrentlyReadingCard({ book, index }: { book: Book; index: number }) {
  const pct = book.pages && book.currentPage ? Math.round((book.currentPage / book.pages) * 100) : 0;

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: C.card, border: `1px solid ${C.hairlineSoft}` }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col sm:flex-row gap-7 p-7 sm:p-8 items-start sm:items-stretch">
        {/* Cover */}
        <div className="flex-shrink-0 flex items-center">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              width: 96,
              height: 144,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
            }}
          >
            <BookCover
              src={book.cover} fallbackSrc={book.coverFallback}
              alt={book.title} spineColor={book.spineColor}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3
              className="text-xl font-semibold leading-tight mb-1"
              style={{ color: C.ink, letterSpacing: "-0.02em" }}
            >
              {book.title}
            </h3>
            <p className="text-sm" style={{ color: C.ink2 }}>{book.author}</p>
          </div>

          <div className="flex flex-col gap-3">
            {book.quote && (
              <p className="text-xs italic leading-relaxed" style={{ color: C.ink2 }}>
                &ldquo;{book.quote}&rdquo;
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: C.ink3 }}>
                  Page {book.currentPage} of {book.pages}
                </span>
                <span className="text-xs font-semibold" style={{ color: C.amber }}>{pct}%</span>
              </div>
              <div className="w-full h-1 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                <motion.div
                  className="h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #C4773B, #D4A843)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── All-Time Card ────────────────────────────────────────────────────────────

function AllTimeCard({ book, index }: { book: Book; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: C.card, border: `1px solid ${C.hairlineSoft}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="p-6 flex gap-5 items-start">
        {/* Cover */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            width: 72,
            height: 108,
            boxShadow: "0 4px 14px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <BookCover
            src={book.cover} fallbackSrc={book.coverFallback}
            alt={book.title} spineColor={book.spineColor}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
            style={{ background: C.amberSoft, color: C.amber, border: `1px solid ${C.amberBorder}` }}
          >
            ★ All-Time
          </div>
          <h3
            className="text-base font-semibold leading-snug"
            style={{ color: C.ink, letterSpacing: "-0.01em" }}
          >
            {book.title}
          </h3>
          <p className="text-xs" style={{ color: C.ink2 }}>{book.author}</p>
          {book.pages && (
            <p className="text-xs" style={{ color: C.ink3 }}>{book.pages.toLocaleString()} pages</p>
          )}
        </div>
      </div>

      {book.quote && (
        <div className="px-6 pb-6">
          <div className="pt-4" style={{ borderTop: `1px solid ${C.hairlineSoft}` }}>
            <p className="text-xs italic leading-relaxed" style={{ color: C.ink2 }}>
              &ldquo;{book.quote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Library Card ─────────────────────────────────────────────────────────────

function LibraryBookCard({ book, index }: { book: Book; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const row = Math.floor(index / 3);
  const col = index % 3;

  return (
    <div ref={ref} className="library-card-wrap">
      <motion.div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{ background: C.card, border: `1px solid ${C.hairlineSoft}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: (row + col) * 0.03 }}
      >
        {/* Cover image */}
        <div className="relative w-full overflow-hidden" style={{ height: 180, background: C.alt }}>
          {/* Spine color subtle bg fallback */}
          <div className="absolute inset-0" style={{ background: book.spineColor, opacity: 0.25 }} />

          <BookCover
            src={book.cover} fallbackSrc={book.coverFallback}
            alt={book.title} spineColor={book.spineColor}
            className="w-full h-full object-cover object-top"
            style={{ display: "block" }}
          />

          {/* Soft white gradient at bottom for legibility */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "55%",
              background: "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Tags */}
          <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap">
            {book.reading && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: C.amberSoft, color: C.amber, border: `1px solid ${C.amberBorder}` }}
              >
                Reading
              </span>
            )}
            {book.allTime && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: C.amberSoft, color: C.amber, border: `1px solid ${C.amberBorder}` }}
              >
                ★ All-Time
              </span>
            )}
            {book.bookCount && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.92)", color: C.ink, border: `1px solid ${C.hairlineSoft}` }}
              >
                {book.bookCount} books
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1.5">
          <p className="text-sm font-semibold leading-snug" style={{ color: C.ink, letterSpacing: "-0.01em" }}>
            {book.title}
          </p>
          <p className="text-xs" style={{ color: C.ink2 }}>{book.author}</p>
          {book.quote && (
            <p className="text-xs italic leading-relaxed mt-1" style={{ color: C.ink3 }}>
              &ldquo;{book.quote}&rdquo;
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BookshelfPage() {
  const [activeCategory, setActiveCategory] = useState<BookCategory | "all">("all");

  const currentlyReading = BOOKS.filter((b) => b.reading);
  const allTimeFavs = BOOKS.filter((b) => b.allTime);

  const libraryBooks = BOOKS.filter((b) =>
    activeCategory === "all" ? true : b.categories.includes(activeCategory as BookCategory)
  );

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.page, fontFamily: SF }}
    >
      <AppleNav />

      <div className="relative z-10 px-8 sm:px-14 lg:px-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-12">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <motion.h1
              className="font-semibold"
              style={{
                fontSize: "clamp(3rem, 7vw, 7rem)",
                color: C.ink,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                padding: "0.1em 0",
              }}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            >
              My reading list.
            </motion.h1>
            <motion.p
              className="text-sm hidden sm:block"
              style={{ color: C.ink2, paddingBottom: "0.4rem", maxWidth: "26rem", textAlign: "right" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            >
              Some shaped how I think. Some I revisit every year. Some I couldn&apos;t put down.
            </motion.p>
          </div>
        </section>

        <div className="flex flex-col gap-16 pb-24">

          {/* ── Currently Reading ──────────────────────────────────────────── */}
          {currentlyReading.length > 0 && (
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentlyReading.map((book, i) => (
                  <CurrentlyReadingCard key={book.id} book={book} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── All-Time Favourites ────────────────────────────────────────── */}
          {allTimeFavs.length > 0 && (
            <section>
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1.0, ease: EASE }}
                className="font-semibold mb-10"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  color: C.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  padding: "0.1em 0",
                }}
              >
                The hall of fame.
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allTimeFavs.map((book, i) => (
                  <AllTimeCard key={book.id} book={book} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── Library ───────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between gap-8 mb-10 flex-wrap">
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1.0, ease: EASE }}
                className="font-semibold"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  color: C.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  padding: "0.1em 0",
                }}
              >
                The full shelf.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                className="text-sm hidden sm:block"
                style={{ color: C.ink2, paddingBottom: "0.4rem", maxWidth: "22rem", textAlign: "right" }}
              >
                {libraryBooks.length} of {BOOKS.length} books, by category.
              </motion.p>
            </div>

            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap mb-8">
              {CATEGORY_FILTERS.map(({ key, label }) => {
                const active = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                    style={{
                      background: active ? C.amberSoft : C.card,
                      color: active ? C.amber : C.ink2,
                      border: `1px solid ${active ? C.amberBorder : C.hairlineSoft}`,
                      transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {libraryBooks.length === 0 ? (
              <p className="text-sm py-16 text-center" style={{ color: C.ink3 }}>
                No books in this category yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {libraryBooks.map((book, i) => (
                  <LibraryBookCard key={book.id} book={book} index={i} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>

      <AppleFooter />
    </main>
  );
}
