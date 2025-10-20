# 🏡 Flex Living — Reviews Dashboard

This project was built as part of the **Flex Living Developer Assessment**.  
It provides a modern manager dashboard for monitoring, filtering, and approving guest reviews,  
along with a public property page displaying approved reviews only.

Deployed app: [https://flex-reviews.vercel.app](https://flex-reviews.vercel.app)

---

## 🚀 Tech Stack

**Frontend**
- [Next.js 14 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) icons
- [shadcn/ui](https://ui.shadcn.com) components

**Backend**
- Next.js API Routes (`/app/api/...`)
- Data persistence via **Vercel KV**
- Fallback mock data for **Hostaway Reviews API**

**Deployment**
- Hosted on **Vercel**
- Environment Variables:
  ```env
  NEXT_PUBLIC_BASE_URL=https://flex-reviews.vercel.app
  HOSTAWAY_ACCOUNT_ID=6118
  HOSTAWAY_API_KEY=<provided_key>
  ```

---

## 📡 API Endpoints

### `GET /api/reviews/hostaway`
Fetches and normalizes reviews from the Hostaway sandbox API.

**Query Parameters**
| Name | Type | Description |
|------|------|--------------|
| `listing` | string | Filter by listing slug |
| `minRating` | number | Minimum rating |
| `approved` | boolean | Only approved reviews |
| `start`, `end` | ISO date | Filter by date range |

**Normalization Output**
```json
{
  "id": "7453",
  "channel": "hostaway",
  "type": "host-to-guest",
  "status": "published",
  "rating": 9.67,
  "categories": {
    "cleanliness": 10,
    "communication": 9,
    "respect_house_rules": 10
  },
  "submittedAt": "2020-08-21T22:45:14.000Z",
  "yearMonth": "2020-08",
  "guestName": "Shane Finkelstein",
  "listingName": "2B N1 A - 29 Shoreditch Heights",
  "listingSlug": "2b-n1-a-29-shoreditch-heights",
  "text": "Shane and family are wonderful! Would definitely host again :)",
  "approved": false
}
```

If the Hostaway API returns no data, the endpoint automatically **falls back to mock JSON**.

---

### `POST /api/reviews/approve`
Toggles the approval status of a review.

**Request Body**
```json
{
  "id": "7453",
  "approved": true
}
```

Data is persisted using **Vercel KV**, ensuring approved reviews remain visible on refresh or deploy.

---

## 💻 Application Views

### 1. **Overview**
- Displays all properties with:
  - Property image
  - Average rating
  - Total review count
  - Approved review count

### 2. **Reviews**
- Manager dashboard to view and manage all reviews.
- Features:
  - Search, Filter (Category, Channel, Rating, Time Range, Approved)
  - Approve/Pending toggle per review
  - Category rating chips (e.g., *Cleanliness: 10*)

### 3. **Insights**
- KPI Cards: **Total Reviews**, **Average Rating**, **Approved Reviews**, **Recent Reviews**
- **Channel distribution** visualization
- **Trending Properties** (3-month rating trend)
- **Properties Needing Attention** (low average rating or negative trend)

### 4. **Property Page**
- Accessible via `/property/[slug]`
- Displays only **approved** reviews.
- Clean, guest-facing layout consistent with property pages on Flex Living’s website.

---

## 🧮 Core Logic

- **Normalization**: All Hostaway reviews are converted into a unified schema.
- **Category Ratings**: `reviewCategory[]` values (e.g., cleanliness, communication) are stored in a `categories` object, and an average rating is derived if `rating` is null.
- **Approval Flow**:  
  1. Toggle approval in dashboard  
  2. Persist state to KV  
  3. Public property page shows only approved reviews
- **Attention Rule**:  
  Properties are flagged when:
  - Average rating < **8.0**, or  
  - 3-month average rating trend drops by more than **–0.3**.

---

## 🔍 Google Reviews Exploration

### Feasibility
Integration is possible using **Google Places API**:
```
GET https://maps.googleapis.com/maps/api/place/details/json?place_id=<id>&fields=reviews&key=<API_KEY>
```

### Considerations
- Requires API key with billing enabled.
- Limited to 5–10 most recent reviews per place.
- Data must be normalized to match Hostaway format.

### Proposed Future Extension
Add `/api/reviews/google?placeId=<id>`  
and merge results from multiple channels:
```ts
GET /api/reviews?channel=hostaway|google|all
```

Currently documented as an **exploration only**.

---

## ⚙️ Setup & Run Locally

```bash
pnpm install
pnpm dev
```

Environment Variables (`.env.local`):
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
HOSTAWAY_ACCOUNT_ID=6118
HOSTAWAY_API_KEY=<provided_key>
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🧠 Design & Logic Decisions

- **Normalization-first** architecture for multiple review sources.
- **Persistent approvals** stored in lightweight KV database.
- **Live→Mock fallback** ensures app always runs, even without external API.
- **UI/UX first**: intuitive filters, instant toggles, and meaningful metrics.
- **Insights** focus on **performance**.

---

## ✅ Deliverables Recap

| Requirement | Status |
|--------------|--------|
| Hostaway API Integration | ✅ Done (with mock fallback) |
| Manager Dashboard | ✅ Done |
| Filtering & Sorting | ✅ Done |
| Approval Workflow | ✅ Done (Vercel KV) |
| Review Display Page | ✅ Done |
| Insights View | ✅ Done |
| API Route `/api/reviews/hostaway` | ✅ Implemented |
| Deployment (Vercel) | ✅ Live |
| Documentation (This file) | ✅ Complete |

---

**Author:** Beyza Nur Ozkara  
**Built for:** Flex Living Developer Assessment  
**Deployed on:** [Vercel](https://vercel.com)
