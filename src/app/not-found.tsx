import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Lost in the void",
  description: "This page doesn't exist. Head back to Hormaz Daruwala's portfolio.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="blueprint absolute inset-0 opacity-80" />
        <div className="absolute left-1/2 top-1/3 h-[380px] w-[520px] -translate-x-1/2 rounded-full bg-[#ff4d00]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-start justify-center px-5 py-32 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">
          (404) · Dead end
        </p>
        <h1 className="font-display mt-6 font-bold leading-[0.9] tracking-[-0.04em]">
          <span className="text-ghost block text-[clamp(5rem,22vw,16rem)]">404</span>
          <span className="mt-4 block text-[clamp(2rem,6vw,4rem)]">
            Lost in the <span className="font-serif-accent font-normal text-[#ff4d00]">void.</span>
          </span>
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-white/60">
          This route was never shipped. The good stuff is one click back — selected work, builds,
          and a contact form that actually gets answered.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#ece8de] py-1.5 pl-1.5 pr-5 text-sm font-bold text-black transition hover:bg-[#ff4d00] hover:text-white"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition group-hover:bg-white group-hover:text-black">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back home
          </Link>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-[#ff4d00] hover:text-white"
          >
            Contact
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
