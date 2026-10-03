"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { experiences } from "@/data/portfolio";
import { Lines, Reveal, Tag } from "./ui";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="experience" className="relative py-16 sm:py-24 lg:py-36 bg-[#0a0a0c] overflow-x-clip">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <Tag index="02" label="Experience · Where I've shipped" />
        <h2 className="font-display h-display-section mt-6 sm:mt-8 font-bold tracking-[-0.03em] leading-[1.0] text-balance">
          <Lines lines={[<>Proof, not promises.</>]} />
        </h2>

        <div ref={ref} className="mt-8 sm:mt-14 grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* sticky intro */}
          <div className="relative">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="max-w-md text-white/55 leading-relaxed md:text-lg">
                  Real platforms with real users, teams that ship, infrastructure that holds.
                  I leave every codebase, team and server better than I found it.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:flex sm:gap-8 font-display max-w-md">
                  <div className="min-w-0">
                    <p className="text-3xl sm:text-4xl font-bold text-[#ff4d00]">4</p>
                    <p className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/40">Roles</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-3xl sm:text-4xl font-bold">10+</p>
                    <p className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/40">Modules shipped</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-3xl sm:text-4xl font-bold">0</p>
                    <p className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/40">Data lost in migration</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* timeline */}
          <div className="relative min-w-0 pl-7 sm:pl-8 lg:pl-10">
            <div className="absolute bottom-4 left-[6px] sm:left-[7px] top-4 w-px bg-white/10">
              <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-[#ff4d00] to-[#6c5bff]" />
            </div>
            <div className="space-y-4 sm:space-y-5">
              {experiences.map((exp, i) => (
                <Reveal key={exp.org + exp.role} delay={i * 0.04}>
                  <article className="ringline group relative rounded-[1.25rem] sm:rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-7 lg:p-9 backdrop-blur transition hover:bg-white/[0.05]" data-hover>
                    <span className="absolute left-[-27px] sm:left-[-33px] lg:left-[-41px] top-8 sm:top-9 grid h-4 w-4 place-items-center">
                      <span className={`h-3 w-3 rounded-full border-2 ${i === 0 ? "bg-[#ff4d00] border-[#ff4d00]" : "bg-[#0a0a0c] border-white/30 group-hover:border-[#ff4d00]"}`} />
                    </span>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                      <span className="rounded-full bg-[#ff4d00] px-3 py-1 font-bold text-white">{exp.period}</span>
                      <span className="text-white/40">{exp.orgDetail}</span>
                    </div>
                    <h3 className="font-display mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-[1.9rem] font-bold leading-tight tracking-tight text-balance">
                      {exp.role} <span className="text-[#ff4d00]">@</span> {exp.org}
                    </h3>
                    <ul className="mt-4 sm:mt-5 space-y-2.5">
                      {exp.points.map((p) => (
                        <li key={p.slice(0, 24)} className="flex gap-3 text-[13.5px] sm:text-[14.5px] leading-relaxed text-white/60">
                          <span className="mt-2 h-1 w-3 sm:w-4 shrink-0 rounded-full bg-white/20 transition group-hover:bg-[#ff4d00]" />
                          <span className="min-w-0">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {exp.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{t}</span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
