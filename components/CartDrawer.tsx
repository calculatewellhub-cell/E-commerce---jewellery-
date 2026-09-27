"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { CloseIcon, WhatsAppIcon } from "./Icons";
import { formatPrice } from "@/lib/site";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={() => setOpen(false)} />
      <aside className="drawer-panel" role="dialog" aria-label="Shopping bag">
        <div className="drawer-head">
          <h2>Your Bag</h2>
          <button className="icon-btn" aria-label="Close bag" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your bag is empty.</p>
            <Link href="/shop" className="btn btn-gold" onClick={() => setOpen(false)}>
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {items.map((i) => (
                <li key={`${i.slug}-${i.size ?? ""}`}>
                  <Image src={i.image} alt={i.name} width={80} height={80} />
                  <div>
                    <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="drawer-name">
                      {i.name}
                    </Link>
                    {i.size && <div className="muted small">Size {i.size}</div>}
                    <div className="qty">
                      <button aria-label="Decrease quantity" onClick={() => setQty(i.slug, i.size, i.qty - 1)}>
                        −
                      </button>
                      <span>{i.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => setQty(i.slug, i.size, i.qty + 1)}>
                        +
                      </button>
                      <button className="link-btn" onClick={() => remove(i.slug, i.size)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong>{formatPrice(i.price * i.qty)}</strong>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="row-between">
                <span>Subtotal</span>
                <strong className="price-lg">{formatPrice(total)}</strong>
              </div>
              <p className="muted small">Free insured shipping · Taxes included</p>
              <Link href="/cart" className="btn btn-whatsapp btn-block" onClick={() => setOpen(false)}>
                <WhatsAppIcon /> Checkout on WhatsApp
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
