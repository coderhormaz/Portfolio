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
  portfolio: "hormaz.vercel.app",
  github: "https://github.com/coderhormaz",
  linkedin: "https://linkedin.com/in/hormazdaruwala",
  availability: "Open to freelance & full-time",
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
  link?: string;
  linkLabel?: string;
  featured?: boolean;
  image?: string;
  video?: string;
  award?: "bounty" | "first" | null;
};

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
  },
  {
    title: "Tarannum Khan",
    subtitle: "Dermatology & Skincare Platform",
    description:
      "Consultation booking, skincare eCommerce (cart, orders, stock alerts), revenue analytics dashboard, admin controls and doctor profile.",
    tags: ["Next.js", "PostgreSQL", "eCommerce", "Booking"],
    link: "https://tarannumkhan.in",
    linkLabel: "tarannumkhan.in",
    featured: true,
    video: "/tarannumkhan.mp4",
  },
  {
    title: "Marudhar Metals",
    subtitle: "Corporate site + CMS admin",
    description:
      "Complete company website with fully customisable CMS-style admin panel and technical SEO optimisation.",
    tags: ["Next.js", "PostgreSQL", "Admin Panel", "SEO"],
    link: "https://marudharmetals.com",
    linkLabel: "marudharmetals.com",
  },
  {
    title: "Techshala Platform",
    subtitle: "College developer ecosystem",
    description:
      "10-module admin platform: events, users, leaderboard, freelance module, VAC learning tracks, showcase and RBAC.",
    tags: ["Next.js", "PostgreSQL", "Admin Panel", "SEO"],
    link: "https://techshala.vpt.edu.in",
    linkLabel: "techshala.vpt.edu.in",
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
  },
  {
    title: "Parsi Calendar",
    subtitle: "Published on Google Play",
    description:
      "Mobile app for the Parsi/Zoroastrian community, with Parsi + Gregorian events, reminders, monthly / weekly / agenda views.",
    tags: ["React Native", "Expo", "TypeScript", "Mobile"],
    featured: true,
  },
  {
    title: "AI DeFi Trading Assistant",
    subtitle: "Gemini-powered · Polygon",
    description:
      "Natural-language trading agent on Polygon, with Gemini command parsing, auto wallet generation, live prices and Uniswap V3 swaps via ethers.js.",
    tags: ["TypeScript", "React", "Polygon", "Gemini AI", "Uniswap V3"],
    image: "/ai-trading-agent.png",
  },
  {
    title: "VibeTune · AI Mood Music Player",
    subtitle: "Emotion-aware playback",
    description:
      "Facial emotion detection (OpenCV + FER), voice commands, Spotify 30s previews across 686 tracks, mood timeline + dynamic theming.",
    tags: ["OpenCV", "Python", "Web Speech API", "Spotify API"],
    image: "/vibe-tune-ai.jpeg",
  },
  {
    title: "opBNB AI Assistant",
    subtitle: "Ultra-low fees · 4,000+ TPS",
    description:
      "Premium AI assistant on opBNB, with secure auth, auto wallet generation and intelligent chain queries in a glassmorphic UI.",
    tags: ["TypeScript", "React", "opBNB", "ethers.js", "Zustand"],
    video: "/bnbai.mp4",
  },
  {
    title: "TokenPlusNFT Launcher",
    subtitle: "Base · ERC-20 / ERC-721",
    description:
      "Launch tokens and NFT collections on Base, with a drawing board, custom tokenomics and MetaMask integration.",
    tags: ["Solidity", "Base", "Web3.js", "MetaMask"],
    video: "/basenft.mp4",
  },
  {
    title: "Global Borderless Payments",
    subtitle: "ETHOnline 2025",
    description:
      "UPI-like global payments on PYUSD + Arbitrum for instant, low-fee cross-border transactions.",
    tags: ["TypeScript", "PYUSD", "Arbitrum", "Blockchain"],
  },
  {
    title: "AI Trading Agent",
    subtitle: "ETHGlobal New Delhi 2025",
    description:
      "AI-powered blockchain trading assistant for Ethereum, with natural-language operations, multi-chain asset management and real-time analytics.",
    tags: ["AI Agent", "Ethereum", "NLP", "TypeScript"],
  },
  {
    title: "AI Smart Contract Deployer",
    subtitle: "BNB Hackathon",
    description:
      "Deploy contracts, launch tokens and mint NFTs from a single AI command, with ultra-low fees on BNB Chain.",
    tags: ["AI Agent", "BNB Chain", "Solidity", "TypeScript"],
  },
  {
    title: "Mind · Mental Wellness Companion",
    subtitle: "AI therapist app",
    description:
      "Mood detection, voice chat, brain/focus games and guided mental-health support features.",
    tags: ["AI", "TypeScript", "Voice Chat", "React"],
  },
  {
    title: "University Management on Blockchain",
    subtitle: "UniChain Internal Hackathon",
    description:
      "Timetables, teacher assignment, results and tamper-proof on-chain degree certificates.",
    tags: ["TypeScript", "Blockchain", "Smart Contracts"],
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
