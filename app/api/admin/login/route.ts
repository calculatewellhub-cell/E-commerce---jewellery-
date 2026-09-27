import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPassword, checkPassword, sessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!adminPassword()) return NextResponse.json({ error: "Set ADMIN_PASSWORD in your environment first." }, { status: 500 });
  if (!checkPassword(String(password ?? ""))) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
