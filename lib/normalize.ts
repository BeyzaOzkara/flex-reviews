import { NormalizedReview, ReviewCategory } from "./types";
import { getApprovedSet } from "./kv";

type HostawayReview = {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory?: ReviewCategory[];
  submittedAt: string; // "YYYY-MM-DD HH:mm:ss"
  guestName?: string;
  listingName?: string;
};

const toISO = (s: string) => new Date(s.replace(" ", "T") + "Z").toISOString();
const slugify = (s?: string | null) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function normalizeHostaway(items: HostawayReview[]): Promise<NormalizedReview[]> {
  const approvedSet = await getApprovedSet();

  return items.map((r) => {
    const categories: Record<string, number> = {};
    (r.reviewCategory || []).forEach((c) => {
      if (c?.category && typeof c.rating === "number") categories[c.category] = c.rating;
    });

    const iso = toISO(r.submittedAt);
    return {
      id: String(r.id),
      channel: "hostaway",
      type: r.type,
      status: r.status,
      rating: r.rating,
      categories,
      submittedAt: iso,
      yearMonth: iso.slice(0, 7),
      guestName: r.guestName || null,
      listingName: r.listingName || null,
      listingSlug: slugify(r.listingName),
      text: r.publicReview || "",
      approved: approvedSet.has(String(r.id)),
    };
  });
}
