# Syaza & Khalis — Digital RSVP Wedding Invitation

Premium Malaysian Malay digital wedding invitation using static HTML/CSS/JavaScript and Google Forms for RSVP recording.

## 1. Files

- `index.html` — main invitation website
- `css/style.css` — design and responsive styles
- `js/app.js` — countdown, RSVP, sharing, music, gallery and links
- `assets/images/` — optional local photos
- `assets/music/wedding.mp3` — optional background music

## 2. Google Form RSVP

Create a Google Form with these fields in the same order/meaning:

1. Nama Penuh
2. Nombor Telefon
3. Kehadiran
4. Bilangan Tetamu
5. Acara Yang Dihadiri (checkboxes)
6. Catatan / Pesanan

Suggested question types:
- Nama Penuh: Short answer
- Nombor Telefon: Short answer
- Kehadiran: Multiple choice
- Bilangan Tetamu: Short answer or dropdown
- Acara Yang Dihadiri: Checkboxes
- Catatan / Pesanan: Paragraph

### Get the entry IDs

1. Open your Google Form.
2. Click the 3-dot menu.
3. Choose "Get pre-filled link".
4. Fill each field with sample values.
5. Generate the link.
6. The URL will contain values such as `entry.123456789=...`.
7. Copy each `entry.xxxxx` ID and paste them into `js/app.js` under `googleFormEntries`.
8. Open the pre-filled link in a browser if you want to confirm the field mapping.

### Get the formResponse endpoint

The normal Google Form URL looks like:

`https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform`

Change `/viewform` to:

`/formResponse`

Then put that full URL into:

`WEDDING_CONFIG.googleFormAction`

Example:

`https://docs.google.com/forms/d/e/123456789ABCDEFG/formResponse`

## 3. Important: checkbox field

The `Acara Yang Dihadiri` field is a checkbox question. The website submits the selected values using the same `entry.xxxxx` field name.

Make sure your Google Form option text exactly matches:

- Akad Nikah
- Walimatulurus

## 4. Optional guestbook Google Form

Create a second Google Form with:

- Nama
- Ucapan

Put its normal `/viewform` URL into:

`guestbookFormUrl`

The "Tulis Ucapan" button will open that form in a new tab.

## 5. Configure the wedding information

Open:

`js/app.js`

Edit:

```js
const WEDDING_CONFIG = {
  coupleShortName: "Syaza & Khalis",
  weddingDateISO: "2026-11-14T12:00:00+08:00",
  weddingDateLabel: "Sabtu · 14 November 2026",
  venue: "Dewan XXX",
  address: "Alamat penuh venue, Perak, Malaysia",
  googleMapsUrl: "...",
  wazeUrl: "...",
  whatsappNumber: "...",
  googleFormAction: "...",
  googleFormEntries: {...},
  guestbookFormUrl: "..."
};
```

Also replace the visible placeholder names, venue and parent names in `index.html`.

## 6. Google Calendar

The example calendar event is configured for:
12:00 PM–4:00 PM Malaysia time on 14 November 2026.

Change the UTC values inside `buildGoogleCalendarUrl()` in `js/app.js` if your reception time is different.

Malaysia is UTC+8.

## 7. WhatsApp

Set your number in international format without `+` or spaces.

Example:

`60123456789`

## 8. Google Maps / Waze

Replace:
- `googleMapsUrl`
- `wazeUrl`

with your actual venue links.

## 9. Music

Put your music file here:

`assets/music/wedding.mp3`

The player is designed to start only after the guest interacts with the invitation cover.

## 10. Photos

You can replace the sample Unsplash URLs in `index.html` with:
- local files, e.g. `assets/images/hero.jpg`
- your own hosted image URLs

For best performance:
- JPG or WebP
- mobile images around 1200px wide
- compressed files

## 11. GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files.
3. Go to Settings → Pages.
4. Select the main branch and root folder.
5. Save.
6. Wait for GitHub Pages to publish the site.
7. Share the published URL through WhatsApp.

## 12. Important Google Form behaviour

This project submits the RSVP form to Google Forms using a hidden iframe, which avoids browser CORS restrictions.

Because Google Forms is external, the site does not receive a secure server-side success response. The success message shown by the website is displayed after the submission request is sent.

Always check the connected Google Sheet after testing to confirm the entry is being recorded.

## 13. Privacy

Do not collect unnecessary personal information in the RSVP form. Only request details needed for wedding preparation.

If the website will be public, review your Google Form settings and response-sheet access before sharing the invitation URL.
