"use client";

import { useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import TopTabs from "@/components/TopTabs";
import PropertyCard, { PropertySummary, Trend } from "@/components/PropertyCard";
import type { NormalizedReview } from "@/lib/types";

const qc = new QueryClient();

export default function DashboardPage() {
  return (
    <QueryClientProvider client={qc}>
      <OverviewInner />
    </QueryClientProvider>
  );
}

function OverviewInner() {
  // fetch ALL normalized reviews
  const { data, isLoading } = useQuery({
    queryKey: ["hostaway", "all"],
    queryFn: async () => {
      const res = await fetch("/api/reviews/hostaway");
      return (await res.json()) as { status: string; result: NormalizedReview[] };
    },
  });

  const summaries = useMemo<PropertySummary[]>(() => {
    const rows = data?.result ?? [];
    // group by listingSlug
    const map = new Map<string, NormalizedReview[]>();
    rows.forEach((r) => {
      const key = r.listingSlug || r.listingName || "unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });

    // helper: compute numeric score per review (rating or avg category)
    const scoreOf = (r: NormalizedReview): number | null => {
      if (typeof r.rating === "number") return r.rating;
      const vals = Object.values(r.categories || {});
      if (!vals.length) return null;
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return avg;
    };

    const monthKey = (r: NormalizedReview) => r.yearMonth; // "YYYY-MM"

    const out: PropertySummary[] = [];
    map.forEach((list, slug) => {
      // average score and count
      const scores = list.map(scoreOf).filter((v): v is number => v !== null);
      const avg =
        scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

      // compute rough trend: avg last 3 months vs previous 3
      const sorted = [...list].sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
      const months: Record<string, number[]> = {};
      sorted.forEach((r) => {
        const s = scoreOf(r);
        if (s === null) return;
        const k = monthKey(r);
        if (!months[k]) months[k] = [];
        months[k].push(s);
      });
      const monthAverages = Object.entries(months)
        .map(([k, arr]) => [k, arr.reduce((a, b) => a + b, 0) / arr.length] as const)
        .sort(([ka], [kb]) => (ka < kb ? 1 : -1));

      const last3 = monthAverages.slice(0, 3).map(([, v]) => v);
      const prev3 = monthAverages.slice(3, 6).map(([, v]) => v);
      const mean = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
      const mLast = mean(last3);
      const mPrev = mean(prev3);
      let trend: Trend = "flat";
      if (mLast !== null && mPrev !== null) {
        const delta = mLast - mPrev;
        if (delta > 0.2) trend = "up";
        else if (delta < -0.2) trend = "down";
      }

      out.push({
        listingName: list[0]?.listingName || slug,
        listingSlug: slug,
        location: null, // we don’t have city/state in mock
        avgRating: avg,
        reviewCount: list.length,
        trend,
      });
    });

    // sort by name
    return out.sort((a, b) => a.listingName.localeCompare(b.listingName));
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-slate-500 text-sm">Monitor and manage property reviews across all platforms</p>
        </div>
        <TopTabs />
      </div>

      <h2 className="text-xl font-semibold">Properties</h2>

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => (
            <PropertyCard key={s.listingSlug} data={s} />
          ))}
        </div>
      )}
    </div>
  );
}
