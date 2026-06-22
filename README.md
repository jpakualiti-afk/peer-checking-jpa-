# Sistem Peer Checking FRP JPA — Unit Kualiti Safe Version

This package is prepared for the Unit Kualiti account to create a NEW Google Sheet and deploy the Apps Script from that same account.

## Key point

This version does **not** use a fixed Spreadsheet ID.

The Apps Script uses:

```javascript
SpreadsheetApp.getActiveSpreadsheet()
```

So the system belongs to whichever Google Sheet the Unit Kualiti account creates and binds the Apps Script to.

## Folder structure

```text
frp-peer-checking-unit-kualiti-safe/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   ├── jpa-logo.png
│   └── nor-khayati-signature.png
├── apps-script/
│   └── Code.gs
└── README.md
```

## Owner email

```text
jpa.kualiti@polipd.edu.my
```

## Tomorrow morning setup

1. Login using the Unit Kualiti account.
2. Create a new Google Sheet.
3. Rename the file:
   ```text
   SISTEM PEER CHECKING FRP JPA
   ```
4. Open **Extensions → Apps Script**.
5. Delete existing code.
6. Paste the full code from:
   ```text
   apps-script/Code.gs
   ```
7. Save.
8. Run:
   ```text
   setupSystem
   ```
9. Approve permissions.
10. Confirm these tabs are created:
   ```text
   email address
   Form_Responses
   Dashboard
   ```
11. Deploy:
   - Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
12. Copy the Apps Script Web App URL.

## GitHub setup

Upload these to GitHub:

```text
index.html
css/
js/
assets/
```

Replace the placeholder images with real assets using the exact names:

```text
assets/jpa-logo.png
assets/nor-khayati-signature.png
```

## No-patch connection method

After Apps Script deployment, open the GitHub page using:

```text
?endpoint=YOUR_APPS_SCRIPT_WEB_APP_URL
```

Example:

```text
https://yourusername.github.io/frp-peer-checking/?endpoint=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FAKfycbxxxx%2Fexec
```

The endpoint will be stored in the browser automatically.

## System function

- Creates required sheets automatically
- Saves submissions into `Form_Responses`
- Updates or appends the matching staff row in `email address`
- Creates `Dashboard`
- Sends owner notification to `jpa.kualiti@polipd.edu.my`
- Sends action notification to FRP owner if status is `Perlu Tindakan` or `Tidak Lengkap`


## Connected Web App URL

This package has already been connected to:

```text
https://script.google.com/macros/s/AKfycbxfOuqvYLE5QGx-e___P0TNqGqqseQUeaEOQkF3NhS59zLLkrwERK2nuQH_biLijiVl/exec
```

You can upload the GitHub files and test directly without adding `?endpoint=...`.

Direct test:
1. Open the GitHub Pages link for this project.
2. Fill in the form.
3. Click **Hantar Semakan**.
4. Check the Unit Kualiti Google Sheet tabs:
   - `Form_Responses`
   - `email address`
   - `Dashboard`
5. Check whether notification email reaches `jpa.kualiti@polipd.edu.my`.
