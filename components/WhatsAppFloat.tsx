"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { trackEvent } from "./track";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <a
      className="wa-float"
      href={whatsappLink(`Hello ${site.name}! I'd like some help choosing jewellery.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onClick={() => trackEvent({ type: "whatsapp_enquiry" })}
    >
      <WhatsAppIcon size={28} />
      <span className="wa-float-label">Chat on WhatsApp</span>
    </a>
  );
}
