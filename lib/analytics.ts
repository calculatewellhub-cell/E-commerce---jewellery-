import "server-only";
import { readCollection, updateCollection, newId } from "./store";

export type EventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "whatsapp_order"
  | "whatsapp_enquiry"
  | "chat_message"
  | "social_click";

export interface TrackedEvent {
  id: string;
  type: EventType;
  at: string;
  path?: string;
  product?: string;
  value?: number;
  source?: string;
  postId?: string;
  platform?: string;
}

const MAX_EVENTS = 20000;

export async function track(e: Omit<TrackedEvent, "id" | "at">) {
  await updateCollection<TrackedEvent>("events", (items) => {
    items.push({ ...e, id: newId(), at: new Date().toISOString() });
    return items.length > MAX_EVENTS ? items.slice(-MAX_EVENTS) : items;
  });
}

export async function summary(days = 30) {
  const since = Date.now() - days * 86400000;
  const events = (await readCollection<TrackedEvent>("events")).filter((e) => Date.parse(e.at) >= since);
  const count = (t: EventType) => events.filter((e) => e.type === t).length;

  const byDay: Record<string, Record<string, number>> = {};
  for (let i = days - 1; i >= 0; i--) {
    byDay[new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)] = {};
  }
  for (const e of events) {
    const d = e.at.slice(0, 10);
    if (byDay[d]) byDay[d][e.type] = (byDay[d][e.type] ?? 0) + 1;
  }

  const tally = (list: TrackedEvent[], key: keyof TrackedEvent) => {
    const m: Record<string, number> = {};
    for (const e of list) {
      const k = e[key];
      if (k) m[String(k)] = (m[String(k)] ?? 0) + 1;
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };

  return {
    totals: {
      pageViews: count("page_view"),
      productViews: count("product_view"),
      addToCart: count("add_to_cart"),
      whatsappOrders: count("whatsapp_order"),
      whatsappEnquiries: count("whatsapp_enquiry"),
      chatMessages: count("chat_message"),
      socialClicks: count("social_click"),
      orderValue: events.filter((e) => e.type === "whatsapp_order").reduce((s, e) => s + (e.value ?? 0), 0),
    },
    daily: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
    topProducts: tally(events.filter((e) => e.type === "product_view"), "product").slice(0, 8),
    sources: tally(events.filter((e) => e.type === "page_view"), "source").slice(0, 8),
    socialByPlatform: tally(events.filter((e) => e.type === "social_click"), "platform"),
    socialByPost: tally(events.filter((e) => e.type === "social_click"), "postId"),
  };
}
