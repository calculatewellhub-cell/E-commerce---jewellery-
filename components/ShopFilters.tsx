"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/products";

export default function ShopFilters({ showCategories = true }: { showCategories?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };
  const cat = params.get("category") ?? "";

  return (
    <div className="filters">
      {showCategories && (
        <>
          <button className={`pill ${!cat ? "active" : ""}`} onClick={() => set("category", "")}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.slug} className={`pill ${cat === c.slug ? "active" : ""}`} onClick={() => set("category", c.slug)}>
              {c.name}
            </button>
          ))}
        </>
      )}
      <span className="spacer" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          set("q", q.trim());
        }}
        role="search"
      >
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jewellery…" aria-label="Search jewellery" />
      </form>
      <select aria-label="Metal" value={params.get("metal") ?? ""} onChange={(e) => set("metal", e.target.value)}>
        <option value="">All metals</option>
        <option>Yellow Gold</option>
        <option>Rose Gold</option>
        <option>White Gold</option>
      </select>
      <select aria-label="Sort by" value={params.get("sort") ?? ""} onChange={(e) => set("sort", e.target.value)}>
        <option value="">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
