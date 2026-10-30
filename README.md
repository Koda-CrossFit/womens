# Free Women's Strength Class — Koda CrossFit Iron View × Mend

**Live at https://koda-crossfit.github.io/womens/** (repo Koda-CrossFit/womens, GitHub Pages from `main`; a push deploys in about a minute).

A one-page site where a new client reserves **one free Women's Strength class** at Koda CrossFit Iron View. The class is PT-led with Mend Physical Therapy, and the page uses Mend's look (teal `#117F97`, navy `#122857`, light blue `#E6F7FE`, Inter). The Mend logo and the class/coach photos load straight from mendcolorado.com.

## How it works

- **Class times live in the page** (`LINEUP` in `index.html`), copied from kodacrossfitironview.com/Schedule on 10/30/2026. Tue/Thu: 7:30, 8:45, 9:45 AM, 4:00, 5:00 PM. Fri: 7:30, 8:45 AM. Change them there and push. The backend only checks that a pick is a real Mountain-time class, still upcoming and no more than 45 days out, so a time change needs no redeploy.
- The picker shows the current week plus the next 3 weeks (`WEEKS_AHEAD`). Classes starting within 60 minutes drop off (`LEAD_MINUTES`). Holidays in `CLOSED_DAYS` show as "no classes".
- **One free class per email.** Reserving again with the same email moves an upcoming class. Once the class has started it counts as used, and the page tells them so.
- Posts `type: "mendws"` to the Koda Apps Script web app, the same `/exec` URL as the Hyrox pages. The backend is `apps-script/MendWomens.js` in `Desktop\Claude\hyrox-simulation-signup` (repo Koda-CrossFit/hyrox), routed from `Code.js`. Deployed as web-app version @60 on 10/30/2026.
- **Sheet:** "Women's Strength Free Class — Koda × Mend (reservations)" in Kevin's Drive (script property `MENDWS_SHEET_ID`).
  - **Reservations** has one row per email. Class holds the start time as a real date, so it can be edited by hand. Status starting "Cancel…" frees the email for a new booking. "Filtered (bot check)" rows came from the hidden spam field and got no emails.
  - **By Class** is rebuilt on every save and shows who is coming to each class. Don't edit it.
- **Emails** go out from Kevin's Gmail via MailApp, sharing the ~100/day quota with the Hyrox pages:
  - The client gets a confirmation with a Google Calendar link, an `.ics` file and the intake-form step. Replies go to Kristin.
  - Maggie and Kristin get an alert for every booking or class change. Replying to the alert reaches the client directly.
  - Test sign-ups (a name or email matching `test`) alert Kevin only.
  - If either email fails, Kevin gets an "email problem" notice.
  - The addresses are script properties (`MENDWS_ALERT_TO`, comma-separated, and `MENDWS_REPLY_TO`), kept out of the public code. Change them with an admin POST to the web app: `{"type":"mendwsAdmin","key":"<admin key>","action":"setAlerts","alertTo":"a@x.com,b@y.com","replyTo":"c@z.com"}`. Unset, both fall back to Kevin.
- **Intake form link:** set it once, with no redeploy. The link must start with `https://`, and `url=clear` removes it:
  `<exec-url>?action=mendwsSetIntake&url=<link>&key=<admin key>`
  Until it's set, the success screen and the confirmation say the coaches will send the intake form, and the alert asks Maggie and Kristin to send it.
- **Admin GETs** need `&key=<admin key>`. It's the same key as the Hyrox admin actions, from `Desktop\Claude\Credentials - SENSITIVE Do Not Share\hyrox-sim-oct25-admin-key.txt`:
  - `mendwsInfo` returns the sheet link, counts, intake link, alert addresses and mail quota.
  - `mendwsRoster` lists every reservation.
  - `mendwsByClass` rebuilds the By Class tab.
  - `mendwsSetIntake` sets or clears the intake link.
  - `mendwsClearTests` deletes test rows.
- `?src=instagram` (or any word) on the link is saved in the Source column, to see where bookings come from.
- Preview without saving: `index.html#test` (red banner; nothing is posted).

## Files

- `index.html`: the whole page (styles and script inline).
- `assets/`: `favicon.svg`, `apple-touch-icon.png` and `og-womens.jpg` (link-preview card). Rebuild them with `node tools/build_assets.js`, which uses puppeteer from `Desktop\Claude\hyrox_pdf`.
