export type ReviewCategory = { 
  category: string; 
  rating: number | null 
};

export type NormalizedReview = {
  id: string;
  channel: "hostaway" | "google";
  type: string;
  status: string;
  rating: number | null;
  categories: Record<string, number>;
  submittedAt: string;   // ISO
  yearMonth: string;     // YYYY-MM
  guestName?: string | null;
  listingName?: string | null;
  listingSlug?: string | null;
  text: string;          // review body
  approved: boolean;     // manager approval
};
