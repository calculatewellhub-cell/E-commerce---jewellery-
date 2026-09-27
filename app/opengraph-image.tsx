import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 75% 35%, #24554b 0%, #0b1a17 60%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, color: "#f1dca4", textTransform: "uppercase" }}>{`Fine Jewellery · Since ${site.founded}`}</div>
        <div style={{ fontSize: 96, marginTop: 20, fontFamily: "serif" }}>{site.name}</div>
        <div style={{ fontSize: 36, marginTop: 16, color: "rgba(255,255,255,.8)", maxWidth: 900 }}>Hallmarked gold · Certified diamonds · Order on WhatsApp</div>
        <div style={{ position: "absolute", right: 110, top: 170, width: 280, height: 280, borderRadius: 999, border: "26px solid #e6c068", boxShadow: "0 0 80px rgba(241,220,164,.4)" }} />
      </div>
    ),
    size
  );
}
