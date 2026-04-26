import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookshelf | Chirayu Arya",
  description:
    "Books that shaped the way Chirayu Arya thinks. Currently reading, all-time favourites, and a full personal library — from Steve Jobs to Harry Potter.",
  openGraph: {
    title: "Bookshelf | Chirayu Arya",
    description:
      "Books that shaped the way Chirayu Arya thinks. Currently reading, all-time favourites, and a full personal library.",
    url: "https://chirayuarya.com/bookshelf",
  },
  twitter: {
    title: "Bookshelf | Chirayu Arya",
    description:
      "Books that shaped the way Chirayu Arya thinks. Currently reading, all-time favourites, and a full personal library.",
  },
};

export default function BookshelfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
