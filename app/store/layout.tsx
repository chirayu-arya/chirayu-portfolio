import type { Metadata } from "next";
import { CartProvider } from "./CartContext";

export const metadata: Metadata = {
  title: "Store | Chirayu Arya",
  description:
    "Wallpapers of virtual photography and digital illustrations, with templates, prompt packs and guides on the way.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
