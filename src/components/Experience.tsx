"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { experiences } from "@/data/portfolio";
import { Reveal, SectionHead } from "./ui";

export default function Experience() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const [lit, setLit] = useState(1);

  /* Dots ignite the moment the fill tip passes them. Measured with
     getBoundingClientRect (offsetTop lies here — Reveal's motion wrapper
     hijacks offsetParent), so uneven cards stay exact on every viewport. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const list = listRef.current;
    if (!list) return;
    const listTop = list.getBoundingClientRect().top;
    const tip = v * list.offsetHeight;
    const dotCenter = (window.innerWidth >= 640 ? 38 : 34) + 6;
    let n = 1;
    for (let i = 0; i < rowRefs.current.length; i++) {
      const row = rowRefs.current[i];
      if (!row) continue;
      if (row.getBoundingClientRect().top - listTop + dotCenter <= tip + 4) n = i + 1;
      else break;
    }
    setLit((prev) => (prev === n ? prev : n));
  });

  const isLit = (i: number) => (reduce ? i === 0 : i < lit);

  return (
    <section id="experience" className="relative py-16 sm:py-24 lg:py-36 bg-[#0a0a0c] overflow-x-clip">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <SectionHead
          index="02"
          eyebrow="Experience · Where I've shipped"
          lines={[<>Proof, not <span className="font-serif-accent font-normal text-[#ff4d00]">promises.</span></>]}
        />

        <div ref={ref} className="mt-8 sm:mt-14 grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* sticky intro card */}
          <div className="relative min-w-0">
            <div className="lg:sticky lg:top-28 overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 backdrop-blur">
              <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#ff4d00]/15 blur-[80px]" />
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff4d00]">
                  The short version
                </p>
                <p className="font-display mt-3 text-xl sm:text-2xl font-bold leading-snug tracking-tight text-balance">
                  Real platforms with real users, teams that ship, infrastructure that holds.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                  I leave every codebase, team and server better than I found it.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {[
                    { v: "4", l: "Roles", hot: true },
                    { v: "10+", l: "Modules shipped", hot: false },
                    { v: "0", l: "Data lost in migration", hot: false },
                  ].map((s) => (
                    <div key={s.l} className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-3 py-4 text-center transition hover:border-[#ff4d00]/50">
                      <p className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${s.hot ? "text-[#ff4d00]" : ""}`}>{s.v}</p>
                      <p className="mt-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-white/40 leading-relaxed">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* timeline: thin rail + scroll gradient fill; dots ignite as the tip passes */}
          <div ref={listRef} className="relative min-w-0">
            {reduce ? (
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-[11.5px] top-4 w-px bg-gradient-to-b from-[#ff4d00]/70 via-[#6c5bff]/40 to-white/10 sm:left-[13.5px]"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-[11.5px] top-4 w-px bg-white/10 sm:left-[13.5px]"
              >
                <motion.div
                  style={{ scaleY }}
                  className="h-full w-full origin-top bg-gradient-to-b from-[#ff4d00] via-[#ff7a2f] to-[#6c5bff] shadow-[0_0_10px_rgba(255,77,0,0.7)]"
                />
              </div>
            )}
            <div className="space-y-4 sm:space-y-5">
              {experiences.map((exp, i) => (
                <Reveal key={exp.org + exp.role} delay={i * 0.04}>
                  <div ref={(el) => { rowRefs.current[i] = el; }} className="group grid min-w-0 grid-cols-[24px_minmax(0,1fr)] sm:grid-cols-[28px_minmax(0,1fr)] gap-2 sm:gap-3">
                    <div aria-hidden="true" className="flex justify-center pt-[34px] sm:pt-[38px]">
                      <span className={`h-3 w-3 shrink-0 rounded-full border-2 transition-all duration-300 ${isLit(i) ? "border-[#ff4d00] bg-[#ff4d00]" : "bg-[#0a0a0c] border-white/30 group-hover:border-[#ff4d00]"}${isLit(i) && !reduce ? " shadow-[0_0_12px_rgba(255,77,0,0.9)]" : ""}`} />
                    </div>
                  <article className="ringline group relative min-w-0 rounded-[1.25rem] sm:rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-7 lg:p-9 backdrop-blur transition hover:bg-white/[0.05]" data-hover>
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
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
