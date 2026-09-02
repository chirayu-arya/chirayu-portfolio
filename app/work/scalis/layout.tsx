import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scalis | Chirayu Arya",
  description:
    "How I built Apex, a media brand that grew to 250,000 subscribers, and the outbound sales pipeline that turned it into revenue at Scalis.",
  openGraph: {
    title: "Scalis | Chirayu Arya",
    description:
      "Building Apex, a student media brand, and the sales pipeline that grew out of it at Scalis.",
    url: "https://chirayuarya.com/work/scalis",
  },
  twitter: {
    title: "Scalis | Chirayu Arya",
    description:
      "Building Apex, a student media brand, and the sales pipeline that grew out of it at Scalis.",
  },
};

export default function ScalisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
