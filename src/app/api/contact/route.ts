import { profile } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import { jsonError } from "@/lib/agent-auth";

export async function GET() {
  return Response.json({
    email: profile.email,
    location: profile.location,
    availability: profile.availability,
    github: profile.github,
    linkedin: profile.linkedin,
    form: `${SITE_URL}/#contact`,
    api: `${SITE_URL}/api/contact`,
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(
      "invalid_json",
      "Request body must be valid JSON.",
      "Send {name, email, message} as JSON with Content-Type: application/json.",
      400,
    );
  }
  const { name, email, message } = (body || {}) as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2) {
    return jsonError(
      "invalid_name",
      "Field 'name' must be a string of at least 2 characters.",
      "Send {name, email, message} to this endpoint.",
      422,
    );
  }
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return jsonError(
      "invalid_email",
      "Field 'email' must be a valid email address.",
      "Check the email format and retry.",
      422,
    );
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return jsonError(
      "invalid_message",
      "Field 'message' must be at least 10 characters.",
      "Include scope, budget, or timeline so the inquiry can be answered.",
      422,
    );
  }
  // Sandbox / demo mode: no email is sent from the API. The website form
  // posts to Web3Forms client-side; this endpoint validates + queues.
  return Response.json(
    {
      ok: true,
      queued: true,
      message: "Inquiry validated. Use the website contact form or email directly to send.",
      contact: { email: profile.email, location: profile.location },
    },
    { status: 202 },
  );
}
