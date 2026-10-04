"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Pause, Play, X } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { EASE } from "./ui";
import ProjectArt from "./ProjectArt";

function Media({ p, i }: { p: Project; i: number }) {
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing]);

  if (p.video) {
    return (
      <div className="relative">
        <video
          ref={ref}
          key={p.video}
          src={p.video}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${p.title} demo`}
          className="aspect-video w-full bg-[#08080b] object-contain"
        />
        <button
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause demo video" : "Play demo video"}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:border-[#ff4d00] hover:text-[#ff4d00]"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  if (p.image) {
    return (
      <Image
        src={p.image}
        alt={`${p.title} screenshot`}
        width={1600}
        height={900}
        className="aspect-video w-full bg-[#08080b] object-contain"
      />
    );
  }

  return (
    <div className="aspect-video w-full">
      <ProjectArt index={i} tall decor={false} />
    </div>
  );
}

export default function CaseStudy({
  projects,
  index,
  onClose,
  onNavigate,
}: {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const p = open ? projects[index] : null;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onNavigate((index + dir + projects.length) % projects.length);
    },
    [index, projects.length, onNavigate]
  );

  /* escape to close, arrows to move between builds */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  /* lock the page behind the overlay and move focus in/out for keyboard users */
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    window.dispatchEvent(new CustomEvent("lenis:stop"));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      clearTimeout(id);
      document.body.style.overflow = prev;
      window.dispatchEvent(new CustomEvent("lenis:start"));
      restoreRef.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && p && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[170] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#06060a]/92 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [...EASE] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f0f13] shadow-[0_40px_140px_rgba(0,0,0,0.8)] sm:rounded-[2rem]"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:border-[#ff4d00] hover:text-[#ff4d00] sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={p.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [...EASE] }}
              >
                {/* media */}
                <div className="relative border-b border-white/10 bg-[#08080b]">
                  <Media p={p} i={index} />
                  {p.award === "bounty" && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#ff4d00] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg sm:left-4 sm:top-4">
                      Bounty win
                    </span>
                  )}
                </div>

                {/* body */}
                <div className="p-5 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-[11px]">
                    <span className="rounded-full bg-[#ff4d00] px-3 py-1 font-bold text-white">
                      {p.subtitle}
                    </span>
                    {p.year && <span className="text-white/40">{p.year}</span>}
                    {p.role && <span className="text-white/40">· {p.role}</span>}
                  </div>

                  <h2
                    id="case-study-title"
                    className="font-display mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl"
                  >
                    {p.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
                    {p.description}
                  </p>

                  {p.metrics && p.metrics.length > 0 && (
                    <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10">
                      {p.metrics.map((m) => (
                        <div key={m.l} className="bg-[#0f0f13] px-3 py-4 text-center">
                          <p className="font-display truncate text-base font-bold text-[#ff4d00] sm:text-xl">
                            {m.v}
                          </p>
                          <p className="mt-1 font-mono text-[9px] uppercase leading-tight tracking-[0.15em] text-white/45 sm:text-[10px]">
                            {m.l}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {p.highlights && p.highlights.length > 0 && (
                    <div className="mt-7">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                        What I built
                      </p>
                      <ul className="mt-4 space-y-3">
                        {p.highlights.map((h) => (
                          <li key={h.slice(0, 28)} className="flex gap-3 text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
                            <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-[#ff4d00]" />
                            <span className="min-w-0">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full bg-[#ece8de] py-1.5 pl-1.5 pr-5 text-sm font-bold text-black transition hover:bg-[#ff4d00] hover:text-white"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                        {p.linkLabel ?? "Live demo"}
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-bold text-white/80 transition hover:border-[#ff4d00] hover:text-white"
                      >
                        <Code2 className="h-4 w-4" />
                        Source code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* prev / next */}
            <div className="flex items-stretch gap-px border-t border-white/10 bg-white/10">
              <button
                onClick={() => step(-1)}
                className="group flex flex-1 items-center gap-3 bg-[#0f0f13] px-4 py-4 text-left transition hover:bg-white/[0.06] sm:px-6"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-white/40 transition group-hover:-translate-x-0.5 group-hover:text-[#ff4d00]" />
                <span className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                    Previous
                  </span>
                  <span className="block truncate text-sm font-semibold">
                    {projects[(index! - 1 + projects.length) % projects.length].title}
                  </span>
                </span>
              </button>
              <button
                onClick={() => step(1)}
                className="group flex flex-1 items-center justify-end gap-3 bg-[#0f0f13] px-4 py-4 text-right transition hover:bg-white/[0.06] sm:px-6"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                    Next
                  </span>
                  <span className="block truncate text-sm font-semibold">
                    {projects[(index! + 1) % projects.length].title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-[#ff4d00]" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}