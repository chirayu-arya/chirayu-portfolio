import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Chirayu Arya",
  description:
    "Photography and illustrations by Chirayu Arya. A visual diary of moments, places, and ideas captured through the lens and on the canvas.",
  openGraph: {
    title: "Gallery | Chirayu Arya",
    description:
      "Photography and illustrations by Chirayu Arya. A visual diary of moments, places, and ideas.",
    url: "https://chirayuarya.com/gallery",
  },
  twitter: {
    title: "Gallery | Chirayu Arya",
    description:
      "Photography and illustrations by Chirayu Arya. A visual diary of moments, places, and ideas.",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
