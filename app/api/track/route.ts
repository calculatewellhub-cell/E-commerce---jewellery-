import { track, type EventType } from "@/lib/analytics";

const ALLOWED: EventType[] = ["page_view", "product_view", "add_to_cart", "whatsapp_order", "whatsapp_enquiry"];

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!ALLOWED.includes(b.type)) return new Response(null, { status: 400 });
    await track({
      type: b.type,
      path: typeof b.path === "string" ? b.path.slice(0, 200) : undefined,
      product: typeof b.product === "string" ? b.product.slice(0, 100) : undefined,
      value: Number.isFinite(b.value) ? Number(b.value) : undefined,
      source: typeof b.source === "string" ? b.source.slice(0, 60) : undefined,
    });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
