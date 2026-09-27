"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export default function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="announce">
        Free insured shipping<span className="only-desktop-inline"> · BIS Hallmarked Gold · IGI Certified Diamonds</span> · Order on WhatsApp
      </div>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container header-inner">
          <button className="icon-btn only-mobile" aria-label="Open menu" onClick={() => setMenu(true)}>
            <MenuIcon />
          </button>
          <Link href="/" className="logo" aria-label={`${site.name} home`}>
            <span className="logo-mark">A</span>
            <span>
              Aurelia<em>Jewels</em>
            </span>
          </Link>
          <nav className="nav only-desktop" aria-label="Main">
            <Link href="/shop">Shop All</Link>
            {categories.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`}>
                {c.name}
              </Link>
            ))}
            <Link href="/category/bangles">Bridal</Link>
            <Link href="/about">Our Story</Link>
          </nav>
          <button className="icon-btn bag-btn" aria-label={`Shopping bag, ${count} items`} onClick={() => setOpen(true)}>
            <BagIcon size={22} />
            {count > 0 && <span className="bag-count">{count}</span>}
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="mobile-menu-panel">
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}>
            <CloseIcon />
          </button>
          <Link href="/shop">Shop All</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link href="/about">Our Story</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="mobile-menu-scrim" onClick={() => setMenu(false)} />
      </div>
    </>
  );
}
