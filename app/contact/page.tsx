import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { WhatsAppIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us & Visit Our Mumbai Store",
  description: `Visit ${site.name} at ${site.address.street}, ${site.address.city}, call ${site.phone}, or chat with our jewellery concierge on WhatsApp for orders, custom designs and video consultations.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">We're here for you</span>
          <h1>Contact & Visit</h1>
          <p>Chat with a concierge, book a video call or visit our flagship store.</p>
        </div>
      </section>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <section className="container" style={{ paddingBottom: 90 }}>
        <div className="steps">
          <div className="panel">
            <h2>WhatsApp</h2>
            <p className="muted">Fastest response for orders, custom designs and video calls.</p>
            <a className="btn btn-whatsapp" href={whatsappLink(`Hello ${site.name}!`)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} /> Start chat
            </a>
          </div>
          <div className="panel">
            <h2>Call or email</h2>
            <p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="muted small">Mon–Sat, 10:30am – 8:30pm IST</p>
          </div>
          <div className="panel">
            <h2>Flagship store</h2>
            <address style={{ fontStyle: "normal" }}>
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </address>
            <a className="btn btn-outline btn-sm" style={{ marginTop: 14 }} href={`https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
