import { renderOgImage } from "@/lib/og-image";

type RouteContext = {
  params: Promise<{ region: string }>;
};

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { region } = await context.params;
  return renderOgImage(region);
}
