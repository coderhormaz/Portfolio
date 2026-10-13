import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import WebMCP from "@/components/WebMCP";
import { PreloaderGate } from "@/components/Preloader";
import { faqJsonLd } from "@/components/Faq";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Hormaz Daruwala — Full-Stack, Web3 & Design Engineer",
    template: "%s | Hormaz Daruwala",
  },
  description:
    "Hormaz Daruwala — Mumbai full-stack developer (Next.js, Web3, mobile). 5+ years shipping production platforms. Open for freelance.",
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
    types: {
      "text/markdown": `${SITE_URL}/index.md`,
    },
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
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Hormaz Daruwala — Full-Stack, Web3 and Design Engineer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hormaz Daruwala — Full-Stack, Web3 & Design Engineer",
    description:
      "Production platforms, on-chain systems and apps with editorial-grade design.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
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

/* Vendored in src/app/fonts: zero Google Fonts requests at build, dev,
   or runtime — crawlers and visitors never depend on the Fonts CDN. */
const grotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-400.woff2", weight: "400" },
    { path: "./fonts/space-grotesk-500.woff2", weight: "500" },
    { path: "./fonts/space-grotesk-600.woff2", weight: "600" },
    { path: "./fonts/space-grotesk-700.woff2", weight: "700" },
  ],
  variable: "--font-grotesk",
  display: "swap",
});
const instrument = localFont({
  src: [
    { path: "./fonts/instrument-serif-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});
const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400" },
    { path: "./fonts/inter-500.woff2", weight: "500" },
    { path: "./fonts/inter-600.woff2", weight: "600" },
  ],
  variable: "--font-inter",
  display: "swap",
});
const spacemono = localFont({
  src: [
    { path: "./fonts/space-mono-400.woff2", weight: "400" },
    { path: "./fonts/space-mono-700.woff2", weight: "700" },
  ],
  variable: "--font-spacemono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hormaz Daruwala",
    url: SITE_URL,
    description:
      "Mumbai full-stack developer building Next.js platforms, Web3 apps and mobile products. 5+ years in production, 15+ hackathons, open for freelance and full-time roles.",
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Freelance Full-Stack, Web3 & Mobile Engineering",
    provider: { "@type": "Person", name: "Hormaz Daruwala", url: SITE_URL },
    areaServed: "Worldwide",
    url: `${SITE_URL}/pricing`,
  };

  return (
    <html
      lang="en"
      className={`dark ${grotesk.variable} ${instrument.variable} ${inter.variable} ${spacemono.variable}`}
    >
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body id="top" className="grain min-h-screen overflow-x-clip bg-[#0a0a0c] text-[#ece8de] antialiased">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <PreloaderGate>
          <SmoothScroll />
          <CustomCursor />
          <WebMCP />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-[#ece8de] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-black"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="min-w-0 overflow-x-clip">{children}</main>
        </PreloaderGate>
      </body>
      {/* Analytics deferred to browser idle so measurement never competes
          with load, interaction, or LCP. Same ID/behavior as gtag.js. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-7L1Q3C3FYC"}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID || "G-7L1Q3C3FYC"}');`}
      </Script>
    </html>
  );
}
