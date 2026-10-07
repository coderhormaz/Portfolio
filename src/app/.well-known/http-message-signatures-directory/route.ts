// Demo Ed25519 key for Web Bot Auth (RFC 9421) verification demos.
// Not a production signing key; rotate before any enforcement use.
export async function GET() {
  const now = Math.floor(Date.now() / 1000);
  return Response.json({
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        kid: "portfolio-bot-auth-2026-01",
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
        nbf: now - 3600,
        exp: now + 31536000,
        use: "sig",
      },
    ],
  });
}
