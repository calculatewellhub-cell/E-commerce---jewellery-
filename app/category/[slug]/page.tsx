import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { categories, getCategory, productsInCategory } from "@/lib/products";
import { filterProducts, itemListLd } from "@/lib/filter";
import { absoluteUrl } from "@/lib/site";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ q?: string; metal?: string; sort?: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return {
    title: `${c.title} — Shop Online`,
    description: `${c.description} Free insured shipping, lifetime exchange and WhatsApp ordering.`,
    alternates: { canonical: `/category/${c.slug}` },
    openGraph: { title: c.title, description: c.description, images: [{ url: absoluteUrl(c.image) }] },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const list = filterProducts(await searchParams, productsInCategory(slug));
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{c.name}</span>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
        </div>
      </section>
      <Breadcrumbs items={[{ name: "Shop", href: "/shop" }, { name: c.name, href: `/category/${c.slug}` }]} />
      <section className="container" style={{ paddingBottom: 90 }}>
        <Suspense>
          <ShopFilters showCategories={false} />
        </Suspense>
        <div className="grid">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
        {!list.length && <p className="muted" style={{ textAlign: "center", padding: 60 }}>No pieces match these filters.</p>}
      </section>
      <JsonLd data={itemListLd(list, (p) => absoluteUrl(`/product/${p.slug}`))} />
    </>
  );
}
