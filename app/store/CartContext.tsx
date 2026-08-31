"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Pack } from "@/lib/store/catalog";

export type CartItem = { productId: string; pack: Pack };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clear: () => void;
  subtotalCents: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "store-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // Drop anything no longer in the catalog.
        setItems(parsed.filter((i) => getProduct(i.productId)?.prices[i.pack] != null));
      }
    } catch {
      // Corrupt cart state: start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + (getProduct(i.productId)?.prices[i.pack] ?? 0), 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addItem: (item) =>
      setItems((prev) =>
        prev.some((i) => i.productId === item.productId && i.pack === item.pack)
          ? prev
          : [...prev, item]
      ),
    removeItem: (item) =>
      setItems((prev) =>
        prev.filter((i) => !(i.productId === item.productId && i.pack === item.pack))
      ),
    clear: () => setItems([]),
    subtotalCents,
    drawerOpen,
    setDrawerOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
