import SiteHeader from "@/components/SiteHeader";
import { Bath, Bed, Hotel, Users } from "lucide-react";
import PropertyReviews from "@/components/PropertyReviews";

type ApiReview = {
  listingName?: string | null;
};

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default async function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Try to get a proper listing name from your API; fallback to slug humanized
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const metaRes = await fetch(
    `${base}/api/reviews/hostaway?listing=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  ).catch(() => null);

  let listingName = humanizeSlug(slug);
  if (metaRes && metaRes.ok) {
    const metaJson = await metaRes.json();
    const first: ApiReview | undefined = metaJson?.result?.[0];
    if (first?.listingName) listingName = first.listingName;
  }

  // You can replace these with real data if you have it
  const facts = { guests: 5, bedrooms: 2, bathrooms: 1, beds: 3 };

  // Local images (put your own in /public). Using <img> avoids next/image domain config.
  const images = [
    "/property.jpg", // make sure this exists in /public
    "/property.jpg",
    "/property.jpg",
    "/property.jpg",
    "/property.jpg",
  ];

  const amenities = [
    "Cable TV",
    "Kitchen",
    "Washing Machine",
    "Wireless",
    "Hair Dryer",
    "Heating",
  ];

  return (
    <div className="bg-[#FAF8F1] min-h-screen">
      <SiteHeader/>
      {/* Top gallery (Flex-like layout) */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <img
          src={images[0]}
          alt=""
          className="col-span-2 h-[420px] w-full object-cover rounded-xl"
        />
        <img
          src={images[1] || images[0]}
          alt=""
          className="h-[420px] w-full object-cover rounded-xl"
        />
        <img
          src={images[2] || images[0]}
          alt=""
          className="h-[240px] w-full object-cover rounded-xl"
        />
        <img
          src={images[3] || images[0]}
          alt=""
          className="h-[240px] w-full object-cover rounded-xl"
        />
        <img
          src={images[4] || images[0]}
          alt=""
          className="h-[240px] w-full object-cover rounded-xl md:col-span-3"
        />
      </section>

      <main className="mx-auto max-w-6xl px-4 md:px-6 pb-16">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
          {listingName}
        </h1>

        {/* Facts row */}
        <div className="flex flex-wrap items-center gap-6 text-slate-700 mb-8">
          <span className="inline-flex items-center gap-2">
            <Users className="w-5 h-5" /> {facts.guests} Guests
          </span>
          <span className="inline-flex items-center gap-2">
            <Hotel className="w-5 h-5" /> {facts.bedrooms} Bedrooms
          </span>
          <span className="inline-flex items-center gap-2">
            <Bath className="w-5 h-5" /> {facts.bathrooms} Bathrooms
          </span>
          <span className="inline-flex items-center gap-2">
            <Bed className="w-5 h-5" /> {facts.beds} beds
          </span>
        </div>

        {/* About & booking (simple cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            {/* About */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                About this property
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Welcome to this cozy apartment, perfect for small groups. It
                offers bright living spaces, a fully equipped kitchen, and
                comfortable bedrooms. Located close to transit, shops, and local
                parks.
              </p>
            </div>

            {/* Amenities */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {amenities.map((a) => (
                  <li
                    key={a}
                    className="text-slate-700 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Approved reviews section */}
            <PropertyReviews slug={slug} />
          </div>

          {/* Booking card (static placeholder) */}
          <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Book Your Stay
            </h3>
            <div className="space-y-3 text-sm">
              <div className="h-10 rounded-lg border border-slate-300 px-3 flex items-center text-slate-600">
                Select dates
              </div>
              <div className="h-10 rounded-lg border border-slate-300 px-3 flex items-center text-slate-600">
                Guests
              </div>
              <button className="w-full h-10 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900">
                Check availability
              </button>
              <button className="w-full h-10 rounded-lg border border-slate-300 text-slate-800 font-medium hover:bg-slate-50">
                Send Inquiry
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Instant booking confirmation.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
