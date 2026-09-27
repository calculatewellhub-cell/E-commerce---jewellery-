"use client";

import { useState } from "react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="admin-login">
      <form
        className="panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
          setBusy(false);
          if (res.ok) location.reload();
          else setError((await res.json()).error ?? "Login failed");
        }}
      >
        <div className="logo" style={{ marginBottom: 16 }}>
          <span className="logo-mark">A</span>
          <span>
            Aurelia<em>Studio</em>
          </span>
        </div>
        <p className="muted small">Marketing studio: analytics, image-to-video creator and social auto-posting.</p>
        {!configured && <p className="small" style={{ color: "#b3261e" }}>Set <code>ADMIN_PASSWORD</code> in your environment to enable the admin area.</p>}
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {error && <p className="small" style={{ color: "#b3261e" }}>{error}</p>}
        <button className="btn btn-gold btn-block" style={{ marginTop: 16 }} disabled={busy || !configured}>
          Sign in
        </button>
      </form>
    </div>
  );
}
