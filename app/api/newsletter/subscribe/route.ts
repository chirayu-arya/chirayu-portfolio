import { NextRequest, NextResponse } from "next/server";

// POST { email: string }
// Adds the email to the Beehiiv publication audience.
export async function POST(req: NextRequest) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json(
      { error: "Newsletter not configured" },
      { status: 500 }
    );
  }

  let email: string | undefined;
  try {
    const body = await req.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleaned,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "chirayuarya.com",
          utm_medium: "newsletter_page",
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Beehiiv subscribe failed:", res.status, detail);
      return NextResponse.json(
        { error: "Could not subscribe. Try again in a moment." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, status: data?.data?.status ?? "active" });
  } catch (err) {
    console.error("Beehiiv subscribe error:", err);
    return NextResponse.json(
      { error: "Network error. Try again." },
      { status: 500 }
    );
  }
}
