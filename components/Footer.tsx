"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">
            <span className="logo-mark">A</span>
            <span>
              Aurelia<em>Jewels</em>
            </span>
          </div>
          <p className="muted">Handcrafted fine jewellery since {site.founded}. Every piece hallmarked, certified and made to be treasured for generations.</p>
          <div className="socials">
            {Object.entries(site.social).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" aria-label={k}>
                {k}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3>Shop</h3>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Help</h3>
          <Link href="/contact">Contact & Store</Link>
          <Link href="/about#faq">FAQ</Link>
          <Link href="/about#policies">Shipping & Returns</Link>
          <Link href="/about#policies">Lifetime Exchange</Link>
        </div>
        <div>
          <h3>Visit</h3>
          <address>
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>BIS Hallmarked · IGI & GIA Certified · Secure Payments</span>
      </div>
    </footer>
  );
}
