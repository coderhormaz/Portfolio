import { SITE_URL } from "@/lib/site";
import { SKILL_DOCS, SKILL_META, skillDigest } from "@/lib/skills";

export async function GET() {
  return Response.json({
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    version: "0.2.0",
    skills: Object.keys(SKILL_DOCS).map((name) => {
      const digest = skillDigest(name);
      return {
        name,
        description: SKILL_META[name].description,
        type: "skill-md",
        url: `${SITE_URL}/skills/${name}.md`,
        digest,
        sha256: digest.replace(/^sha256:/, ""),
        endpoint: SKILL_META[name].endpoint,
        openapi: `${SITE_URL}/openapi.json`,
      };
    }),
  });
}
