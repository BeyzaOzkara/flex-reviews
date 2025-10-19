"use client";

import { useState, useMemo } from "react";
import { LayoutDashboard, List, BarChart3 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { PropertyCard } from "@/components/PropertyCard";
import { ReviewsTable } from "@/components/ReviewsTable";
import { Filters, type FilterOptions } from "@/components/Filters";
import { InsightsPanel } from "@/components/InsightsPanel";
import type { Property } from "@/lib/types";

type ViewMode = "overview" | "reviews" | "insights";

export default function DashboardPage() {
  const { properties, reviews, loading, error, toggleReviewVisibility } = useDashboardData();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "",
    channel: "",
    rating: "",
    timeRange: "",
    approved: "",
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach(r => Object.keys(r.categories ?? {}).forEach(k => set.add(k)));
    return Array.from(set).sort();
  }, [reviews]);
  const channels = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.channel))),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    if (selectedProperty) filtered = filtered.filter((r) => r.property_id === selectedProperty);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.reviewer_name.toLowerCase().includes(s) ||
          r.comment.toLowerCase().includes(s)
      );
    }
    if (filters.category) {
      const key = filters.category.toLowerCase();
      filtered = filtered.filter((r) => r.categories && key in r.categories);
    }
    if (filters.channel) filtered = filtered.filter((r) => r.channel === filters.channel);
    if (filters.rating) {
      const min = parseInt(filters.rating, 10);
      filtered = filtered.filter((r) => (r.rating ?? 0) >= min);
    }
    if (filters.timeRange) {
      const days = parseInt(filters.timeRange);
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter((r) => new Date(r.review_date) >= cutoff);
    }
    if (filters.approved === "approved") {
      filtered = filtered.filter((r) => r.is_approved);
    } else if (filters.approved === "pending") {
      filtered = filtered.filter((r) => !r.is_approved);
    }

    return filtered.sort(
      (a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime()
    );
  }, [reviews, properties, selectedProperty, filters]);

  const filteredProperties = useMemo(
    () => (filters.category ? properties.filter((p) => p.category === filters.category) : properties),
    [properties, filters.category]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage property reviews across all platforms
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setViewMode("overview"); setSelectedProperty(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "overview" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview
              </button>
              <button
                onClick={() => { setViewMode("reviews"); setSelectedProperty(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "reviews" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" /> Reviews
              </button>
              <button
                onClick={() => { setViewMode("insights"); setSelectedProperty(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "insights" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Insights
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedProperty && (
          <div className="mb-6">
            <button onClick={() => setSelectedProperty(null)} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Back to all properties
            </button>
          </div>
        )}

        {viewMode === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => { setSelectedProperty(property.id); setViewMode("reviews"); }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === "reviews" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {selectedProperty
                  ? `Reviews for ${properties.find((p) => p.id === selectedProperty)?.name ?? ""}`
                  : "All Reviews"}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Filters filters={filters} onFilterChange={setFilters} categories={categories} channels={channels} />

            <ReviewsTable
              reviews={filteredReviews}
              properties={properties as Property[]}
              onToggleApproved={toggleReviewVisibility}
            />
          </div>
        )}

        {viewMode === "insights" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Analytics & Insights</h2>
              <p className="text-sm text-gray-600 mb-4">Key metrics and trends across all properties</p>
            </div>
            <InsightsPanel properties={properties} reviews={reviews} />
          </div>
        )}
      </main>
    </div>
  );
}
