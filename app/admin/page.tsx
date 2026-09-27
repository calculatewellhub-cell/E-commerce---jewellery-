import type { Metadata } from "next";
import { isAdmin, adminPassword } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin configured={Boolean(adminPassword())} />;
  const catalog = products.map((p) => ({ slug: p.slug, name: p.name, image: p.image, price: p.price, short: p.short }));
  return <AdminDashboard catalog={catalog} siteUrl={site.url} />;
}
