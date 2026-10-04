"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, Children, type ReactNode, type MouseEvent } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [...EASE] }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal for big headlines (explicit inView wiring — robust under smooth scrollers) */
export function Lines({ lines, className = "", delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  /* toArray assigns stable keys, so static fragment arrays passed as
     `lines` never trip React's key warning at any call site. */
  const items = Children.toArray(lines);
  return (
    <span ref={ref} className={className}>
      {items.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: reduce ? 0 : "115%" }}
            animate={{ y: inView || reduce ? "0%" : "115%" }}
            transition={{ duration: 1.05, delay: delay + i * 0.1, ease: [...EASE] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Tag({ index, label, dark = false }: { index?: string; label: string; dark?: boolean }) {
  return (
    <Reveal>
      <div className={`flex min-w-0 items-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.35em] ${dark ? "text-[#131313]/60" : "text-[#ece8de]/50"}`}>
        {index && <span className="shrink-0 text-[#ff4d00]">({index})</span>}
        <span className="min-w-0 shrink leading-relaxed">{label}</span>
        <span className={`h-px min-w-6 flex-1 sm:min-w-8 ${dark ? "bg-[#131313]/15" : "bg-white/10"}`} />
      </div>
    </Reveal>
  );
}

/**
 * Shared section heading system: eyebrow tag, masked-line display title,
 * optional ghost numeral and description. `tone="light"` for bone sections.
 */
export function SectionHead({
  index,
  eyebrow,
  lines,
  description,
  ghost,
  tone = "dark",
  className = "",
}: {
  index?: string;
  eyebrow: string;
  lines: ReactNode[];
  description?: ReactNode;
  ghost?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={className}>
      <Tag index={index} label={eyebrow} dark={light} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 sm:mt-8">
        <h2
          className={`font-display h-display-section max-w-4xl font-bold leading-[1.0] tracking-[-0.03em] text-balance ${
            light ? "text-[#131313]" : ""
          }`}
        >
          <Lines lines={lines} />
        </h2>
        {ghost && (
          <Reveal
            aria-hidden="true"
            className={`font-display hidden select-none text-7xl font-bold leading-[0.8] tracking-tight sm:block lg:text-8xl ${
              light ? "text-ghost-dark" : "text-ghost"
            }`}
          >
            {ghost}
          </Reveal>
        )}
      </div>
      {description && (
        <Reveal delay={0.12}>
          <p
            className={`mt-5 max-w-xl leading-relaxed sm:mt-6 ${
              light ? "text-black/60" : "text-white/55"
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Magnetic({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}

export function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
