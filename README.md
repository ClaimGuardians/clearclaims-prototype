# ClearClaims Customer Prototype

This is a static, dependency-free prototype based on the ClearClaims blueprint.

## Run locally

```bash
cd "/Users/chucktaylor/Documents/New project/clearclaims-prototype"
python3 -m http.server 8010
```

Open:

```text
http://localhost:8010
```

## Current scope

- Homeowner claim workspace with editable claim details
- Local document index and upload metadata
- Photo evidence log with captions and optional thumbnails
- Timeline and carrier response tracking
- Personal property inventory with CSV export
- Policy reference notes with plain-language helper copy
- Policy/declarations page upload area with local prototype limit extraction
- Agent/adjuster message builder to request a complete policy copy
- Supplied ClearClaims icon and wordmark assets served from `assets/`
- Section naming system using “Clear” labels such as Clear Answers, Clear Communications, and Clear Results
- Carrier letter draft workflow with homeowner review and certification
- NC DOI complaint packet preview with attachment checklist

All data is stored in the browser's local storage for prototype review. No files are uploaded to a backend.
