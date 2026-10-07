import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    status: "ok",
    site: SITE_URL,
    time: new Date().toISOString(),
    endpoints: [
      "/api/profile",
      "/api/projects",
      "/api/experience",
      "/api/contact",
      "/api/health",
      "/api/sandbox",
    ],
    docs: `${SITE_URL}/docs`,
    openapi: `${SITE_URL}/openapi.json`,
  });
}
