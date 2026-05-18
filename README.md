# NetVisor — Electron Desktop App

Network Infrastructure Manager for SMEs.
Single encrypted database file, multi-user, AES-256-GCM, runs on Windows, Mac and Linux.

---

## Project structure

```
netvisor/
├── main.js                  Electron main process (window, tray, IPC, dialogs)
├── preload.js               Secure bridge between renderer and Node.js
├── electron-builder.yml     Build config for all platforms
├── package.json
├── assets/
│   ├── icon.ico             Windows icon  (256x256)
│   ├── icon.icns            macOS icon    (512x512)
│   └── icon.png             Linux icon    (512x512)
└── renderer/
    └── index.html           The full NetVisor app (HTML/CSS/JS)
```

---

## Prerequisites

- Node.js 18 or later — https://nodejs.org
- npm (comes with Node.js)

---

## First-time setup

```bash
# 1. Clone or copy this folder to your machine
cd netvisor

# 2. Install dependencies
npm install
```

---

## Run in development

```bash
npm start
```

This opens the app directly. No build step needed for development.

---

## Add your app icons

Before building for distribution, add icons to the `assets/` folder:

| File | Size | Used on |
|---|---|---|
| `assets/icon.ico` | 256x256 | Windows |
| `assets/icon.icns` | 512x512 | macOS |
| `assets/icon.png` | 512x512 | Linux + fallback |

You can create these from a single PNG using a tool like:
- https://www.icoconverter.com (for .ico)
- https://cloudconvert.com (for .icns)

The app will still run without icons but they are needed for the final installer.

---

## Build for distribution

```bash
# Windows installer (.exe)
npm run build:win

# macOS disk image (.dmg)
npm run build:mac

# Linux packages (.AppImage, .deb, .rpm)
npm run build:linux

# All platforms at once (run on a Mac for best results)
npm run build:all
```

Output files go into the `dist/` folder.

Note: Building for macOS requires running on a Mac.
Building for Windows can be done on Windows or Linux (via Wine).
Building for Linux works on Linux or macOS.

---

## How the app works

**On first launch:**
The login screen appears. Click "Create New Database" to pick a location for your
encrypted `.json` file, then create your first user account.

**On subsequent launches:**
The app remembers your last database file. It auto-loads it and takes you straight
to the user select / password screen.

**Encryption:**
Each user's data is encrypted with AES-256-GCM. The key is derived from their
password using PBKDF2-SHA256 with 310,000 iterations and a unique random salt.
The database file is a standard `.json` file but all payload data is ciphertext.

**Auto-save:**
Every change (add device, edit VLAN, etc.) is immediately encrypted and written
back to the database file. There is no manual save step.

**System tray:**
The app minimizes to the system tray when closed. Right-click the tray icon to
quit fully, toggle "open on startup", or show the window.

---

## Adding auto-updates (future)

When you are ready to distribute updates automatically:

1. Create a GitHub repository for NetVisor.
2. Install electron-updater: `npm install electron-updater`
3. Uncomment the `publish` section in `electron-builder.yml` and set your repo.
4. Add update-check logic to `main.js` using `autoUpdater` from `electron-updater`.
5. Build and publish a GitHub release — the app will check for updates on launch.

---

## Updating the app UI

The entire UI lives in `renderer/index.html`. Edit it freely.
All NetVisor features (devices, VLANs, port maps, cable trace, firmware, audit logs)
are in that single file. Run `npm start` to see changes immediately.
