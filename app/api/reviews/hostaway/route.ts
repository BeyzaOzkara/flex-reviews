import { NextRequest, NextResponse } from "next/server";
import raw from "@/lib/hostawayMock.json";
import { normalizeHostaway, HostawayReview } from "@/lib/normalize";

type HostawayMock = {
  status: string;
  result: HostawayReview[];
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const listing = url.searchParams.get("listing");
  const minRating = url.searchParams.get("minRating");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const approvedOnly = url.searchParams.get("approved") === "true";

  const data = raw as HostawayMock;
  const items: HostawayReview[] = Array.isArray(data?.result) ? data.result : [];

  let result = await normalizeHostaway(items);

  if (listing) result = result.filter(r => r.listingSlug === listing || r.listingName === listing);
  if (minRating) result = result.filter(r => (r.rating ?? 0) >= Number(minRating));
  if (start) result = result.filter(r => r.submittedAt >= new Date(start).toISOString());
  if (end) result = result.filter(r => r.submittedAt <= new Date(end).toISOString());
  if (approvedOnly) result = result.filter(r => r.approved);

  result = result.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));

  return NextResponse.json({ status: "success", result });
}
