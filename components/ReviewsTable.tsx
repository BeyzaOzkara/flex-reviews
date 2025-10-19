// components/ReviewsTable.tsx
import { useState } from "react";
import { Star, Calendar, Eye, EyeOff, MessageSquare } from "lucide-react";
import type { Property, ReviewRow } from "@/lib/types";

const pretty = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export function ReviewsTable({
  reviews,
  properties,
  onToggleApproved,
}: {
  reviews: ReviewRow[];
  properties: Property[];
  onToggleApproved: (reviewId: string, approved: boolean) => Promise<void>;
}) {
  const [toggling, setToggling] = useState<string | null>(null);

  const nameOf = (id: string) => properties.find((p) => p.id === id)?.name ?? "Unknown Property";
  const fmt = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  if (!reviews.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categories</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Approved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4"><div className="font-medium text-gray-900 text-sm">{nameOf(r.property_id)}</div></td>
                <td className="px-6 py-4 text-sm text-gray-900">{r.reviewer_name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-sm">{r.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(r.categories ?? {}).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      title={`${k.replace(/_/g, " ")}: ${v}/10`}
                    >
                      {pretty(k)}: {v}
                    </span>
                  ))}
                  {!r.categories || Object.keys(r.categories).length === 0 ? (
                    <span className="text-xs text-gray-400">—</span>
                  ) : null}
                </div>
              </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700">
                    {r.channel}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <div className="text-sm text-gray-600 line-clamp-2">{r.comment}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {fmt(r.review_date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={async () => {
                      setToggling(r.id);
                      try { await onToggleApproved(r.id, !r.is_approved); }
                      finally { setToggling(null); }
                    }}
                    disabled={toggling === r.id}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      r.is_approved ? "bg-green-50 text-green-700 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {r.is_approved ? (<><Eye className="w-4 h-4"/><span>Approved</span></>)
                                   : (<><EyeOff className="w-4 h-4"/><span>Pending</span></>)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
