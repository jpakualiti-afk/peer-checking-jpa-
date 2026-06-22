# Testing Guide — Sistem Peer Checking FRP JPA

This version is already connected to the Apps Script Web App:

https://script.google.com/macros/s/AKfycbxfOuqvYLE5QGx-e___P0TNqGqqseQUeaEOQkF3NhS59zLLkrwERK2nuQH_biLijiVl/exec

## Before testing

Make sure the Apps Script under the Unit Kualiti account has already:
1. Run `setupSystem()`
2. Created tabs:
   - `email address`
   - `Form_Responses`
   - `Dashboard`
3. Been deployed as Web App:
   - Execute as: Me
   - Who has access: Anyone

## Test steps

1. Open the GitHub Pages link for this project.
2. Confirm the top banner shows:
   `Connected to Google Sheet`
3. Fill in sample data.
4. Click `Hantar Semakan`.
5. Check Google Sheet:
   - New row appears in `Form_Responses`
   - Matching row updates in `email address`, or a new row is appended
   - `Dashboard` refresh timestamp updates
6. Check Gmail:
   - Owner notification should be sent to `jpa.kualiti@polipd.edu.my`
   - If status is `Perlu Tindakan` or `Tidak Lengkap`, FRP owner gets an action email

## Suggested test cases

### Test 1: Lengkap
All checklist items = Ya, Status FRP = Lengkap.

Expected:
- Saved to Form_Responses
- Owner email sent
- No action email to FRP owner

### Test 2: Perlu Tindakan
At least one item = Tidak, Status FRP = Perlu Tindakan.

Expected:
- Saved to Form_Responses
- Owner email sent
- FRP owner action email sent

### Test 3: Tidak Lengkap
Several items = Tidak, Status FRP = Tidak Lengkap.

Expected:
- Saved to Form_Responses
- Owner email sent
- FRP owner action email sent
