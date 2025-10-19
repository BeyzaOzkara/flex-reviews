import type { NormalizedReview } from "@/lib/types";

type PageParams = Record<string, unknown>;

export const dynamic = "force-dynamic"; // optional: avoids caching during dev

export default async function PropertyPage({
  // Next’s generated PageProps currently expects params?: Promise<any>
  params,
}: {
  params?: Promise<PageParams>;
}) {
  const resolved: PageParams = params ? await params : {};
  const slug =
    typeof resolved.slug === "string" ? resolved.slug : "";

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not set. For dev: http://localhost:3000. For prod: your Vercel URL."
    );
  }

  const res = await fetch(
    `${base}/api/reviews/hostaway?listing=${encodeURIComponent(slug)}&approved=true`,
    { cache: "no-store" }
  );
  const { result } = (await res.json()) as { result: NormalizedReview[] };

  const listingName = result?.[0]?.listingName ?? slug;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{listingName}</h1>
        <p className="text-sm opacity-70">Guest reviews selected by our managers</p>
      </header>

      {!result?.length ? (
        <div className="text-sm opacity-70">
          No approved reviews yet. Go to <a href="/dashboard" className="underline">Dashboard</a> to approve some.
        </div>
      ) : (
        <section className="grid md:grid-cols-2 gap-4">
          {result.map((r) => (
            <article key={r.id} className="rounded-2xl border p-4 shadow-sm">
              <div className="text-sm opacity-70">
                {new Date(r.submittedAt).toLocaleDateString()}
              </div>
              <div className="mt-1 font-medium">{r.guestName || "Guest"}</div>
              {r.rating !== null && (
                <div className="text-sm">Overall rating: {r.rating}/10</div>
              )}
              <p className="mt-2 whitespace-pre-wrap">{r.text}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
