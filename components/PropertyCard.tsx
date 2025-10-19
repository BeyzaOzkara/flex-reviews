import Image from "next/image";
import Link from "next/link";

export type Trend = "up" | "down" | "flat";

export type PropertySummary = {
  listingName: string;
  listingSlug: string;
  location?: string | null;      // optional (we don’t have it in the mock)
  avgRating: number | null;      // 0–10
  reviewCount: number;
  trend: Trend;
};

const PLACEHOLDER = "/property.png";

export default function PropertyCard({
  data,
}: {
  data: PropertySummary;
}) {
  const toStars10 = (v: number | null) =>
    v === null ? "—" : (Math.round(v * 10) / 10).toFixed(1);

  const trendGlyph =
    data.trend === "up" ? "↗" : data.trend === "down" ? "↘" : "→";
  const trendColor =
    data.trend === "up" ? "text-green-600" : data.trend === "down" ? "text-red-600" : "text-slate-400";

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src={PLACEHOLDER} alt={data.listingName} fill className="object-cover" priority />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{data.listingName}</h3>
          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            Property
          </span>
        </div>

        {data.location && (
          <div className="text-xs text-slate-500">{data.location}</div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-amber-500">★</span>
          <span className="font-medium">{toStars10(data.avgRating)}</span>
          <span className="text-slate-500">({data.reviewCount} reviews)</span>
          <span className={trendColor}>{trendGlyph}</span>
        </div>

        <div className="pt-3 border-t mt-3 flex items-center gap-2">
          <Link
            href={`/property/${data.listingSlug}`}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
          >
            View public page
          </Link>
          <Link
            href="/reviews"
            className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            Manage reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
