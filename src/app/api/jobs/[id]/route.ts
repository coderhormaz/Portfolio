import { getJob } from "@/app/api/contact/route";
import { jsonError } from "@/lib/agent-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) {
    return jsonError(
      "job_not_found",
      `No job found for id '${id}'.`,
      "POST /api/contact to create a job, then poll the returned poll_url.",
      404,
    );
  }
  return Response.json({ job_id: job.id, status: job.status, result: job.status === "completed" ? job.result : null, poll_url: job.poll_url });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
