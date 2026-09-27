import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createPost, listPosts, publishPost } from "@/lib/social";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const publisher = process.env.SOCIAL_WEBHOOK_URL ? "webhook" : process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID ? "meta" : "none";
  return NextResponse.json({ posts: await listPosts(), publisher, ai: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.caption || !Array.isArray(body.platforms) || !body.platforms.length) {
    return NextResponse.json({ error: "Caption and at least one platform are required" }, { status: 400 });
  }
  let post = await createPost(body);
  if (body.publishNow) post = await publishPost(post.id);
  return NextResponse.json({ post });
}
