import { TrendingUp, AlertCircle, MessageSquare, Eye } from "lucide-react";
import type { Property, ReviewRow } from "@/lib/types";

interface InsightsPanelProps {
  properties: Property[];
  reviews: ReviewRow[];
}

export function InsightsPanel({ properties, reviews }: InsightsPanelProps) {
  // ---------- Top-line KPIs ----------
  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / totalReviews
      : 0;

  const approvedReviews = reviews.filter((r) => r.is_approved).length;

  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);
  const recentReviews = reviews.filter((r) => new Date(r.review_date) >= last7);

  // ---------- Channel Distribution ----------
  const channelDistribution = reviews.reduce<Record<string, number>>((acc, r) => {
    const key = r.channel || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const totalForPct = Math.max(totalReviews, 1);

  // ---------- Per-property stats derived from reviews ----------
  type PropAgg = {
    id: string;
    name: string;
    avg_rating: number | null;
    review_count: number;
    approved_count: number;
    recent_trend: number; // last 3 months avg - previous 3 months avg
  };

  // index reviews by property
  const byProp = new Map<string, ReviewRow[]>();
  reviews.forEach((r) => {
    if (!byProp.has(r.property_id)) byProp.set(r.property_id, []);
    byProp.get(r.property_id)!.push(r);
  });

  const monthKey = (iso: string) => iso.slice(0, 7); // "YYYY-MM"
  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const propAggs: PropAgg[] = properties.map((p) => {
    const rows = byProp.get(p.id) ?? [];
    const scores = rows.map((r) => r.rating ?? 0);
    const avg = scores.length ? mean(scores) : (p.avg_rating ?? null);
    const approvedCount = rows.filter((r) => r.is_approved).length;

    // trend: avg of last 3 months - previous 3 months
    const buckets = new Map<string, number[]>();
    rows.forEach((r) => {
      const k = monthKey(r.review_date);
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k)!.push(r.rating ?? 0);
    });
    const monthAverages = Array.from(buckets.entries())
      .map(([m, arr]) => [m, mean(arr)] as const)
      .sort(([a], [b]) => (a < b ? 1 : -1)); // desc by month

    const last3 = monthAverages.slice(0, 3).map(([, v]) => v);
    const prev3 = monthAverages.slice(3, 6).map(([, v]) => v);
    const recentTrend = mean(last3) - mean(prev3);

    return {
      id: p.id,
      name: p.name,
      avg_rating: avg,
      review_count: rows.length || p.review_count || 0,
      approved_count: approvedCount || (p.approved_count ?? 0),
      recent_trend: recentTrend,
    };
  });

  // properties needing attention: lowest avg 
  const ATTENTION_RATING_CUTOFF = 8.0; // tweak as you like
  const ATTENTION_TREND_DROP = -0.3;   // drop threshold

  const needsAttention = propAggs
    .filter((p) => p.review_count > 0)
    .filter(
      (p) =>
        (p.avg_rating ?? 10) < ATTENTION_RATING_CUTOFF ||
        p.recent_trend < ATTENTION_TREND_DROP
    )
    .sort((a, b) => {
      const aAvg = a.avg_rating ?? 10;
      const bAvg = b.avg_rating ?? 10;
      if (aAvg !== bAvg) return aAvg - bAvg;           // lowest avg first
      return a.recent_trend - b.recent_trend;          // most negative trend next
    })
    .slice(0, 3);

  // trending properties: absolute movement (up or down)
  const trending = [...propAggs]
    .filter((p) => p.recent_trend !== 0)
    .sort((a, b) => Math.abs(b.recent_trend) - Math.abs(a.recent_trend))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 opacity-80" />
            <span className="text-blue-100 text-sm font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalReviews}</div>
          <div className="text-blue-100 text-sm">Reviews</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-yellow-100 text-sm font-medium">Average</span>
          </div>
          <div className="text-3xl font-bold mb-1">{avgRating.toFixed(1)}</div>
          <div className="text-yellow-100 text-sm">Rating</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 opacity-80" />
            <span className="text-emerald-100 text-sm font-medium">Approved</span>
          </div>
          <div className="text-3xl font-bold mb-1">{approvedReviews}</div>
          <div className="text-emerald-100 text-sm">
            {totalReviews ? `${Math.round((approvedReviews / totalReviews) * 100)}%` : "0%"} of total
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-slate-100 text-sm font-medium">Last 7 Days</span>
          </div>
          <div className="text-3xl font-bold mb-1">{recentReviews.length}</div>
          <div className="text-slate-100 text-sm">New reviews</div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Properties Needing Attention
          </h3>
          {needsAttention.length ? (
          <div className="space-y-3">
            {needsAttention.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div>
                  <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-600">
                    Avg {p.avg_rating?.toFixed(1) ?? "—"}
                    {typeof p.recent_trend === "number" && (
                      <>
                        {" • "}
                        Trend {p.recent_trend > 0 ? "+" : ""}
                        {p.recent_trend.toFixed(1)}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right text-red-600">
                  <div className="font-semibold">
                    {p.avg_rating?.toFixed(1) ?? "—"}
                  </div>
                  <div className="text-xs text-gray-600">avg rating</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">All properties are performing well!</p>
        )}
        </div>

        {/* Trending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Trending Properties
          </h3>
          {trending.length ? (
            <div className="space-y-3">
              {trending.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                    <div className="text-xs text-gray-600">
                      {p.avg_rating?.toFixed(1) ?? "—"} avg rating
                    </div>
                  </div>
                  <div
                    className={`text-right ${
                      p.recent_trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <div className="font-semibold">
                      {p.recent_trend > 0 ? "+" : ""}
                      {p.recent_trend.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">trend (3m vs prev)</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No significant trends detected</p>
          )}
        </div>
      </div>

      {/* Channel distribution + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reviews in last 7 days</span>
              <span className="font-semibold text-gray-900">{recentReviews.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved reviews</span>
              <span className="font-semibold text-gray-900">{approvedReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending reviews</span>
              <span className="font-semibold text-gray-900">
                {totalReviews - approvedReviews}
              </span>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Channel Distribution</h3>
          <div className="space-y-2">
            {Object.entries(channelDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([channel, count]) => (
                <div key={channel} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{channel}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.round((count / totalForPct) * 100)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            {!Object.keys(channelDistribution).length && (
              <p className="text-sm text-gray-500">No channel data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
