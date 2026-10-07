import { SITE_URL } from "@/lib/site";

export async function GET() {
  const lines = [
    { name: "Landing page", price: "from $800" },
    { name: "Full-stack platform", price: "from $3,500" },
    { name: "Web3 build", price: "from $4,500" },
    { name: "Mobile app", price: "from $3,000" },
    { name: "Monthly retainer", price: "$1,500/mo" },
  ].map((t) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Offer",
      name: t.name,
      priceSpecification: { "@type": "PriceSpecification", price: t.price, priceCurrency: "USD" },
      url: `${SITE_URL}/pricing`,
    }),
  );
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
