import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/pricing",
    "/docs",
    "/developers",
    "/sandbox",
  ];
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${SITE_URL}/aiskool.png`,
        `${SITE_URL}/decentralised-ai-agent-marketplace.png`,
        `${SITE_URL}/ai-trading-agent.png`,
        `${SITE_URL}/vibe-tune-ai.jpeg`,
      ],
    },
    ...pages
      .filter((p) => p !== "")
      .map((p) => ({
        url: `${SITE_URL}${p}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
