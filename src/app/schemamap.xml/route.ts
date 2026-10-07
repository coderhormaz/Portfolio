import { SITE_URL } from "@/lib/site";

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<schemamap xmlns="https://nlweb.ai/schemamap">
  <feed url="${SITE_URL}/feeds/projects.jsonl" type="Project" format="jsonl" />
  <feed url="${SITE_URL}/feeds/profile.jsonl" type="Person" format="jsonl" />
  <feed url="${SITE_URL}/feeds/pricing.jsonl" type="Offer" format="jsonl" />
</schemamap>
`;

export async function GET() {
  return new Response(XML, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
