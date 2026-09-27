"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trackEvent } from "./track";

export interface CartItem {
  slug: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, size: string | undefined, qty: number) => void;
  remove: (slug: string, size?: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "aurelia-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const add = useCallback<CartCtx["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.slug === item.slug && p.size === item.size);
      if (i >= 0) return prev.map((p, idx) => (idx === i ? { ...p, qty: Math.min(10, p.qty + qty) } : p));
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
    trackEvent({ type: "add_to_cart", product: item.slug, value: item.price * qty });
  }, []);

  const setQty = useCallback<CartCtx["setQty"]>((slug, size, qty) => {
    setItems((prev) => prev.map((p) => (p.slug === slug && p.size === size ? { ...p, qty: Math.max(1, Math.min(10, qty)) } : p)));
  }, []);

  const remove = useCallback<CartCtx["remove"]>((slug, size) => {
    setItems((prev) => prev.filter((p) => !(p.slug === slug && p.size === size)));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear: () => setItems([]),
    }),
    [items, open, add, setQty, remove]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
