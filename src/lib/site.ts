/**
 * Single source of truth for the canonical site URL.
 * Set NEXT_PUBLIC_SITE_URL when you move to a custom domain,
 * e.g. https://hormazdaruwala.com — no code changes needed.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hormaz.vercel.app";

export const SITE_NAME = "Hormaz Daruwala";
