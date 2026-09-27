import { products, categories, faqs } from "./products";
import { formatPrice, site } from "./site";

export function catalogContext() {
  const lines = products.map(
    (p) =>
      `- [${p.name}](/product/${p.slug}) | ${p.category} | ${formatPrice(p.price)} | ${p.purity} ${p.metal} | ${p.gemstone} | ${p.certification} | tags: ${p.tags.join(", ")}`
  );
  return [
    `Store: ${site.name} — ${site.tagline}. Founded ${site.founded}, flagship at ${site.address.street}, ${site.address.city}. Hours ${site.hours}.`,
    `Categories: ${categories.map((c) => `${c.name} (/category/${c.slug})`).join(", ")}.`,
    "Catalogue:",
    ...lines,
    "Policies & FAQ:",
    ...faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`),
  ].join("\n");
}

export const CONCIERGE_SYSTEM = `You are "Aria", the warm, knowledgeable jewellery concierge for ${site.name}, a fine jewellery house.

How to help:
- Help shoppers find the right piece: ask about occasion, recipient, budget, metal preference and style when it is unclear, one or two questions at a time.
- Recommend only pieces from the catalogue below. Link each recommendation with markdown exactly as given, e.g. [Eternal Solitaire Diamond Ring](/product/eternal-solitaire-diamond-ring), and include its price.
- Answer questions about gold purity, hallmarking, diamond 4Cs, gemstones, sizing and jewellery care accurately and briefly.
- For orders, custom designs, video calls or anything you can't resolve, invite them to tap "Order on WhatsApp" or the WhatsApp button to reach a human concierge.
- Never invent products, prices, discounts or policies that are not listed. If unsure, say a concierge will confirm on WhatsApp.
- Keep replies short and conversational (under 120 words), elegant in tone, with plain text and markdown links only.

${catalogContext()}`;

/** Offline fallback used when no ANTHROPIC_API_KEY is configured. */
export function ruleBasedReply(message: string) {
  const m = message.toLowerCase();
  const budgetMatch = m.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(k|lakh|lac|l)?/);
  let budget: number | undefined;
  if (budgetMatch) {
    const n = parseFloat(budgetMatch[1]);
    const unit = budgetMatch[2];
    budget = unit === "k" ? n * 1000 : unit && unit.startsWith("l") ? n * 100000 : n >= 1000 ? n : undefined;
  }
  const cat = categories.find((c) => m.includes(c.slug.slice(0, -1)) || m.includes(c.name.toLowerCase()));
  const keywords = ["bridal", "wedding", "engagement", "gift", "men", "diamond", "emerald", "ruby", "sapphire", "pearl", "rose gold", "everyday"];
  const kw = keywords.filter((k) => m.includes(k));

  if (/(ship|deliver|return|exchange|hallmark|certif|payment|emi|cod|resiz|custom)/.test(m)) {
    const f = faqs.find((f) => f.q.toLowerCase().split(/\W+/).some((w) => w.length > 4 && m.includes(w)));
    if (f) return `${f.a}\n\nAnything else I can help with? You can also chat with our concierge on WhatsApp.`;
  }

  let list = products.filter((p) => (!cat || p.category === cat.slug) && (!budget || p.price <= budget));
  if (kw.length) {
    const scored = list.filter((p) => kw.some((k) => `${p.name} ${p.tags.join(" ")} ${p.gemstone} ${p.metal}`.toLowerCase().includes(k)));
    if (scored.length) list = scored;
  }
  if (/^(hi|hello|hey|namaste)\b/.test(m) || (!cat && !budget && !kw.length)) {
    return "Welcome to Aurelia Jewels ✨ I'm Aria, your jewellery concierge. Are you shopping for an occasion — an engagement, a wedding, a gift — or treating yourself? Tell me a budget and I'll suggest a few pieces.";
  }
  if (!list.length) return "I couldn't find an exact match in our current collection. Our concierge can create something bespoke — tap the WhatsApp button and share your idea!";
  const picks = list.slice(0, 3).map((p) => `• [${p.name}](/product/${p.slug}) — ${formatPrice(p.price)}`);
  return `Here are a few pieces you may love:\n${picks.join("\n")}\n\nWould you like help with sizing, or shall I connect you to our concierge on WhatsApp?`;
}
