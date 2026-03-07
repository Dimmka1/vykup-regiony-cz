import { NextResponse } from "next/server";
import { z } from "zod";
import { markLeadConverted } from "@/lib/google-sheets";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

function isAuthorized(request: Request): boolean {
  if (!ADMIN_SECRET) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_SECRET}`;
}

const conversionSchema = z.object({
  lead_id: z.string().min(1),
  conversion_value: z.number().min(0),
  conversion_time: z.string().min(1),
  conversion_currency: z.string().length(3).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();
    const result = conversionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { lead_id, conversion_value, conversion_time, conversion_currency } =
      result.data;

    const updateResult = await markLeadConverted({
      lead_id,
      conversion_value,
      conversion_time,
      conversion_currency,
    });

    if (!updateResult.success) {
      return NextResponse.json(
        { ok: false, code: "UPDATE_FAILED", error: updateResult.error },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { ok: true, message: `Lead ${lead_id} marked as converted` },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("[conversions] Error:", error);
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
