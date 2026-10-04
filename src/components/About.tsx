"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { education, profile } from "@/data/portfolio";
import { CountUp, Reveal, SectionHead } from "./ui";

const services = [
  { n: "01", t: "Full-stack platforms", d: "Next.js, APIs, Postgres, auth & RBAC, admin systems that scale." },
  { n: "02", t: "Web3 & agents", d: "Solidity, multi-chain swaps, Pyth oracles, AI trading agents." },
  { n: "03", t: "Mobile apps", d: "React Native / Expo, published on Play Store with real users." },
  { n: "04", t: "Design & motion", d: "Figma to Framer-motion: design systems, 3D, GSAP-level polish." },
  { n: "05", t: "VPS & DevOps", d: "Nginx, SSL, migrations with zero loss, hardening, pipelines." },
];

const facts = [
  { v: 5, s: "+", l: "Years shipping" },
  { v: 15, s: "+", l: "Hackathons" },
  { v: 4, s: "", l: "Roles led" },
  { v: 10, s: "+", l: "Live launches" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yCard = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} id="about" className="relative bg-[#0e0e11] text-[#ece8de] py-16 sm:py-24 lg:py-36 overflow-hidden">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <SectionHead
          index="01"
          eyebrow="About · Who I am"
          lines={[
            <>I build the product</>,
            <>and run the <span className="font-serif-accent font-normal text-[#ff4d00]">infrastructure.</span></>,
          ]}
        />

        <div className="mt-8 sm:mt-12 grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left: story + services */}
          <div className="min-w-0">
            <Reveal>
              <p className="max-w-2xl text-[15px] sm:text-base lg:text-xl leading-relaxed text-white/60">
                I&apos;m Hormaz, a Mumbai-based <span className="font-semibold text-white">full-stack developer</span> with{" "}
                5+ years in production. I completed full-stack work at <span className="rounded-full bg-[#ece8de] px-2.5 py-0.5 text-black text-[0.9em]">AISkool</span>: auth
                with RBAC, APIs from scratch, and a zero-loss Supabase to self-hosted Postgres migration on VPS. I headed
                the IT department at Techshala and compete in hackathons across India.
              </p>
            </Reveal>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {services.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group grid grid-cols-[36px_1fr_auto] sm:grid-cols-[48px_1fr_auto] items-start sm:items-center gap-3 sm:gap-4 py-4 sm:py-5 transition hover:bg-white/[0.04] px-2 -mx-2 rounded-xl"
                  data-hover
                >
                  <span className="font-mono text-xs text-[#ff4d00] pt-1 sm:pt-0">({s.n})</span>
                  <div className="min-w-0">
                    <p className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-balance">{s.t}</p>
                    <p className="mt-0.5 text-[13px] sm:text-sm text-white/50">{s.d}</p>
                  </div>
                  <ArrowUpRight className="hidden sm:block h-5 w-5 shrink-0 opacity-0 transition group-hover:opacity-100 group-hover:rotate-45 text-[#ff4d00]" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* right: new profile card */}
          <motion.div style={{ y: yCard }} className="relative min-w-0">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#141417] text-[#ece8de] shadow-2xl lg:sticky lg:top-28">
              {/* art band */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c22] via-[#101013] to-[#2a1410] p-5 sm:p-6">
                <div className="dotgrid absolute inset-0 opacity-30" />
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ff4d00]/25 blur-[70px]" />
                <div className="relative flex items-center justify-between gap-3">
                  <Image
                    src={profile.logo}
                    alt="Hormaz Daruwala logo"
                    width={72}
                    height={72}
                    className="h-14 w-14 sm:h-[72px] sm:w-[72px] rounded-2xl"
                  />
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                    <Asterisk className="h-3.5 w-3.5" /> Open to work
                  </span>
                </div>
                <p className="font-display relative mt-5 text-2xl font-bold leading-tight text-balance sm:text-[1.7rem]">
                  Full-stack engineer for web, mobile and on-chain products.
                </p>
              </div>
              {/* facts */}
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {facts.map((f) => (
                  <div key={f.l} className="bg-[#131313] px-5 py-4">
                    <p className="font-display text-2xl font-bold tracking-tight text-[#ff4d00]">
                      <CountUp to={f.v} suffix={f.s} />
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{f.l}</p>
                  </div>
                ))}
              </div>
              {/* education */}
              <div className="space-y-3 p-5 sm:p-6">
                {education.map((e) => (
                  <div key={e.degree} className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{e.degree}</p>
                      <p className="truncate text-white/50">{e.school}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-white/35">{e.period}</span>
                  </div>
                ))}
                <a
                  href={`mailto:${profile.email}`}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-[#ece8de] px-5 py-4 text-sm font-bold text-black transition hover:bg-[#ff4d00] hover:text-white sm:text-base"
                >
                  <span className="truncate">{profile.email}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
