import { formatPrice, site, absoluteUrl } from "./site";

export interface OrderLine {
  name: string;
  sku: string;
  slug: string;
  price: number;
  qty: number;
  size?: string;
}

export interface CustomerDetails {
  name?: string;
  phone?: string;
  city?: string;
  pincode?: string;
  address?: string;
  notes?: string;
}

export function whatsappLink(text: string, number = site.whatsapp) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function orderMessage(lines: OrderLine[], customer: CustomerDetails = {}, orderId?: string) {
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const rows = lines.map(
    (l, i) =>
      `${i + 1}. *${l.name}*${l.size ? ` (Size ${l.size})` : ""}\n   SKU ${l.sku} · Qty ${l.qty} · ${formatPrice(l.price * l.qty)}\n   ${absoluteUrl(`/product/${l.slug}`)}`
  );
  const who = [
    customer.name && `Name: ${customer.name}`,
    customer.phone && `Phone: ${customer.phone}`,
    customer.address && `Address: ${customer.address}`,
    (customer.city || customer.pincode) && `City/PIN: ${[customer.city, customer.pincode].filter(Boolean).join(" - ")}`,
    customer.notes && `Notes: ${customer.notes}`,
  ].filter(Boolean);

  return [
    `✨ *New Order — ${site.name}*${orderId ? `\nOrder ref: #${orderId}` : ""}`,
    "",
    ...rows,
    "",
    `*Order total: ${formatPrice(total)}*`,
    "Free insured shipping",
    ...(who.length ? ["", "*Delivery details*", ...who] : []),
    "",
    "Please confirm availability and payment options. Thank you!",
  ].join("\n");
}

export function productEnquiry(name: string, slug: string) {
  return `Hello ${site.name}! I'm interested in the *${name}*.\n${absoluteUrl(`/product/${slug}`)}\n\nCould you share more photos / a video call and delivery time?`;
}

export function makeOrderId() {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `AU${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
