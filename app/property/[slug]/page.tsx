export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/reviews/hostaway?listing=${params.slug}&approved=true`, {
    cache: "no-store",
  });
  const { result } = await res.json();
  const listingName = result?.[0]?.listingName ?? params.slug;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{listingName}</h1>
        <p className="text-sm opacity-70">Guest reviews selected by our managers</p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {(result || []).map((r: any) => (
          <article key={r.id} className="rounded-2xl border p-4 shadow-sm">
            <div className="text-sm opacity-70">{new Date(r.submittedAt).toLocaleDateString()}</div>
            <div className="mt-1 font-medium">{r.guestName || "Guest"}</div>
            {r.rating !== null && <div className="text-sm">Overall rating: {r.rating}/10</div>}
            <p className="mt-2 whitespace-pre-wrap">{r.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
