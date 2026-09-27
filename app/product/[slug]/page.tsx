import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BuyBox from "@/components/BuyBox";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import ProductMedia from "@/components/ProductMedia";
import { RefreshIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/Icons";
import { getCategory, getProduct, products, relatedProducts } from "@/lib/products";
import { absoluteUrl, formatPrice, site } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = `${p.name} — ${p.purity} ${p.metal}`;
  const description = `${p.short} ${p.gemstone !== "None" ? `${p.gemstone}. ` : ""}${p.certification}. ${formatPrice(p.price)} with free insured shipping. Order on WhatsApp.`;
  return {
    title,
    description,
    keywords: [...p.tags, p.metal, p.purity, p.category],
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { type: "website", title, description, url: absoluteUrl(`/product/${p.slug}`), images: [{ url: absoluteUrl(p.image), alt: p.name }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(p.image)] },
    other: { "product:price:amount": String(p.price), "product:price:currency": site.currency },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = relatedProducts(p);
  const url = absoluteUrl(`/product/${p.slug}`);
  const validUntil = `${new Date().getFullYear() + 1}-12-31`;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    description: p.description,
    sku: p.sku,
    mpn: p.sku,
    image: [absoluteUrl(p.image)],
    url,
    category: cat.title,
    material: `${p.purity} ${p.metal}`,
    brand: { "@type": "Brand", name: site.name },
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Purity", value: p.purity },
      { "@type": "PropertyValue", name: "Weight", value: p.weight },
      { "@type": "PropertyValue", name: "Gemstone", value: p.gemstone },
      { "@type": "PropertyValue", name: "Certification", value: p.certification },
    ],
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: site.currency,
      price: p.price,
      priceValidUntil: validUntil,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": absoluteUrl("/#store") },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: site.currency },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Shop", href: "/shop" }, { name: cat.name, href: `/category/${cat.slug}` }, { name: p.name, href: `/product/${p.slug}` }]} />
      <section className="container pdp">
        <ProductMedia image={p.image} name={p.name} metal={p.viewer.metal} gem={p.viewer.gem} showRing={p.category === "rings"} />
        <div className="pdp-info">
          <span className="eyebrow">{cat.name}</span>
          <h1>{p.name}</h1>
          <div className="rating" style={{ fontSize: ".9rem" }}>
            <StarIcon /> {p.rating} · <span className="muted">{p.reviews} verified reviews</span>
          </div>
          <div className="pdp-price">
            <strong>{formatPrice(p.price)}</strong>
            {p.compareAt && (
              <>
                <s className="compare">{formatPrice(p.compareAt)}</s>
                <span className="save">Save {formatPrice(p.compareAt - p.price)}</span>
              </>
            )}
          </div>
          <p className="muted small" style={{ marginTop: -10 }}>
            Inclusive of all taxes · Free insured shipping · {p.inStock ? "In stock, ships in 48 hours" : "Made to order"}
          </p>
          <p>{p.description}</p>
          <BuyBox product={p} />
          <dl className="specs">
            <div>
              <dt>Metal</dt>
              <dd>
                {p.purity} {p.metal}
              </dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{p.weight}</dd>
            </div>
            <div>
              <dt>Gemstone</dt>
              <dd>{p.gemstone}</dd>
            </div>
            <div>
              <dt>Certification</dt>
              <dd>{p.certification}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{p.sku}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>3–7 days, insured</dd>
            </div>
          </dl>
          <h2 style={{ fontSize: "1.5rem" }}>Highlights</h2>
          <ul className="checklist">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="assurance">
            <div>
              <ShieldIcon /> Certified & Hallmarked
            </div>
            <div>
              <TruckIcon /> Free Insured Shipping
            </div>
            <div>
              <RefreshIcon /> Lifetime Exchange
            </div>
          </div>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">You may also love</span>
            <h2>Complete the look</h2>
          </div>
          <div className="grid">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} />
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={productLd} />
    </>
  );
}
