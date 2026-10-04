"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowUpRight, Copy, Check, FileText, MapPin } from "lucide-react";
import { profile } from "@/data/portfolio";
import { CountUp, EASE, Magnetic } from "./ui";

function Clock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const f = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    f();
    const id = setInterval(f, 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time} IST</span>;
}

const stats = [
  { v: 5, s: "+", l: "Years shipping", short: "Years" },
  { v: 15, s: "+", l: "Hackathons", short: "Hackathons" },
  { v: 2, s: "", l: "Major wins", short: "Wins" },
  { v: 10, s: "+", l: "Live launches", short: "Launches" },
];

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // card tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  // subtle parallax on the backdrop glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const spx = useSpring(mx, { stiffness: 80, damping: 25 });
  const spy = useSpring(my, { stiffness: 80, damping: 25 });
  const glowX = useTransform(spx, (v) => `${v * 100}%`);
  const glowY = useTransform(spy, (v) => `${v * 100}%`);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(560px circle at ${x} ${y}, rgba(255,77,0,0.09), transparent 65%)`
  );

  function onSectionMouse(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function onCardMouse(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 10);
  }
  function resetCard() {
    rx.set(0);
    ry.set(0);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <section
      id="top"
      onMouseMove={onSectionMouse}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blueprint absolute inset-0 opacity-80" />
        <div className="absolute -top-32 right-[-30%] h-[380px] w-[420px] rounded-full bg-[#ff4d00]/[0.13] blur-[120px] sm:right-[-10%] sm:h-[520px] sm:w-[680px] sm:blur-[160px]" />
        <div className="absolute left-[-30%] top-[45%] h-[300px] w-[300px] rounded-full bg-[#6c5bff]/[0.12] blur-[100px] sm:left-[-12%] sm:h-[420px] sm:w-[420px] sm:blur-[140px]" />
        <motion.div className="absolute inset-0 hidden sm:block" style={{ background: glowBg }} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
      </div>

      {/* content: vertically centered so it fits one viewport on desktop */}
      <div className="relative mx-auto flex w-full max-w-[1440px] min-w-0 flex-1 flex-col justify-center px-5 pb-6 pt-[92px] sm:px-6 sm:pt-[96px] lg:px-8">
        {/* meta row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [...EASE] }}
          className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-[11px] sm:tracking-[0.22em]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for freelance
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5">
            <MapPin className="h-3 w-3 text-[#ff4d00]" /> Mumbai · <Clock />
          </span>
          <span className="ml-auto hidden text-white/35 lg:block">Folio 2026 · Full-stack × Web3 × Design</span>
        </motion.div>

        <div className="mt-5 grid min-w-0 items-center gap-8 sm:mt-6 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* LEFT */}
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [...EASE] }}
              className="font-display text-[13px] font-bold uppercase tracking-[0.22em] text-white/70"
            >
              Hormaz Daruwala<span className="text-[#ff4d00]">®</span>
              <span className="ml-3 font-mono font-normal normal-case tracking-normal text-white/35">
                · full-stack developer
              </span>
            </motion.p>

            <h1 className="font-display mt-3 font-bold leading-[1.0] tracking-[-0.03em] text-balance sm:mt-4 text-[clamp(2.2rem,6vw+0.6rem,4.3rem)] min-[1600px]:text-[5.2rem]">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [...EASE] }}
                  className="block"
                >
                  I build <span className="font-serif-accent font-normal text-[#ff4d00]">production</span> web
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.18, ease: [...EASE] }}
                  className="block text-[#ece8de]"
                >
                  & Web3 products people <span className="font-serif-accent font-normal text-[#ff4d00]">love.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [...EASE] }}
              className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/60 sm:mt-4 sm:text-[15px]"
            >
              5+ years building high-impact web apps, blockchain systems and mobile
              experiences. Zero-loss Postgres migrations, a published Play Store app,
              15+ hackathons including a first-place finish and an ETH Mumbai bounty.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36, ease: [...EASE] }}
              className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3"
            >
              <Magnetic>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#ece8de] py-1.5 pl-1.5 pr-5 text-sm font-bold text-black transition hover:bg-[#ff4d00] hover:text-white"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition group-hover:bg-white group-hover:text-black">
                    <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </span>
                  View selected work
                </a>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={copyEmail}
                  className="inline-flex min-w-0 max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 font-mono text-[12px] backdrop-blur transition hover:border-[#ff4d00]/70 hover:text-white sm:text-[13px]"
                >
                  {copied ? <Check className="h-4 w-4 shrink-0 text-emerald-400" /> : <Copy className="h-4 w-4 shrink-0 text-white/50" />}
                  <span className="hidden min-[440px]:inline truncate">{copied ? "Copied!" : profile.email}</span>
                  <span className="min-[440px]:hidden">{copied ? "Copied!" : "Copy email"}</span>
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resume}
                  download={profile.resumeLabel}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 font-mono text-[12px] backdrop-blur transition hover:border-[#ff4d00]/70 hover:text-white sm:text-[13px]"
                >
                  <FileText className="h-4 w-4 shrink-0 text-white/50 transition group-hover:text-[#ff4d00]" />
                  Résumé
                </a>
              </Magnetic>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-white/55 transition hover:text-[#ff4d00]"
              >
                GitHub <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </a>
            </motion.div>

            {/* stats: slim inline strip, part of the one-view hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.48 }}
              className="mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 sm:mt-6 sm:gap-3 sm:pt-5"
            >
              {stats.map((s) => (
                <div key={s.l} className="min-w-0">
                  <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    <CountUp to={s.v} suffix={s.s} />
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40 sm:text-[10px] sm:tracking-[0.2em]">
                    <span className="sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.l}</span>
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: compact artifact card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.22, ease: [...EASE] }}
            className="relative mx-auto hidden w-full max-w-[440px] [perspective:1400px] sm:block min-[1600px]:max-w-[520px]"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#ff4d00]/25 via-transparent to-[#6c5bff]/20 blur-2xl" />
            <motion.div
              ref={cardRef}
              onMouseMove={onCardMouse}
              onMouseLeave={resetCard}
              style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111113]/95 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-[11px] text-white/40">hormaz · live</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Deploy ok
                </span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[300px] whitespace-nowrap p-4 font-mono text-[12px] leading-[1.75] lg:p-5">
                  <p><span className="text-[#6c5bff]">const</span> <span className="text-white">hormaz</span> <span className="text-white/40">=</span> <span className="text-white/60">{"{"}</span></p>
                  <p className="pl-5"><span className="text-white/45">stack:</span> <span className="text-[#d9ff3d]">[&quot;Next.js&quot;, &quot;Postgres&quot;, &quot;Solidity&quot;]</span><span className="text-white/40">,</span></p>
                  <p className="pl-5"><span className="text-white/45">focus:</span> <span className="text-[#d9ff3d]">[&quot;Web platforms&quot;, &quot;Mobile apps&quot;, &quot;AI agents&quot;]</span><span className="text-white/40">,</span></p>
                  <p className="pl-5"><span className="text-white/45">openToWork:</span> <span className="text-emerald-300">true</span></p>
                  <p><span className="text-white/60">{"}"}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/40">
                {[
                  { v: "5+", l: "Years" },
                  { v: "10+", l: "Launches" },
                  { v: "0", l: "Data lost" },
                ].map((s) => (
                  <div key={s.l} className="px-4 py-2.5 text-center">
                    <p className="font-display text-lg font-bold">{s.v}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="group mx-auto mt-5 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition hover:text-white/70 lg:inline-flex"
          aria-label="Scroll to about"
        >
          Scroll
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition group-hover:border-[#ff4d00]">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
