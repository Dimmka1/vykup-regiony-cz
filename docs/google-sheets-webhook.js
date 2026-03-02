/**
 * Google Apps Script — Lead Webhook Receiver
 *
 * Deploy: Extensions → Apps Script → paste this → Deploy → Web app
 * Set "Execute as: Me" and "Who has access: Anyone"
 * Copy the deployment URL and set as LEAD_WEBHOOK_URL env var.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead ID",
        "Name",
        "Phone",
        "Property Type",
        "Region",
        "Situation",
        "IP",
      ]);
    }

    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.lead_id || "",
      payload.data ? payload.data.name : "",
      payload.data ? payload.data.phone : "",
      payload.data ? payload.data.property_type : "",
      payload.data ? payload.data.region : "",
      payload.data ? payload.data.situation_type : "",
      payload.ip || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
