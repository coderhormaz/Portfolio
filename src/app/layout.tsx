import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import { PreloaderGate } from "@/components/Preloader";
import { faqJsonLd } from "@/components/Faq";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Hormaz Daruwala — Full-Stack, Web3 & Design Engineer",
    template: "%s | Hormaz Daruwala",
  },
  description:
    "Mumbai full-stack developer building Next.js platforms, Web3 apps and mobile products. 5+ years, 15+ hackathons, open for freelance.",
  keywords: [
    "Hormaz Daruwala",
    "Full Stack Developer Mumbai",
    "Freelance Next.js Developer",
    "Web3 Engineer India",
    "Solidity Base Developer",
    "React Native Developer",
    "UI/UX Designer",
  ],
  authors: [{ name: "Hormaz Daruwala", url: SITE_URL }],
  creator: "Hormaz Daruwala",
  publisher: "Hormaz Daruwala",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Hormaz Daruwala — Engineer and Designer",
    description:
      "Production platforms, on-chain systems and apps with editorial-grade design.",
    type: "website",
    url: SITE_URL,
    siteName: "Hormaz Daruwala",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/aiskool.png`,
        width: 1200,
        height: 630,
        alt: "AISkool EdTech platform built by Hormaz Daruwala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hormaz Daruwala — Full-Stack, Web3 & Design Engineer",
    description:
      "Production platforms, on-chain systems and apps with editorial-grade design.",
    images: [`${SITE_URL}/aiskool.png`],
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hormaz Daruwala",
    url: SITE_URL,
    jobTitle: "Full-Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Solidity",
      "React Native",
      "UI/UX Design",
    ],
    sameAs: [
      "https://github.com/coderhormaz",
      "https://linkedin.com/in/hormazdaruwala",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hormaz Daruwala — Portfolio",
    url: SITE_URL,
    author: { "@type": "Person", name: "Hormaz Daruwala" },
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
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
