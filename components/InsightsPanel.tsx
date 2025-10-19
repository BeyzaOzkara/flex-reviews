import type { Property, ReviewRow } from "@/lib/types";

export function InsightsPanel({ properties, reviews }: { properties: Property[]; reviews: ReviewRow[] }) {
  const total = reviews.length;
  const approved = reviews.filter((r) => r.is_approved).length;
  const avg =
    reviews.length
      ? (reviews.reduce((a, b) => a + (b.rating ?? 0), 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-4">
        <div className="text-slate-500 text-sm">Total Reviews</div>
        <div className="text-2xl font-semibold">{total}</div>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <div className="text-slate-500 text-sm">Approved</div>
        <div className="text-2xl font-semibold">{approved}</div>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <div className="text-slate-500 text-sm">Average Rating</div>
        <div className="text-2xl font-semibold">{avg}</div>
      </div>
    </div>
  );
}
