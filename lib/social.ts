import "server-only";
import { readCollection, updateCollection, newId } from "./store";
import { site } from "./site";

export const PLATFORMS = ["instagram", "facebook", "pinterest", "x", "linkedin", "whatsapp_channel", "youtube"] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface PublishResult {
  platform: Platform;
  ok: boolean;
  externalId?: string;
  error?: string;
  at: string;
}

export interface SocialPost {
  id: string;
  caption: string;
  hashtags: string;
  mediaUrl?: string;
  mediaType: "image" | "video" | "none";
  link?: string;
  productSlug?: string;
  platforms: Platform[];
  scheduledAt?: string;
  status: "draft" | "scheduled" | "publishing" | "published" | "partial" | "failed";
  results: PublishResult[];
  createdAt: string;
  publishedAt?: string;
}

const COLLECTION = "social-posts";

export function trackedLink(post: Pick<SocialPost, "id">, platform: Platform) {
  return `${site.url}/go/${post.id}?p=${platform}`;
}

export function captionFor(post: SocialPost, platform: Platform) {
  const link = post.link ? trackedLink(post, platform) : "";
  const tags = post.hashtags.trim();
  // Instagram captions don't make links clickable, so point to the bio instead.
  if (platform === "instagram") return [post.caption, link && "🔗 Shop via link in bio or DM us on WhatsApp", tags].filter(Boolean).join("\n\n");
  if (platform === "x") return [post.caption.slice(0, 200), link, tags.split(/\s+/).slice(0, 3).join(" ")].filter(Boolean).join("\n");
  return [post.caption, link && `Shop now: ${link}`, tags].filter(Boolean).join("\n\n");
}

export async function listPosts() {
  const posts = await readCollection<SocialPost>(COLLECTION);
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: string) {
  return (await readCollection<SocialPost>(COLLECTION)).find((p) => p.id === id);
}

export async function createPost(input: Partial<SocialPost>) {
  const platforms = (input.platforms ?? []).filter((p): p is Platform => (PLATFORMS as readonly string[]).includes(p));
  const post: SocialPost = {
    id: newId(),
    caption: String(input.caption ?? "").slice(0, 2200),
    hashtags: String(input.hashtags ?? "").slice(0, 600),
    mediaUrl: input.mediaUrl || undefined,
    mediaType: input.mediaType ?? (input.mediaUrl ? "image" : "none"),
    link: input.link || undefined,
    productSlug: input.productSlug || undefined,
    platforms,
    scheduledAt: input.scheduledAt || undefined,
    status: input.scheduledAt ? "scheduled" : "draft",
    results: [],
    createdAt: new Date().toISOString(),
  };
  await updateCollection<SocialPost>(COLLECTION, (items) => [...items, post]);
  return post;
}

export async function deletePost(id: string) {
  await updateCollection<SocialPost>(COLLECTION, (items) => items.filter((p) => p.id !== id));
}

async function savePost(post: SocialPost) {
  await updateCollection<SocialPost>(COLLECTION, (items) => items.map((p) => (p.id === post.id ? post : p)));
}

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v23.0"}`;

async function graph(pathname: string, params: Record<string, string>) {
  const res = await fetch(`${GRAPH}/${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...params, access_token: process.env.META_PAGE_ACCESS_TOKEN || "" }),
  });
  const json = (await res.json()) as { id?: string; post_id?: string; error?: { message: string } };
  if (!res.ok || json.error) throw new Error(json.error?.message || `Graph API ${res.status}`);
  return json;
}

async function publishFacebook(post: SocialPost) {
  const page = process.env.META_PAGE_ID!;
  const message = captionFor(post, "facebook");
  if (post.mediaType === "video" && post.mediaUrl) return (await graph(`${page}/videos`, { file_url: post.mediaUrl, description: message })).id;
  if (post.mediaType === "image" && post.mediaUrl) return (await graph(`${page}/photos`, { url: post.mediaUrl, caption: message })).post_id;
  return (await graph(`${page}/feed`, { message, ...(post.link ? { link: trackedLink(post, "facebook") } : {}) })).id;
}

async function publishInstagram(post: SocialPost) {
  const ig = process.env.META_IG_USER_ID!;
  if (!post.mediaUrl || post.mediaType === "none") throw new Error("Instagram requires an image or video URL");
  const caption = captionFor(post, "instagram");
  const container = await graph(
    `${ig}/media`,
    post.mediaType === "video" ? { media_type: "REELS", video_url: post.mediaUrl, caption } : { image_url: post.mediaUrl, caption }
  );
  if (post.mediaType === "video") {
    // Reels are processed asynchronously; wait until the container is ready.
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const status = await fetch(`${GRAPH}/${container.id}?fields=status_code&access_token=${process.env.META_PAGE_ACCESS_TOKEN}`).then((r) => r.json());
      if (status.status_code === "FINISHED") break;
      if (status.status_code === "ERROR") throw new Error("Instagram could not process the video");
    }
  }
  return (await graph(`${ig}/media_publish`, { creation_id: container.id! })).id;
}

/**
 * Publishes a post. Two back-ends:
 *  1. SOCIAL_WEBHOOK_URL — sends the post to Make.com / Zapier / n8n, which fans out to every network.
 *  2. Meta Graph API — posts directly to your Facebook Page and Instagram Business account.
 */
export async function publishPost(id: string): Promise<SocialPost> {
  const post = await getPost(id);
  if (!post) throw new Error("Post not found");
  post.status = "publishing";
  await savePost(post);

  const results: PublishResult[] = [];
  const now = () => new Date().toISOString();
  const webhook = process.env.SOCIAL_WEBHOOK_URL;
  const metaReady = Boolean(process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID);

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          brand: site.name,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType,
          link: post.link,
          posts: post.platforms.map((p) => ({ platform: p, caption: captionFor(post, p), trackedLink: post.link ? trackedLink(post, p) : null })),
        }),
      });
      for (const p of post.platforms) results.push({ platform: p, ok: res.ok, error: res.ok ? undefined : `Webhook responded ${res.status}`, at: now() });
    } catch (e) {
      for (const p of post.platforms) results.push({ platform: p, ok: false, error: (e as Error).message, at: now() });
    }
  } else {
    for (const p of post.platforms) {
      try {
        if (p === "facebook" && metaReady) results.push({ platform: p, ok: true, externalId: await publishFacebook(post), at: now() });
        else if (p === "instagram" && metaReady && process.env.META_IG_USER_ID)
          results.push({ platform: p, ok: true, externalId: await publishInstagram(post), at: now() });
        else throw new Error("No publisher configured — set SOCIAL_WEBHOOK_URL or the META_* variables");
      } catch (e) {
        results.push({ platform: p, ok: false, error: (e as Error).message, at: now() });
      }
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  post.results = results;
  post.status = okCount === results.length && okCount > 0 ? "published" : okCount > 0 ? "partial" : "failed";
  post.publishedAt = okCount > 0 ? now() : undefined;
  await savePost(post);
  return post;
}

export async function publishDuePosts() {
  const due = (await listPosts()).filter((p) => p.status === "scheduled" && p.scheduledAt && Date.parse(p.scheduledAt) <= Date.now());
  const out = [];
  for (const p of due) out.push(await publishPost(p.id));
  return out;
}
