import { NextRequest, NextResponse } from "next/server";
import raw from "@/lib/hostawayMock.json";
import { normalizeHostaway } from "@/lib/normalize";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const listing = url.searchParams.get("listing");
  const minRating = url.searchParams.get("minRating");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const approvedOnly = url.searchParams.get("approved") === "true";

  const items = Array.isArray((raw as any)?.result) ? (raw as any).result : [];
  let data = await normalizeHostaway(items);

  if (listing) data = data.filter((r) => r.listingSlug === listing || r.listingName === listing);
  if (minRating) data = data.filter((r) => (r.rating ?? 0) >= Number(minRating));
  if (start) data = data.filter((r) => r.submittedAt >= new Date(start).toISOString());
  if (end) data = data.filter((r) => r.submittedAt <= new Date(end).toISOString());
  if (approvedOnly) data = data.filter((r) => r.approved);

  data = data.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));

  return NextResponse.json({ status: "success", result: data });
}
