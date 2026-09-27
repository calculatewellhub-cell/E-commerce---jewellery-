import type { Metadata } from "next";
import CartPage from "@/components/CartPage";

export const metadata: Metadata = {
  title: "Your Bag — Checkout on WhatsApp",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function Cart() {
  return (
    <section className="container">
      <div style={{ padding: "40px 0 0" }}>
        <span className="eyebrow">Checkout</span>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", marginTop: 10 }}>Complete your order</h1>
      </div>
      <CartPage />
    </section>
  );
}
