import { products, type Product } from "./products";

export type ShopQuery = { q?: string; category?: string; metal?: string; sort?: string };

export function filterProducts(query: ShopQuery, base: Product[] = products) {
  let list = base;
  if (query.category) list = list.filter((p) => p.category === query.category);
  if (query.metal) list = list.filter((p) => p.metal === query.metal);
  if (query.q) {
    const terms = query.q.toLowerCase().split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.metal} ${p.gemstone} ${p.tags.join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  const sorted = [...list];
  if (query.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (query.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (query.sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}

export function itemListLd(list: Product[], url: (p: Product) => string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: url(p), name: p.name })),
  };
}
