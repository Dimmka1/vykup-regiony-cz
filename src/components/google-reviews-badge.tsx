import type { ReactElement } from "react";

const GOOGLE_RATING = process.env.NEXT_PUBLIC_GOOGLE_RATING ?? "4.9";
const GOOGLE_REVIEW_COUNT = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_COUNT ?? "47";
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "#";

interface StarProps {
  filled: boolean;
  half?: boolean;
}

function StarIcon({ filled, half }: StarProps): ReactElement {
  if (half) {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" aria-hidden="true">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-star)"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`h-3.5 w-3.5 ${filled ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function renderStars(rating: number): ReactElement[] {
  const stars: ReactElement[] = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
  const totalFull = hasHalf ? fullStars : Math.round(rating);

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<StarIcon key={i} filled />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<StarIcon key={i} filled={false} half />);
    } else {
      stars.push(<StarIcon key={i} filled={i < totalFull} />);
    }
  }

  return stars;
}

function GoogleIcon(): ReactElement {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type BadgeVariant = "header" | "header-dark" | "hero";

interface GoogleReviewsBadgeProps {
  variant?: BadgeVariant;
  className?: string;
}

export function GoogleReviewsBadge({
  variant = "header",
  className = "",
}: GoogleReviewsBadgeProps): ReactElement {
  const rating = parseFloat(GOOGLE_RATING);
  const reviewCount = GOOGLE_REVIEW_COUNT;

  if (variant === "hero") {
    return (
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`glass inline-flex items-center gap-2.5 rounded-xl border border-white/20 px-4 py-2.5 backdrop-blur-md transition hover:border-white/40 ${className}`}
        aria-label={`Google hodnocení ${GOOGLE_RATING} z 5 na základě ${reviewCount} recenzí`}
      >
        <GoogleIcon />
        <div className="flex items-center gap-1.5">{renderStars(rating)}</div>
        <span className="text-sm font-semibold text-white">
          {GOOGLE_RATING}
        </span>
        <span className="text-xs text-white/70">({reviewCount} recenzí)</span>
      </a>
    );
  }

  const isDark = variant === "header-dark";

  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
        isDark
          ? "border-white/20 bg-white/10 hover:bg-white/20"
          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
      } ${className}`}
      aria-label={`Google hodnocení ${GOOGLE_RATING} z 5 na základě ${reviewCount} recenzí`}
    >
      <GoogleIcon />
      <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
      <span
        className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
      >
        {GOOGLE_RATING}
      </span>
      <span className={isDark ? "text-white/60" : "text-slate-500"}>
        ({reviewCount})
      </span>
    </a>
  );
}
