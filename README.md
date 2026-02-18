# 📋 Interview Prep PWA

A minimal, dark-themed Progressive Web App for daily interview preparation. Alternates between **Coding** (Blind 75) and **System Design** topics on a daily schedule, with a built-in 30-minute timer and progress tracking.

🔗 **Live:** [anurag27397.github.io/interview-prep-pwa](https://anurag27397.github.io/interview-prep-pwa/)

---

## Features

- **Daily Question Rotation** — Coding (odd days) and System Design (even days), anchored to a fixed start date
- **"Aha!" Hints** — Hidden by default; reveal the key insight for each problem
- **30-Minute Timer** — Persists across page reloads via localStorage
- **Custom Topics** — Override the daily pick with your own problem or system design topic
- **History View** — See all past days with completion checkboxes
- **☁️ Cloud Sync** — Firebase Realtime Database sync across devices using a 6-character code
- **Offline Support** — Service worker caches assets; falls back to localStorage when offline
- **Export / Import** — Backup and restore your progress as JSON

## Cloud Sync Setup

The app syncs completion state across devices (e.g. Mac Safari ↔ iPhone Safari) via Firebase:

1. Open the app on your **first device** — a sync code (e.g. `MRNKC3`) is generated automatically
2. Open the app on your **second device**
3. Enter the same sync code in the **☁️ Cloud Sync** section at the bottom
4. Tap the **🔗 link button** — data merges and syncs in real-time

> No login required. The sync code is stored in localStorage on each device.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML / CSS / JS (ES Modules) |
| Sync | Firebase Realtime Database (free tier) |
| Hosting | GitHub Pages |
| Offline | Service Worker + Cache API |
| PWA | Web App Manifest + apple-mobile-web-app meta tags |

## Project Structure

```
InterviewPrepApp/
├── index.html          # Main app (UI + logic)
├── data.js             # Blind 75 + System Design question bank
├── firebase-sync.js    # Cloud sync module
├── style.css           # Dark theme styles
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
└── icons/              # App icons
```

## Local Development

```bash
# Serve locally
python3 -m http.server 8000

# Open http://localhost:8000
```

## License

Personal project — not licensed for redistribution.
