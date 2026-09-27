import Anthropic from "@anthropic-ai/sdk";
import { CONCIERGE_SYSTEM, ruleBasedReply } from "@/lib/concierge";
import { track } from "@/lib/analytics";

export const runtime = "nodejs";

type ChatTurn = { role: "user" | "assistant"; content: string };

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Server-side refusal fallbacks are supported on these models.
const SUPPORTS_FALLBACKS = ["claude-opus-5", "claude-fable-5-1"].includes(MODEL);

function textStream(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  let messages: ChatTurn[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatTurn) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m: ChatTurn) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  // The conversation must start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return new Response("Bad request", { status: 400 });

  track({ type: "chat_message" }).catch(() => {});

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return textStream(ruleBasedReply(last.content));
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: [{ type: "text", text: CONCIERGE_SYSTEM, cache_control: { type: "ephemeral" } }],
          messages,
          output_config: { effort: "low" },
          ...(SUPPORTS_FALLBACKS ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
        });
        s.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nI'm not able to help with that here — our concierge will be happy to assist you on WhatsApp."));
        }
      } catch (err) {
        console.error("chat error", err);
        controller.enqueue(encoder.encode(ruleBasedReply(last.content)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
