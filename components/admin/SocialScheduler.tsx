"use client";

import { useCallback, useEffect, useState } from "react";
import type { CatalogItem } from "./types";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "pinterest", label: "Pinterest" },
  { id: "x", label: "X / Twitter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube Shorts" },
  { id: "whatsapp_channel", label: "WhatsApp Channel" },
] as const;

type Post = {
  id: string;
  caption: string;
  hashtags: string;
  mediaUrl?: string;
  mediaType: string;
  link?: string;
  platforms: string[];
  scheduledAt?: string;
  status: string;
  results: { platform: string; ok: boolean; error?: string }[];
  createdAt: string;
};

const empty = { productSlug: "", caption: "", hashtags: "", mediaUrl: "", mediaType: "image", link: "", platforms: ["instagram", "facebook"] as string[], scheduledAt: "" };

export default function SocialScheduler({ catalog, siteUrl, note }: { catalog: CatalogItem[]; siteUrl: string; note?: string }) {
  const [form, setForm] = useState(empty);
  const [posts, setPosts] = useState<Post[]>([]);
  const [clicks, setClicks] = useState<Record<string, number>>({});
  const [publisher, setPublisher] = useState("none");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [p, a] = await Promise.all([fetch("/api/social/posts").then((r) => r.json()), fetch("/api/analytics?days=90").then((r) => r.json())]);
    setPosts(p.posts ?? []);
    setPublisher(p.publisher ?? "none");
    setClicks(Object.fromEntries(a.socialByPost ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pickProduct = (slug: string) => {
    const p = catalog.find((c) => c.slug === slug);
    setForm((f) => ({
      ...f,
      productSlug: slug,
      link: p ? `/product/${p.slug}` : f.link,
      mediaUrl: p ? `${siteUrl}${p.image}` : f.mediaUrl,
      caption: f.caption || (p ? `✨ ${p.name}\n${p.short}` : ""),
    }));
  };

  const generate = async () => {
    setBusy("ai");
    const res = await fetch("/api/social/caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: form.productSlug, brief: form.caption }),
    });
    const j = await res.json();
    setBusy("");
    if (j.caption) setForm((f) => ({ ...f, caption: j.caption, hashtags: j.hashtags ?? f.hashtags }));
    else setMsg(j.error ?? "Could not generate caption");
  };

  const submit = async (mode: "draft" | "schedule" | "now") => {
    if (!form.caption.trim() || !form.platforms.length) return setMsg("Add a caption and choose at least one platform.");
    if (mode === "schedule" && !form.scheduledAt) return setMsg("Pick a date & time to schedule.");
    setBusy(mode);
    setMsg("");
    const res = await fetch("/api/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        link: form.link ? new URL(form.link, siteUrl).toString() : "",
        mediaType: form.mediaUrl ? form.mediaType : "none",
        scheduledAt: mode === "schedule" ? new Date(form.scheduledAt).toISOString() : undefined,
        publishNow: mode === "now",
      }),
    });
    const j = await res.json();
    setBusy("");
    if (!res.ok) return setMsg(j.error ?? "Failed");
    setMsg(mode === "now" ? `Publish status: ${j.post.status}` : mode === "schedule" ? "Scheduled ✓" : "Draft saved ✓");
    setForm(empty);
    load();
  };

  const act = async (id: string, method: "POST" | "DELETE") => {
    setBusy(id);
    await fetch(`/api/social/posts/${id}`, { method });
    setBusy("");
    load();
  };

  const shareLinks = (p: Post) => {
    const link = `${siteUrl}/go/${p.id}`;
    const text = encodeURIComponent(p.caption);
    return [
      ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${link}?p=facebook`)}`],
      ["X", `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(`${link}?p=x`)}`],
      ["Pinterest", `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`${link}?p=pinterest`)}&media=${encodeURIComponent(p.mediaUrl ?? "")}&description=${text}`],
      ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${link}?p=linkedin`)}`],
      ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${p.caption}\n${link}?p=whatsapp_channel`)}`],
    ];
  };

  return (
    <div>
      <h1 className="admin-h1">Social auto-posting & tracking</h1>
      <p className="muted">
        Publisher:{" "}
        <strong>{publisher === "webhook" ? "Automation webhook (Make / Zapier / n8n) ✓" : publisher === "meta" ? "Meta Graph API (Facebook + Instagram) ✓" : "Not configured — see README"}</strong>. Every post gets a tracked link per platform
        so you can see which network drives visits.
      </p>
      {note && <p className="notice">{note}</p>}
      <div className="admin-grid-2">
        <div className="panel">
          <h3>Compose</h3>
          <div className="form-grid">
            <div className="field full">
              <label>Product (auto-fills image & link)</label>
              <select value={form.productSlug} onChange={(e) => pickProduct(e.target.value)}>
                <option value="">— Custom post —</option>
                {catalog.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full">
              <div className="row-between">
                <label>Caption</label>
                <button className="btn btn-sm btn-outline" onClick={generate} disabled={busy === "ai"} type="button">
                  {busy === "ai" ? "Writing…" : "✨ Write with AI"}
                </button>
              </div>
              <textarea rows={5} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
            </div>
            <div className="field full">
              <label>Hashtags</label>
              <input value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} placeholder="#FineJewellery #Bridal" />
            </div>
            <div className="field">
              <label>Media URL (public image / video)</label>
              <input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://…/reel.mp4" />
            </div>
            <div className="field">
              <label>Media type</label>
              <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video / Reel</option>
              </select>
            </div>
            <div className="field full">
              <label>Link (tracked automatically)</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/product/… or full URL" />
            </div>
            <div className="field full">
              <label>Platforms</label>
              <div className="filters" style={{ margin: 0 }}>
                {PLATFORMS.map((p) => {
                  const on = form.platforms.includes(p.id);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      className={`pill ${on ? "active" : ""}`}
                      aria-pressed={on}
                      onClick={() => setForm({ ...form, platforms: on ? form.platforms.filter((x) => x !== p.id) : [...form.platforms, p.id] })}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="field full">
              <label>Schedule for</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
          </div>
          {msg && <p className="notice">{msg}</p>}
          <div className="row-between" style={{ marginTop: 16, gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-sm btn-outline" onClick={() => submit("draft")} disabled={!!busy}>
              Save draft
            </button>
            <button className="btn btn-sm btn-dark" onClick={() => submit("schedule")} disabled={!!busy}>
              Schedule
            </button>
            <button className="btn btn-sm btn-gold" onClick={() => submit("now")} disabled={!!busy}>
              {busy === "now" ? "Publishing…" : "Publish now"}
            </button>
          </div>
        </div>
        <div className="panel">
          <h3>Posts & performance</h3>
          {!posts.length && <p className="muted small">No posts yet. Compose your first one.</p>}
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.id}>
                <div className="row-between">
                  <span className={`status status-${p.status}`}>{p.status}</span>
                  <span className="small muted">
                    {p.scheduledAt ? `⏰ ${new Date(p.scheduledAt).toLocaleString()}` : new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="post-caption">{p.caption}</p>
                <div className="small muted">
                  {p.platforms.join(" · ")} · <strong>{clicks[p.id] ?? 0}</strong> tracked clicks
                </div>
                {p.results
                  .filter((r) => !r.ok)
                  .map((r) => (
                    <div key={r.platform} className="small" style={{ color: "#b3261e" }}>
                      {r.platform}: {r.error}
                    </div>
                  ))}
                <details className="small">
                  <summary>Share manually / tracked links</summary>
                  <div className="share-links">
                    {shareLinks(p).map(([label, href]) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ))}
                    <button className="link-btn" onClick={() => navigator.clipboard.writeText(`${p.caption}\n\n${p.hashtags}\n\n${siteUrl}/go/${p.id}?p=instagram`)}>
                      Copy caption + link
                    </button>
                  </div>
                </details>
                <div className="row-between" style={{ marginTop: 8 }}>
                  <button className="btn btn-sm btn-outline" disabled={busy === p.id} onClick={() => act(p.id, "POST")}>
                    {p.status === "published" ? "Re-publish" : "Publish now"}
                  </button>
                  <button className="link-btn" onClick={() => confirm("Delete this post?") && act(p.id, "DELETE")}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
