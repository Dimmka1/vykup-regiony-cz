import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  TRACKED_KEYWORDS,
  type KeywordData,
  type SerpSnapshot,
  type SerpHistory,
} from "@/lib/serp-keywords";

const DATA_DIR = join(process.cwd(), "data");
const HISTORY_FILE = join(DATA_DIR, "serp-history.json");
const SITE_URL = "https://vykoupim-nemovitost.cz";

function loadHistory(): SerpHistory {
  if (!existsSync(HISTORY_FILE)) {
    return { snapshots: [] };
  }
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, "utf-8")) as SerpHistory;
  } catch {
    return { snapshots: [] };
  }
}

function saveHistory(history: SerpHistory): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function fetchGscData(): Promise<KeywordData[]> {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    console.warn(
      "[serp-check] GOOGLE_SERVICE_ACCOUNT_KEY not set. Using mock data. " +
        "To connect: create a GCP service account, enable Search Console API, " +
        "add the service account email as a user in GSC, then set " +
        "GOOGLE_SERVICE_ACCOUNT_KEY env var with the JSON key contents.",
    );
    return generateMockData();
  }

  try {
    const key = JSON.parse(serviceAccountKey) as {
      client_email: string;
      private_key: string;
    };
    const token = await getGscAccessToken(key.client_email, key.private_key);

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];

    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["query"],
          dimensionFilterGroups: [
            {
              filters: TRACKED_KEYWORDS.map((kw) => ({
                dimension: "query",
                operator: "equals",
                expression: kw,
              })),
              groupType: "or" as const,
            },
          ],
          rowLimit: 25,
        }),
      },
    );

    if (!res.ok) {
      console.error(
        "[serp-check] GSC API error:",
        res.status,
        await res.text(),
      );
      return generateMockData();
    }

    const data = (await res.json()) as {
      rows?: Array<{
        keys: string[];
        position: number;
        impressions: number;
        clicks: number;
      }>;
    };

    const resultMap = new Map<string, KeywordData>();
    for (const row of data.rows ?? []) {
      resultMap.set(row.keys[0], {
        keyword: row.keys[0],
        position: Math.round(row.position * 10) / 10,
        impressions: row.impressions,
        clicks: row.clicks,
      });
    }

    return TRACKED_KEYWORDS.map(
      (kw) =>
        resultMap.get(kw) ?? {
          keyword: kw,
          position: 0,
          impressions: 0,
          clicks: 0,
        },
    );
  } catch (error) {
    console.error("[serp-check] GSC fetch error:", error);
    return generateMockData();
  }
}

async function getGscAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const { subtle } = globalThis.crypto;
  const pemBody = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(`${header}.${claim}`),
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${claim}.${sig}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenData = (await tokenRes.json()) as { access_token: string };
  return tokenData.access_token;
}

function generateMockData(): KeywordData[] {
  return TRACKED_KEYWORDS.map((kw) => ({
    keyword: kw,
    position: Math.round((Math.random() * 30 + 1) * 10) / 10,
    impressions: Math.floor(Math.random() * 500 + 10),
    clicks: Math.floor(Math.random() * 50),
  }));
}

async function sendTelegramAlert(
  droppedKeywords: KeywordData[],
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const lines = droppedKeywords.map(
    (kw) => `⚠️ "${kw.keyword}" — pozice ${kw.position}`,
  );
  const text = [
    "📉 <b>SERP Alert: klíčová slova vypadla z top-20</b>",
    "",
    ...lines,
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keywords = await fetchGscData();
  const snapshot: SerpSnapshot = {
    date: new Date().toISOString().split("T")[0],
    keywords,
  };

  const history = loadHistory();

  const prev = history.snapshots[history.snapshots.length - 1];
  if (prev) {
    const prevMap = new Map(prev.keywords.map((k) => [k.keyword, k.position]));
    const dropped = keywords.filter((kw) => {
      const prevPos = prevMap.get(kw.keyword);
      return (
        kw.position > 20 &&
        prevPos !== undefined &&
        prevPos > 0 &&
        prevPos <= 20
      );
    });
    if (dropped.length > 0) {
      await sendTelegramAlert(dropped);
    }
  }

  history.snapshots.push(snapshot);
  if (history.snapshots.length > 52) {
    history.snapshots = history.snapshots.slice(-52);
  }
  saveHistory(history);

  return NextResponse.json({
    ok: true,
    date: snapshot.date,
    keywords: keywords.length,
  });
}
