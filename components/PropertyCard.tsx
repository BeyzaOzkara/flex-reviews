import Image from "next/image";
import type { Property } from "@/lib/types";

export function PropertyCard({
  property,
  onClick,
}: {
  property: Property;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full">
        <Image src={property.image || "/property.png"} alt={property.name} fill className="object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {property.category}
          </span>
        </div>
        {property.location && <div className="text-xs text-slate-500">{property.location}</div>}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-amber-500">★</span>
          <span className="font-medium">
            {property.avg_rating === null ? "—" : (Math.round(property.avg_rating * 10) / 10).toFixed(1)}
          </span>
          <span className="text-slate-500">({property.review_count} reviews)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
            Approved: {property.approved_count ?? 0}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{property.review_count} total</span>
        </div>

      </div>
    </button>
  );
}
