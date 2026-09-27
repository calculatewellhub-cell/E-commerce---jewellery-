import { getCategory, products } from "@/lib/products";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Google Merchant Center / Meta Commerce (Instagram & Facebook Shop) product feed.
export function GET() {
  const items = products
    .map(
      (p) => `  <item>
    <g:id>${p.sku}</g:id>
    <g:title>${esc(p.name)}</g:title>
    <g:description>${esc(p.description)}</g:description>
    <g:link>${absoluteUrl(`/product/${p.slug}`)}</g:link>
    <g:image_link>${absoluteUrl(p.image)}</g:image_link>
    <g:availability>${p.inStock ? "in_stock" : "out_of_stock"}</g:availability>
    <g:price>${p.price.toFixed(2)} ${site.currency}</g:price>
    ${p.compareAt ? `<g:sale_price>${p.price.toFixed(2)} ${site.currency}</g:sale_price>` : ""}
    <g:brand>${esc(site.name)}</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>188</g:google_product_category>
    <g:product_type>${esc(getCategory(p.category)?.title ?? p.category)}</g:product_type>
    <g:material>${esc(`${p.purity} ${p.metal}`)}</g:material>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${esc(site.name)}</title>
  <link>${site.url}</link>
  <description>${esc(site.description)}</description>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
