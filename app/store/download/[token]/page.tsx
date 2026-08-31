import Nav from "../../../components/Nav";
import Link from "next/link";
import { resolveDownloadToken, isDbConfigured } from "@/lib/store/db";
import { getProduct, PACK_LABELS } from "@/lib/store/catalog";

// Always render fresh — the token's validity is time-based.
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}>
      <Nav />
      <section className="max-w-2xl mx-auto px-6 pt-32 md:pt-40 pb-24">{children}</section>
    </main>
  );
}

function Invalid({ message }: { message: string }) {
  return (
    <Shell>
      <h1 className="font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f5f5f7" }}>
        Link unavailable
      </h1>
      <p className="text-base mt-5" style={{ color: "#86868b" }}>{message}</p>
      <Link
        href="/store"
        className="inline-block mt-8 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer"
        style={{ background: "#f5f5f7", color: "#000" }}
      >
        Back to the store
      </Link>
    </Shell>
  );
}

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!isDbConfigured()) {
    return <Invalid message="Downloads are not configured in this environment." />;
  }

  const grant = await resolveDownloadToken(token);
  if (!grant) {
    return <Invalid message="This download link is invalid or has expired. If you purchased recently, reply to your confirmation email and I'll send a fresh link." />;
  }

  const expires = new Date(grant.expiresAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Shell>
      <h1 className="font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f5f5f7" }}>
        Your downloads
      </h1>
      <p className="text-base mt-4" style={{ color: "#86868b" }}>
        Link valid through {expires}. Personal use only.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {grant.items.map((item) => {
          const product = getProduct(item.product_id);
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {product && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.preview}
                  alt={item.title}
                  className="rounded-lg object-cover shrink-0"
                  style={{ width: 64, height: 64 }}
                  draggable={false}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#f5f5f7" }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#86868b" }}>{PACK_LABELS[item.pack]}</p>
              </div>
              <a
                href={`/api/download/${token}/${item.product_id}`}
                className="rounded-full px-5 py-2 text-xs font-semibold cursor-pointer shrink-0"
                style={{ background: "#f5f5f7", color: "#000" }}
              >
                Download
              </a>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
