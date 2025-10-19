export default function InsightsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <p className="text-slate-500 text-sm">
        Stats & trends (e.g., average rating over time, top issues). You can add Recharts here.
      </p>
      <div className="mt-4">
        <a className="underline" href="/dashboard">← Back to Overview</a>
      </div>
    </div>
  );
}
