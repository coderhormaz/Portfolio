"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { profile } from "@/data/portfolio";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const doneRef = useRef(false);
  const reduce = useReducedMotion();

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (reduce) {
      finish();
      return;
    }
    const id = setInterval(() => {
      setN((v) => {
        const next = v + Math.floor(Math.random() * 9) + 7;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(finish, 250);
          return 100;
        }
        return next;
      });
    }, 65);
    const failsafe = setTimeout(finish, 2600);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearInterval(id);
      clearTimeout(failsafe);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col overflow-hidden bg-[#0a0a0c] px-5 sm:px-8 py-5 sm:py-6"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      onClick={finish}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* faint backdrop glow + grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="blueprint absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/3 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[#ff4d00]/10 blur-[130px]" />
      </div>

      {/* top row */}
      <motion.div
        className="relative flex items-center justify-between gap-3"
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
      >
        <span className="flex items-center gap-2.5">
          <Image
            src={profile.logo}
            alt="Hormaz Daruwala logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50">
            Hormaz Daruwala®
          </span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
          Tap to skip
        </span>
      </motion.div>

      {/* middle: name reveal */}
      <motion.div
        className="relative flex flex-1 flex-col justify-center"
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.35 }}
      >
        <p className="overflow-hidden font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4d00]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Folio 2026 · Mumbai
          </motion.span>
        </p>
        <h1 className="font-display mt-3 font-bold leading-[0.92] tracking-[-0.03em] text-[clamp(2.8rem,10vw,6.5rem)]">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              HORMAZ
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-serif-accent font-normal text-[#ece8de]">Daruwala</span>
              <span className="text-[#ff4d00]">.</span>
            </motion.span>
          </span>
        </h1>
      </motion.div>

      {/* bottom: label + counter + bar */}
      <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative">
        <div className="mb-3 flex items-end justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
            Loading the experience
          </p>
          <p className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight tabular-nums text-[#ece8de]">
            {n}
            <span className="align-top text-[0.4em] text-[#ff4d00]">%</span>
          </p>
        </div>
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff4d00] to-[#6c5bff] transition-[width] duration-100 ease-out"
            style={{ width: `${n}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PreloaderGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  // lock scroll while the loader is up so the hero doesn't jump
  useEffect(() => {
    if (!loading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
