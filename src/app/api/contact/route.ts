import { createHash, randomBytes } from "node:crypto";
import { profile } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import {
  getIdempotentResult,
  idempotencyKeyFrom,
  jsonError,
  storeIdempotentResult,
} from "@/lib/agent-auth";

type Job = { id: string; status: "processing" | "completed"; createdAt: number; result: unknown };
const jobs = new Map<string, Job>();
const COMPLETE_AFTER_MS = 2000;

function fingerprint(input: { name: string; email: string; message: string }): string {
  return createHash("sha256").update(JSON.stringify(input), "utf8").digest("hex").slice(0, 12);
}

export function createContactJob(input: { name: string; email: string; message: string }) {
  const id = `job_${fingerprint(input)}${randomBytes(3).toString("hex")}`;
  const job: Job = {
    id,
    status: "processing",
    createdAt: Date.now(),
    result: {
      queued: true,
      message: "Inquiry validated. Use the website contact form or email directly to send.",
      contact: { email: profile.email, location: profile.location },
    },
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): (Job & { poll_url: string }) | null {
  const job = jobs.get(id);
  if (!job) return null;
  if (Date.now() - job.createdAt >= COMPLETE_AFTER_MS) job.status = "completed";
  return { ...job, poll_url: `${SITE_URL}/api/jobs/${job.id}` };
}

export async function GET() {
  return Response.json({
    email: profile.email,
    location: profile.location,
    availability: profile.availability,
    form: `${SITE_URL}/#contact`,
    api: `${SITE_URL}/api/contact`,
    jobs: "POST here returns 202 + job_id; poll GET /api/jobs/{id}.",
  });
}

export async function POST(req: Request) {
  const idemKey = idempotencyKeyFrom(req);
  const replay = getIdempotentResult(idemKey);
  if (replay) return replay;

  const { name, email, message } = (await req.json().catch(() => null)) as Record<string, unknown> | null ?? {};
  if (typeof name !== "string" || name.trim().length < 2) {
    return jsonError("invalid_name", "Field 'name' must be a string of at least 2 characters.", "Send {name, email, message} to this endpoint.", 422);
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return jsonError("invalid_email", "Field 'email' must be a valid email address.", "Check the email format and retry.", 422);
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return jsonError("invalid_message", "Field 'message' must be at least 10 characters.", "Include scope, budget, or timeline so the inquiry can be answered.", 422);
  }
  const job = createContactJob({ name: name.trim(), email: email.trim(), message: message.trim() });
  const resBody = {
    ok: true,
    queued: true,
    job_id: job.id,
    status: job.status,
    poll_url: `${SITE_URL}/api/jobs/${job.id}`,
    message: "Inquiry accepted for validation. Poll poll_url until status is completed.",
  };
  storeIdempotentResult(idemKey, 202, resBody);
  return Response.json(resBody, {
    status: 202,
    headers: { Location: `${SITE_URL}/api/jobs/${job.id}` },
  });
}
