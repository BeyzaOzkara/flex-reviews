export default function ReviewsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <p className="text-slate-500 text-sm">
        Full reviews list with filters (reuse the existing table from the earlier dashboard).
      </p>
      <div className="mt-4">
        <a className="underline" href="/dashboard">← Back to Overview</a>
      </div>
    </div>
  );
}
