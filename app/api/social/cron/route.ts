import { NextResponse } from "next/server";
import { publishDuePosts } from "@/lib/social";

// Call this every few minutes (Vercel Cron, GitHub Actions, cron-job.org…)
// with header `Authorization: Bearer <CRON_SECRET>` to publish scheduled posts.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const published = await publishDuePosts();
  return NextResponse.json({ published: published.map((p) => ({ id: p.id, status: p.status })) });
}
