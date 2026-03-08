"use client";

import { useEffect, useState, type ReactElement } from "react";
import { Star } from "lucide-react";
import type { ReviewsResponse } from "@/app/api/reviews/route";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=" +
  (process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "");

function StarRating({ rating }: { rating: number }): ReactElement {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} z 5 hvězd`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-slate-200 text-slate-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewSkeleton(): ReactElement {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-24 rounded-lg bg-slate-200" />
        <div className="h-4 w-32 rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-5">
            <div className="mb-2 h-4 w-20 rounded bg-slate-200" />
            <div className="mb-1 h-3 w-full rounded bg-slate-100" />
            <div className="mb-1 h-3 w-4/5 rounded bg-slate-100" />
            <div className="h-3 w-3/5 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoogleReviews(): ReactElement {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("fetch failed");
        const json: ReviewsResponse = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <ReviewSkeleton />;
  }

  // Fallback — no data or no reviews
  if (!data || data.totalReviews === 0 || data.reviews.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700">
          Ohodnoťte nás na Google
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Vaše zkušenost nám pomůže zlepšovat naše služby
        </p>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--theme-700)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-800)]"
        >
          <Star className="h-4 w-4" aria-hidden="true" />
          Napsat recenzi na Google
        </a>
      </div>
    );
  }

  const displayReviews = data.reviews.slice(0, 5);

  return (
    <div>
      {/* Overall rating */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-4xl font-extrabold text-slate-900">
          {data.rating.toFixed(1)}
        </span>
        <div>
          <StarRating rating={data.rating} />
          <p className="mt-0.5 text-sm text-slate-500">
            {data.totalReviews} hodnocení na Google
          </p>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayReviews.map((review, idx) => (
          <div
            key={`${review.author}-${idx}`}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {review.author}
              </span>
              <StarRating rating={review.rating} />
            </div>
            {review.text && (
              <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">
                &ldquo;{review.text}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Link to write review */}
      <div className="mt-6 text-center">
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
        >
          Napsat recenzi na Google →
        </a>
      </div>
    </div>
  );
}
