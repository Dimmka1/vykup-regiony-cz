import { NextResponse } from "next/server";
import { getAllLeads } from "@/lib/google-sheets";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

function isAuthorized(request: Request): boolean {
  if (!ADMIN_SECRET) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_SECRET}`;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const leads = await getAllLeads();

    return NextResponse.json(
      { ok: true, leads, total: leads.length },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("[admin-leads] Error:", error);
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
