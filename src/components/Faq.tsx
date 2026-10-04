import { Fragment } from "react";
import { profile } from "@/data/portfolio";
import { SectionHead } from "./ui";

const faqs = [
  {
    q: "What services does Hormaz Daruwala offer?",
    a: "Full-stack Next.js platforms with PostgreSQL auth and admin panels, Web3 builds in Solidity on Base and BNB Chain, React Native mobile apps, UI/UX design systems, and VPS DevOps including Nginx, SSL and zero-downtime migrations.",
  },
  {
    q: "Is Hormaz available for freelance or full-time work?",
    a: "Yes. He is open to freelance projects and full-time roles, works from Mumbai with clients worldwide, and typically replies within 24 hours via email or the contact form.",
  },
  {
    q: "What production experience does he have?",
    a: "5+ years shipping production code including the AISkool EdTech platform with RBAC auth and a zero-data-loss Supabase to self-hosted PostgreSQL migration, plus Techshala's 10-module college platform and live client sites with CMS, bookings and eCommerce.",
  },
  {
    q: "What is his Web3 and AI experience?",
    a: "ETH Mumbai bounty winner for a decentralised AI agent marketplace with USDC pay-per-query on Base via x402 and ENS discovery, plus AI trading agents on Polygon and opBNB, token and NFT launchers, and Gemini-powered natural-language blockchain operations.",
  },
  {
    q: "How do I contact Hormaz about a project?",
    a: `Email ${profile.email} directly or use the contact form with your scope, budget and timeline. Include links to anything similar you like and you will get a reply within 24 hours.`,
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Faq() {
  return (
    <section id="faq" className="relative bg-[#0a0a0c] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="FAQ · Hiring questions"
          lines={[
            <Fragment key="q">Questions,</Fragment>,
            <Fragment key="a">
              <span className="font-serif-accent font-normal text-[#ff4d00]">answered.</span>
            </Fragment>,
          ]}
        />
        <div className="mt-8 grid gap-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 open:bg-white/[0.05]"
            >
              <summary className="cursor-pointer list-none font-display text-base font-bold tracking-tight sm:text-lg">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-[15px]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
