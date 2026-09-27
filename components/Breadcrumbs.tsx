import Link from "next/link";
import JsonLd from "./JsonLd";
import { absoluteUrl } from "@/lib/site";

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav className="crumbs container" aria-label="Breadcrumb">
        {all.map((c, i) => (
          <span key={c.href} style={{ display: "contents" }}>
            {i > 0 && <span aria-hidden>/</span>}
            {i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  );
}
