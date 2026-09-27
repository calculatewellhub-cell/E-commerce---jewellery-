import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny JSON-file persistence for social posts and analytics events.
 * Works out of the box on any Node host (VPS, Render, Railway, Docker).
 * On serverless platforms with a read-only filesystem it falls back to /tmp,
 * which is NOT durable — swap these functions for a real database
 * (Postgres, Supabase, Upstash Redis…) before going to production there.
 */
const DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const FALLBACK = path.join("/tmp", "aurelia-data");

async function dir() {
  for (const d of [DIR, FALLBACK]) {
    try {
      await fs.mkdir(d, { recursive: true });
      await fs.access(d, fs.constants.W_OK);
      return d;
    } catch {
      /* try next */
    }
  }
  throw new Error("No writable data directory");
}

const locks = new Map<string, Promise<unknown>>();

export async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(await dir(), `${name}.json`), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

/** Serialised read-modify-write so concurrent requests don't clobber each other. */
export async function updateCollection<T>(name: string, fn: (items: T[]) => T[] | Promise<T[]>): Promise<T[]> {
  const prev = locks.get(name) ?? Promise.resolve();
  const next = prev.then(async () => {
    const items = await readCollection<T>(name);
    const updated = await fn(items);
    const file = path.join(await dir(), `${name}.json`);
    await fs.writeFile(`${file}.tmp`, JSON.stringify(updated, null, 2));
    await fs.rename(`${file}.tmp`, file);
    return updated;
  });
  locks.set(name, next.catch(() => undefined));
  return next;
}

export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
