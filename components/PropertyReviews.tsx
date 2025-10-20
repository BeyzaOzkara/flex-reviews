import { Star } from "lucide-react";

type Review = {
  id: string;
  guestName?: string | null;
  text: string;
  submittedAt: string;  // ISO string
  rating: number | null;
  categories?: Record<string, number>;
};

function Stars({ value }: { value: number }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-1" aria-label={`${v} / 10`}>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-semibold text-slate-800">{v}</span>
      <span className="ml-1 text-xs text-slate-500">/10</span>
    </div>
  );
}

const pretty = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default async function PropertyReviews({ slug }: { slug: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${base}/api/reviews/hostaway?listing=${encodeURIComponent(
      slug
    )}&approved=true`,
    { next: { revalidate: 60 } }
  );
  const json = await res.json();
  const reviews: Review[] = json?.result ?? [];

  return (
    <section id="guest-reviews" className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Guest Reviews</h2>
        <span className="text-sm text-slate-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No guest reviews have been published for this property yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-900">
                  {r.guestName ?? "Guest"}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(r.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">{r.text}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {typeof r.rating === "number" ? <Stars value={r.rating} /> : null}

                {r.categories &&
                  Object.keys(r.categories).length > 0 &&
                  Object.entries(r.categories).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      title={`${pretty(k)}: ${v}/10`}
                    >
                      {pretty(k)}: {v}
                    </span>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
