"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon, SparkIcon, WhatsAppIcon } from "./Icons";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Engagement rings under ₹1.5 lakh", "Bridal necklace ideas", "A gift for my wife", "Is your gold hallmarked?"];
const GREETING: Msg = {
  role: "assistant",
  content: "Namaste ✨ I'm Aria, your personal jewellery concierge. Looking for something special — an engagement ring, bridal set or a gift?",
};

/** Renders plain text with markdown links; internal links use client-side navigation. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith("/") ? (
            <Link key={i} href={href}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMsgs([...next, { role: "assistant", content: "Sorry, I'm having trouble connecting. Our concierge is always available on WhatsApp." }]);
    } finally {
      setBusy(false);
    }
  }

  const transcript = msgs
    .filter((m) => m !== GREETING)
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Me" : "Aria"}: ${m.content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}`)
    .join("\n");

  return (
    <>
      <button className={`chat-fab ${open ? "hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Open AI jewellery concierge">
        <SparkIcon size={22} />
        <span>Ask Aria</span>
      </button>
      <section className={`chat ${open ? "open" : ""}`} aria-label="AI jewellery concierge" aria-hidden={!open}>
        <header className="chat-head">
          <div className="chat-avatar">
            <SparkIcon size={18} />
          </div>
          <div>
            <strong>Aria · AI Concierge</strong>
            <span className="chat-status">Online · replies instantly</span>
          </div>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
            <CloseIcon />
          </button>
        </header>
        <div className="chat-body" ref={list} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.content ? <RichText text={m.content} /> : <span className="typing"><i /><i /><i /></span>}
            </div>
          ))}
          {msgs.length <= 1 && (
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <a
          className="chat-handoff"
          href={whatsappLink(`Hello ${site.name}! I was chatting with Aria on your website.\n\n${transcript}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={16} /> Continue with a human on WhatsApp
        </a>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about rings, budgets, gold purity…" aria-label="Message" maxLength={500} />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
            <SendIcon size={18} />
          </button>
        </form>
      </section>
    </>
  );
}
