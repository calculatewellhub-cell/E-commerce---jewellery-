"use client";

import { useEffect, useState } from "react";
import type { CatalogItem } from "./types";
import { formatPrice } from "@/lib/site";

type Summary = {
  totals: Record<string, number>;
  daily: ({ date: string } & Record<string, number | string>)[];
  topProducts: [string, number][];
  sources: [string, number][];
  socialByPlatform: [string, number][];
};

function BarChart({ data, field, title }: { data: Summary["daily"]; field: string; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const values = data.map((d) => Number(d[field] ?? 0));
  const max = Math.max(1, ...values);
  const W = 600;
  const H = 180;
  const pad = { l: 30, r: 8, t: 10, b: 22 };
  const bw = (W - pad.l - pad.r) / values.length;
  const ticks = [0, Math.ceil(max / 2), max];
  return (
    <figure className="chart">
      <figcaption>{title}</figcaption>
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${title}, last ${values.length} days`} onMouseLeave={() => setHover(null)}>
          {ticks.map((t) => {
            const y = pad.t + (H - pad.t - pad.b) * (1 - t / max);
            return (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="currentColor" opacity={0.1} />
                <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity={0.6}>
                  {t}
                </text>
              </g>
            );
          })}
          {values.map((v, i) => {
            const h = ((H - pad.t - pad.b) * v) / max;
            const x = pad.l + i * bw;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={x} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                <path
                  d={h > 0 ? `M${x + 1} ${H - pad.b} V${H - pad.b - h + Math.min(4, h)} q0 -${Math.min(4, h)} ${Math.min(4, h)} -${Math.min(4, h)} H${x + bw - 1 - Math.min(4, h)} q${Math.min(4, h)} 0 ${Math.min(4, h)} ${Math.min(4, h)} V${H - pad.b}Z` : ""}
                  fill="#a67f36"
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              </g>
            );
          })}
          <text x={pad.l} y={H - 6} fontSize="10" fill="currentColor" opacity={0.6}>
            {data[0]?.date.slice(5)}
          </text>
          <text x={W - pad.r} y={H - 6} fontSize="10" textAnchor="end" fill="currentColor" opacity={0.6}>
            {data[data.length - 1]?.date.slice(5)}
          </text>
        </svg>
        {hover !== null && (
          <div className="tip" style={{ left: `${((pad.l + (hover + 0.5) * bw) / W) * 100}%` }}>
            <strong>{values[hover]}</strong> · {data[hover].date}
          </div>
        )}
      </div>
    </figure>
  );
}

function Ranked({ title, rows, label = (k: string) => k }: { title: string; rows: [string, number][]; label?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="panel">
      <h3>{title}</h3>
      {rows.length === 0 && <p className="muted small">No data yet.</p>}
      <ul className="ranked">
        {rows.map(([k, v]) => (
          <li key={k}>
            <span>{label(k)}</span>
            <span className="ranked-bar">
              <i style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <strong>{v}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Analytics({ catalog }: { catalog: CatalogItem[] }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch(`/api/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [days]);

  const name = (slug: string) => catalog.find((c) => c.slug === slug)?.name ?? slug;
  const t = data?.totals ?? {};
  const conv = t.productViews ? ((t.whatsappOrders / t.productViews) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1 className="admin-h1">Store performance</h1>
        <div className="filters" style={{ margin: 0 }}>
          {[7, 30, 90].map((d) => (
            <button key={d} className={`pill ${days === d ? "active" : ""}`} onClick={() => setDays(d)}>
              {d} days
            </button>
          ))}
        </div>
      </div>
      <div className="kpis">
        {[
          ["Page views", t.pageViews ?? 0],
          ["Product views", t.productViews ?? 0],
          ["Add to bag", t.addToCart ?? 0],
          ["WhatsApp orders", t.whatsappOrders ?? 0],
          ["Order value", formatPrice(t.orderValue ?? 0)],
          ["View → order", `${conv}%`],
          ["AI chat messages", t.chatMessages ?? 0],
          ["Social clicks", t.socialClicks ?? 0],
        ].map(([k, v]) => (
          <div key={k} className="kpi">
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      {data && (
        <div className="admin-grid-2">
          <div className="panel">
            <BarChart data={data.daily} field="page_view" title="Daily page views" />
          </div>
          <div className="panel">
            <BarChart data={data.daily} field="whatsapp_order" title="Daily WhatsApp orders" />
          </div>
          <Ranked title="Most viewed products" rows={data.topProducts} label={name} />
          <Ranked title="Traffic sources" rows={data.sources} />
          <Ranked title="Social clicks by platform" rows={data.socialByPlatform} />
        </div>
      )}
    </div>
  );
}
