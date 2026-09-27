import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ padding: "120px 0" }}>
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>This treasure has moved</h1>
        <p>The page you're looking for isn't here, but our collection is.</p>
        <Link href="/shop" className="btn btn-gold" style={{ marginTop: 24 }}>
          Explore jewellery
        </Link>
      </div>
    </section>
  );
}
