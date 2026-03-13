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
- **Reset Day Counter** — Reset to Day 1 or any previous day (10-tap safety to prevent accidental resets)

## Cloud Sync Setup

The app syncs completion state across devices (e.g. Mac Safari ↔ iPhone Safari) via Firebase:

1. Open the app on your **first device** — a sync code (e.g. `MRNKC3`) is generated automatically
2. Open the app on your **second device**
3. Enter the same sync code in the **☁️ Cloud Sync** section at the bottom
4. Tap the **🔗 link button** — data merges and syncs in real-time

> **Current sync code: `MRNKC3`**
>
> No login required. The sync code is stored in localStorage on each device. Use the same code on all your devices to keep them in sync.

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

## Reset Day Counter

The app tracks which day you're on based on an anchor date. To reset:

1. Scroll to the bottom and find the **Reset Day Counter** button
2. Tap it **10 times** (safety mechanism to prevent accidental resets)
3. A prompt appears asking which day to reset to (e.g. enter `1` for Day 1, or `6` to go back to Day 6)
4. The page reloads with the new day

The anchor date is stored in `localStorage` (`interview_prep_anchor`). Clearing browser data will revert to the hardcoded default anchor.

## Local Development

```bash
# Serve locally
python3 -m http.server 8000

# Open http://localhost:8000
```

## License

Personal project — not licensed for redistribution.
