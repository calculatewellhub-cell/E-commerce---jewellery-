import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Search engines AND AI answer engines are explicitly welcome (AIO / GEO).
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/", "/cart", "/go/"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow }))],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
