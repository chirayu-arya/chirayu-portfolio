import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Subscriber count, cached in Next.js Data Cache and shared across all
// function instances on Vercel. Revalidates every 5 minutes — and a cron
// (vercel.json) hits this route every 5 minutes to keep it warm even when
// no real visitors are around.
const REVALIDATE_SECONDS = 300;

const fetchActiveSubscribers = unstable_cache(
  async (): Promise<number> => {
    const apiKey = process.env.BEEHIIV_API_KEY;
    const pubId = process.env.BEEHIIV_PUBLICATION_ID;
    if (!apiKey || !pubId) return 0;

    const url = new URL(`https://api.beehiiv.com/v2/publications/${pubId}`);
    url.searchParams.append("expand[]", "stats");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Beehiiv responded ${res.status}`);
    }

    const json = await res.json();
    return Number(json?.data?.stats?.active_subscriptions ?? 0);
  },
  ["beehiiv-active-subscribers"],
  { revalidate: REVALIDATE_SECONDS, tags: ["beehiiv-stats"] }
);

export async function GET() {
  try {
    const count = await fetchActiveSubscribers();
    return jsonNoStore({ count });
  } catch (err) {
    console.error("Beehiiv stats error:", err);
    return jsonNoStore({ count: 0, error: "upstream_error" });
  }
}

function jsonNoStore(body: Record<string, unknown>) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
