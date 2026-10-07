export async function GET() {
  return Response.json({ events: [], hint: "POST agent lifecycle events here." });
}

export async function POST() {
  return Response.json({ ok: true, received: true });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}
