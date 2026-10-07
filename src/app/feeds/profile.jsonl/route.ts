import { profile } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const line = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    jobTitle: "Full-Stack Developer",
    address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  });
  return new Response(line, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
