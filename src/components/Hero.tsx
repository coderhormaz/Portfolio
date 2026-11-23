"use client";

import { ArrowDown, ArrowUpRight, Check, Copy, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile, stats } from "@/data/portfolio";
import HeroVisual from "./HeroVisual";
import styles from "./Hero.module.css";

const statLabels = ["Years building", "Hackathons", "Major wins", "Live launches"];

export default function Hero() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyAttempt = useRef(0);

  useEffect(() => {
    return () => {
      copyAttempt.current += 1;
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function copyEmail() {
    const attempt = ++copyAttempt.current;
    let result: "copied" | "failed";
    try {
      await navigator.clipboard.writeText(profile.email);
      result = "copied";
    } catch {
      result = "failed";
    }

    if (attempt !== copyAttempt.current) return;
    if (copyTimer.current) clearTimeout(copyTimer.current);
    setCopyStatus(result);
    if (result === "copied") {
      copyTimer.current = setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }

  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.body}>
          <div className={styles.intro}>
            <div className={styles.identity}>
              <span>{profile.name}</span>
              <span className={styles.identityRule} aria-hidden="true" />
              <span>Full-stack engineer</span>
            </div>

            <h1 id="hero-title" className={styles.title}>
              <span>I turn ideas</span>{" "}
              <em>into software.</em>
            </h1>

            <p className={styles.description}>
              I build web, mobile, and Web3 products, from the interface to the
              infrastructure that runs them.
            </p>

            <div className={styles.actions}>
              <a href="#work" className={styles.primaryAction}>
                View selected work <ArrowDown size={17} aria-hidden="true" />
              </a>
              <button type="button" className={styles.copyAction} onClick={copyEmail} title={profile.email}>
                {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                <span>{copyStatus === "copied" ? "Copied!" : "Copy email"}</span>
              </button>
            </div>
            <span role="status" className="sr-only">
              {copyStatus === "copied" && "Email address copied."}
              {copyStatus === "failed" && "Could not copy the email address. Use the email link below."}
            </span>
            {copyStatus === "failed" && (
              <a className={styles.emailFallback} href={`mailto:${profile.email}`}>{profile.email}</a>
            )}

            <div className={styles.links}>
              <a href={profile.resume} download={profile.resumeLabel}>
                <FileText size={15} aria-hidden="true" /> Résumé
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <HeroVisual />
        </div>

        <div className={styles.footer}>
          <dl className={styles.stats}>
            {stats.map(({ value, label }, index) => (
              <div className={styles.stat} key={label}>
                <dt>{statLabels[index]}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.meta}>
            <span className={styles.availability}>Available for freelance</span>
            <span>{profile.location}</span>
          </div>
          <a href="#about" className={styles.aboutLink} aria-label="Scroll to about">
            <ArrowDown size={19} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
