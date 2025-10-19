import { NormalizedReview } from "@/lib/types";
import React from "react";

type Params = { approved: boolean; minRating: string; listing: string };

interface FiltersBarProps {
  value: Params;
  onChange: React.Dispatch<React.SetStateAction<Params>>;
  data: NormalizedReview[];
}

export default function FiltersBar({ value, onChange, data }: FiltersBarProps) {
  const listings = React.useMemo(() => {
    const s = new Set<string>();
    (data || []).forEach((r) => r.listingSlug && s.add(r.listingSlug));
    return Array.from(s);
  }, [data]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col">
        <label className="text-sm">Listing</label>
        <select
          className="border rounded px-2 py-1"
          value={value.listing}
          onChange={(e) => onChange(prev => ({ ...prev, listing: e.target.value }))}
        >
          <option value="">All</option>
          {listings.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm">Min rating</label>
        <input
          type="number" min={0} max={10}
          className="border rounded px-2 py-1 w-28"
          value={value.minRating}
          onChange={(e) => onChange(prev => ({ ...prev, minRating: e.target.value }))}
        />
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.approved}
          onChange={(e) => onChange(prev => ({ ...prev, approved: e.target.checked }))}
        />
        Approved only
      </label>
    </div>
  );
}
