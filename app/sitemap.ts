import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: absoluteUrl(`/category/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: [absoluteUrl(p.image)],
    })),
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
