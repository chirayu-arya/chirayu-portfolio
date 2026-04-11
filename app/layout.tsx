import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chirayu Arya — Designer, Marketer & Photographer",
  description:
    "Portfolio of Chirayu Arya. Designer, marketer, and photographer crafting visual stories and brand experiences.",
  openGraph: {
    title: "Chirayu Arya",
    description: "Designer, Marketer & Photographer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
