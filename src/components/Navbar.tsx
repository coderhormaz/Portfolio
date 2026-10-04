"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/portfolio";

/** Last section whose top has passed the header line = the one you're reading. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const line = 160;
      let current = "";
      for (const l of navLinks) {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top <= line) current = l.href;
      }
      // near the very bottom the last section may never cross the line
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = navLinks[navLinks.length - 1].href;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}

function useMumbaiTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const f = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const time = useMumbaiTime();
  const activeSection = useActiveSection();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock background scroll while the mobile menu is open */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(open ? "lenis:stop" : "lenis:start"));
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    const lock = open ? "hidden" : prevBody;
    document.body.style.overflow = lock;
    document.documentElement.style.overflow = open ? "hidden" : prevHtml;
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.dispatchEvent(new CustomEvent("lenis:start"));
    };
  }, [open ]);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[120]"
      >
        {/* reading progress */}
        <motion.div
          style={{ scaleX: progress }}
          aria-hidden="true"
          className="h-[2px] w-full origin-left bg-gradient-to-r from-[#ff4d00] via-[#ff8a4d] to-[#6c5bff]"
        />
        <div className="mx-auto flex w-full max-w-[1440px] min-w-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
          <a
            href="#top"
            aria-label="Back to top"
            className={`flex min-w-0 items-center gap-2 rounded-full py-2 pl-2.5 pr-4 sm:py-2.5 sm:pl-4 sm:pr-5 transition-all duration-500 ${
              scrolled ? "bg-[#ece8de] text-[#131313] shadow-xl" : "bg-white/[0.04] text-[#ece8de] backdrop-blur-xl border border-white/10"
            }`}
          >
            <Image
              src={profile.logo}
              alt="Hormaz Daruwala logo"
              width={28}
              height={28}
              priority
              className="h-7 w-7 shrink-0 rounded-lg"
            />
            <span className="truncate font-display text-sm font-bold tracking-tight">HORMAZ®</span>
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">©2026</span>
          </a>

          <nav
            aria-label="Primary"
            className={`hidden lg:flex items-center gap-1 rounded-full px-2 backdrop-blur-xl transition-all duration-500 ${
              scrolled
                ? "border border-white/10 bg-[#131313]/85 py-1.5 text-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
                : "border border-white/10 bg-white/[0.04] py-2 text-white/70"
            }`}
          >
            {navLinks.map((l, ni) => {
              const on = activeSection === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={on ? "true" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    on ? "text-white" : "hover:text-white"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-inset ring-white/15"
                    />
                  )}
                  <span className="relative font-mono text-[10px] text-[#ff4d00]">
                    0{ni + 1}
                  </span>
                  <span className="roll relative">
                    <span>{l.label}</span>
                    <span aria-hidden="true" className="text-[#ff4d00]">
                      {l.label}
                    </span>
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span
              className={`hidden xl:flex items-center gap-2 rounded-full px-4 py-3 font-mono text-[11px] tracking-widest backdrop-blur-xl border transition-all ${
                scrolled ? "bg-[#131313]/85 border-white/10 text-white/60" : "bg-white/[0.04] border-white/10 text-white/60"
              }`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              BOM {time}
            </span>
            <a
              href="#contact"
              tabIndex={open ? -1 : undefined}
              aria-hidden={open}
              className={`group hidden min-[400px]:inline-flex items-center gap-1.5 rounded-full bg-[#ff4d00] px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] font-bold text-white transition-all duration-300 hover:bg-[#ece8de] hover:text-black ${
                open ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100"
              }`}
            >
              Let&apos;s talk
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ece8de] text-black lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] flex h-[100dvh] flex-col bg-[#0a0a0c]/95 backdrop-blur-2xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            {/* spacer for the fixed header */}
            <div className="h-[92px] shrink-0 sm:h-[96px]" />
            <nav
              className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 sm:px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-center justify-between gap-3 border-b border-white/10 py-2.5 sm:py-3 font-display text-[1.65rem] sm:text-3xl font-bold tracking-tight ${
                    activeSection === l.href ? "text-[#ff4d00]" : ""
                  }`}
                >
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span className="font-mono text-xs text-[#ff4d00]">0{i + 1}</span>{" "}
                    <span className="truncate">{l.label}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[#ff4d00]" />
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 block break-all rounded-2xl bg-[#ff4d00] p-4 text-center text-sm font-bold text-white"
              >
                {profile.email}
              </motion.a>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 grid grid-cols-3 gap-2"
              >
                {[
                  { label: "GitHub", href: profile.github },
                  { label: "LinkedIn", href: profile.linkedin },
                  { label: "Résumé", href: profile.resume, download: profile.resumeLabel },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(s.download
                      ? { download: s.download }
                      : { target: "_blank", rel: "noreferrer" })}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3.5 text-[13px] font-semibold text-white/75 transition hover:border-[#ff4d00]/60 hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition group-hover:rotate-45 group-hover:text-[#ff4d00]" />
                  </a>
                ))}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
