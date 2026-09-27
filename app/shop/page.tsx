import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { filterProducts, itemListLd } from "@/lib/filter";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Fine Jewellery — Rings, Necklaces, Earrings & More",
  description:
    "Browse our full collection of hallmarked gold and certified diamond jewellery: engagement rings, bridal necklaces, jhumkas, tennis bracelets, pendants and bangles. Free insured shipping.",
  alternates: { canonical: "/shop" },
};

type Search = Promise<{ q?: string; category?: string; metal?: string; sort?: string }>;

export default async function Shop({ searchParams }: { searchParams: Search }) {
  const query = await searchParams;
  const list = filterProducts(query);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">The Collection</span>
          <h1>Shop All Jewellery</h1>
          <p>Every piece is BIS hallmarked, certified, and ships free with full insurance.</p>
        </div>
      </section>
      <Breadcrumbs items={[{ name: "Shop", href: "/shop" }]} />
      <section className="container" style={{ paddingBottom: 90 }}>
        <Suspense>
          <ShopFilters />
        </Suspense>
        {list.length ? (
          <div className="grid">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="muted" style={{ textAlign: "center", padding: 60 }}>
            No pieces match your search. Try another term, or ask Aria for help.
          </p>
        )}
      </section>
      <JsonLd data={itemListLd(list, (p) => absoluteUrl(`/product/${p.slug}`))} />
    </>
  );
}
