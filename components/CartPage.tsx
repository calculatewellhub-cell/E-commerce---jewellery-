"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./Icons";
import { formatPrice } from "@/lib/site";
import { makeOrderId, orderMessage, whatsappLink, type CustomerDetails } from "@/lib/whatsapp";
import { trackEvent } from "./track";

const KEY = "aurelia-customer";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [c, setC] = useState<CustomerDetails>({});
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setC(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const update = (k: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...c, [k]: e.target.value };
    setC(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  if (sent) {
    return (
      <div className="panel" style={{ textAlign: "center", maxWidth: 560, margin: "40px auto 90px" }}>
        <h2>Thank you! ✨</h2>
        <p>
          Your order <strong>#{sent}</strong> has been sent to our concierge on WhatsApp. We'll confirm availability and share a secure payment link shortly.
        </p>
        <Link href="/shop" className="btn btn-gold">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="panel" style={{ textAlign: "center", maxWidth: 560, margin: "40px auto 90px" }}>
        <h2>Your bag is empty</h2>
        <p className="muted">Discover handcrafted pieces made to be treasured.</p>
        <Link href="/shop" className="btn btn-gold">
          Shop the collection
        </Link>
      </div>
    );
  }

  const canSend = Boolean(c.name?.trim() && c.phone?.trim() && c.city?.trim());

  const placeOrder = () => {
    const id = makeOrderId();
    const url = whatsappLink(orderMessage(items.map((i) => ({ ...i })), c, id));
    trackEvent({ type: "whatsapp_order", value: total, product: items.map((i) => i.slug).join(",") });
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(id);
    clear();
  };

  return (
    <div className="cart-layout">
      <div className="panel">
        <h2 style={{ fontSize: "1.8rem" }}>Your Bag</h2>
        <ul className="drawer-items" style={{ padding: 0 }}>
          {items.map((i) => (
            <li key={`${i.slug}-${i.size ?? ""}`}>
              <Image src={i.image} alt={i.name} width={80} height={80} />
              <div>
                <Link href={`/product/${i.slug}`} className="drawer-name">
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
        <div className="row-between" style={{ marginTop: 18 }}>
          <span>Subtotal</span>
          <strong className="price-lg">{formatPrice(total)}</strong>
        </div>
        <div className="row-between muted small">
          <span>Insured shipping</span>
          <span>Free</span>
        </div>
      </div>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) placeOrder();
        }}
      >
        <h2 style={{ fontSize: "1.8rem" }}>Delivery details</h2>
        <p className="muted small">We'll send your order to our concierge on WhatsApp. No payment is taken on this site — you'll receive a secure payment link after confirmation.</p>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="name">Full name *</label>
            <input id="name" autoComplete="name" required value={c.name ?? ""} onChange={update("name")} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone / WhatsApp *</label>
            <input id="phone" type="tel" autoComplete="tel" required value={c.phone ?? ""} onChange={update("phone")} />
          </div>
          <div className="field">
            <label htmlFor="pincode">PIN code</label>
            <input id="pincode" inputMode="numeric" autoComplete="postal-code" value={c.pincode ?? ""} onChange={update("pincode")} />
          </div>
          <div className="field full">
            <label htmlFor="address">Address</label>
            <input id="address" autoComplete="street-address" value={c.address ?? ""} onChange={update("address")} />
          </div>
          <div className="field full">
            <label htmlFor="city">City *</label>
            <input id="city" autoComplete="address-level2" required value={c.city ?? ""} onChange={update("city")} />
          </div>
          <div className="field full">
            <label htmlFor="notes">Notes (engraving, gift message, preferred call time)</label>
            <textarea id="notes" value={c.notes ?? ""} onChange={update("notes")} />
          </div>
        </div>
        <button type="submit" className="btn btn-whatsapp btn-block" style={{ marginTop: 18 }} disabled={!canSend}>
          <WhatsAppIcon /> Place order on WhatsApp · {formatPrice(total)}
        </button>
      </form>
    </div>
  );
}
