import { categories, faqs, products } from "./products";
import { absoluteUrl, formatPrice, site } from "./site";

/** llms.txt — a concise, LLM-friendly map of the site (https://llmstxt.org). */
export function llmsTxt(full = false) {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is a fine jewellery house founded in ${site.founded} with a flagship store at ${site.address.street}, ${site.address.city}, India. All gold is BIS hallmarked (HUID); diamonds above 0.30 ct are IGI or GIA certified. Orders are placed online and confirmed by a human concierge on WhatsApp (${site.phone}). Free insured shipping across India, 15-day returns, lifetime exchange at 100% gold value.`,
    "",
    "## Collections",
    ...categories.map((c) => `- [${c.title}](${absoluteUrl(`/category/${c.slug}`)}): ${c.description}`),
    "",
    "## Products",
    ...products.map((p) =>
      full
        ? `### [${p.name}](${absoluteUrl(`/product/${p.slug}`)})\n- Price: ${formatPrice(p.price)}\n- Metal: ${p.purity} ${p.metal}, ${p.weight}\n- Gemstone: ${p.gemstone}\n- Certification: ${p.certification}\n- Rating: ${p.rating}/5 from ${p.reviews} reviews\n\n${p.description}\n`
        : `- [${p.name}](${absoluteUrl(`/product/${p.slug}`)}): ${formatPrice(p.price)} — ${p.purity} ${p.metal}; ${p.short}`
    ),
    "",
    "## Policies & FAQ",
    ...faqs.map((f) => (full ? `### ${f.q}\n${f.a}\n` : `- ${f.q} ${f.a}`)),
    "",
    "## Key pages",
    `- [Shop all](${absoluteUrl("/shop")})`,
    `- [Our story, policies and FAQ](${absoluteUrl("/about")})`,
    `- [Contact & store](${absoluteUrl("/contact")})`,
    `- [Product feed (XML)](${absoluteUrl("/feed.xml")})`,
    ...(full ? [] : ["", "## Optional", `- [Full product details](${absoluteUrl("/llms-full.txt")})`]),
  ];
  return lines.join("\n");
}
