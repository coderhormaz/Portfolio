import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact — Hormaz Daruwala",
  description:
    "Contact Hormaz Daruwala for freelance or full-time work: email, location, availability, and project inquiry details. Replies within 24 hours.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
    types: { "text/markdown": `${SITE_URL}/contact.md` },
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">Contact · Hormaz Daruwala</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Contact</h1>
      <p className="mt-4 leading-relaxed text-white/60">
        The fastest way to reach Hormaz Daruwala about freelance projects
        or full-time roles is email at {profile.email} — every message is
        read personally and answered within 24 hours. Include your scope,
        budget, and timeline, plus links to anything similar you like, and
        you will get a concrete next step rather than a generic reply. He
        works from {profile.location} with clients worldwide and is
        currently {profile.availability.toLowerCase()}. An interactive
        contact form with validation lives on the homepage at /#contact,
        and agents can validate inquiries programmatically via POST
        /api/contact with name, email, and message fields.
      </p>
      <ul className="mt-6 space-y-2 text-white/70">
        <li>Email: <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a></li>
        <li>Phone: {profile.phone}</li>
        <li>Location: {profile.location} (worldwide remote)</li>
        <li>GitHub: <a className="underline" href={profile.github}>{profile.github}</a></li>
        <li>LinkedIn: <a className="underline" href={profile.linkedin}>{profile.linkedin}</a></li>
        <li>API: <a className="underline" href="/api/contact">/api/contact</a></li>
      </ul>
    </section>
  );
}
