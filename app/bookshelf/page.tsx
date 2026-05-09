"use client";

import Nav from "../components/Nav";
import PageBlobs from "../components/PageBlobs";
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
        <span style={{ fontSize: "2rem", opacity: 0.5 }}>📖</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={handleError} />;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Book data ─────────────────────────────────────────────────────────────────

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
  { key: "all",        label: "All" },
  { key: "fiction",    label: "Fiction" },
  { key: "non-fiction",label: "Non-Fiction" },
  { key: "self-help",  label: "Self-Help" },
  { key: "biography",  label: "Biography" },
  { key: "psychology", label: "Psychology" },
  { key: "classics",   label: "Classics" },
  { key: "mystery",    label: "Mystery" },
];

// ── Currently Reading Card ────────────────────────────────────────────────────

function CurrentlyReadingCard({ book, index }: { book: Book; index: number }) {
  const pct = book.pages && book.currentPage ? Math.round((book.currentPage / book.pages) * 100) : 0;

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden"
      style={{ border: "1px solid rgba(212,168,67,0.25)", cursor: "default" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -6, borderColor: "rgba(212,168,67,0.5)" }}
    >
      {/* Blurred cover background */}
      <div className="absolute inset-0">
        <BookCover
          src={book.cover} fallbackSrc={book.coverFallback}
          alt="" spineColor={book.spineColor}
          className="w-full h-full object-cover"
          style={{ filter: "blur(32px) brightness(0.2) saturate(1.2)", transform: "scale(1.15)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(40,24,4,0.88) 0%, rgba(0,0,0,0.94) 100%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-7 p-7 sm:p-9 items-start sm:items-stretch">
        {/* Cover */}
        <div className="flex-shrink-0 flex items-center">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              width: 96, height: 144,
              border: `1px solid rgba(212,168,67,0.3)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.6), 4px 4px 0 rgba(0,0,0,0.4)`,
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
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4A843" }}>
              Currently Reading
            </p>
            <h3 className="text-xl font-bold leading-tight mb-1" style={{ color: "#f5f5f7" }}>{book.title}</h3>
            <p className="text-sm" style={{ color: "#86868b" }}>{book.author}</p>
          </div>

          <div className="flex flex-col gap-3">
            {book.quote && (
              <p className="text-xs italic leading-relaxed" style={{ color: "#86868b" }}>
                &ldquo;{book.quote}&rdquo;
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: "#515154" }}>
                  Page {book.currentPage} of {book.pages}
                </span>
                <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>{pct}%</span>
              </div>
              {/* Amber progress bar */}
              <div className="w-full h-1 rounded-full" style={{ background: "rgba(212,168,67,0.15)" }}>
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

// ── All-Time Card ─────────────────────────────────────────────────────────────

function AllTimeCard({ book, index }: { book: Book; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#0a0a0a", border: "1px solid rgba(212,168,67,0.18)", cursor: "default" }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      whileHover={{ y: -6, borderColor: "rgba(212,168,67,0.4)" }}
    >
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }} />

      {/* Amber gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.1) 0%, transparent 60%)" }} />

      <div className="relative z-10 p-6 flex gap-5 items-start">
        {/* Cover */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            width: 72, height: 108,
            border: `1px solid rgba(212,168,67,0.25)`,
            boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
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
            style={{ background: "rgba(212,168,67,0.15)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.25)" }}
          >
            ★ All-Time
          </div>
          <h3 className="text-base font-bold leading-snug" style={{ color: "#f5f5f7" }}>{book.title}</h3>
          <p className="text-xs" style={{ color: "#86868b" }}>{book.author}</p>
          {book.pages && (
            <p className="text-xs" style={{ color: "#515154" }}>{book.pages.toLocaleString()} pages</p>
          )}
        </div>
      </div>

      {book.quote && (
        <div className="relative z-10 px-6 pb-6">
          <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs italic leading-relaxed" style={{ color: "#86868b" }}>
              &ldquo;{book.quote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Library Card ──────────────────────────────────────────────────────────────

function LibraryBookCard({ book, index }: { book: Book; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const row = Math.floor(index / 3);
  const col = index % 3;

  return (
    <div ref={ref} className="library-card-wrap" style={{ cursor: "default" }}>
      <motion.div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: (row + col) * 0.03 }}
      >
        {/* Cover image */}
        <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
          {/* Spine color as bg fallback */}
          <div className="absolute inset-0" style={{ background: book.spineColor, opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ backgroundImage: NOISE, backgroundSize: "180px 180px", opacity: 0.12 }} />

          <BookCover
            src={book.cover} fallbackSrc={book.coverFallback}
            alt={book.title} spineColor={book.spineColor}
            className="w-full h-full object-cover object-top"
            style={{ display: "block" }}
          />

          {/* Gradient overlay — before tags in DOM so tags paint on top */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 55%)" }} />

          {/* Tags */}
          <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap">
            {book.reading && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(212,168,67,0.25)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.3)" }}>
                Reading
              </span>
            )}
            {book.allTime && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(212,168,67,0.15)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.25)" }}>
                ★ All-Time
              </span>
            )}
            {book.bookCount && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(0,0,0,0.65)", color: "#f5f5f7" }}>
                {book.bookCount} books
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1.5">
          <p className="text-sm font-semibold leading-snug" style={{ color: "#f5f5f7" }}>{book.title}</p>
          <p className="text-xs" style={{ color: "#86868b" }}>{book.author}</p>
          {book.quote && (
            <p className="text-xs italic leading-relaxed mt-1" style={{ color: "#515154" }}>
              &ldquo;{book.quote}&rdquo;
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookshelfPage() {
  const [activeCategory, setActiveCategory] = useState<BookCategory | "all">("all");

  const currentlyReading = BOOKS.filter((b) => b.reading);
  const allTimeFavs = BOOKS.filter((b) => b.allTime);

  const libraryBooks = BOOKS.filter((b) =>
    activeCategory === "all" ? true : b.categories.includes(activeCategory as BookCategory)
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "#000" }}>
      <Nav />
      <PageBlobs palette="amber" />

      <div className="relative z-10 px-8 sm:px-14 lg:px-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-36 pb-20">
          <motion.p
            className="text-xs tracking-[0.22em] uppercase font-medium mb-10"
            style={{ color: "#86868b" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Bookshelf
          </motion.p>
          <div className="flex items-end justify-between gap-8">
            <motion.h1
              className="font-black tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "#f5f5f7" }}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            >
              My reading list.
            </motion.h1>
            <motion.p
              className="text-sm hidden sm:block"
              style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "20rem", textAlign: "right" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            >
              Some shaped how I think. Some I revisit every year. Some I couldn&apos;t put down.
            </motion.p>
          </div>
        </section>

        <div className="flex flex-col gap-20 pb-32">

          {/* ── Currently Reading ──────────────────────────────────────────── */}
          {currentlyReading.length > 0 && (
            <section>
              <p className="text-xs tracking-[0.22em] uppercase font-medium mb-10" style={{ color: "#86868b" }}>
                Currently Reading
              </p>
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
              <p className="text-xs tracking-[0.22em] uppercase font-medium mb-6" style={{ color: "#86868b" }}>
                All-Time Favourites
              </p>
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1.0, ease: EASE }}
                className="font-black tracking-tight leading-[0.92] mb-10"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", color: "#f5f5f7" }}
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
            <p className="text-xs tracking-[0.22em] uppercase font-medium mb-6" style={{ color: "#86868b" }}>
              Library
            </p>
            <div className="flex items-end justify-between gap-8 mb-10">
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1.0, ease: EASE }}
                className="font-black tracking-tight leading-[0.92]"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", color: "#f5f5f7" }}
              >
                The full shelf.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                className="text-sm hidden sm:block"
                style={{ color: "#86868b", paddingBottom: "0.4rem", maxWidth: "16rem", textAlign: "right" }}
              >
                {libraryBooks.length} of {BOOKS.length} books, by category.
              </motion.p>
            </div>

            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap mb-8">
              {CATEGORY_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: activeCategory === key ? "rgba(212,168,67,0.18)" : "rgba(255,255,255,0.05)",
                    color: activeCategory === key ? "#D4A843" : "#86868b",
                    border: activeCategory === key ? "1px solid rgba(212,168,67,0.35)" : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {libraryBooks.length === 0 ? (
              <p className="text-sm py-16 text-center" style={{ color: "#515154" }}>No books in this category yet.</p>
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
    </main>
  );
}
