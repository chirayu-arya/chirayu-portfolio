import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Chirayu Arya",
  description:
    "The story behind the work. Marketing designer and photographer based in Charleston, SC — working at the intersection of design, strategy, and craft.",
  openGraph: {
    title: "About | Chirayu Arya",
    description:
      "The story behind the work. Marketing designer and photographer based in Charleston, SC — working at the intersection of design, strategy, and craft.",
    url: "https://chirayuarya.com/about",
  },
  twitter: {
    title: "About | Chirayu Arya",
    description:
      "The story behind the work. Marketing designer and photographer based in Charleston, SC.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
