import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/drip/subscriber";

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return new NextResponse(unsubscribePage("Neplatný odkaz."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const expectedToken = Buffer.from(email).toString("base64url");
  if (token !== expectedToken) {
    return new NextResponse(unsubscribePage("Neplatný odkaz."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const ok = await unsubscribe(email);

  const message = ok
    ? "Byli jste úspěšně odhlášeni z odběru e-mailů."
    : "E-mail nebyl nalezen v našem systému.";

  return new NextResponse(unsubscribePage(message), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function unsubscribePage(message: string): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Odhlášení z odběru</title></head>
<body style="font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f9fafb">
  <div style="background:#fff;padding:40px;border-radius:12px;max-width:500px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <h1 style="color:#1a56db;font-size:24px">Odhlášení z odběru</h1>
    <p style="color:#475569;font-size:16px">${message}</p>
    <a href="https://vykoupim-nemovitost.cz" style="display:inline-block;margin-top:20px;color:#1a56db;text-decoration:underline">Zpět na hlavní stránku</a>
  </div>
</body>
</html>`;
}
