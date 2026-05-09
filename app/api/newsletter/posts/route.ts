import { NextResponse } from "next/server";

type BeehiivPost = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  status: string;
  publish_date: number; // unix seconds
  web_url: string;
  thumbnail_url?: string;
  preview_text?: string;
};

type CachedPosts = { posts: BeehiivPost[]; ts: number };
let cached: CachedPosts | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// GET — returns the latest 3 confirmed (published) posts.
export async function GET() {
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ posts: cached.posts });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const url = new URL(
      `https://api.beehiiv.com/v2/publications/${pubId}/posts`
    );
    url.searchParams.set("status", "confirmed");
    url.searchParams.set("limit", "3");
    url.searchParams.set("order_by", "publish_date");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("expand[]", "free_web_content");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Beehiiv posts fetch failed:", res.status);
      return NextResponse.json({ posts: [] });
    }

    const json = await res.json();
    const posts: BeehiivPost[] = (json?.data ?? []).map((p: BeehiivPost) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      slug: p.slug,
      status: p.status,
      publish_date: p.publish_date,
      web_url: p.web_url,
      thumbnail_url: p.thumbnail_url,
      preview_text: p.preview_text,
    }));

    cached = { posts, ts: Date.now() };
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Beehiiv posts error:", err);
    return NextResponse.json({ posts: [] });
  }
}
