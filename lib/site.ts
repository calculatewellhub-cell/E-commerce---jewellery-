export const site = {
  name: "Aurelia Jewels",
  shortName: "Aurelia",
  tagline: "Handcrafted Fine Jewellery — Certified Gold, Diamonds & Gemstones",
  description:
    "Shop handcrafted fine jewellery at Aurelia Jewels: BIS-hallmarked gold, IGI-certified diamonds, bridal sets, engagement rings, earrings and bracelets. Order instantly on WhatsApp with free insured shipping and lifetime exchange.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.aureliajewels.com").replace(/\/$/, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  email: "concierge@aureliajewels.com",
  phone: "+91 98765 43210",
  address: {
    street: "12 Heritage Arcade, Zaveri Bazaar",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400002",
    country: "IN",
  },
  geo: { lat: 18.9489, lng: 72.8311 },
  hours: "Mo-Sa 10:30-20:30",
  currency: "INR",
  locale: "en-IN",
  founded: "1998",
  social: {
    instagram: "https://instagram.com/aureliajewels",
    facebook: "https://facebook.com/aureliajewels",
    pinterest: "https://pinterest.com/aureliajewels",
    youtube: "https://youtube.com/@aureliajewels",
  },
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
