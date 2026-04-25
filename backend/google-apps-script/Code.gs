const SHEET_NAME = "Leads";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "NextGen lead API is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(spreadsheet, SHEET_NAME);

    sheet.appendRow([
      new Date(),
      payload.name || "",
      payload.phone || "",
      payload.email || "",
      payload.domain || "",
      payload.branch || "",
      payload.degree || "",
      payload.message || "",
      payload.userMessage || "",
      payload.source || "Website Form",
      payload.status || "Received",
    ]);

    sendNotificationEmail_(payload);

    return jsonResponse_({
      ok: true,
      message: "Your query has been updated. We will contact you soon.",
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: "Unable to save your query right now. Please try again.",
      error: error.message,
    });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Phone",
      "Email",
      "Domain",
      "Branch",
      "Current / Pursuing Degree",
      "Project Requirement",
      "Your Message",
      "Source",
      "Lead Status",
    ]);
  }

  return sheet;
}

function sendNotificationEmail_(payload) {
  const ownerEmail = "nextgenengineeringsolutions.p@gmail.com";
  const studentEmail = payload.email || "";
  const subject = "New Website Enquiry - NextGen Engineering Solutions";
  const body = [
    "A new lead has been received from the website.",
    "",
    "Name: " + (payload.name || ""),
    "Phone: " + (payload.phone || ""),
    "Email: " + studentEmail,
    "Domain: " + (payload.domain || ""),
    "Branch: " + (payload.branch || ""),
    "Current / Pursuing Degree: " + (payload.degree || ""),
    "Requirement: " + (payload.message || ""),
    "Your Message: " + (payload.userMessage || ""),
  ].join("\n");

  MailApp.sendEmail(ownerEmail, subject, body);

  if (studentEmail) {
    MailApp.sendEmail(
      studentEmail,
      "Your query has been updated",
      "Your query has been updated. We will contact you soon."
    );
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
