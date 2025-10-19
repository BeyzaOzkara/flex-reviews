"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import FiltersBar from "@/components/FiltersBar";
import ReviewsTable from "@/components/ReviewsTable";

const qc = new QueryClient();

export default function DashboardPage() {
  return (
    <QueryClientProvider client={qc}>
      <Inner />
    </QueryClientProvider>
  );
}

function Inner() {
  type Params = { approved: boolean; minRating: string; listing: string };

  const [params, setParams] = useState<Params>({
    approved: false,
    minRating: "",
    listing: "",
  });

  const qs = new URLSearchParams();
  if (params.listing) qs.set("listing", params.listing);
  if (params.minRating) qs.set("minRating", params.minRating);
  if (params.approved) qs.set("approved", "true");

  const { data, isLoading } = useQuery({
    queryKey: ["hostaway", qs.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/hostaway?${qs.toString()}`);
      return res.json();
    },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Reviews Dashboard</h1>
      <FiltersBar value={params} onChange={setParams} data={data?.result ?? []} />
      <ReviewsTable loading={isLoading} rows={data?.result ?? []} />
    </div>
  );
}
