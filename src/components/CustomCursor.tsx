"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 400, damping: 35, mass: 0.7 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let armed = false;
    const move = (e: MouseEvent) => {
      if (!armed) {
        armed = true;
        document.documentElement.classList.add("cursor-none-fine");
        setEnabled(true);
      }
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-hover]"));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("cursor-none-fine");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: pressed ? 56 : hovering ? 72 : 20,
        height: pressed ? 56 : hovering ? 72 : 20,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      <span
        className={`absolute inset-0 grid place-items-center font-mono text-[9px] font-bold uppercase tracking-widest text-black transition-opacity ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {pressed ? "Hold" : "View"}
      </span>
    </motion.div>
  );
}
