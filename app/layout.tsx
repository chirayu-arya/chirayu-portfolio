import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = "https://chirayuarya.com";

export const metadata: Metadata = {
  title: "Chirayu Arya \u00ae | Marketing Design",
  description:
    "Chirayu Arya is a marketing designer and photographer working at the intersection of art and technology. Based in Charleston, SC.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Chirayu Arya \u00ae | Marketing Design",
    description:
      "Chirayu Arya is a marketing designer and photographer working at the intersection of art and technology. Based in Charleston, SC.",
    url: siteUrl,
    siteName: "Chirayu Arya",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chirayu Arya \u00ae | Marketing Design",
    description:
      "Chirayu Arya is a marketing designer and photographer working at the intersection of art and technology.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chirayu Arya",
  jobTitle: "Marketing Designer",
  url: siteUrl,
  sameAs: ["https://www.linkedin.com/in/chirayuarya/"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Charleston",
    addressRegion: "SC",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
