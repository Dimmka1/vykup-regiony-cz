import { NextResponse } from "next/server";

/**
 * Validates ADMIN_SECRET Bearer token from request headers.
 * Returns null if valid, or a 401 NextResponse if invalid.
 */
export function validateAdminAuth(request: Request): NextResponse | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Admin auth not configured" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { ok: false, error: "Missing authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.slice(7);
  if (token !== secret) {
    return NextResponse.json(
      { ok: false, error: "Invalid admin token" },
      { status: 401 },
    );
  }

  return null;
}
