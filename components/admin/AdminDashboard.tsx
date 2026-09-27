"use client";

import Link from "next/link";
import { useState } from "react";
import Analytics from "./Analytics";
import VideoStudio from "./VideoStudio";
import SocialScheduler from "./SocialScheduler";
import type { CatalogItem } from "./types";

const TABS = [
  { id: "analytics", label: "Analytics" },
  { id: "video", label: "Video Studio" },
  { id: "social", label: "Social Posting" },
] as const;

export default function AdminDashboard({ catalog, siteUrl }: { catalog: CatalogItem[]; siteUrl: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("analytics");
  // A freshly rendered video can be handed to the scheduler as a starting point.
  const [draftMedia, setDraftMedia] = useState<{ note: string } | null>(null);

  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="logo">
          <span className="logo-mark">A</span>
          <span>
            Aurelia<em>Studio</em>
          </span>
        </div>
        <nav className="admin-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-actions">
          <Link href="/" className="btn btn-sm btn-outline">
            View store
          </Link>
          <button
            className="btn btn-sm btn-dark"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              location.reload();
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="admin-body">
        {tab === "analytics" && <Analytics catalog={catalog} />}
        {tab === "video" && (
          <VideoStudio
            catalog={catalog}
            onUseInPost={() => {
              setDraftMedia({ note: "Upload the downloaded video to your media host (or Meta Business Suite) and paste its public URL below." });
              setTab("social");
            }}
          />
        )}
        {tab === "social" && <SocialScheduler catalog={catalog} siteUrl={siteUrl} note={draftMedia?.note} />}
      </div>
    </div>
  );
}
