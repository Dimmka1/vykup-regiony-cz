import { NextRequest, NextResponse } from "next/server";
import { fetchSearchAnalytics, fetchCoverageData } from "@/lib/gsc";

function checkAuth(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return false;
  return apiKey === expected;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type");

  try {
    if (type === "analytics") {
      const data = await fetchSearchAnalytics();
      return NextResponse.json(data);
    }

    if (type === "coverage") {
      const data = await fetchCoverageData();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Invalid type. Use ?type=analytics or ?type=coverage" },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("[gsc-api]", error);
    return NextResponse.json(
      {
        error: "GSC API error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
