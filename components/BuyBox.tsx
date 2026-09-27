"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./Icons";
import { makeOrderId, orderMessage, productEnquiry, whatsappLink } from "@/lib/whatsapp";
import { trackEvent } from "./track";

const RING_SIZES = ["8", "10", "12", "14", "16", "18", "20", "22"];
const BANGLE_SIZES = ["2.2", "2.4", "2.6", "2.8", "2.10"];

export default function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const sizes = product.category === "rings" ? RING_SIZES : product.category === "bangles" ? BANGLE_SIZES : null;
  const [size, setSize] = useState<string | undefined>(undefined);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    trackEvent({ type: "product_view", product: product.slug });
  }, [product.slug]);

  const needsSize = sizes && !size;
  const item = { slug: product.slug, sku: product.sku, name: product.name, price: product.price, image: product.image, size };

  return (
    <div>
      {sizes && (
        <>
          <div className="row-between">
            <strong className="small" style={{ letterSpacing: ".12em", textTransform: "uppercase" }}>
              {product.category === "rings" ? "Ring size (Indian)" : "Bangle size"}
            </strong>
            <a className="small muted" href={whatsappLink(`Hi! Please help me find my ${product.category === "rings" ? "ring" : "bangle"} size for the ${product.name}.`)} target="_blank" rel="noopener noreferrer">
              Size help?
            </a>
          </div>
          <div className="sizes" role="radiogroup" aria-label="Size">
            {sizes.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                className={size === s ? "active" : ""}
                onClick={() => {
                  setSize(s);
                  setWarn(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {warn && <p className="small" style={{ color: "#b3261e", marginTop: -10 }}>Please select a size first.</p>}
        </>
      )}
      <div className="buy-row">
        <button
          className="btn btn-dark"
          onClick={() => {
            if (needsSize) return setWarn(true);
            add(item);
          }}
        >
          Add to Bag
        </button>
        <a
          className="btn btn-whatsapp"
          href={whatsappLink(orderMessage([{ ...item, qty: 1 }], {}, makeOrderId()))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (needsSize) {
              e.preventDefault();
              setWarn(true);
              return;
            }
            trackEvent({ type: "whatsapp_order", product: product.slug, value: product.price });
          }}
        >
          <WhatsAppIcon size={18} /> Order on WhatsApp
        </a>
      </div>
      <a
        className="btn btn-block"
        style={{ marginTop: 12, border: "1px solid var(--line)" }}
        href={whatsappLink(productEnquiry(product.name, product.slug))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent({ type: "whatsapp_enquiry", product: product.slug })}
      >
        Request a live video call
      </a>
    </div>
  );
}
