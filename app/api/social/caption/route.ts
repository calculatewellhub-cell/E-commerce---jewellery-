import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getProduct } from "@/lib/products";
import { formatPrice, site } from "@/lib/site";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productSlug, brief, tone } = await req.json();
  const p = productSlug ? getProduct(productSlug) : undefined;
  const about = p
    ? `${p.name} — ${p.short} ${p.purity} ${p.metal}, ${p.gemstone}. Price ${formatPrice(p.price)}. ${p.certification}.`
    : String(brief || "our latest fine jewellery collection");

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    const name = p?.name ?? "our new collection";
    return NextResponse.json({
      caption: `✨ Meet the ${name}.\n${p?.short ?? "Handcrafted fine jewellery, made to be treasured."}\n\nBIS hallmarked • Certified • Free insured shipping\n💬 Order instantly on WhatsApp`,
      hashtags: `#${site.shortName}Jewels #FineJewellery #Handcrafted #${(p?.category ?? "jewellery").replace(/s$/, "")} #GoldJewellery #DiamondJewellery #BridalJewellery #JewelleryLovers`,
    });
  }

  const client = new Anthropic();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: { caption: { type: "string" }, hashtags: { type: "string" } },
          required: ["caption", "hashtags"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: `Write a social media caption for ${site.name}, a fine jewellery brand, promoting: ${about}
Tone: ${tone || "luxurious, warm, aspirational"}. 2–4 short lines with tasteful emoji, a clear call to action to order on WhatsApp. No links (added automatically).
Also give 10–15 relevant hashtags as one space-separated string mixing brand, product, occasion and discovery tags.`,
      },
    ],
  });
  const text = msg.content.find((b) => b.type === "text");
  try {
    return NextResponse.json(JSON.parse(text && text.type === "text" ? text.text : "{}"));
  } catch {
    return NextResponse.json({ error: "Could not generate caption" }, { status: 502 });
  }
}
