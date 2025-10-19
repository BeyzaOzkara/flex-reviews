import raw from "@/lib/hostawayMock.json";
import type { ReviewCategory } from "./types";
import type { HostawayReview } from "./normalize"; // you exported this earlier

type HostawayApiResponse = {
  status: string;
  result: HostawayReview[];
};

function hasCreds() {
  return !!(process.env.HOSTAWAY_API_BASE && process.env.HOSTAWAY_API_KEY && process.env.HOSTAWAY_ACCOUNT_ID);
}

/**
 * Try fetching live Hostaway reviews. Return [] on any failure.
 * Adjust the endpoint/path & headers to whatever their sandbox expects.
 */
export async function fetchHostawayLive(): Promise<HostawayReview[]> {
  if (!hasCreds()) return [];

  const base = process.env.HOSTAWAY_API_BASE!;
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID!;
  const apiKey = process.env.HOSTAWAY_API_KEY!;

  // NOTE: endpoint path & auth scheme can vary by sandbox.
  // If their docs specify a different path or headers, tweak here.
  const url = `${base}/v1/reviews?accountId=${encodeURIComponent(accountId)}`;

  try {
    const res = await fetch(url, {
      // Next.js server runtime: outbound fetch is fine
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,   // if sandbox uses different header, change here
        "X-Account-Id": accountId,             // or remove if not needed
      },
      // defensive timeout via Next.js runtime options:
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = (await res.json()) as HostawayApiResponse;

    if (!Array.isArray(data?.result)) return [];
    return data.result;
  } catch {
    return [];
  }
}

/** Read from your mock JSON (ships with repo). */
export async function fetchHostawayMock(): Promise<HostawayReview[]> {
  const data = raw as unknown as HostawayApiResponse;
  return Array.isArray(data?.result) ? data.result : [];
}

/**
 * “Smart” getter: try live first; if no data (or error), fall back to mock.
 */
export async function getHostawayReviews(): Promise<{ items: HostawayReview[]; source: "live" | "mock" }> {
  const live = await fetchHostawayLive();
  if (live.length > 0) return { items: live, source: "live" };
  const mock = await fetchHostawayMock();
  return { items: mock, source: "mock" };
}
