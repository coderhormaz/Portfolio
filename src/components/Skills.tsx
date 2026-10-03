"use client";

import { motion } from "framer-motion";
import { skillGroups, marqueeItems } from "@/data/portfolio";
import { Lines, Reveal, Tag } from "./ui";

export default function Skills() {
  return (
    <section id="stack" className="relative bg-[#0a0a0c] text-[#ece8de] py-16 sm:py-24 lg:py-36 overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <Tag index="05" label="Arsenal · Tools I reach for" />
        <h2 className="font-display h-display-section mt-6 sm:mt-8 font-bold tracking-[-0.03em] leading-[1.0] text-balance">
          <Lines lines={[<>Fluent in <span className="font-serif-accent font-normal">shipping.</span></>]} />
        </h2>

        <div className="mt-8 sm:mt-12 grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.07} className={gi === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
              <div className="h-full rounded-[1.25rem] sm:rounded-[1.75rem] border border-white/10 bg-[#141417] text-[#ece8de] p-5 sm:p-8 transition hover:-translate-y-1.5 duration-500 shadow-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#ff4d00]">0{gi + 1} · {g.title}</p>
                <div className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                  {g.skills.map((s, si) => (
                    <div key={s.name} className="min-w-0">
                      <div className="mb-2 flex items-baseline justify-between gap-3">
                        <span className="font-display min-w-0 truncate text-base sm:text-lg font-bold tracking-tight">{s.name}</span>
                        <span className="font-mono text-xs text-white/40 shrink-0">{s.level}%</span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${si % 2 ? "bg-[#6c5bff]" : "bg-[#ff4d00]"}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 sm:mt-6 overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border border-white/10 bg-white/[0.04]">
            <div className="flex w-max animate-marquee gap-8 sm:gap-10 py-4 sm:py-5 pr-8 sm:pr-10">
              {[...marqueeItems, ...marqueeItems].map((m, i) => (
                <span key={i} className="flex items-center gap-8 sm:gap-10 whitespace-nowrap font-display text-base sm:text-lg font-bold uppercase tracking-wide">
                  {m} <span className="text-[#ff4d00]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
