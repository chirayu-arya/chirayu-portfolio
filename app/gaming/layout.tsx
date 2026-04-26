import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gaming | Chirayu Arya",
  description:
    "Chirayu Arya's PlayStation gaming dashboard — live trophy data, recently played games, and a full library of 1,300+ titles. PSN: Techno_Naut.",
  openGraph: {
    title: "Gaming | Chirayu Arya",
    description:
      "Live PlayStation dashboard — trophies, recently played, and a full game library. PSN: Techno_Naut.",
    url: "https://chirayuarya.com/gaming",
  },
  twitter: {
    title: "Gaming | Chirayu Arya",
    description:
      "Live PlayStation dashboard — trophies, recently played, and a full game library. PSN: Techno_Naut.",
  },
};

export default function GamingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
