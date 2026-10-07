import { SITE_URL } from "@/lib/site";
import { jsonError } from "@/lib/agent-auth";

function notFound(): Response {
  return jsonError(
    "not_found",
    "Unknown API path. See /openapi.json for the full surface.",
    `Try GET ${SITE_URL}/api/profile, ${SITE_URL}/api/projects, ${SITE_URL}/api/health, or ${SITE_URL}/api/sandbox. Versioned alias: ${SITE_URL}/api/v1/{profile,projects,experience,contact,health,sandbox}.`,
    404,
  );
}

export async function GET() {
  return notFound();
}
export async function POST() {
  return notFound();
}
export async function PUT() {
  return notFound();
}
export async function PATCH() {
  return notFound();
}
export async function DELETE() {
  return notFound();
}
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
  });
}
