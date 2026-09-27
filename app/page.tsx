import Image from "next/image";
import Link from "next/link";
import LazyJewelViewer from "@/components/LazyJewelViewer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { GemIcon, RefreshIcon, ShieldIcon, StarIcon, TruckIcon, WhatsAppIcon } from "@/components/Icons";
import { categories, faqs, products, testimonials } from "@/lib/products";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export default function Home() {
  const featured = [...products.filter((p) => p.badge), ...products.filter((p) => !p.badge)].slice(0, 8);
  const bridal = products.filter((p) => p.tags.some((t) => /bridal|wedding/.test(t)));

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Fine Jewellery · Since {site.founded}</span>
            <h1>
              Crafted to shine <em className="gold-text">for generations</em>
            </h1>
            <p className="lead">
              Handcrafted gold, IGI-certified diamonds and rare gemstones — designed in Mumbai, finished by master karigars, and delivered insured to your door.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-gold">
                Explore Collection
              </Link>
              <a className="btn btn-ghost-light" href={whatsappLink(`Hello ${site.name}! I'd like a personal consultation.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Book a Video Call
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>25k+</strong>
                <span>Happy clients</span>
              </div>
              <div>
                <strong>4.9★</strong>
                <span>Google rating</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Certified</span>
              </div>
            </div>
          </div>
          <div className="hero-3d">
            <LazyJewelViewer variant="hero" metal="#e6c068" gem="#eaf7ff" label="3D diamond solitaire ring — drag to rotate" />
            <div className="orbit" />
            <span className="hint">Drag to rotate · 3D</span>
          </div>
        </div>
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, k) =>
              ["BIS Hallmarked Gold", "IGI & GIA Certified", "Free Insured Shipping", "Lifetime Exchange", "Order on WhatsApp", "Bespoke Designs", "15-Day Returns"].map((t) => (
                <span key={`${k}-${t}`}>{t}</span>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Shop by Category</span>
            <h2>Find your forever piece</h2>
          </Reveal>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link href={`/category/${c.slug}`} className="cat-tile">
                  <Image src={c.image} alt={c.title} fill sizes="(max-width: 560px) 50vw, 16vw" />
                  <span>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Most Loved</span>
            <h2>Bestsellers & new arrivals</h2>
            <p className="muted">Pieces our clients return for — each one hallmarked, certified and ready to ship.</p>
          </Reveal>
          <div className="grid">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/shop" className="btn btn-outline">
              View all jewellery
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow" style={{ color: "var(--gold-2)" }}>
              The Aurelia Promise
            </span>
            <h2>Luxury you can trust</h2>
          </Reveal>
          <div className="features">
            {[
              { icon: <ShieldIcon size={30} />, t: "Certified & Hallmarked", d: "BIS HUID hallmark on every gold piece, IGI/GIA certificates for diamonds." },
              { icon: <TruckIcon size={30} />, t: "Free Insured Delivery", d: "Fully insured, tamper-proof shipping across India in 3–7 days." },
              { icon: <RefreshIcon size={30} />, t: "Lifetime Exchange", d: "100% gold value on exchange, 90% on buy-back — forever." },
              { icon: <GemIcon size={30} />, t: "Bespoke Design", d: "Share an idea on WhatsApp; we sketch, render in 3D and craft it for you." },
            ].map((f, i) => (
              <Reveal key={f.t} className="feature" delay={i * 80}>
                {f.icon}
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="split-media">
            <Image src="/images/products/bridal-polki-diamond-choker.svg" alt="Bridal polki diamond choker in 22K gold" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </Reveal>
          <Reveal>
            <span className="eyebrow">The Bridal Edit</span>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", marginTop: 14 }}>Heirlooms for your most beautiful day</h2>
            <p className="muted">
              From uncut polki chokers to hand-set kundan and temple bangles, our bridal atelier pairs centuries-old techniques with a personal stylist on WhatsApp — so every piece complements your outfit perfectly.
            </p>
            <ul className="checklist">
              <li>Complimentary bridal styling session over video call</li>
              <li>Matching sets, custom lengths and made-to-measure bangles</li>
              <li>Trousseau packaging and priority delivery before your date</li>
            </ul>
            <div className="hero-cta" style={{ marginTop: 10 }}>
              {bridal[0] && (
                <Link href={`/product/${bridal[0].slug}`} className="btn btn-dark">
                  Shop Bridal
                </Link>
              )}
              <a className="btn btn-whatsapp" href={whatsappLink(`Hello ${site.name}! I'd like to book a bridal styling session.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Book Stylist
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Shop on WhatsApp</span>
            <h2>Order in three simple steps</h2>
          </Reveal>
          <div className="steps">
            <Reveal className="step">
              <h3>Choose your piece</h3>
              <p className="muted">Browse, view in 3D, pick your size and add to bag — or ask Aria, our AI concierge, for suggestions.</p>
            </Reveal>
            <Reveal className="step" delay={100}>
              <h3>Tap “Order on WhatsApp”</h3>
              <p className="muted">Your complete order — items, sizes, total and address — is sent to our concierge in one tap.</p>
            </Reveal>
            <Reveal className="step" delay={200}>
              <h3>Confirm & relax</h3>
              <p className="muted">We confirm on a video call if you like, share a secure payment link, and ship insured.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Client Love</span>
            <h2>Worn & adored across India</h2>
          </Reveal>
          <div className="quotes">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} className="quote" delay={i * 80}>
                <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }, (_, k) => (
                    <StarIcon key={k} />
                  ))}
                </div>
                <blockquote>“{t.text}”</blockquote>
                <strong>{t.name}</strong> <span className="muted">· {t.city}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream" id="faq">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Frequently asked</h2>
          </Reveal>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-band">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-2)" }}>
                Personal Concierge
              </span>
              <h2 style={{ marginTop: 12 }}>See any piece live on a video call before you buy</h2>
              <p style={{ color: "rgba(255,255,255,.7)", margin: 0 }}>Our experts are available Monday to Saturday, 10:30am – 8:30pm.</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a className="btn btn-whatsapp" href={whatsappLink(`Hello ${site.name}! I'd like to schedule a video call.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
