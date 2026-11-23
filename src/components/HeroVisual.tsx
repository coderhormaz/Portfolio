"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./Hero.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function prefersReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

type HeroScene = ReturnType<typeof import("./hero-scene").createHeroScene>;

export default function HeroVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const syncPlayback = useRef<((playing: boolean) => void) | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => true);
  const [playingOverride, setPlayingOverride] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"poster" | "ready" | "unavailable">("poster");
  const playing = playingOverride ?? !reduced;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let scene: HeroScene | undefined;
    let inView = false;
    let wantsMotion = false;
    let stopped = false;
    let loading = false;
    let unavailable = false;

    function fallBack() {
      unavailable = true;
      scene?.dispose();
      scene = undefined;
      setStatus("unavailable");
    }

    function canAnimate() {
      return wantsMotion && inView && !document.hidden;
    }

    const updateScene = async () => {
      if (stopped || unavailable) return;

      if (scene) {
        scene.setPlaying(canAnimate());
        return;
      }

      if (!canAnimate() || loading) return;
      loading = true;

      try {
        const { createHeroScene } = await import("./hero-scene");
        if (stopped || unavailable || !canAnimate()) return;

        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        if (!context) {
          fallBack();
          return;
        }

        scene = createHeroScene(stage, canvas, context);
        scene.setPlaying(true);
        setStatus("ready");
      } catch {
        if (!stopped) fallBack();
      } finally {
        loading = false;
      }
    };

    syncPlayback.current = (next) => {
      wantsMotion = next;
      void updateScene();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      void updateScene();
    });
    intersection.observe(stage);
    document.addEventListener("visibilitychange", updateScene);
    canvas.addEventListener("webglcontextlost", fallBack);

    return () => {
      stopped = true;
      syncPlayback.current = null;
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateScene);
      canvas.removeEventListener("webglcontextlost", fallBack);
      scene?.dispose();
    };
  }, []);

  useEffect(() => {
    syncPlayback.current?.(playing);
  }, [playing]);

  const unavailable = status === "unavailable";

  return (
    <div ref={stageRef} className={styles.stage} data-scene={status}>
      <div className={styles.instrument} aria-hidden="true" />
      <div className={styles.artwork} aria-hidden="true">
        <Image
          src="/hero-knot.webp"
          alt=""
          width={720}
          height={720}
          unoptimized
          loading="eager"
          className={styles.poster}
        />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <button
        type="button"
        className={styles.playback}
        onClick={unavailable ? undefined : () => setPlayingOverride(!playing)}
        aria-label={unavailable ? "Still view, 3D animation unavailable" : playing ? "Pause 3D animation" : "Play 3D animation"}
        aria-disabled={unavailable || undefined}
        tabIndex={unavailable ? -1 : undefined}
      >
        {!unavailable && (playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />)}
        {unavailable ? "Still view" : playing ? "Pause" : "Play"}
      </button>
      <span role="status" className="sr-only">
        {unavailable && "The 3D artwork is shown as a still image."}
      </span>
    </div>
  );
}
