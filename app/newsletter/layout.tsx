import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unscripted | Chirayu Arya",
  description:
    "A biweekly letter for international students, job seekers, and purpose seekers navigating a world that didn't go according to plan. No playbook. Figure it out.",
  openGraph: {
    title: "Unscripted | Chirayu Arya",
    description:
      "A biweekly letter for students and purpose seekers navigating a world that didn't go according to plan.",
    url: "https://chirayuarya.com/newsletter",
  },
  twitter: {
    title: "Unscripted | Chirayu Arya",
    description:
      "A biweekly letter for students and purpose seekers navigating a world that didn't go according to plan.",
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
