"use client";
import { useMemo } from "react";

export default function FiltersBar({ value, onChange, data }: any) {
  const listings = useMemo(() => {
    const s = new Set<string>();
    (data || []).forEach((r: any) => r.listingSlug && s.add(r.listingSlug));
    return Array.from(s);
  }, [data]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col">
        <label className="text-sm">Listing</label>
        <select
          className="border rounded px-2 py-1"
          value={value.listing || ""}
          onChange={(e) => onChange({ ...value, listing: e.target.value })}
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
          value={value.minRating || ""}
          onChange={(e) => onChange({ ...value, minRating: e.target.value })}
        />
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.approved || false}
          onChange={(e) => onChange({ ...value, approved: e.target.checked })}
        />
        Approved only
      </label>
    </div>
  );
}
