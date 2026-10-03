"use client";

const tones = [
  "from-[#ff4d00] via-[#ff7a2f] to-[#6c5bff]",
  "from-[#23232b] via-[#2b2b33] to-[#6c5bff]",
  "from-[#3a3a22] via-[#4a4a2a] to-[#ff4d00]",
  "from-[#6c5bff] via-[#2a2a33] to-[#ff4d00]",
];

/**
 * Default placeholder artwork for project cards.
 * Abstract gradient + grid + ghost index: intentional, no stretched screenshots.
 */
export default function ProjectArt({
  index = 0,
  label,
  tall = false,
  decor = true,
}: {
  index?: number;
  label?: string;
  tall?: boolean;
  decor?: boolean;
}) {
  const initial = (label ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${tones[index % tones.length]}`}>
      <div className="dotgrid absolute inset-0 opacity-30" />
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-[60px]" />
      <div className="absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-black/25 blur-[60px]" />
      {decor && (
        <>
          <span
            aria-hidden="true"
            className={`font-display pointer-events-none absolute -bottom-3 right-3 font-bold leading-none text-white/20 select-none ${
              tall ? "text-7xl sm:text-8xl lg:text-9xl" : "text-6xl sm:text-7xl"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden="true"
            className={`font-display absolute left-4 top-1/2 grid -translate-y-1/2 place-items-center rounded-2xl bg-black/30 font-bold text-white backdrop-blur-sm border border-white/20 select-none ${
              tall ? "h-14 w-14 text-2xl sm:h-16 sm:w-16" : "h-12 w-12 text-xl"
            }`}
          >
            {initial}
          </span>
        </>
      )}
    </div>
  );
}
