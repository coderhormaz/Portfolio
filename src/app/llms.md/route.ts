import { HOME_MARKDOWN, LLMS_TXT, fm } from "@/lib/markdown";

export async function GET() {
  const head = fm(
    "Hormaz Daruwala — Agent manual (llms.md)",
    "Combined homepage summary and agent navigation index.",
    "https://hormazdaruwala.vercel.app/llms.md",
  );
  return new Response(`${head}${HOME_MARKDOWN.replace(/^---\n[\s\S]*?---\n/, "")}\n---\n${LLMS_TXT}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
