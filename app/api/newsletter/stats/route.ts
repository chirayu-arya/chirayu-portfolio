import { NextResponse } from "next/server";

let cached: { count: number; ts: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// GET — returns the active subscriber count from Beehiiv.
export async function GET() {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ count: cached.count });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const url = new URL(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`
    );
    url.searchParams.set("limit", "1");
    url.searchParams.set("status", "active");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Beehiiv stats fetch failed:", res.status);
      return NextResponse.json({ count: 0 });
    }

    const json = await res.json();
    const count =
      typeof json?.total_results === "number"
        ? json.total_results
        : Array.isArray(json?.data)
          ? json.data.length
          : 0;

    cached = { count, ts: Date.now() };
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Beehiiv stats error:", err);
    return NextResponse.json({ count: 0 });
  }
}
