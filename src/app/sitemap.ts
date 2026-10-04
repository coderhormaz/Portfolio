import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${SITE_URL}/aiskool.png`,
        `${SITE_URL}/decentralised-ai-agent-marketplace.png`,
        `${SITE_URL}/ai-trading-agent.png`,
        `${SITE_URL}/vibe-tune-ai.jpeg`,
      ],
    },
  ];
}
