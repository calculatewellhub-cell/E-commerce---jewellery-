"use client";

type ClientEvent = {
  type: "page_view" | "product_view" | "add_to_cart" | "whatsapp_order" | "whatsapp_enquiry";
  path?: string;
  product?: string;
  value?: number;
  source?: string;
};

export function trackEvent(e: ClientEvent) {
  try {
    const body = JSON.stringify({ path: location.pathname, ...e });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    /* never break the UI for analytics */
  }
}
