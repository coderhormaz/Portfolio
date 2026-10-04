"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

export default function Marquee({ items, dark = false, fast = false }: { items: string[]; dark?: boolean; fast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 30 });
  const skew = useTransform(smooth, [-2500, 2500], [-8, 8]);

  /* Exactly two copies: the keyframe translates -50%, which equals one full
     set, so the loop restarts on an identical frame with no visible jump. */
  const row = [...items, ...items];

  return (
    <div ref={ref} className={`relative overflow-hidden border-y py-3.5 sm:py-4 lg:py-5 ${dark ? "border-white/10 bg-[#0d0d10] text-[#ece8de]" : "border-[#131313]/10 bg-[#ff4d00] text-white"}`}>
      <motion.div style={{ skewX: skew }} className={`flex w-max items-center gap-6 sm:gap-10 pr-6 sm:pr-10 ${fast ? "animate-marquee-fast" : "animate-marquee"}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-10 whitespace-nowrap">
            <span className="font-display text-[13px] sm:text-sm lg:text-lg font-bold uppercase tracking-[0.15em]">{item}</span>
            <span className={`font-serif-accent text-lg sm:text-xl lg:text-2xl ${dark ? "text-[#ff4d00]" : "text-white/70"}`}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
