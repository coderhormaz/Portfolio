import { experiences, hackathons, skillGroups, education } from "@/data/portfolio";

export async function GET() {
  return Response.json({ experiences, hackathons, skillGroups, education });
}
