export const profile = {
  name: "Hormaz Daruwala",
  initials: "HD",
  logo: "/logo.svg",
  roles: [
    "Full Stack Developer",
    "UI/UX Designer",
    "Web3 & Blockchain Engineer",
    "Mobile App Developer",
  ],
  tagline:
    "5+ years building high-impact web apps, blockchain systems and mobile experiences. 15+ hackathons, 1 first-place win, an ETH Mumbai bounty, and an app published on Google Play.",
  email: "hormazdaruwala86@gmail.com",
  phone: "+91 9082920942",
  location: "Mumbai, India",
  portfolio: "hormazdaruwala.vercel.app",
  github: "https://github.com/coderhormaz",
  linkedin: "https://linkedin.com/in/hormazdaruwala",
  availability: "Open to freelance & full-time",
  resume: "/Hormaz_Resume.pdf",
  resumeLabel: "Hormaz_Daruwala_Resume.pdf",
};

export const stats = [
  { value: "5+", label: "Years shipping production code" },
  { value: "15+", label: "Hackathons competed" },
  { value: "2", label: "Major wins · 1st + ETH bounty" },
  { value: "10+", label: "Live client & Web3 launches" },
];

export const marqueeItems = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Python",
  "React Native",
  "Three.js",
  "GSAP",
  "Solidity",
  "Web3",
  "VPS / DevOps",
  "Generative AI",
  "Figma",
  "Tailwind",
];

export type Experience = {
  role: string;
  org: string;
  orgDetail: string;
  period: string;
  points: string[];
  tags: string[];
};

export const experiences: Experience[] = [
  {
    role: "Full Stack Developer",
    org: "AISkool.com",
    orgDetail: "AI & Robotics EdTech Platform",
    period: "Apr 2026 – Jul 2026",
    points: [
      "Redesigned and enhanced the admin panel, improving usability for course, event and student management.",
      "Architected complete auth system: registration, login, sessions and role-based access control.",
      "Built backend APIs from scratch, replacing Supabase managed layer with optimised custom server logic.",
      "Led zero-data-loss migration from Supabase to self-hosted PostgreSQL on a dedicated VPS.",
      "Managed full VPS lifecycle: Nginx, SSL, deployment pipelines and security hardening.",
    ],
    tags: ["Next.js", "PostgreSQL", "VPS", "Auth", "Nginx"],
  },
  {
    role: "IT Department Head",
    org: "Techshala",
    orgDetail: "Vidyalankar Polytechnic",
    period: "Jul 2025 – Apr 2026",
    points: [
      "Led the college student IT body, overseeing technical projects, workshops and developer mentorship.",
      "Architected techshala.vpt.edu.in with a 10-module admin panel: events, users, leaderboard, freelance, VAC tracks, team + RBAC.",
    ],
    tags: ["Leadership", "Next.js", "PostgreSQL", "Admin Panel"],
  },
  {
    role: "Ethical Hacking Intern",
    org: "Secure Cyber Future",
    orgDetail: "Offensive Security",
    period: "Jun 2025 – Aug 2025",
    points: [
      "Trained in SQLi, XSS, Google Dorking, brute-force and vulnerability assessment.",
      "Ran structured pentest exercises with remediation-focused documentation.",
    ],
    tags: ["Cybersecurity", "Pentesting", "Networking"],
  },
  {
    role: "Team Leader · Code Snipers",
    org: "Smart India Hackathon",
    orgDetail: "National Main Event · 2× Shortlisted",
    period: "2023 · 2024",
    points: [
      "Led teams shortlisted for the SIH main hackathon at the all-India level twice, beyond the internal college round.",
      "Drove technical direction, task splits and judging-criteria strategy across the builds.",
    ],
    tags: ["Leadership", "Strategy", "Full Stack"],
  },
];

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** live deployment */
  link?: string;
  /** source repository */
  repo?: string;
  linkLabel?: string;
  featured?: boolean;
  image?: string;
  video?: string;
  /** Explicit poster override. Otherwise derived: /x.mp4 -> /posters/x.jpg */
  poster?: string;
  award?: "bounty" | "first" | null;
  /** year shipped */
  year?: string;
  /** what I owned on the build */
  role?: string;
  /** case-study detail lines, shown in the overlay */
  highlights?: string[];
  metrics?: { v: string; l: string }[];
};

/**
 * Poster shown before a demo video loads any bytes.
 * Convention: /x.mp4 -> /posters/x.jpg (explicit `poster` wins).
 * Cards use preload="none" + poster so crawlers and visitors never
 * download video until they choose to play it.
 */
export function posterFor(p: { video?: string; poster?: string }): string | undefined {
  if (p.poster) return p.poster;
  if (!p.video) return undefined;
  return p.video.replace(/\.mp4$/i, ".jpg").replace(/^\//, "/posters/");
}

export const clientProjects: Project[] = [
  {
    title: "AISkool.com",
    subtitle: "AI & Robotics EdTech Platform",
    description:
      "Admin panel redesign, full auth system with RBAC, Supabase → self-hosted PostgreSQL VPS migration, Nginx/SSL management, hardening and UI overhaul.",
    tags: ["Next.js", "PostgreSQL", "VPS", "Auth", "Nginx"],
    link: "https://aiskool.com",
    linkLabel: "aiskool.com",
    featured: true,
    image: "/aiskool.png",
    year: "2026",
    role: "Full-stack · infrastructure",
    highlights: [
      "Designed and shipped registration, login, sessions and role-based access control end to end.",
      "Replaced the managed Supabase layer with custom server logic and optimised queries.",
      "Led a zero-data-loss migration from Supabase to self-hosted PostgreSQL on a dedicated VPS.",
      "Owned Nginx, SSL, deployment pipelines and security hardening for the whole stack.",
    ],
    metrics: [
      { v: "0", l: "records lost in migration" },
      { v: "RBAC", l: "role-based access" },
      { v: "VPS", l: "self-hosted" },
    ],
  },
  {
    title: "Aurenext",
    subtitle: "Dermatology & Skincare Platform",
    description:
      "Consultation booking, skincare eCommerce (cart, orders, stock alerts), revenue analytics dashboard, admin controls and doctor profile.",
    tags: ["Next.js", "PostgreSQL", "eCommerce", "Booking"],
    link: "https://tarannumkhan.in",
    linkLabel: "tarannumkhan.in",
    featured: true,
    video: "/tarannumkhan.mp4",
    year: "2026",
    role: "Full-stack · design",
    highlights: [
      "Booking flow tied to real doctor availability, with confirmation and reminders.",
      "eCommerce with cart, orders and low-stock alerts wired to live inventory.",
      "Revenue analytics dashboard so the business can act on its own numbers.",
      "Admin controls and a doctor profile page to round out the platform.",
    ],
    metrics: [
      { v: "Booking", l: "consultation flow" },
      { v: "Cart", l: "eCommerce + stock" },
      { v: "Analytics", l: "revenue dashboard" },
    ],
  },
  {
    title: "Marudhar Metals",
    subtitle: "Corporate site + CMS admin",
    description:
      "Complete company website with fully customisable CMS-style admin panel and technical SEO optimisation.",
    tags: ["Next.js", "PostgreSQL", "Admin Panel", "SEO"],
    link: "https://marudharmetals.com",
    linkLabel: "marudharmetals.com",
    year: "2025",
    role: "Full-stack · SEO",
    highlights: [
      "CMS-style admin so the client updates content without developer involvement.",
      "Technical SEO pass covering metadata, structure and crawl behaviour.",
      "Delivered as a complete company website, not a template reskin.",
    ],
    metrics: [
      { v: "CMS", l: "client editable" },
      { v: "SEO", l: "technical pass" },
      { v: "Next.js", l: "stack" },
    ],
  },
  {
    title: "Techshala Platform",
    subtitle: "College developer ecosystem",
    description:
      "10-module admin platform: events, users, leaderboard, freelance module, VAC learning tracks, showcase and RBAC.",
    tags: ["Next.js", "PostgreSQL", "Admin Panel", "SEO"],
    link: "https://techshala.vpt.edu.in",
    linkLabel: "techshala.vpt.edu.in",
    year: "2025",
    role: "IT Department Head · architect",
    highlights: [
      "Architected a 10-module admin platform covering the full college developer lifecycle.",
      "Modules: events, users, leaderboard, freelance, VAC tracks, showcase and team management.",
      "Shipped role-based access control so each cohort only sees what it should.",
    ],
    metrics: [
      { v: "10", l: "admin modules" },
      { v: "RBAC", l: "role-based access" },
      { v: "Live", l: "college ecosystem" },
    ],
  },
];

export const personalProjects: Project[] = [
  {
    title: "Decentralised AI Agent Marketplace",
    subtitle: "ETH Mumbai · Bounty Win",
    description:
      "Pay-per-query micropayments in USDC on Base via x402, with ENS-powered agent discovery, no KYC and no subscriptions.",
    tags: ["Base", "USDC", "x402", "ENS", "TypeScript", "Next.js"],
    image: "/decentralised-ai-agent-marketplace.png",
    award: "bounty",
    featured: true,
    year: "2026",
    role: "Full-stack · smart contracts · payments",
    link: "https://decentralised-ai-agent-marketplace.vercel.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/Decentralised-AI-Agent-Marketplace",
    highlights: [
      "Implemented the x402 pay-per-query flow so agents charge per request in USDC instead of forcing subscriptions.",
      "ENS names resolve to agent endpoints, so discovery needs no central directory or KYC.",
      "Deployed on Base for sub-cent fees, which keeps micropayments economically viable.",
    ],
    metrics: [
      { v: "USDC", l: "per-query settlement" },
      { v: "Base", l: "settlement chain" },
      { v: "Bounty", l: "ETH Mumbai" },
    ],
  },
  {
    title: "Avalanche AI Blockchain Assistant",
    subtitle: "Natural language on AVAX",
    description:
      "Chat with AI to send AVAX, create tokens and mint NFTs using natural language, with IPFS-backed metadata and gas-aware execution.",
    tags: ["TypeScript", "React", "Avalanche", "AI", "IPFS", "Web3"],
    video: "/avaxai.mp4",
    year: "2025",
    role: "Full-stack · AI orchestration",
    link: "https://avax-ai.vercel.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/AVAX_Team1_hackathon",
    highlights: [
      "Turned plain-English intent into audited contract calls through an AI planning layer.",
      "Token metadata pinned to IPFS so minted assets survive any single host going down.",
      "Every write path pre-checks balance and gas before broadcasting to fail fast and cheaply.",
    ],
    metrics: [
      { v: "AVAX", l: "native chain" },
      { v: "IPFS", l: "metadata storage" },
      { v: "NL", l: "command interface" },
    ],
  },
  {
    title: "Parsi Calendar",
    subtitle: "Published on Google Play",
    description:
      "Mobile app for the Parsi/Zoroastrian community, with Parsi + Gregorian events, reminders, monthly / weekly / agenda views.",
    tags: ["React Native", "Expo", "TypeScript", "Mobile"],
    year: "2026",
    role: "Sole developer · design · release",
    highlights: [
      "Built the Parsi and Gregorian event model so both calendars stay in sync from one dataset.",
      "Shipped reminder scheduling that survives device reboot and time-zone changes.",
      "Took it through the full Play Store review and published it for real users.",
    ],
    metrics: [
      { v: "1", l: "app on Play Store" },
      { v: "3", l: "calendar views" },
      { v: "RN", l: "React Native + Expo" },
    ],
  },
  {
    title: "AI DeFi Trading Assistant",
    subtitle: "Gemini-powered · Polygon",
    description:
      "Natural-language trading agent on Polygon, with Gemini command parsing, auto wallet generation, live prices and Uniswap V3 swaps via ethers.js.",
    tags: ["TypeScript", "React", "Polygon", "Gemini AI", "Uniswap V3"],
    image: "/ai-trading-agent.png",
    year: "2025",
    role: "Full-stack · AI parsing · swaps",
    highlights: [
      "Gemini parses free-text intent into validated swap parameters before anything touches a wallet.",
      "Gasless onboarding: a wallet is provisioned automatically so users never touch a seed phrase.",
      "Quotes and slippage are shown before signing, with live prices streamed into the UI.",
    ],
    metrics: [
      { v: "Polygon", l: "settlement chain" },
      { v: "Uniswap V3", l: "AMM routing" },
      { v: "Gemini", l: "intent parser" },
    ],
  },
  {
    title: "VibeTune · AI Mood Music Player",
    subtitle: "Emotion-aware playback",
    description:
      "Facial emotion detection (OpenCV + FER), voice commands, Spotify 30s previews across 686 tracks, mood timeline + dynamic theming.",
    tags: ["OpenCV", "Python", "Web Speech API", "Spotify API"],
    image: "/vibe-tune-ai.jpeg",
    link: "https://vibe-tune-ai.vercel.app",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/vibe-tune-ai",
    year: "2025",
    role: "Full-stack · ML integration",
    highlights: [
      "Facial emotion detection runs client-side through OpenCV FER, so mood data never leaves the device.",
      "Voice commands drive search and playback through the Web Speech API.",
      "Theme and queue react live to the detected mood across a 686-track Spotify catalogue.",
    ],
    metrics: [
      { v: "686", l: "tracks previewed" },
      { v: "OpenCV", l: "emotion model" },
      { v: "On-device", l: "mood inference" },
    ],
  },
  {
    title: "opBNB AI Assistant",
    subtitle: "Ultra-low fees · 4,000+ TPS",
    description:
      "Premium AI assistant on opBNB, with secure auth, auto wallet generation and intelligent chain queries in a glassmorphic UI.",
    tags: ["TypeScript", "React", "opBNB", "ethers.js", "Zustand"],
    video: "/bnbai.mp4",
    year: "2025",
    role: "Full-stack · design",
    link: "https://bnb-hackathon-bombay.vercel.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/BNB_Hackathon",
    highlights: [
      "Query opBNB chain state through natural language instead of raw JSON-RPC calls.",
      "Secure auth with automatic wallet provisioning keeps the first-run flow to one tap.",
      "Glassmorphic interface tuned for read-heavy chain dashboards.",
    ],
    metrics: [
      { v: "4,000+", l: "chain TPS" },
      { v: "opBNB", l: "chain" },
      { v: "<$0.001", l: "typical tx cost" },
    ],
  },
  {
    title: "TokenPlusNFT Launcher",
    subtitle: "Base · ERC-20 / ERC-721",
    description:
      "Launch tokens and NFT collections on Base, with a drawing board, custom tokenomics and MetaMask integration.",
    tags: ["Solidity", "Base", "Web3.js", "MetaMask"],
    video: "/basenft.mp4",
    year: "2025",
    role: "Smart contracts · frontend",
    link: "https://kingsdontquit.netlify.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/TokenPlusNFTlauncher",
    highlights: [
      "One deploy flow covers both ERC-20 tokens and ERC-721 collections with editable tokenomics.",
      "Drawing board generates collection art in-browser before minting.",
      "MetaMask integration handles connect, network switching and deployment confirmation.",
    ],
    metrics: [
      { v: "ERC-20", l: "fungible tokens" },
      { v: "ERC-721", l: "NFT collections" },
      { v: "Base", l: "deployment chain" },
    ],
  },
  {
    title: "Lightship Clone",
    subtitle: "GSAP · ScrollTrigger · parallax",
    description:
      "Pixel-perfect clone of the Niantic Lightship site, rebuilt with GSAP ScrollTrigger, layered parallax and vanilla JS interactions.",
    tags: ["JavaScript", "GSAP", "ScrollTrigger", "Canvas"],
    video: "/Lightship.mp4",
    year: "2025",
    role: "Animation engineering",
    link: "https://hormaz-lightship.netlify.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/lightship-clone",
    highlights: [
      "Recreated the layered parallax scroll choreography with GSAP ScrollTrigger timelines.",
      "Rebuilt the interactive WebGL-style hero in vanilla JS with no framework overhead.",
      "Held frame budget smooth on mid-range mobile hardware via transform-only animation.",
    ],
    metrics: [
      { v: "GSAP", l: "ScrollTrigger" },
      { v: "Vanilla JS", l: "no framework" },
      { v: "60fps", l: "target on mobile" },
    ],
  },
  {
    title: "Global Borderless Payments",
    subtitle: "ETHOnline 2025",
    description:
      "UPI-like global payments on PYUSD + Arbitrum for instant, low-fee cross-border transactions.",
    tags: ["TypeScript", "PYUSD", "Arbitrum", "Blockchain"],
    year: "2025",
    role: "Full-stack · payments",
    highlights: [
      "Modelled a UPI-familiar send flow on PYUSD so cross-border transfers feel domestic.",
      "Arbitrum keeps settlement cheap enough for remittance-sized transfers.",
      "Stablecoin rails remove the FX spread that normally eats remittance margins.",
    ],
    metrics: [
      { v: "PYUSD", l: "settlement asset" },
      { v: "Arbitrum", l: "rollup" },
      { v: "Global", l: "reach" },
    ],
  },
  {
    title: "AI Trading Agent",
    subtitle: "ETHGlobal New Delhi 2025",
    description:
      "AI-powered blockchain trading assistant for Ethereum, with natural-language operations, multi-chain asset management and real-time analytics.",
    tags: ["AI Agent", "Ethereum", "NLP", "TypeScript"],
    year: "2025",
    role: "Full-stack · AI agent",
    highlights: [
      "Natural-language operations mapped to concrete, validated on-chain actions.",
      "Multi-chain asset view so positions are readable in one place.",
      "Real-time analytics surfaced inline with each suggested trade.",
    ],
    metrics: [
      { v: "Ethereum", l: "chain" },
      { v: "NLP", l: "command layer" },
      { v: "Real-time", l: "analytics" },
    ],
  },
  {
    title: "AI Smart Contract Deployer",
    subtitle: "BNB Hackathon",
    description:
      "Deploy contracts, launch tokens and mint NFTs from a single AI command, with ultra-low fees on BNB Chain.",
    tags: ["AI Agent", "BNB Chain", "Solidity", "TypeScript"],
    year: "2025",
    role: "Full-stack · Solidity",
    highlights: [
      "A single natural-language command deploys, launches a token or mints a collection.",
      "BNB Chain fees kept deployment cheap enough to be practical for experimentation.",
      "Generated contracts are compiled and verified before any deployment is broadcast.",
    ],
    metrics: [
      { v: "BNB Chain", l: "chain" },
      { v: "Solidity", l: "contract language" },
      { v: "1 cmd", l: "to deploy" },
    ],
  },
  {
    title: "Selemen Clone",
    subtitle: "Animation · responsive rebuild",
    description:
      "Meticulously rebuilt clone of the Selemen marketing site with smooth scroll animations, modern layout and a fully responsive design.",
    tags: ["CSS3", "JavaScript", "Animation", "Responsive"],
    video: "/selemen.mp4",
    year: "2025",
    role: "Frontend · animation",
    link: "https://hormaz-selemen.netlify.app/",
    linkLabel: "Live demo",
    repo: "https://github.com/coderhormaz/selemen-clone",
    highlights: [
      "Reproduced the site's transition language with hand-tuned easing rather than defaults.",
      "Layout holds from 320px through ultrawide with no breakpoints breaking intent.",
      "Animation degrades cleanly where the browser reports reduced motion.",
    ],
    metrics: [
      { v: "320px+", l: "responsive floor" },
      { v: "Easing", l: "hand-tuned" },
      { v: "A11y", l: "reduced-motion safe" },
    ],
  },
  {
    title: "Mind · Mental Wellness Companion",
    subtitle: "AI therapist app",
    description:
      "Mood detection, voice chat, brain/focus games and guided mental-health support features.",
    tags: ["AI", "TypeScript", "Voice Chat", "React"],
    year: "2025",
    role: "Full-stack · product design",
    highlights: [
      "Mood check-ins feed a lightweight prompt that adapts the session to the user.",
      "Voice chat keeps the interface usable when typing is the wrong mode.",
      "Focus and brain games give the app something to do between conversations.",
    ],
    metrics: [
      { v: "Voice", l: "chat interface" },
      { v: "Mood", l: "detection" },
      { v: "React", l: "frontend" },
    ],
  },
  {
    title: "University Management on Blockchain",
    subtitle: "UniChain Internal Hackathon",
    description:
      "Timetables, teacher assignment, results and tamper-proof on-chain degree certificates.",
    tags: ["TypeScript", "Blockchain", "Smart Contracts"],
    year: "2025",
    role: "Full-stack · smart contracts",
    highlights: [
      "Degree certificates issued on-chain so a credential cannot be quietly altered.",
      "Timetables and teacher assignment share one consistent academic record.",
      "Results published to chain with verifiable provenance for each entry.",
    ],
    metrics: [
      { v: "On-chain", l: "certificates" },
      { v: "Tamper-proof", l: "records" },
      { v: "UniChain", l: "hackathon" },
    ],
  },
];

export type Hackathon = {
  name: string;
  result: string;
  kind: "first" | "bounty" | "selected" | "participant";
};

export const hackathons: Hackathon[] = [
  { name: "ETH Mumbai 2026", result: "Bounty Win", kind: "bounty" },
  { name: "Industrial Hackathon 2026", result: "1st Place", kind: "first" },
  { name: "Smart India Hackathon", result: "Main Event Shortlist · 2×", kind: "selected" },
  { name: "ETHGlobal New Delhi 2025", result: "Participant", kind: "participant" },
  { name: "ETHOnline 2025", result: "Participant", kind: "participant" },
  { name: "BNB Hackathon", result: "Participant", kind: "participant" },
  { name: "UniChain Internal", result: "Participant", kind: "participant" },
];

export const skillGroups = [
  {
    title: "Core Engineering",
    skills: [
      { name: "Next.js / React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "PostgreSQL", level: 88 },
      { name: "Python", level: 86 },
    ],
  },
  {
    title: "Immersive & Web3",
    skills: [
      { name: "React Native / Expo", level: 88 },
      { name: "Three.js / GSAP", level: 82 },
      { name: "Web3 / Solidity", level: 85 },
      { name: "Generative AI", level: 90 },
    ],
  },
  {
    title: "Design & Ops",
    skills: [
      { name: "Figma / Framer", level: 92 },
      { name: "Tailwind / Bootstrap", level: 94 },
      { name: "VPS / DevOps", level: 84 },
      { name: "Adobe XD / PS", level: 78 },
    ],
  },
];

export const education = [
  {
    degree: "B.Tech – Information Technology",
    school: "Shah & Anchor Kutchhi Engineering College",
    period: "2026 – Present",
  },
  {
    degree: "Diploma – Information Technology",
    school: "Vidyalankar Polytechnic",
    period: "2023 – 2026",
  },
  {
    degree: "HSC",
    school: "Sharda Mandir High School",
    period: "2016 – 2023",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Builds", href: "#builds" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];
