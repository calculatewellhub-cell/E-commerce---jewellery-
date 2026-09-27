import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story, Policies & FAQ",
  description: `The story of ${site.name}: a family jeweller since ${site.founded}. Read about our craftsmanship, certification, shipping, returns and lifetime exchange policies.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Since {site.founded}</span>
          <h1>Our Story</h1>
          <p>Three generations of master jewellers, one promise: honest gold, certified stones and pieces made to outlive us all.</p>
        </div>
      </section>
      <Breadcrumbs items={[{ name: "Our Story", href: "/about" }]} />
      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container split">
          <div className="split-media">
            <Image src="/images/products/royal-emerald-kundan-necklace.svg" alt="Hand-set kundan emerald necklace" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div className="prose" style={{ margin: 0 }}>
            <h2 style={{ marginTop: 0 }}>Made by hand, measured by heart</h2>
            <p>
              {site.name} began in {site.founded} as a small workshop in Mumbai's Zaveri Bazaar. Today our atelier brings together karigars from Jaipur, Kolkata and Coimbatore — each a master of a
              different tradition, from kundan and polki to temple work and modern diamond setting.
            </p>
            <p>
              Every design is sketched by hand, modelled in 3D, and finished at the bench. Gold is BIS hallmarked with a unique HUID; diamonds above 0.30 ct are independently certified by IGI or GIA.
            </p>
            <p>We believe buying fine jewellery should feel personal, which is why every order is handled by a real concierge on WhatsApp — with video calls whenever you'd like to see a piece up close.</p>
          </div>
        </div>
      </section>
      <section className="section section-cream" id="policies">
        <div className="container prose">
          <h2 style={{ marginTop: 0 }}>Shipping, returns & exchange</h2>
          <p>
            <strong>Shipping:</strong> Free, fully insured, tamper-proof delivery across India in 3–7 working days. International shipping on request.
          </p>
          <p>
            <strong>Returns:</strong> Unworn pieces in original condition may be returned within 15 days for a full refund. Engraved and custom pieces are exchange-only.
          </p>
          <p>
            <strong>Lifetime exchange & buy-back:</strong> Exchange at 100% of the prevailing gold value and buy back at 90%. Diamonds are valued at the invoice rate.
          </p>
          <p>
            <strong>Resizing & care:</strong> Free resizing within 60 days and complimentary cleaning & polishing for life at our store.
          </p>
        </div>
      </section>
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q} open>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
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
