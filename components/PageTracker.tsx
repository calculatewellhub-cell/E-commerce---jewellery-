"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "./track";

function source() {
  const params = new URLSearchParams(location.search);
  const utm = params.get("utm_source");
  if (utm) return utm;
  if (!document.referrer) return "direct";
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host === location.hostname.replace(/^www\./, "")) return undefined;
    return host;
  } catch {
    return "direct";
  }
}

export default function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackEvent({ type: "page_view", source: source() });
  }, [pathname]);
  return null;
}
