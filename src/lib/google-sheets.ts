/**
 * Google Sheets API helper using service account JWT auth.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY  (PEM, with \n escaped as literal \\n)
 *   GOOGLE_SHEETS_ID    (spreadsheet id from URL)
 */

/* ------------------------------------------------------------------ */
/*  Auth – service-account JWT → access token                         */
/* ------------------------------------------------------------------ */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

interface ServiceAccountConfig {
  email: string;
  privateKey: string;
  spreadsheetId: string;
}

function getServiceAccountConfig(): ServiceAccountConfig {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  if (!email || !rawKey || !spreadsheetId) {
    throw new Error(
      "[google-sheets] Missing env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEETS_ID",
    );
  }

  const privateKey = rawKey.replace(/\\n/g, "\n");
  return { email, privateKey, spreadsheetId };
}

function base64url(data: string): string {
  return Buffer.from(data).toString("base64url");
}

async function signJwt(email: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPES,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signingInput = `${header}.${payload}`;

  const { createSign } = await import("node:crypto");
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(privateKeyPem, "base64url");

  return `${signingInput}.${signature}`;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const { email, privateKey } = getServiceAccountConfig();
  const jwt = await signJwt(email, privateKey);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[google-sheets] Token request failed: ${res.status} ${body}`,
    );
  }

  const data = (await res.json()) as TokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

/* ------------------------------------------------------------------ */
/*  Sheets API helpers                                                */
/* ------------------------------------------------------------------ */

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

interface SheetValues {
  values?: string[][];
}

/**
 * Read a range from the spreadsheet.
 */
export async function readRange(range: string): Promise<string[][]> {
  const token = await getAccessToken();
  const { spreadsheetId } = getServiceAccountConfig();

  const url = `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[google-sheets] Read failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as SheetValues;
  return data.values ?? [];
}

/**
 * Append rows to a sheet.
 */
export async function appendRows(
  range: string,
  rows: (string | number)[][],
): Promise<void> {
  const token = await getAccessToken();
  const { spreadsheetId } = getServiceAccountConfig();

  const url = `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: rows }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[google-sheets] Append failed: ${res.status} ${body}`);
  }
}
