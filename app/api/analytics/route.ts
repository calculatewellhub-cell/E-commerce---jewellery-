import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { summary } from "@/lib/analytics";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const days = Math.min(90, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 30));
  return NextResponse.json(await summary(days));
}
