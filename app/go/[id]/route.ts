import { NextResponse } from "next/server";
import { getPost, PLATFORMS, type Platform } from "@/lib/social";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

// Tracked short link used in every social post: /go/<postId>?p=<platform>
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = new URL(req.url).searchParams.get("p") ?? "direct";
  const platform = (PLATFORMS as readonly string[]).includes(p) ? (p as Platform) : "direct";
  const post = await getPost(id);
  const target = new URL(post?.link || "/", site.url);
  if (target.origin === site.url) {
    target.searchParams.set("utm_source", platform);
    target.searchParams.set("utm_medium", "social");
    target.searchParams.set("utm_campaign", `post-${id}`);
  }
  if (post) await track({ type: "social_click", postId: id, platform }).catch(() => {});
  return NextResponse.redirect(target, 302);
}
