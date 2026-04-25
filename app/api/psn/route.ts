import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getUserTitles,
  getUserTrophyProfileSummary,
  getUserPlayedGames,
  getPurchasedGames,
} from "psn-api";

let cached: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const npsso = process.env.PSN_NPSSO;
  if (!npsso) {
    return NextResponse.json({ error: "PSN_NPSSO not configured" }, { status: 500 });
  }

  try {
    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const auth = await exchangeAccessCodeForAuthTokens(accessCode);
    const authorization = { accessToken: auth.accessToken };

    const [titlesRes, trophySummaryRes, playedRes, purchasedRes] = await Promise.all([
      getUserTitles(authorization, "me", { limit: 200 }),
      getUserTrophyProfileSummary(authorization, "me"),
      getUserPlayedGames(authorization, "me", { limit: 200 }),
      getPurchasedGames(authorization, { size: 2000 }),
    ]);

    const trophyTitles = titlesRes.trophyTitles ?? [];
    const playedGames = playedRes.titles ?? [];
    const totalLibraryCount = purchasedRes.data?.purchasedTitlesRetrieve?.games?.length ?? playedRes.totalItemCount ?? playedGames.length;

    // Build a name-keyed map of trophy data for quick merging
    const trophyByName = new Map(trophyTitles.map((t) => [t.trophyTitleName.toLowerCase(), t]));

    // Enrich each played game with trophy data where available
    const library = playedGames.map((g) => {
      const trophy = trophyByName.get(g.name.toLowerCase());
      return {
        ...g,
        trophy: trophy ?? null,
      };
    });

    const data = {
      titles: trophyTitles,
      trophySummary: trophySummaryRes,
      recentlyPlayed: playedGames.slice(0, 10),
      library,
      totalLibraryCount,
    };

    cached = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch (err) {
    console.error("PSN API error:", err);
    return NextResponse.json({ error: "Failed to fetch PSN data" }, { status: 500 });
  }
}
