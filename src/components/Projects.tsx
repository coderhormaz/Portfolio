"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowUpRight, Medal } from "lucide-react";
import { personalProjects, hackathons, posterFor, type Project } from "@/data/portfolio";
import { Reveal, SectionHead } from "./ui";
import ProjectArt from "./ProjectArt";
import CaseStudy from "./CaseStudy";

const filters = ["All", "Web3 / AI", "Apps", "Tools"];

const WEB3 = ["solidity", "ethereum", "eth", "arbitrum", "bnb", "opbnb", "base", "polygon", "pyusd", "oracle", "chain", "web3", "nft", "token", "agent", "pyth", "ens", "x402", "usdc", "uniswap", "gemini", "ethers", "defi", "evm", "wallet", "metamask", "avalanche", "ipfs"];

function cat(tags: string[]): string {
  const t = ` ${tags.join(" ").toLowerCase()} `;
  if (WEB3.some((k) => t.includes(k))) return "Web3 / AI";
  if (["native", "expo", "mobile", "spotify", "opencv", "voice", "wellness", "calendar", "music", "play store"].some((k) => t.includes(k))) return "Apps";
  return "Tools";
}

/**
 * Contain-fit on a dark matte so screenshots are never cropped at the sides
 * and can never overflow the card. `hovered` is driven from the card so the
 * stretched click-target never blocks the video.
 */
function Media({
  image,
  video,
  title,
  index,
  videoRef,
}: {
  image?: string;
  video?: string;
  title: string;
  index: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  if (video) {
    return (
      <video
        ref={videoRef}
        src={video}
        poster={posterFor({ video })}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${title} demo`}
        className="absolute inset-0 h-full w-full bg-[#0c0c0f] object-contain"
      />
    );
  }
  if (image) {
    return (
      <Image
        src={image}
        alt={`${title} screenshot`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="bg-[#0c0c0f] object-contain"
      />
    );
  }
  return <ProjectArt index={index} label={title} />;
}

function BuildCard({
  p,
  index,
  onOpen,
}: {
  p: Project;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !p.video) return;
    if (hovered) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered, p.video]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`ringline group relative flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05] ${p.award === "bounty" ? "border-[#ff4d00]/40" : ""}`}
      data-hover
    >
      {/* media: 21:9 matte matches screenshot ratio, contain-fit never crops */}
      <div className="relative aspect-[21/9] overflow-hidden border-b border-white/10 bg-[#0c0c0f]">
        <Media
          image={p.image}
          video={p.video}
          title={p.title}
          index={index}
          videoRef={videoRef}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {p.award === "bounty" && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#ff4d00] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
            <Medal className="h-3 w-3" /> Bounty
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`min-w-0 font-mono text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] ${
              p.award === "bounty" ? "text-[#ff8a4d]" : p.featured ? "text-[#ff4d00]" : "text-[#6c5bff]"
            }`}
          >
            {p.subtitle}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition group-hover:rotate-45 group-hover:text-[#ff4d00]" />
        </div>
        <h3 className="font-display mt-3 text-xl font-bold leading-snug tracking-tight text-balance sm:text-[1.35rem]">
          {p.title}
        </h3>
        <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-white/55 sm:text-sm">
          {p.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-5">
          {p.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/60">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* stretched trigger: the whole card opens the case study */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open case study: ${p.title}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
      />
    </motion.article>
  );
}

export default function Projects() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered =
    active === "All" ? personalProjects : personalProjects.filter((p) => cat(p.tags) === active);

  return (
    <section id="builds" className="relative bg-[#0d0d10] py-16 sm:py-24 lg:py-36 border-y border-white/10 overflow-x-clip">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8">
        <SectionHead
          index="04"
          eyebrow="Playground · Hackathons and side builds"
          lines={[
            <>Built fast,</>,
            <>
              <span className="font-serif-accent font-normal text-[#ff4d00]">finished</span> faster.
            </>,
          ]}
        />

        <Reveal>
          <div className="mask-fade-x mt-8 overflow-hidden pb-2 sm:mt-10" aria-label="Hackathon record, auto-scrolling">
            <div className="flex w-max animate-marquee gap-2 pr-2 motion-reduce:animate-none hover:[animation-play-state:paused]">
              {[...hackathons, ...hackathons].map((h, i) => {
                const styles =
                  h.kind === "first"
                    ? "border-[#d9ff3d]/50 bg-[#d9ff3d]/10 text-[#d9ff3d] font-bold"
                    : h.kind === "bounty"
                      ? "border-[#ff4d00]/50 bg-[#ff4d00]/10 text-[#ff8a4d] font-bold"
                      : h.kind === "selected"
                        ? "border-[#6c5bff]/50 bg-[#6c5bff]/10 text-[#b3a8ff] font-semibold"
                        : "border-white/10 text-white/55";
                return (
                  <span
                    key={`${h.name}-${i}`}
                    aria-hidden={i >= hackathons.length}
                    className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs sm:text-sm ${styles}`}
                  >
                    {h.kind !== "participant" && <Trophy className="h-3.5 w-3.5 shrink-0" />}
                    {h.name} · {h.result}
                  </span>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-col min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center min-[560px]:justify-between gap-3 sm:mt-8 sm:gap-4">
          <div className="scroll-row flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1.5 sm:gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 sm:px-5 sm:text-sm ${
                  active === f ? "bg-[#ece8de] text-black" : "text-white/55 hover:text-white"
                }`}
              >
                <span className="whitespace-nowrap">{f}</span>
              </button>
            ))}
          </div>
          <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-white/35">
            {filtered.length} builds · click to open
          </span>
        </div>

        <motion.div
          layout
          className="mt-6 grid min-w-0 gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <BuildCard
                key={p.title}
                p={p}
                index={personalProjects.indexOf(p)}
                onOpen={() => setSelected(personalProjects.indexOf(p))}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <CaseStudy
        projects={personalProjects}
        index={selected}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </section>
  );
}