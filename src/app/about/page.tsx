import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { profile, education } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "About — Hormaz Daruwala",
  description:
    "About Hormaz Daruwala: Mumbai full-stack, Web3, and mobile engineer with 5+ years production experience, hackathon wins, and live client launches.",
  alternates: {
    canonical: `${SITE_URL}/about`,
    types: { "text/markdown": `${SITE_URL}/about.md` },
  },
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">About · Hormaz Daruwala</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">About Hormaz Daruwala</h1>
      <p className="mt-4 leading-relaxed text-white/60">
        I&apos;m Hormaz Daruwala, a Mumbai-based full-stack developer with
        5+ years shipping production code across web platforms, Web3
        systems, and mobile apps. I completed full-stack work at AISkool:
        auth with role-based access control, backend APIs built from
        scratch, and a zero-data-loss migration from Supabase to
        self-hosted PostgreSQL on a dedicated VPS with Nginx, SSL,
        deployment pipelines, and security hardening. I headed the IT
        department at Techshala (Vidyalankar Polytechnic), architecting a
        10-module college developer platform with events, users,
        leaderboard, freelance, VAC tracks, and RBAC.
      </p>
      <p className="mt-4 leading-relaxed text-white/60">
        I compete in 15+ hackathons including an ETH Mumbai bounty win for
        a decentralised AI agent marketplace with USDC pay-per-query on
        Base via x402 and ENS discovery, plus builds across Avalanche,
        Polygon, opBNB, and BNB Chain with Gemini-powered natural-language
        blockchain operations. Client work spans EdTech, dermatology
        booking + eCommerce, corporate CMS sites, and design systems with
        editorial-grade motion. I work from Mumbai with clients worldwide,
        reply within 24 hours at {profile.email}, and am open to freelance
        and full-time roles.
      </p>
      <h2 className="mt-8 text-2xl font-bold">Education</h2>
      <ul className="mt-3 space-y-2 text-white/70">
        {education.map((e) => (
          <li key={e.degree}>{e.degree} — {e.school} ({e.period})</li>
        ))}
      </ul>
      <p className="mt-6 text-white/60">
        GitHub: <a className="underline" href={profile.github}>{profile.github}</a> ·
        LinkedIn: <a className="underline" href={profile.linkedin}>{profile.linkedin}</a> ·
        Developers: <a className="underline" href="/developers">/developers</a> ·
        Docs: <a className="underline" href="/docs">/docs</a>
      </p>
    </section>
  );
}
