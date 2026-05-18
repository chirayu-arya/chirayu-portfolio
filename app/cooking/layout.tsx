import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cooking | Chirayu Arya",
  description:
    "What Chirayu Arya makes and loves when it comes to food. Signature dishes, favourite cuisines, and current food obsessions.",
  openGraph: {
    title: "Cooking | Chirayu Arya",
    description:
      "What Chirayu Arya makes and loves when it comes to food. Signature dishes, favourite cuisines, and current food obsessions.",
    url: "https://chirayuarya.com/cooking",
  },
  twitter: {
    title: "Cooking | Chirayu Arya",
    description:
      "What Chirayu Arya makes and loves when it comes to food.",
  },
};

export default function CookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
