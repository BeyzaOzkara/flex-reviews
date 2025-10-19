import { NextRequest, NextResponse } from "next/server";
import { normalizeHostaway } from "@/lib/normalize";
import { getHostawayReviews } from "@/lib/sources";
import type { NormalizedReview } from "@/lib/types";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const listing = url.searchParams.get("listing");
  const minRating = url.searchParams.get("minRating");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const approvedOnly = url.searchParams.get("approved") === "true";

  // 1) Get reviews (live first, mock fallback)
  const { items, source } = await getHostawayReviews();

  // 2) Normalize to your final shape
  let result: NormalizedReview[] = await normalizeHostaway(items);

  // 3) Server-side filters (same as before)
  if (listing) result = result.filter((r) => r.listingSlug === listing || r.listingName === listing);
  if (minRating) result = result.filter((r) => (r.rating ?? 0) >= Number(minRating));
  if (start) result = result.filter((r) => r.submittedAt >= new Date(start).toISOString());
  if (end) result = result.filter((r) => r.submittedAt <= new Date(end).toISOString());
  if (approvedOnly) result = result.filter((r) => r.approved);

  // newest first
  result = result.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));

  // 4) Return with a tiny bit of metadata so you (and reviewers) can see if it used live or mock
  return NextResponse.json({ status: "success", source, result });
}
