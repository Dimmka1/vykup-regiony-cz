/**
 * Google Apps Script — Push Subscriber Webhook Receiver
 *
 * Deploy: Extensions → Apps Script → paste this → Deploy → Web app
 * Set "Execute as: Me" and "Who has access: Anyone"
 * Copy the deployment URL and set as PUSH_SUBSCRIBERS_WEBHOOK_URL env var.
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("push_subscribers");

    if (!sheet) {
      sheet = ss.insertSheet("push_subscribers");
      sheet.appendRow(["endpoint", "p256dh", "auth", "created_at"]);
    }

    var payload = JSON.parse(e.postData.contents);

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.endpoint) {
        sheet.getRange(i + 1, 1, 1, 4).setValues([
          [payload.endpoint, payload.p256dh, payload.auth, payload.created_at || new Date().toISOString()]
        ]);
        return ContentService.createTextOutput(
          JSON.stringify({ ok: true, action: "updated" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    sheet.appendRow([
      payload.endpoint || "",
      payload.p256dh || "",
      payload.auth || "",
      payload.created_at || new Date().toISOString(),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, action: "created" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
