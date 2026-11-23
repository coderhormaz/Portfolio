"use client";

import { Box, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./Hero.module.css";

type HeroScene = ReturnType<typeof import("./hero-scene").createHeroScene>;
type ModelView = "still" | "loading" | "ready" | "unavailable";

const rotationKeys: Partial<Record<string, [number, number]>> = {
  ArrowLeft: [-14, 0],
  ArrowRight: [14, 0],
  ArrowUp: [0, 14],
  ArrowDown: [0, -14],
};

export default function HeroVisual() {
  const [view, setView] = useState<ModelView>("still");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const inspecting = view === "loading" || view === "ready";

  useEffect(() => {
    if (!inspecting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let stopped = false;

    function unavailable() {
      if (document.activeElement === canvas) buttonRef.current?.focus();
      setView("unavailable");
    }

    async function openModel(target: HTMLCanvasElement) {
      try {
        const { createHeroScene } = await import("./hero-scene");
        if (stopped) return;
        const context = target.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        if (!context) {
          unavailable();
          return;
        }
        sceneRef.current = createHeroScene(target, context);
        setView("ready");
      } catch {
        if (!stopped) unavailable();
      }
    }

    canvas.addEventListener("webglcontextlost", unavailable);
    void openModel(canvas);

    return () => {
      stopped = true;
      drag.current = null;
      canvas.removeEventListener("webglcontextlost", unavailable);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [inspecting]);

  useEffect(() => {
    if (view === "ready" && document.activeElement === buttonRef.current) {
      canvasRef.current?.focus({ preventScroll: true });
    }
  }, [view]);

  function startDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (view !== "ready" || drag.current || event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragModel(event: PointerEvent<HTMLCanvasElement>) {
    const start = drag.current;
    if (!start || event.pointerId !== start.id) return;
    sceneRef.current?.rotate(event.clientX - start.x, event.clientY - start.y);
    drag.current = { id: start.id, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (event.pointerId === drag.current?.id) drag.current = null;
  }

  function useKeyboard(event: KeyboardEvent<HTMLCanvasElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      buttonRef.current?.focus();
      setView("still");
      return;
    }
    const amount = rotationKeys[event.key];
    if (!amount) return;
    event.preventDefault();
    sceneRef.current?.rotate(...amount);
  }

  const controlLabel = {
    still: "Rotate model",
    loading: "Cancel loading",
    ready: "Close 3D view",
    unavailable: "3D unavailable",
  }[view];

  return (
    <figure className={styles.stage} data-model-view={view}>
      <div className={styles.artwork}>
        <picture>
          <source media="(max-width: 29rem)" srcSet="/hero-enter-480.webp" />
          <Image
            src="/hero-enter.webp"
            alt="A copper Enter key on a machined base with a circuit board and exposed fasteners"
            width={880}
            height={880}
            unoptimized
            fetchPriority="high"
            loading="eager"
            className={styles.poster}
          />
        </picture>
        {inspecting && (
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            tabIndex={view === "ready" ? 0 : -1}
            aria-label="3D model of the Enter key"
            aria-describedby="hero-model-help"
            onPointerDown={startDrag}
            onPointerMove={dragModel}
            onLostPointerCapture={endDrag}
            onKeyDown={useKeyboard}
          />
        )}
      </div>
      <div className={styles.artControls}>
        {view === "ready" && <span id="hero-model-help">Drag or use arrow keys</span>}
        {view === "loading" && <span role="status">Loading model</span>}
        {view === "unavailable" && <span role="status" className="sr-only">Showing the still image.</span>}
        <button
          ref={buttonRef}
          className={styles.modelButton}
          type="button"
          onClick={view === "unavailable" ? undefined : () => setView(inspecting ? "still" : "loading")}
          aria-disabled={view === "unavailable" || undefined}
        >
          {inspecting ? <X size={15} aria-hidden="true" /> : <Box size={15} aria-hidden="true" />}
          {controlLabel}
        </button>
      </div>
    </figure>
  );
}
