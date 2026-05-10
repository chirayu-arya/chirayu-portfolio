import { NextResponse } from "next/server";

// Always run as a dynamic function. Without this, Next.js / Vercel's CDN can
// statically cache the response and never call the route again.
export const dynamic = "force-dynamic";
export const revalidate = 0;

let cached: { count: number; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// GET — returns the active subscriber count from Beehiiv.
// Pulls `data.stats.active_subscriptions` from the publication endpoint.
// (The /subscriptions endpoint uses cursor pagination and has no total field.)
export async function GET() {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return jsonNoStore({ count: cached.count, fromCache: true });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return jsonNoStore({ count: 0, error: "not_configured" });
  }

  try {
    const url = new URL(`https://api.beehiiv.com/v2/publications/${pubId}`);
    url.searchParams.append("expand[]", "stats");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Beehiiv publication fetch failed:", res.status);
      return jsonNoStore({ count: cached?.count ?? 0, error: "upstream_error" });
    }

    const json = await res.json();
    const count = Number(json?.data?.stats?.active_subscriptions ?? 0);

    cached = { count, ts: Date.now() };
    return jsonNoStore({ count });
  } catch (err) {
    console.error("Beehiiv stats error:", err);
    return jsonNoStore({ count: cached?.count ?? 0, error: "network_error" });
  }
}

function jsonNoStore(body: Record<string, unknown>) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
