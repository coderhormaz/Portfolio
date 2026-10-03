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
        const next = v + Math.floor(Math.random() * 13) + 9;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(finish, 200);
          return 100;
        }
        return next;
      });
    }, 75);
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
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col justify-between overflow-hidden bg-[#0a0a0c] px-5 sm:px-8 py-5 sm:py-6"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onClick={finish}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* top row */}
      <div className="flex items-center justify-between gap-3">
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
      </div>

      {/* center */}
      <div className="flex flex-col gap-3">
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
        <p className="overflow-hidden font-display text-[clamp(1.6rem,5vw,3rem)] font-bold leading-tight tracking-tight text-[#ece8de]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Setting up the experience<span className="text-[#ff4d00]">.</span>
          </motion.span>
        </p>
      </div>

      {/* bottom: counter + bar */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
            Full-stack × Web3 × Design
          </p>
          <p className="font-display text-[clamp(3.5rem,12vw,7rem)] font-bold leading-none tracking-tight tabular-nums text-[#ece8de]">
            {n}
            <span className="align-top text-[0.35em] text-[#ff4d00]">%</span>
          </p>
        </div>
        <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#ff4d00] transition-[width] duration-100 ease-out"
            style={{ width: `${n}%` }}
          />
        </div>
      </div>
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
