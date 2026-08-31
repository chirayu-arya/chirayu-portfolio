import { NextRequest, NextResponse } from "next/server";
import { resolveDownloadToken, isDbConfigured } from "@/lib/store/db";
import { getProduct } from "@/lib/store/catalog";
import { fetchOriginal } from "@/lib/store/images";

// Allow headroom to fetch large original masters before streaming them back.
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; productId: string }> }
) {
  const { token, productId } = await params;

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Downloads are not configured." }, { status: 503 });
  }

  const grant = await resolveDownloadToken(token);
  if (!grant) {
    return NextResponse.json({ error: "This download link is invalid or has expired." }, { status: 410 });
  }

  const item = grant.items.find((i) => i.product_id === productId);
  if (!item) {
    return NextResponse.json({ error: "This item is not part of your order." }, { status: 403 });
  }

  const product = getProduct(productId);
  if (!product || product.kind !== "wallpaper") {
    return NextResponse.json({ error: "This item is not downloadable yet." }, { status: 404 });
  }

  try {
    const file = await fetchOriginal(product, req.nextUrl.origin);
    return new NextResponse(new Uint8Array(file.buffer), {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error(`[download] ${productId} failed:`, err);
    return NextResponse.json({ error: "Could not prepare your file. Please try again." }, { status: 500 });
  }
}
