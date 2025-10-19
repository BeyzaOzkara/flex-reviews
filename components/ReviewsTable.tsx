"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NormalizedReview } from "@/lib/types";

interface ReviewsTableProps {
  rows: NormalizedReview[];
  loading: boolean;
}

export default function ReviewsTable({ rows, loading }: ReviewsTableProps) {
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await fetch("/api/reviews/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved }),
      });
      return res.json() as Promise<{ ok: boolean }>;
    },
    onSuccess: () => {
      // invalidate all queries that start with "hostaway"
      qc.invalidateQueries({ predicate: q => Array.isArray(q.queryKey) && q.queryKey[0] === "hostaway" });
    },
  });

  if (loading) return <div>Loading…</div>;
  if (!rows?.length) return <div>No reviews found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-2">Approved</th>
            <th className="p-2">Date</th>
            <th className="p-2">Listing</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Categories</th>
            <th className="p-2">Text</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: NormalizedReview) => (
            <tr key={r.id} className="border-b">
              <td className="p-2 align-top">
                <input
                  type="checkbox"
                  checked={r.approved}
                  onChange={(e) => mut.mutate({ id: r.id, approved: e.target.checked })}
                />
              </td>
              <td className="p-2 align-top">{new Date(r.submittedAt).toLocaleDateString()}</td>
              <td className="p-2 align-top">{r.listingName || r.listingSlug}</td>
              <td className="p-2 align-top">{r.rating ?? "-"}</td>
              <td className="p-2 align-top">
                {(Object.entries(r.categories || {}) as [string, number][])
                  .map(([k, v]) => (
                    <span key={k} className="mr-2 inline-block rounded bg-slate-100 px-2 py-0.5">
                      {k}:{v}
                    </span>
                  ))}
              </td>
              <td className="p-2 align-top max-w-xl">{r.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
