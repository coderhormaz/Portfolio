"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/portfolio";

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
        <div className="mx-auto flex w-full max-w-[1440px] min-w-0 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
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
              className="h-7 w-7 shrink-0 rounded-lg"
            />
            <span className="truncate font-display text-sm font-bold tracking-tight">HORMAZ®</span>
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">©2026</span>
          </a>

          <nav
            className={`hidden lg:flex items-center gap-7 rounded-full px-7 py-3.5 text-[13px] font-medium backdrop-blur-xl transition-all duration-500 ${
              scrolled ? "bg-[#131313]/85 text-white/70 border border-white/10" : "bg-white/[0.04] border border-white/10 text-white/70"
            }`}
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="roll py-1">
                <span>{l.label}</span>
                <span aria-hidden="true" className="text-[#ff4d00]">{l.label}</span>
              </a>
            ))}
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
              className="group hidden min-[400px]:inline-flex items-center gap-1.5 rounded-full bg-[#ff4d00] px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] font-bold text-white transition hover:bg-[#ece8de] hover:text-black"
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
            className="fixed inset-0 z-[110] flex flex-col justify-end bg-[#0a0a0c]/95 backdrop-blur-2xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            <nav className="max-h-[70dvh] overflow-y-auto px-5 sm:px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-2" onClick={(e) => e.stopPropagation()}>
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between gap-3 border-b border-white/10 py-3.5 sm:py-4 font-display text-[clamp(1.75rem,8vw,2.5rem)] font-bold tracking-tight"
                >
                  <span className="flex min-w-0 items-baseline gap-3"><span className="font-mono text-xs text-[#ff4d00]">0{i + 1}</span> <span className="truncate">{l.label}</span></span>
                  <ArrowUpRight className="h-6 w-6 shrink-0 text-[#ff4d00]" />
                </motion.a>
              ))}
              <a href={`mailto:${profile.email}`} className="mt-6 block break-all rounded-2xl bg-[#ff4d00] p-5 text-center text-sm sm:text-base font-bold text-white">
                {profile.email}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
