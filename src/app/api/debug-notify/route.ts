import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const diagnostics: Record<string, unknown> = {
    hasBotToken: !!botToken,
    botTokenLength: botToken?.length ?? 0,
    botTokenPrefix: botToken?.slice(0, 10) ?? "MISSING",
    hasChatId: !!chatId,
    chatIdValue: chatId ?? "MISSING",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // Try to actually send a test message
  if (botToken && chatId) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🔧 Debug test from Vercel runtime",
            parse_mode: "HTML",
          }),
        },
      );
      const body = await res.text();
      diagnostics.telegramStatus = res.status;
      diagnostics.telegramOk = res.ok;
      diagnostics.telegramResponse = body.slice(0, 500);
    } catch (err) {
      diagnostics.telegramError =
        err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(diagnostics);
}
