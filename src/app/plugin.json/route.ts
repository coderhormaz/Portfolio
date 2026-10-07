import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    $schema: "https://agent-plugins.org/specification/plugin.json",
    name: "hormaz-portfolio",
    version: "1.0.0",
    title: "Hormaz Daruwala Portfolio Plugin",
    description: "Query Hormaz Daruwala's profile, projects, and contact paths over MCP and REST.",
    homepage: SITE_URL,
    repository: "https://github.com/coderhormaz/Portfolio",
    skills: ["./SKILL.md"],
    mcp_servers: [`${SITE_URL}/api/mcp`],
    capabilities: ["get-profile", "search-projects", "validate-contact", "ask-portfolio"],
  });
}
