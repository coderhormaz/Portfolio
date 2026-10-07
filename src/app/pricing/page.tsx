import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Hormaz Daruwala",
  description:
    "Hormaz Daruwala freelance pricing: landing pages, full-stack Next.js platforms, Web3 builds, mobile apps, and monthly retainers. Machine-readable pricing at /pricing.md.",
  alternates: {
    canonical: `${SITE_URL}/pricing`,
    types: { "text/markdown": `${SITE_URL}/pricing.md` },
  },
};

const tiers = [
  { n: "Landing page", p: "from $800", f: ["Next.js + Tailwind", "SEO + OG + sitemap", "Contact / booking form", "1–2 week delivery", "2 revision rounds"] },
  { n: "Full-stack platform", p: "from $3,500", f: ["Next.js + PostgreSQL", "Auth + RBAC + admin panel", "APIs + VPS deploy (Nginx/SSL)", "Analytics + hardening", "4–8 week delivery"] },
  { n: "Web3 build", p: "from $4,500", f: ["Solidity on Base / BNB / Polygon", "Wallet + swaps + oracles", "AI agent integration", "Audit-ready code", "4–8 week delivery"] },
  { n: "Mobile app", p: "from $3,000", f: ["React Native / Expo", "iOS + Android", "Play Store release", "OTA updates", "3–6 week delivery"] },
  { n: "Monthly retainer", p: "$1,500/mo", f: ["~40 hrs/month", "Priority replies <24h", "Roadmap + maintenance", "Pause anytime"] },
];

export default function PricingPage() {
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tiers.map((t, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: t.n,
      priceSpecification: { "@type": "PriceSpecification", price: t.p, priceCurrency: "USD" },
      url: `${SITE_URL}/pricing`,
      seller: { "@type": "Person", name: "Hormaz Daruwala", url: SITE_URL },
    })),
  };
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-28 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">Pricing · Hormaz Daruwala</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Freelance pricing</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-white/60">
        Transparent starting prices for freelance engagements with Hormaz
        Daruwala, a Mumbai-based full-stack, Web3, and mobile engineer with
        5+ years in production. Every engagement includes a written scope,
        weekly demos, and source handover. Final quotes depend on scope,
        integrations, and timeline — email{" "}
        <a className="underline" href="mailto:hormazdaruwala86@gmail.com">hormazdaruwala86@gmail.com</a>{" "}
        or use the contact form with budget and timeline for a fixed quote
        within 24 hours. Machine-readable pricing for agents lives at{" "}
        <a className="underline" href="/pricing.md">/pricing.md</a> and in the
        schema.org Offer data on this page.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {tiers.map((t) => (
          <div key={t.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-lg font-bold">{t.n}</p>
            <p className="mt-1 text-2xl font-bold text-[#ff4d00]">{t.p}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
              {t.f.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-white/50">
        Free 30-min discovery call · 50% upfront, 50% on launch · Sandbox
        demos before any production change · See <a className="underline" href="/docs">/docs</a> and{" "}
        <a className="underline" href="/developers">/developers</a> for the public API.
      </p>
    </section>
  );
}
