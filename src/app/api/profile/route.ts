import { profile, stats } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    name: profile.name,
    tagline: profile.tagline,
    roles: profile.roles,
    email: profile.email,
    location: profile.location,
    availability: profile.availability,
    site: SITE_URL,
    portfolio: profile.portfolio,
    github: profile.github,
    linkedin: profile.linkedin,
    stats,
    docs: `${SITE_URL}/docs`,
    openapi: `${SITE_URL}/openapi.json`,
  });
}
