"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUp, ArrowUpRight, Copy, Check, Send, RotateCcw, Clock, Briefcase, MapPin, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Magnetic, Reveal } from "./ui";

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[15px] text-white placeholder:text-white/30 outline-none backdrop-blur transition focus:border-[#ff4d00]/70 focus:bg-white/[0.06]";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please tell me your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Give me a little more detail (10+ characters).");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "5b753ca7-d1f3-4e40-947f-455243a55493",
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          subject: `Portfolio inquiry from ${name.trim()}`,
          from_name: "Hormaz Portfolio",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Send failed");
      setSent(true);
    } catch {
      setError("Couldn't send just now. Please try again or email me directly.");
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setError("");
    setSent(false);
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center sm:p-10">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-400/15">
          <Check className="h-6 w-6 text-emerald-300" />
        </span>
        <p className="font-display mt-4 text-2xl font-bold">Message sent</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
          Thanks for reaching out. I read everything myself and reply within 24 hours.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-[#ff4d00] hover:text-[#ff4d00]"
        >
          <RotateCcw className="h-4 w-4" /> Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="p-5 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="cf-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Name *
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="cf-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Email *
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="cf-msg" className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Project details *
          </label>
          <span className="font-mono text-[10px] text-white/30 tabular-nums">{message.length}/1000</span>
        </div>
        <textarea
          id="cf-msg"
          rows={5}
          maxLength={1000}
          placeholder="What are we building? Budget and timeline help."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} min-h-[140px] resize-y`}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-[#ff4d00]/40 bg-[#ff4d00]/10 px-4 py-3 text-sm text-[#ff8a4d]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff4d00] px-8 py-4 font-bold text-white transition hover:bg-[#ece8de] hover:text-black disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {sending ? (
          <>
            Sending
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <>
      <section ref={ref} id="contact" className="relative overflow-hidden bg-[#0a0a0c] pt-16 sm:pt-24 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 h-[320px] w-[620px] sm:h-[500px] sm:w-[900px] -translate-x-1/2 rounded-full bg-[#ff4d00]/12 blur-[110px] sm:blur-[150px]" />
          <div className="blueprint absolute inset-0 opacity-70" />
        </div>

        <motion.div style={{ scale }} className="relative mx-auto w-full max-w-[1440px] min-w-0 px-5 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#ff4d00]">(06) · Got a project in mind?</p>
          </Reveal>
          <a href={`mailto:${profile.email}`} data-hover className="group mt-6 block min-w-0">
            <span className="font-display h-display-talk block font-bold leading-[0.9] tracking-[-0.04em] transition-colors duration-500 group-hover:text-[#ff4d00]">
              LET&apos;S TALK
            </span>
            <span className="font-serif-accent mt-2 block text-[clamp(1.4rem,6vw,3rem)] text-white/60 transition group-hover:text-white">
              and make it unforgettable
            </span>
          </a>

          <Reveal delay={0.15}>
            <div className="mt-8 sm:mt-10 flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center justify-center gap-2.5 sm:gap-3">
              <Magnetic strength={0.3}>
                <a href={`mailto:${profile.email}`} className="inline-flex min-w-0 w-full min-[420px]:w-auto items-center justify-center gap-2 rounded-full bg-[#ff4d00] px-6 sm:px-8 py-4 text-sm sm:text-base font-bold text-white transition hover:bg-[#ece8de] hover:text-black">
                  <span className="truncate">Email me</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
              </Magnetic>
              <button onClick={copy} className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-white/15 px-6 sm:px-7 py-4 text-sm sm:text-base font-semibold text-white/80 backdrop-blur transition hover:border-[#ff4d00] hover:text-white">
                {copied ? <Check className="h-4 w-4 shrink-0 text-emerald-400" /> : <Copy className="h-4 w-4 shrink-0" />}
                <span className="truncate">{copied ? "Copied" : "Copy email"}</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 sm:mt-14 w-full max-w-5xl">
            <div className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] text-left backdrop-blur lg:grid-cols-[0.85fr_1.15fr]">
              {/* info panel */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#ff4d00] via-[#c73e00] to-[#431505] p-7 text-white sm:p-9">
                <div className="dotgrid absolute inset-0 opacity-25" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-[80px]" />
                <div className="relative flex h-full flex-col">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
                    Prefer talking?
                  </p>
                  <p className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    Tell me about your project.
                  </p>
                  <ul className="mt-6 space-y-4 text-[15px]">
                    <li className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/25">
                        <Clock className="h-4 w-4" />
                      </span>
                      Replies within 24 hours
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/25">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      Freelance and full-time roles
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/25">
                        <MapPin className="h-4 w-4" />
                      </span>
                      Mumbai, working worldwide
                    </li>
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </a>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-black"
                    >
                      GitHub <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-black"
                    >
                      LinkedIn <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              {/* form side */}
              <div className="min-w-0">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </motion.div>

        <footer className="relative mt-14 sm:mt-20 border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1440px] min-w-0 flex-col gap-4 sm:gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={profile.logo}
                alt="Hormaz Daruwala logo"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-lg"
              />
              <p className="min-w-0 text-sm text-white/60">© 2026 Hormaz Daruwala · Mumbai · <span className="font-mono text-xs">{profile.portfolio}</span></p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">Designed & engineered with obsession</p>
            <a href="#top" className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm transition hover:border-[#ff4d00] hover:text-[#ff4d00]">
              Back to top <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="overflow-hidden px-2" aria-hidden="true">
            <p className="font-display whitespace-nowrap text-center font-bold leading-[0.85] tracking-tight text-white/[0.045] text-[clamp(4rem,13.5vw,12rem)]">HORMAZ®</p>
          </div>
        </footer>
      </section>
    </>
  );
}
