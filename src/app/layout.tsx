import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import { PreloaderGate } from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Hormaz Daruwala® - Full-Stack, Web3 and Design",
  description:
    "Hormaz Daruwala builds production EdTech platforms, on-chain agents and mobile apps. 5+ years, 15+ hackathons, Industrial 1st place + ETH Mumbai bounty. Next.js · TypeScript · Postgres · Solidity · React Native.",
  keywords: ["Hormaz Daruwala", "Full Stack Developer", "Web3 Engineer", "Next.js", "Solidity", "React Native", "UI/UX"],
  authors: [{ name: "Hormaz Daruwala" }],
  openGraph: {
    title: "Hormaz Daruwala® - Engineer and Designer",
    description: "Production platforms, on-chain systems and apps with editorial-grade design.",
    type: "website",
  },
  metadataBase: new URL("https://hormaz.vercel.app"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`:root{--font-display:"Space Grotesk",sans-serif;--font-serif2:"Instrument Serif",serif;--font-body:"Inter",sans-serif;--font-mono:"Space Mono",monospace;}`}</style>
      </head>
      <body className="grain min-h-screen overflow-x-clip bg-[#0a0a0c] text-[#ece8de] antialiased">
        <PreloaderGate>
          <SmoothScroll />
          <CustomCursor />
          <Navbar />
          <main className="min-w-0 overflow-x-clip">{children}</main>
        </PreloaderGate>
      </body>
    </html>
  );
}
