# Google Sheets Backend Setup

## What this does

This Apps Script backend saves every website enquiry into Google Sheets and returns:

`Your query has been updated. We will contact you soon.`

It also:

- emails `nextgenengineeringsolutions.p@gmail.com` when a new lead arrives
- sends a confirmation email to the student if they entered an email address
- keeps each lead organized for follow-up tracking

## Setup steps

1. Create a new Google Sheet for leads.
2. Open `Extensions -> Apps Script`.
3. Paste the contents of `Code.gs` into the Apps Script editor.
4. Save the project.
5. Click `Deploy -> New deployment`.
6. Choose `Web app`.
7. Set `Execute as` to your account.
8. Set `Who has access` to `Anyone`.
9. Deploy and copy the Web App URL.
10. Open [script.js](C:/Users/digit/OneDrive/Desktop/nextgen/script.js) and replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with that URL.

## Suggested Google Sheet columns

The script creates these automatically:

- Timestamp
- Name
- Phone
- Email
- Domain
- Branch
- Current / Pursuing Degree
- Project Requirement
- Your Message
- Source
- Lead Status

## WhatsApp automation note

Google Apps Script cannot directly send WhatsApp messages by itself. The usual pattern is:

1. save lead in Google Sheets
2. call a WhatsApp API provider webhook
3. update the lead row with follow-up status

You can later extend `doPost()` with your provider API call.
