"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CatalogItem } from "./types";
import { formatPrice, site } from "@/lib/site";

type Slide = { id: string; src: string; title: string; subtitle: string };
type Format = "reel" | "square" | "landscape";
type Transition = "fade" | "zoom" | "slide" | "shine";

const SIZES: Record<Format, [number, number, string]> = {
  reel: [720, 1280, "9:16 Reel / Story / Short"],
  square: [1080, 1080, "1:1 Feed post"],
  landscape: [1280, 720, "16:9 YouTube / Facebook"],
};
const FPS = 30;
const TRANSITION_SECONDS = 0.7;

function pickMime() {
  const candidates = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return candidates.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) ?? "";
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, scale: number, dx: number, dy: number) {
  const r = Math.max(W / img.width, H / img.height) * scale;
  const w = img.width * r;
  const h = img.height * r;
  ctx.drawImage(img, (W - w) / 2 + dx, (H - h) / 2 + dy, w, h);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
  ctx.restore();
}

export default function VideoStudio({ catalog, onUseInPost }: { catalog: CatalogItem[]; onUseInPost: () => void }) {
  const [slides, setSlides] = useState<Slide[]>(() =>
    catalog.slice(0, 3).map((p) => ({ id: p.slug, src: p.image, title: p.name, subtitle: formatPrice(p.price) }))
  );
  const [format, setFormat] = useState<Format>("reel");
  const [transition, setTransition] = useState<Transition>("zoom");
  const [seconds, setSeconds] = useState(2.8);
  const [cta, setCta] = useState("Order on WhatsApp");
  const [outro, setOutro] = useState(`${site.name} · Link in bio`);
  const [music, setMusic] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<{ url: string; mime: string; size: number } | null>(null);
  const [error, setError] = useState("");

  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef(new Map<string, HTMLImageElement>());
  const previewRaf = useRef(0);
  const [W, H] = SIZES[format];
  const outroSeconds = 2.2;
  const total = slides.length * seconds + outroSeconds;

  // Preload images
  useEffect(() => {
    slides.forEach((s) => {
      if (!images.current.has(s.src)) loadImage(s.src).then((img) => images.current.set(s.src, img)).catch(() => setError(`Couldn't load ${s.title}`));
    });
  }, [slides]);

  const draw = useCallback(
    (t: number) => {
      const c = canvas.current;
      if (!c) return;
      const ctx = c.getContext("2d")!;
      const unit = Math.min(W, H) / 100;

      const bg = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, Math.max(W, H));
      bg.addColorStop(0, "#1f4a41");
      bg.addColorStop(1, "#050c0b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const slideT = slides.length * seconds;
      const inOutro = t >= slideT;
      const i = Math.min(slides.length - 1, Math.floor(t / seconds));
      const local = inOutro ? 1 : (t - i * seconds) / seconds;

      const paint = (idx: number, p: number, alpha: number, offsetX = 0) => {
        const s = slides[idx];
        const img = s && images.current.get(s.src);
        if (!img) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        const zoom = transition === "zoom" || transition === "shine" ? 1.02 + 0.12 * p : 1.04;
        const panX = transition === "zoom" ? (idx % 2 ? -1 : 1) * unit * 3 * p : 0;
        drawCover(ctx, img, W, H, zoom, panX + offsetX, -unit * 2 * p);
        ctx.restore();
      };

      if (slides.length) {
        if (inOutro) {
          paint(slides.length - 1, 1, 0.35);
        } else {
          const tEnd = seconds - TRANSITION_SECONDS;
          const inTrans = t - i * seconds > tEnd && i < slides.length - 1;
          const k = inTrans ? ease((t - i * seconds - tEnd) / TRANSITION_SECONDS) : 0;
          if (transition === "slide" && inTrans) {
            paint(i, local, 1, -W * k);
            paint(i + 1, 0, 1, W * (1 - k));
          } else {
            paint(i, local, 1);
            if (inTrans) paint(i + 1, 0, k);
          }
          if (transition === "shine") {
            const x = ((t % seconds) / seconds) * (W + H) * 1.2 - H;
            const g = ctx.createLinearGradient(x, 0, x + H * 0.5, H);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(0.5, "rgba(255,245,220,0.22)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
          }
        }
      }

      // Readability gradient
      const shade = ctx.createLinearGradient(0, H * 0.45, 0, H);
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(0,0,0,0.78)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, W, H);

      // Story-style progress bars
      const barW = (W - unit * 8 - (slides.length - 1) * unit) / Math.max(1, slides.length);
      slides.forEach((_, k) => {
        const x = unit * 4 + k * (barW + unit);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(x, unit * 3, barW, unit * 0.5);
        const fill = inOutro || k < i ? 1 : k === i ? local : 0;
        ctx.fillStyle = "#f1dca4";
        ctx.fillRect(x, unit * 3, barW * fill, unit * 0.5);
      });

      // Brand
      ctx.fillStyle = "#f1dca4";
      ctx.font = `500 ${unit * 3}px Jost, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.letterSpacing = `${unit * 0.8}px`;
      ctx.fillText(site.name.toUpperCase(), W / 2, unit * 9);
      ctx.letterSpacing = "0px";

      // Sparkles
      for (let s = 0; s < 7; s++) {
        const phase = (t * 0.8 + s * 0.37) % 1;
        sparkle(ctx, ((s * 137) % 100) * unit * (W / Math.min(W, H) / 1), ((s * 71) % 60 + 10) * unit * (H / Math.min(W, H)), unit * (1 + (s % 3)), Math.sin(phase * Math.PI) * 0.9);
      }

      ctx.textAlign = "center";
      if (!inOutro && slides[i]) {
        const appear = ease(Math.min(1, local * 3));
        ctx.globalAlpha = appear;
        const y0 = H - unit * (format === "landscape" ? 20 : 26) + (1 - appear) * unit * 4;
        ctx.fillStyle = "#fff";
        ctx.font = `500 ${unit * 7}px "Cormorant Garamond", Georgia, serif`;
        const lines = wrap(ctx, slides[i].title, W - unit * 14);
        lines.forEach((l, n) => ctx.fillText(l, W / 2, y0 + n * unit * 7.5 - (lines.length - 1) * unit * 7.5));
        if (slides[i].subtitle) {
          ctx.fillStyle = "#f1dca4";
          ctx.font = `500 ${unit * 4}px Jost, Arial, sans-serif`;
          ctx.fillText(slides[i].subtitle, W / 2, y0 + unit * 7);
        }
        ctx.globalAlpha = 1;
      }

      if (inOutro) {
        const p = ease(Math.min(1, (t - slideT) / 0.6));
        ctx.globalAlpha = p;
        ctx.fillStyle = "#fff";
        ctx.font = `500 ${unit * 8}px "Cormorant Garamond", Georgia, serif`;
        wrap(ctx, outro, W - unit * 14).forEach((l, n) => ctx.fillText(l, W / 2, H / 2 - unit * 4 + n * unit * 9));
        // CTA pill
        ctx.font = `600 ${unit * 3.6}px Jost, Arial, sans-serif`;
        const tw = ctx.measureText(cta).width + unit * 10;
        const px = W / 2 - tw / 2;
        const py = H / 2 + unit * 10;
        ctx.fillStyle = "#25d366";
        ctx.beginPath();
        ctx.roundRect(px, py, tw, unit * 9, unit * 4.5);
        ctx.fill();
        ctx.fillStyle = "#06301a";
        ctx.fillText(cta, W / 2, py + unit * 5.8);
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.font = `400 ${unit * 3}px Jost, Arial, sans-serif`;
        ctx.fillText(site.url.replace(/^https?:\/\//, ""), W / 2, py + unit * 16);
        ctx.globalAlpha = 1;
      }
    },
    [W, H, slides, seconds, transition, cta, outro, format]
  );

  // Live looping preview
  useEffect(() => {
    if (recording) return;
    const start = performance.now();
    const loop = (now: number) => {
      draw(((now - start) / 1000) % total);
      previewRaf.current = requestAnimationFrame(loop);
    };
    previewRaf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(previewRaf.current);
  }, [draw, total, recording]);

  async function render() {
    const c = canvas.current;
    if (!c || !slides.length) return;
    const mime = pickMime();
    if (!mime) return setError("Your browser can't record video. Please use the latest Chrome, Edge or Safari.");
    setError("");
    setOutput(null);
    setRecording(true);
    cancelAnimationFrame(previewRaf.current);
    await Promise.all(slides.map((s) => (images.current.has(s.src) ? null : loadImage(s.src).then((img) => images.current.set(s.src, img)))));
    await document.fonts?.ready;

    const stream = c.captureStream(FPS);
    let audio: HTMLAudioElement | null = null;
    let actx: AudioContext | null = null;
    if (music) {
      audio = new Audio(music);
      actx = new AudioContext();
      const src = actx.createMediaElementSource(audio);
      const gain = actx.createGain();
      const dest = actx.createMediaStreamDestination();
      src.connect(gain).connect(dest);
      // Fade the music out over the final second
      gain.gain.setValueAtTime(1, actx.currentTime + Math.max(0, total - 1));
      gain.gain.linearRampToValueAtTime(0, actx.currentTime + total);
      dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
    }

    const chunks: Blob[] = [];
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => (rec.onstop = () => r()));
    rec.start(250);
    audio?.play().catch(() => {});

    const start = performance.now();
    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = (now - start) / 1000;
        draw(Math.min(t, total - 0.001));
        setProgress(Math.min(1, t / total));
        if (t < total) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    rec.stop();
    await done;
    audio?.pause();
    actx?.close();
    stream.getTracks().forEach((tr) => tr.stop());
    const blob = new Blob(chunks, { type: mime.split(";")[0] });
    setOutput({ url: URL.createObjectURL(blob), mime: mime.split(";")[0], size: blob.size });
    setRecording(false);
    setProgress(0);
  }

  const available = useMemo(() => catalog.filter((p) => !slides.some((s) => s.id === p.slug)), [catalog, slides]);

  const move = (idx: number, dir: -1 | 1) =>
    setSlides((s) => {
      const n = [...s];
      const j = idx + dir;
      if (j < 0 || j >= n.length) return s;
      [n[idx], n[j]] = [n[j], n[idx]];
      return n;
    });

  return (
    <div>
      <h1 className="admin-h1">Image → Video Studio</h1>
      <p className="muted">Turn product photos into branded Reels, Shorts and Stories in seconds. Rendering happens in your browser — nothing is uploaded.</p>
      <div className="studio">
        <div className="studio-controls">
          <div className="panel">
            <h3>1 · Slides</h3>
            <ol className="slide-list">
              {slides.map((s, idx) => (
                <li key={s.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" width={52} height={52} />
                  <div className="slide-fields">
                    <input value={s.title} onChange={(e) => setSlides((all) => all.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))} aria-label="Slide title" />
                    <input value={s.subtitle} onChange={(e) => setSlides((all) => all.map((x) => (x.id === s.id ? { ...x, subtitle: e.target.value } : x)))} aria-label="Slide subtitle" placeholder="Price or tagline" />
                  </div>
                  <div className="slide-actions">
                    <button onClick={() => move(idx, -1)} aria-label="Move up">↑</button>
                    <button onClick={() => move(idx, 1)} aria-label="Move down">↓</button>
                    <button onClick={() => setSlides((all) => all.filter((x) => x.id !== s.id))} aria-label="Remove">✕</button>
                  </div>
                </li>
              ))}
            </ol>
            <div className="row-between" style={{ gap: 8, flexWrap: "wrap" }}>
              <select
                value=""
                onChange={(e) => {
                  const p = catalog.find((c) => c.slug === e.target.value);
                  if (p) setSlides((s) => [...s, { id: p.slug, src: p.image, title: p.name, subtitle: formatPrice(p.price) }]);
                }}
                aria-label="Add a product slide"
              >
                <option value="">+ Add product image…</option>
                {available.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
              <label className="btn btn-sm btn-outline">
                Upload photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    setSlides((s) => [
                      ...s,
                      ...files.map((f) => ({ id: `${f.name}-${f.lastModified}`, src: URL.createObjectURL(f), title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "), subtitle: "" })),
                    ]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
          <div className="panel">
            <h3>2 · Style</h3>
            <div className="form-grid">
              <div className="field">
                <label>Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                  {Object.entries(SIZES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v[2]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Transition</label>
                <select value={transition} onChange={(e) => setTransition(e.target.value as Transition)}>
                  <option value="zoom">Ken Burns zoom</option>
                  <option value="fade">Cross-fade</option>
                  <option value="slide">Slide</option>
                  <option value="shine">Gold shine sweep</option>
                </select>
              </div>
              <div className="field">
                <label>Seconds per slide: {seconds.toFixed(1)}</label>
                <input type="range" min={1.5} max={6} step={0.1} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Background music (optional)</label>
                <input type="file" accept="audio/*" onChange={(e) => setMusic(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} />
              </div>
              <div className="field">
                <label>Closing line</label>
                <input value={outro} onChange={(e) => setOutro(e.target.value)} />
              </div>
              <div className="field">
                <label>Call to action</label>
                <input value={cta} onChange={(e) => setCta(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <div className="studio-preview">
          <div className={`canvas-frame ${format}`}>
            <canvas ref={canvas} width={W} height={H} />
          </div>
          <p className="muted small" style={{ textAlign: "center" }}>
            {W}×{H} · {total.toFixed(1)}s · live preview
          </p>
          <button className="btn btn-gold btn-block" onClick={render} disabled={recording || !slides.length}>
            {recording ? `Rendering… ${Math.round(progress * 100)}%` : "🎬 Render video"}
          </button>
          {error && <p className="small" style={{ color: "#b3261e" }}>{error}</p>}
          {output && (
            <div className="panel" style={{ marginTop: 14 }}>
              <video src={output.url} controls playsInline style={{ width: "100%", maxHeight: 420, borderRadius: 12, background: "#000" }} />
              <p className="small muted">
                {output.mime} · {(output.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <div className="row-between" style={{ gap: 8 }}>
                <a className="btn btn-sm btn-dark" href={output.url} download={`aurelia-${format}-${Date.now()}.${output.mime.includes("mp4") ? "mp4" : "webm"}`}>
                  Download
                </a>
                <button className="btn btn-sm btn-outline" onClick={onUseInPost}>
                  Schedule as post →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
