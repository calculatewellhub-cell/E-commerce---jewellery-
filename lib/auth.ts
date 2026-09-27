import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "aurelia_admin";

function token(password: string) {
  return createHash("sha256").update(`aurelia:${password}`).digest("hex");
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function checkPassword(input: string) {
  const expected = adminPassword();
  if (!expected) return false;
  const a = Buffer.from(token(input));
  const b = Buffer.from(token(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionToken() {
  return token(adminPassword());
}

export async function isAdmin() {
  const expected = adminPassword();
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === token(expected);
}
