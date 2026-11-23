"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Medal, Pause, Play, X } from "lucide-react";
import { posterFor, type Project } from "@/data/portfolio";
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
          poster={posterFor(p)}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${p.title} demo`}
          className="block aspect-video w-full object-contain"
        />
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause demo video" : "Play demo video"}
          className="absolute bottom-2 right-2 grid size-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur transition-colors hover:border-accent hover:text-accent"
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
        sizes="(min-width: 1024px) 30rem, 100vw"
        className="block aspect-video w-full object-contain"
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
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const p = projects[index];
  const previousIndex = (index - 1 + projects.length) % projects.length;
  const nextIndex = (index + 1) % projects.length;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    window.dispatchEvent(new Event("lenis:stop"));
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      window.dispatchEvent(new Event("lenis:start"));
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [index]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="case-study-title"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          contentRef.current?.focus({ preventScroll: true });
          onNavigate(event.key === "ArrowLeft" ? previousIndex : nextIndex);
        }
      }}
      className="fixed inset-0 m-auto h-dvh max-h-dvh w-full max-w-none grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[#111116] p-0 text-bone open:grid backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-5xl sm:rounded-2xl sm:border sm:border-white/15"
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#15151b] px-4 pt-[max(0.375rem,env(safe-area-inset-top))] pb-1.5 sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase leading-snug tracking-wider text-accent-soft sm:text-xs">
          {p.award === "bounty" && <Medal aria-hidden="true" className="size-4 shrink-0" />}
          {p.subtitle}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-bone transition-colors hover:border-accent hover:text-accent-soft focus-visible:outline-offset-0"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div
        ref={contentRef}
        role="region"
        aria-label="Project details"
        tabIndex={0}
        className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]"
      >
        <div className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
            <div>
              <h2 id="case-study-title" aria-live="polite" className="font-display text-3xl font-bold leading-[1.05] tracking-tight [overflow-wrap:anywhere] sm:text-[clamp(2rem,4vw,3rem)]">
                {p.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-bone/65">
                {p.year && <span>{p.year}</span>}
                {p.role && <span>{p.role}</span>}
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/75 sm:text-base">
                {p.description}
              </p>
              {(p.link || p.repo) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bone px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-accent-soft">
                      {p.linkLabel ?? "Live demo"}
                      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-bone transition-colors hover:border-accent hover:text-accent-soft">
                      <Code2 aria-hidden="true" className="size-4 shrink-0" />
                      Source code
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#08080b]">
              <Media key={p.title} p={p} i={index} />
            </div>
          </div>

          {!!p.metrics?.length && (
            <dl className="mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.03] sm:mt-7">
              {p.metrics.map((m) => (
                <div key={m.l} className="flex flex-col px-2.5 py-3 sm:px-4">
                  <dt className="font-mono text-[10px] leading-snug text-bone/65 sm:text-xs">{m.l}</dt>
                  <dd className="-order-1 mb-1 font-display text-lg font-bold leading-tight text-accent-soft [overflow-wrap:anywhere] sm:text-xl">{m.v}</dd>
                </div>
              ))}
            </dl>
          )}

          {!!p.highlights?.length && (
            <section className="mt-6 sm:mt-8">
              <h3 className="font-display text-lg font-bold">What I built</h3>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-bone/75 marker:text-accent sm:text-[15px]">
                {p.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </section>
          )}

          <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
            {p.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-white/[0.07] px-2.5 py-1 text-xs text-bone/75">{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <nav aria-label="Browse case studies" className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-[#15151b] pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={() => onNavigate(previousIndex)}
          className="flex min-h-13 items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.05] focus-visible:outline-offset-[-3px] sm:gap-3 sm:px-6"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0 text-accent-soft" />
          <span className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-bone/65">Previous</span>
            <span className="block truncate text-xs font-semibold sm:text-sm">{projects[previousIndex].title}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate(nextIndex)}
          className="flex min-h-13 items-center justify-end gap-2 px-4 py-2 text-right transition-colors hover:bg-white/[0.05] focus-visible:outline-offset-[-3px] sm:gap-3 sm:px-6"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-bone/65">Next</span>
            <span className="block truncate text-xs font-semibold sm:text-sm">{projects[nextIndex].title}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-accent-soft" />
        </button>
      </nav>
    </dialog>
  );
}
