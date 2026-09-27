"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "./CartProvider";
import { StarIcon } from "./Icons";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const ref = useRef<HTMLElement>(null);

  // Subtle 3D tilt that follows the pointer
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(0)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(0)}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <article ref={ref} className="card" onPointerMove={onMove} onPointerLeave={onLeave}>
      <Link href={`/product/${product.slug}`} className="card-media" aria-label={product.name}>
        <Image src={product.image} alt={`${product.name} in ${product.purity} ${product.metal}`} fill sizes="(max-width: 700px) 50vw, 25vw" priority={priority} />
        <span className="card-shine" />
        {product.badge && <span className="badge">{product.badge}</span>}
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span>
            {product.purity} {product.metal}
          </span>
          <span className="rating">
            <StarIcon /> {product.rating}
          </span>
        </div>
        <h3 className="card-title">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="card-foot">
          <div>
            <span className="price">{formatPrice(product.price)}</span>
            {product.compareAt && <s className="compare">{formatPrice(product.compareAt)}</s>}
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => add({ slug: product.slug, sku: product.sku, name: product.name, price: product.price, image: product.image })}
            aria-label={`Add ${product.name} to bag`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
