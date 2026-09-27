import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageTracker from "@/components/PageTracker";
import JsonLd from "@/components/JsonLd";
import { site, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "fine jewellery",
    "gold jewellery online",
    "diamond rings",
    "engagement rings India",
    "bridal jewellery",
    "kundan necklace",
    "polki choker",
    "hallmarked gold",
    "IGI certified diamonds",
    "jhumka earrings",
    "tennis bracelet",
    "order jewellery on WhatsApp",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "shopping",
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1a17",
  width: "device-width",
  initialScale: 1,
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": absoluteUrl("/#store"),
  name: site.name,
  description: site.description,
  url: site.url,
  logo: absoluteUrl("/icon.svg"),
  image: absoluteUrl("/opengraph-image"),
  telephone: site.phone,
  email: site.email,
  priceRange: "₹₹₹",
  foundingDate: site.founded,
  currenciesAccepted: site.currency,
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking, Cash on Delivery",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: site.hours,
  sameAs: Object.values(site.social),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phone,
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
    contactOption: "TollFree",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  url: site.url,
  publisher: { "@id": absoluteUrl("/#store") },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/shop?q={search_term_string}") },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />
        <JsonLd data={[orgLd, websiteLd]} />
      </head>
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <ChatWidget />
          <WhatsAppFloat />
          <PageTracker />
        </CartProvider>
      </body>
    </html>
  );
}
