"use client";
import { useEffect, useState } from "react";
import type { NormalizedReview, Property, ReviewRow  } from "@/lib/types";

export function useDashboardData() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews/hostaway", { cache: "no-store" });
        const json = (await res.json()) as { status: string; result: NormalizedReview[] };
        const rows = json.result;

        // build properties map
        const byListing = new Map<string, NormalizedReview[]>();
        rows.forEach((r) => {
          const slug = r.listingSlug || "unknown";
          if (!byListing.has(slug)) byListing.set(slug, []);
          byListing.get(slug)!.push(r);
        });

        const calcScore = (r: NormalizedReview): number | null => {
          if (typeof r.rating === "number") return r.rating;
          const v = Object.values(r.categories || {});
          return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
        };

        const props: Property[] = Array.from(byListing.entries()).map(([slug, list]) => {
          const scores = list
            .map(calcScore)
            .filter((n): n is number => n !== null);
          const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

          const approvedCount = list.filter((r) => !!r.approved).length;  // 👈 NEW

          return {
            id: slug,
            name: list[0]?.listingName ?? slug,
            category: "Hotel",
            location: null,
            avg_rating: avg,
            review_count: list.length,
            approved_count: approvedCount,
            image: "/property.jpg",
          };
        });


        const rowsBolt: ReviewRow[] = rows.map((r) => {
          const s = calcScore(r) ?? 0;
          return {
            id: r.id,
            property_id: r.listingSlug || "unknown",
            reviewer_name: r.guestName || "Guest",
            comment: r.text,
            channel: r.channel,
            rating: s,
            review_date: r.submittedAt || new Date(0).toISOString(), // <— ISO string
            is_approved: r.approved,
          };
        });

        if (!cancelled) {
          setProperties(props);
          setReviews(rowsBolt);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function toggleReviewVisibility(id: string, approved: boolean) {
    await fetch("/api/reviews/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });

    setReviews(prev => prev.map(r => (r.id === id ? { ...r, is_approved: approved } : r)));

    // Also update approved_count on properties (fast, local)
    setProperties(prev => {
      // find the review we just changed to know which property to touch
      const changed = reviews.find(r => r.id === id);
      if (!changed) return prev;

      const pid = changed.property_id;
      return prev.map(p =>
        p.id !== pid
          ? p
          : {
              ...p,
              approved_count: Math.max(
                0,
                (p.approved_count ?? 0) + (approved ? 1 : -1)
              ),
            }
      );
    });
  }



  return { properties, reviews, loading, error, toggleReviewVisibility };
}
