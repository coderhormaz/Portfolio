export async function GET() {
  return Response.json({
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        kid: "portfolio-bot-auth-2026-01",
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
        use: "sig",
      },
    ],
  });
}
