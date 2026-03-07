/**
 * Google Sheets integration for lead storage & offline conversions (VR-220)
 *
 * Uses Google Sheets API v4 with service account credentials.
 * Required env vars:
 *   GOOGLE_SHEETS_SPREADSHEET_ID - the spreadsheet ID
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL - service account email
 *   GOOGLE_SERVICE_ACCOUNT_KEY   - private key (PEM, base64-encoded or raw)
 *   GOOGLE_SHEETS_SHEET_NAME     - sheet/tab name (default: "Leads")
 */

import { google, type sheets_v4 } from "googleapis";

/* ── Column layout ─────────────────────────────────────────── */

export const SHEET_COLUMNS = [
  "lead_id",
  "timestamp",
  "name",
  "phone",
  "email",
  "property_type",
  "region",
  "situation_type",
  "address",
  "city",
  "postal_code",
  "ip",
  "utm_source",
  "gclid",
  "lead_score",
  "lead_tier",
  "conversion_status",
  "conversion_value",
  "conversion_time",
  "conversion_currency",
] as const;

export type SheetColumn = (typeof SHEET_COLUMNS)[number];

/* ── Types ─────────────────────────────────────────────────── */

export interface LeadRow {
  lead_id: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  property_type: string;
  region: string;
  situation_type: string;
  address: string;
  city: string;
  postal_code: string;
  ip: string;
  utm_source: string;
  gclid: string;
  lead_score: string;
  lead_tier: string;
  conversion_status: string;
  conversion_value: string;
  conversion_time: string;
  conversion_currency: string;
}

export interface ConversionUpdate {
  lead_id: string;
  conversion_value: number;
  conversion_time: string;
  conversion_currency?: string;
}

/* ── Auth ──────────────────────────────────────────────────── */

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? "";
  // Handle base64-encoded key (common in Vercel env vars)
  if (!raw.includes("BEGIN") && raw.length > 100) {
    return Buffer.from(raw, "base64").toString("utf-8");
  }
  // Handle escaped newlines
  return raw.replace(/\\n/g, "\n");
}

function getSheetsClient(): sheets_v4.Sheets {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id)
    throw new Error("[google-sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set");
  return id;
}

function getSheetName(): string {
  return process.env.GOOGLE_SHEETS_SHEET_NAME ?? "Leads";
}

/* ── Core operations ───────────────────────────────────────── */

/**
 * Append a new lead row to the sheet
 */
export async function appendLeadRow(data: Partial<LeadRow>): Promise<void> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    console.warn(
      "[google-sheets] Service account not configured, skipping sheet write",
    );
    return;
  }

  const sheets = getSheetsClient();
  const row = SHEET_COLUMNS.map((col) => data[col] ?? "");

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `${getSheetName()}!A:T`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

/**
 * Find row index by lead_id (1-indexed, including header)
 */
async function findRowByLeadId(
  sheets: sheets_v4.Sheets,
  leadId: string,
): Promise<{ rowIndex: number; rowData: string[] } | null> {
  const spreadsheetId = getSpreadsheetId();
  const sheetName = getSheetName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:A`,
  });

  const rows = res.data.values ?? [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]?.[0] === leadId) {
      // Fetch full row
      const fullRow = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A${i + 1}:T${i + 1}`,
      });
      return {
        rowIndex: i + 1,
        rowData: (fullRow.data.values?.[0] as string[]) ?? [],
      };
    }
  }

  return null;
}

/**
 * Mark a lead as converted — updates conversion columns in the sheet
 */
export async function markLeadConverted(
  update: ConversionUpdate,
): Promise<{ success: boolean; error?: string }> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    return { success: false, error: "Google Sheets not configured" };
  }

  const sheets = getSheetsClient();
  const found = await findRowByLeadId(sheets, update.lead_id);

  if (!found) {
    return {
      success: false,
      error: `Lead ${update.lead_id} not found in sheet`,
    };
  }

  const convStatusCol = SHEET_COLUMNS.indexOf("conversion_status");
  const convCurrencyCol = SHEET_COLUMNS.indexOf("conversion_currency");

  // Build update: columns Q-T (conversion_status through conversion_currency)
  const startCol = String.fromCharCode(65 + convStatusCol); // Q
  const endCol = String.fromCharCode(65 + convCurrencyCol); // T
  const sheetName = getSheetName();

  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!${startCol}${found.rowIndex}:${endCol}${found.rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "converted",
          String(update.conversion_value),
          update.conversion_time,
          update.conversion_currency ?? "CZK",
        ],
      ],
    },
  });

  return { success: true };
}

/**
 * Get all leads with conversion data for CSV export
 * Filter: conversion_status = "converted" AND gclid is not empty
 */
export async function getConvertedLeadsForExport(): Promise<LeadRow[]> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    return [];
  }

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const sheetName = getSheetName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:T`,
  });

  const rows = res.data.values ?? [];
  if (rows.length <= 1) return []; // Only header or empty

  const gclidIdx = SHEET_COLUMNS.indexOf("gclid");
  const convStatusIdx = SHEET_COLUMNS.indexOf("conversion_status");

  const results: LeadRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const gclid = row[gclidIdx] ?? "";
    const convStatus = row[convStatusIdx] ?? "";

    if (convStatus === "converted" && gclid.trim() !== "") {
      const leadRow: Record<string, string> = {};
      SHEET_COLUMNS.forEach((col, idx) => {
        leadRow[col] = row[idx] ?? "";
      });
      results.push(leadRow as unknown as LeadRow);
    }
  }

  return results;
}

/**
 * Get all leads where gclid is not empty — for Google Ads Offline Conversion CSV export.
 * Throws on Google Sheets API errors so the caller can return 500.
 */
export async function getLeadsWithGclidForExport(): Promise<LeadRow[]> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    throw new Error(
      "Google Sheets service account not configured (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY)",
    );
  }

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const sheetName = getSheetName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:T`,
  });

  const rows = res.data.values ?? [];
  if (rows.length <= 1) return [];

  const gclidIdx = SHEET_COLUMNS.indexOf("gclid");
  const results: LeadRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const gclid = row[gclidIdx] ?? "";

    if (gclid.trim() !== "") {
      const leadRow: Record<string, string> = {};
      SHEET_COLUMNS.forEach((col, idx) => {
        leadRow[col] = row[idx] ?? "";
      });
      results.push(leadRow as unknown as LeadRow);
    }
  }

  return results;
}
/**
 * Get all leads (for admin view)
 */
export async function getAllLeads(): Promise<LeadRow[]> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ) {
    return [];
  }

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const sheetName = getSheetName();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:T`,
  });

  const rows = res.data.values ?? [];
  if (rows.length <= 1) return [];

  const results: LeadRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const leadRow: Record<string, string> = {};
    SHEET_COLUMNS.forEach((col, idx) => {
      leadRow[col] = row[idx] ?? "";
    });
    results.push(leadRow as unknown as LeadRow);
  }

  return results;
}
