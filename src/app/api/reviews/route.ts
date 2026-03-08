import { NextResponse } from "next/server";

export interface ReviewData {
  author: string;
  text: string;
  rating: number;
  time: number;
}

export interface ReviewsResponse {
  rating: number;
  totalReviews: number;
  reviews: ReviewData[];
}

const EMPTY_RESPONSE: ReviewsResponse = {
  rating: 0,
  totalReviews: 0,
  reviews: [],
};

export async function GET(): Promise<NextResponse<ReviewsResponse>> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json(EMPTY_RESPONSE);
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "reviews,rating,user_ratings_total");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("language", "cs");

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("Google Places API error:", res.status);
      return NextResponse.json(EMPTY_RESPONSE);
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result) {
      console.error("Google Places API status:", data.status);
      return NextResponse.json(EMPTY_RESPONSE);
    }

    const result = data.result;

    const reviews: ReviewData[] = (result.reviews ?? []).map(
      (r: {
        author_name: string;
        text: string;
        rating: number;
        time: number;
      }) => ({
        author: r.author_name,
        text: r.text,
        rating: r.rating,
        time: r.time,
      }),
    );

    return NextResponse.json({
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return NextResponse.json(EMPTY_RESPONSE);
  }
}
