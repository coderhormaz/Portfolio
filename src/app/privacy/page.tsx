import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy — Hormaz Daruwala",
  description:
    "Privacy policy for hormazdaruwala.vercel.app: what data is collected, how contact inquiries are used, cookies, analytics, and contact details.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
    types: { "text/markdown": `${SITE_URL}/privacy.md` },
  },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">Privacy · Hormaz Daruwala</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 leading-relaxed text-white/60">
        This portfolio at hormazdaruwala.vercel.app collects the minimum
        data needed to operate: contact inquiries you submit (name, email,
        message) are used solely to respond to your project or hiring
        inquiry and are never sold or shared with third parties except the
        form-delivery provider that forwards your message to the site
        owner. Server logs (IP, user agent, requested path) may be
        retained briefly by the hosting provider for security and abuse
        prevention. No advertising trackers are used; any privacy-friendly
        analytics are aggregated and contain no cross-site identifiers.
      </p>
      <p className="mt-4 leading-relaxed text-white/60">
        The public API is read-only and requires no account; authenticated
        agent endpoints accept only the credentials described in /auth.md
        and demo tokens expire within one hour. You may request access,
        correction, or deletion of your inquiry data at any time by
        emailing hormazdaruwala86@gmail.com from the address you used, and
        deletion will be confirmed within 7 days. This policy may be
        updated as features change; the sitemap last-modified date
        reflects the latest revision.
      </p>
    </section>
  );
}
