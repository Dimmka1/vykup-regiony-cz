import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateValuation, type ValuationResult } from "@/lib/valuation";

const valuationSchema = z.object({
  region: z.string().min(1),
  type: z.enum(["byt", "dum", "pozemek", "komercni"]),
  m2: z.number().min(1).max(10_000),
  condition: z.enum(["vyborny", "dobry", "horsi", "rekonstrukce"]),
  floor: z.enum(["prizemi", "1-3", "4+", "podkrovi"]),
});

export async function POST(
  request: Request,
): Promise<NextResponse<ValuationResult | { ok: false; code: string }>> {
  try {
    const body: unknown = await request.json();
    const result = valuationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false as const, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const valuation = calculateValuation(result.data);

    return NextResponse.json(valuation, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false as const, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
