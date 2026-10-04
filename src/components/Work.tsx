"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { clientProjects } from "@/data/portfolio";
import { SectionHead } from "./ui";
import ProjectArt from "./ProjectArt";

export default function Work() {
  const reduce = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  const { scrollYProgress } = useScroll({ target: targetRef });
  /* On touch devices the smoothed spring feels laggy: map scroll directly.
     (useState initializer runs once, so hook order stays stable.) */
  const [coarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 40));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const x = useTransform(coarse ? scrollYProgress : smooth, [0, 1], [0, -range]);
  /* cover art drifts against the scroll for depth */
  const artX = useTransform(coarse ? scrollYProgress : smooth, [0, 1], ["2.5%", "-2.5%"]);

  const total = clientProjects.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(smooth, "change", (v) =>
    setActive(Math.min(total - 1, Math.max(0, Math.round(v * (total - 1)))))
  );

  /* Reduced motion: calm vertical list instead of the pinned track */
  if (reduce) {
    return (
      <section id="work" className="relative bg-[#0e0e12] text-[#ece8de] py-16 sm:py-24 lg:py-36 overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
          <SectionHead
            index="03"
            eyebrow="Selected work · Live in production"
            ghost="04"
            lines={[
              <>Proof of</>,
            <><span className="font-serif-accent font-normal text-[#ff4d00]">work.</span></>,
            ]}
          />
          <div className="mt-8 space-y-4">
            {clientProjects.map((p, i) => (
              <article key={p.title} className="overflow-hidden rounded-[1.5rem] bg-[#f2efe7] text-[#131313] ring-1 ring-white/10">
                <div className="relative overflow-hidden p-6">
                  <div className="absolute inset-0"><ProjectArt index={i} tall decor={false} /></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <h3 className="font-display relative text-3xl font-bold">{p.title}</h3>
                  <p className="font-serif-accent relative text-lg opacity-90">{p.subtitle}</p>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-black/60">{p.description}</p>
                  <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold">
                    Visit site <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="relative bg-[#0e0e12] text-[#ece8de] overflow-x-clip">
      {/* header in normal flow */}
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32">
        <SectionHead
          index="03"
          eyebrow="Selected work · Live in production"
          ghost="04"
          lines={[
            <>Proof of</>,
            <><span className="font-serif-accent font-normal text-[#ff4d00]">work.</span></>,
          ]}
          description="Real businesses on my builds: CMS admin panels, auth, bookings, eCommerce and SEO."
        />
        <div className="mt-6 flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/40 bg-[#ff4d00]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff8a4d] shrink-0">
            Keep scrolling <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
          </span>
          <div className="h-px flex-1 bg-white/10 overflow-hidden rounded-full">
            <motion.div style={{ scaleX: smooth }} className="h-full w-full origin-left bg-[#ff4d00]" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/45 tabular-nums shrink-0">
            {String(active + 1).padStart(2, "0")} <span className="text-white/25">/ {String(total).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      {/* pinned horizontal track: shorter pin on phones = snappier feel */}
      <div ref={targetRef} className="relative h-[220vh] sm:h-[260vh] lg:h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-stretch gap-4 sm:gap-6 px-5 sm:px-8 will-change-transform"
          >
            {clientProjects.map((p, i) => (
              <motion.article
                key={p.title}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-[64svh] sm:h-[66svh] lg:h-[70svh] w-[84vw] sm:w-[62vw] lg:w-[44vw] xl:w-[38vw] shrink-0 flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-[#f2efe7] text-[#131313] shadow-[0_16px_44px_rgba(0,0,0,0.5)] lg:shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
                data-hover
              >
                {/* cover: fixed share of the card, type sized to always fit inside */}
                <div className="relative h-[47%] min-h-0 shrink-0 overflow-hidden">
                  <motion.div style={{ x: artX }} className="absolute -inset-x-[4%] inset-y-0">
                    <ProjectArt index={i} tall decor={false} />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white bg-black/35 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 break-all">
                        {p.linkLabel}
                      </span>
                      <span className="font-display text-5xl sm:text-6xl font-bold leading-[0.85] text-white/25 shrink-0">0{i + 1}</span>
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live in production
                      </div>
                      <h3 className="font-display mt-1 text-[1.7rem] sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.02] text-balance">
                        {p.title}
                      </h3>
                      <p className="font-serif-accent mt-0.5 text-base sm:text-lg leading-snug opacity-90 truncate">{p.subtitle}</p>
                    </div>
                  </div>
                </div>
                {/* body */}
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 p-5 sm:p-6">
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm leading-relaxed text-black/60">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full bg-black/[0.05] border border-black/10 px-2.5 py-1 text-[11px] font-medium text-black/60">{t}</span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${p.title}`}
                    className="group/btn inline-flex w-fit items-center gap-2.5 rounded-full bg-[#131313] py-1.5 pl-1.5 pr-5 text-sm font-bold text-[#ece8de] transition hover:bg-[#ff4d00] hover:text-white"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ece8de] text-black transition group-hover/btn:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    Visit site
                  </a>
                </div>
              </motion.article>
            ))}

            {/* end CTA card */}
            <a
              href="#contact"
              className="group flex h-[62svh] sm:h-[64svh] lg:h-[68svh] w-[70vw] sm:w-[44vw] lg:w-[26vw] shrink-0 flex-col justify-between overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-[#ff4d00]/40 bg-gradient-to-br from-[#ff4d00] to-[#6c5bff] p-7 sm:p-8 text-white"
              data-hover
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-80">Next up</p>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                  Your project could be here.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition group-hover:gap-3">
                  Start a project <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
