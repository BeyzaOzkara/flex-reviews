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

export type Property = {
  id: string;            // listingSlug
  name: string;          // listingName
  category: string;      // e.g., "Hotel" (we’ll fake for now)
  location?: string | null;
  avg_rating: number | null; // 0–10
  review_count: number;
  approved_count?: number; 
  image?: string;        // /public image or remote
};

export type ReviewRow = {
  id: string;                // review id
  property_id: string;       // listingSlug
  reviewer_name: string;
  comment: string;
  channel: "hostaway" | "google" | string;
  rating: number;            // 0–10 (or derived)
  review_date: string;       // ISO
  is_approved: boolean;      // approved
};
