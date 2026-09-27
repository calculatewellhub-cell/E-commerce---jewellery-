"use client";

import Image from "next/image";
import { useState } from "react";
import LazyJewelViewer from "./LazyJewelViewer";

export default function ProductMedia({ image, name, metal, gem, showRing }: { image: string; name: string; metal: string; gem: string | null; showRing: boolean }) {
  const [mode, setMode] = useState<"photo" | "3d">("photo");
  return (
    <div className="pdp-media">
      <div className="pdp-stage">
        {mode === "photo" ? (
          <Image src={image} alt={name} fill priority sizes="(max-width: 900px) 100vw, 55vw" />
        ) : (
          <LazyJewelViewer metal={metal} gem={gem} label={`${name} — interactive 3D view`} />
        )}
      </div>
      <div className="pdp-tabs">
        <button className={`pill ${mode === "photo" ? "active" : ""}`} onClick={() => setMode("photo")}>
          Photo
        </button>
        <button className={`pill ${mode === "3d" ? "active" : ""}`} onClick={() => setMode("3d")}>
          ✦ View in 3D{showRing ? "" : " (metal & stone preview)"}
        </button>
      </div>
    </div>
  );
}
