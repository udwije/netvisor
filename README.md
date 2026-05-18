# LANVault

> **Network Infrastructure Manager for SMEs** — a cross-platform desktop app for documenting, visualising, and managing your organisation's entire network in one encrypted local file.

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![Electron](https://img.shields.io/badge/built%20with-Electron%2029-47848F?logo=electron)
![License](https://img.shields.io/badge/license-Apache2.0%20Beta-orange)
![Status](https://img.shields.io/badge/status-Beta%20Testing-yellow)

---

## What is LANVault?

LANVault is a **local-first**, **offline-capable** desktop application that gives small and medium organisations a single source of truth for their network infrastructure. Everything — devices, VLANs, port mappings, cable paths, firmware status, and audit history — lives in one AES-256-GCM encrypted file on your own machine or file server.

No cloud subscription. No SaaS. No data leaving your premises.

---

## Screenshots

> _<img width="1916" height="1027" alt="image" src="https://github.com/user-attachments/assets/63128149-eaa2-4fe2-b7c6-c749d6465f98" _/>
<img width="1920" height="1030" alt="Screenshot (40)" src="https://github.com/user-attachments/assets/59374fe5-572f-4d42-8c7a-6e251e5e8ef4" />
<img width="1920" height="1022" alt="Screenshot (39)" src="https://github.com/user-attachments/assets/88d7991c-344a-4558-b818-37121fda8a79" />
<img width="1920" height="1022" alt="Screenshot (38)" src="https://github.com/user-attachments/assets/18aac1a4-d1ac-436c-b4b4-382f5eab08b3" />
<img width="1920" height="1030" alt="Screenshot (32)" src="https://github.com/user-attachments/assets/a50d4246-a518-4d38-a994-eeb3b34c4cea" />
<img width="1920" height="1030" alt="Screenshot (34)" src="https://github.com/user-attachments/assets/f3788cca-f394-49b3-b31c-22e7619f4061" />
<img width="1920" height="1022" alt="Screenshot (35)" src="https://github.com/user-attachments/assets/5f24af08-a5df-4178-9dc9-0a8ab3cb9692" />

---

## Features

### 🖥️ Device Inventory
Full inventory management across every device category in a real SME network:

| Category | Description |
|---|---|
| **ISP Device / CPE** | Modem, ONT, or provider-managed edge equipment |
| **Router** | Layer-3 routing devices (Cisco, MikroTik, Juniper, etc.) |
| **Firewall** | Perimeter and internal firewalls (FortiGate, Cisco ASA, pfSense, etc.) |
| **Core Switch** | Distribution-layer or collapsed-core switches |
| **Distribution Switch** | Aggregation layer between core and access |
| **Managed Switch (Access)** | Access-layer switches with VLAN support |
| **Wireless LAN Controller** | Centralised AP management (Cisco, Aruba, Ruckus, etc.) |
| **Access Point** | Individual APs linked to their upstream switch and port |
| **SFP Module** | Transceiver documentation per port |
| **Other Device** | Anything else (NAS, UPS, PDU, OOB console server, etc.) |

Each device stores hostname, model, IP, MAC, location, firmware, serial number, and operational status.

### 🔌 Realistic Port Profiles
Port counts are not just a number — they reflect real hardware. When adding a switch or router you can select from a built-in model library or define your own groups:

- **Built-in presets** for Cisco CBS350-24P-4G, SG350-28, C9300, C9500, FortiSwitch 248D-FPOE / 124E, Aruba 2930F / CX6300, Huawei S5735 / S5720, Ubiquiti USW-Pro, and more.
- Each preset defines **port groups** — for example, the CBS350-24P-4G is defined as 24× GbE PoE + 4× SFP, not just "28 ports".
- Group types: **GbE**, **PoE**, **SFP**, **Combo**, **Custom**.
- The Port Map view colour-codes every port by its hardware group so you can instantly see which ports are PoE-capable, which are SFP uplinks, and which are combo ports.
- Fully **custom** mode lets you define any combination for unlisted models.

### 🗺️ Port Map View
> ⚠️ **Beta:** Port map is functional but visual polish is still in progress. A full UI redesign is planned for v1.1.

Visual front-panel representation of every switch, firewall, router, and distribution device:

- Each port renders as a physical port tile, colour-coded by connection type (Access / Uplink / Trunk / DMZ / WAN).
- A coloured bottom border strip on each tile shows which hardware group it belongs to (PoE = green, GbE = blue, SFP = amber, Combo = purple).
- Empty slots are filled automatically based on the port profile, greyed out and labelled with the hardware group.
- Port utilisation percentage shown per device.
- Click any connected port to **launch a cable trace** from that port.
- Add or edit port connections directly from the port map without opening the full device editor.

### 🌐 Network Topology
Auto-generated layered topology diagram built from your inventory data:

- **5-layer OSI-inspired layout**: ISP/Internet Edge → Core/Firewall/Router → Distribution → Access → Endpoints/SFPs.
- Each device node is colour-coded by category (indigo for ISP, orange for Router, red for Firewall, blue for Core, etc.).
- Connections are drawn from port mapping data — uplinks, trunks, access, WAN, and DMZ links all render with distinct arrow colours.
- Duplicate edges are deduplicated automatically.
- Fully scrollable SVG canvas that scales with your inventory size.

### 🔗 Cable Trace
Point-to-point path tracer across your topology:

- Select source and destination devices (all categories supported).
- The tracer walks the portMap graph and resolves intermediate hops.
- Shows the full path with hop count, port labels, link type badges, and estimated cable length(Not Functional with current version) .
- Launch directly from a port tile in the Port Map view.

### 🏷️ VLAN Management
Document your VLAN design as logical constructs, independent of port assignments:

- VLAN ID, name, subnet, gateway, description, and purpose.
- VLANs are linked to devices through the switch port rows (not the VLAN definition itself).
- Filter VLANs by switch, search by ID or name.
- Managed switches display which VLANs they carry.

### 📋 Interface Configuration
Per-device interface rows with full detail:

- **Switches**: Port ID, type (Access / Uplink / Trunk / DMZ / WAN), connected device (linked from your inventory or manually entered), and VLAN/purpose label. Tooltips explain each field and port type.
- **Firewalls / Routers / ISP Devices**: Interface name, IP, subnet mask, port identifier, and type.
- **WLCs**: Port, type, connected switch (linked from inventory), and purpose.
- Connected Device fields use a dropdown populated from your live inventory — no more copy-pasting hostnames.

### 📦 Firmware Tracker
> ⚠️ **Beta:** Firmware version tracking is manual entry only in this release. Automated version checking against vendor sources is on the roadmap.

Firmware lifecycle management across all devices:

- Log current firmware version per device.
- Mark devices as Current, Update Available, End of Life, Near EOL, or Unknown.
- Compliance rate shown on the dashboard.
- Bulk overview table for audit and planning.

### 🕵️ Audit Log
Automatic change history for every action:

- Every add, edit, delete, and import is logged with timestamp and user.
- Searchable and filterable by action type.
- Exportable for compliance records.

### 🔐 Multi-user with Encrypted Database
- On first launch, create a new `.json` database file at any path (local disk, network share, USB drive).
- Each user gets their own account with a bcrypt-style PBKDF2-SHA256 password (310,000 iterations, unique salt per user).
- All inventory data is encrypted at rest with **AES-256-GCM**.
- The app remembers the last database path and goes straight to the login screen on subsequent launches.
- Undo / Redo support for all data changes within a session.

### 🌗 Light & Dark Theme
Full dark and light theme with consistent colour semantics across all views, badges, and the topology canvas.

---

## Prerequisites

- **Node.js 18 or later** — [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node.js)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/udwije/LANVault.git
cd lanvault

# 2. Install dependencies
npm install

# 3. Run in development mode
npm start
```

The app window opens immediately. No build step required for development or testing.

---

## First Launch

1. The login screen appears. Click **"Create New Database"**.
2. Choose a location to save your encrypted `.json` file (e.g. `~/Documents/lanvault.json`).
3. Create your first user account with a username and password.
4. You're in — start adding devices.

On every subsequent launch the app loads the last database file automatically and goes straight to the user/password screen.

---

## Project Structure

```
lanvault/
├── main.js                  Electron main process
│                            (window management, tray, IPC, file dialogs,
│                             encryption/decryption, PBKDF2 key derivation)
├── preload.js               Secure context bridge (renderer ↔ Node.js)
├── electron-builder.yml     Build configuration for all platforms
├── package.json
├── assets/
│   ├── icon.ico             Windows icon  (256×256 px)
│   ├── icon.icns            macOS icon    (512×512 px)
│   └── icon.png             Linux icon    (512×512 px)
└── renderer/
    └── index.html           Entire LANVault UI (HTML + CSS + JS, single file)
```

The entire front-end lives in `renderer/index.html`. Edit it freely and run `npm start` to see changes immediately — no bundler, no watch script needed.

---

## Building for Distribution

Before building, add app icons to the `assets/` folder (see table above). The app runs without them but installers need them.

```bash
# Windows — produces a .exe NSIS installer in dist/
npm run build:win

# macOS — produces a .dmg and .zip in dist/
npm run build:mac

# Linux — produces .AppImage, .deb, and .rpm in dist/
npm run build:linux

# All platforms at once (best run on macOS for cross-platform signing)
npm run build:all
```

> **Note:** Building for macOS requires running on a Mac (Apple code-signing restrictions). Windows builds can be cross-compiled from Linux using Wine. Linux builds work on both Linux and macOS.

---

## Icon Resources

| File | Required size | Platform |
|---|---|---|
| `assets/icon.ico` | 256×256 | Windows |
| `assets/icon.icns` | 512×512 | macOS |
| `assets/icon.png` | 512×512 | Linux + fallback |

---

## Security Model

| Aspect | Implementation |
|---|---|
| Encryption | AES-256-GCM per user session |
| Key derivation | PBKDF2-SHA256, 310,000 iterations, unique random salt per user |
| Storage | Single `.json` file — all payload fields are ciphertext |
| At rest | File is unreadable without the correct password |
| In transit | N/A — fully offline, no network calls |
| Auto-save | Every change is immediately re-encrypted and written to disk |

The database file is portable — copy it to a USB drive or network share and open it from any machine running LANVault.

---

## Known Limitations (Beta)

- **Port Map visuals** — functional but UI polish is ongoing. Full redesign planned for v1.1.
- **Firmware version checking** — manual entry only in this release. Automated checks against vendor sources are on the roadmap.
- **No cloud sync** — intentional; bring your own file sync (Syncthing, OneDrive, SMB share).
- **No auto-update** — updates require replacing the app manually during this beta phase.
- **Single file concurrency** — simultaneous writes from two open instances of the app will cause the last write to win. For shared use, open the file from a network share one user at a time, or stagger writes.
- **macOS Gatekeeper** — unsigned builds will show a security warning on first launch. Right-click → Open to bypass, or sign the app with an Apple Developer certificate.
- **No mobile client** — desktop only.

---


## Frequently Asked Questions

**Can multiple people use the same database file simultaneously?**
Yes, if it's on a shared network drive. However, simultaneous writes are not merge-safe — the last save wins. For team use, coordinate who is editing at any given time, or open the file read-only if you only need to view data.

**What happens if I forget my password?**
There is no password recovery. The encryption key is derived solely from your password. Keep a backup of the database file and remember your password.

**Can I run this on a Raspberry Pi or NAS?**
If Node.js 18+ and Electron run on it, yes. For headless server use you would need a different approach — this is a desktop GUI app and requires a display.

**Is my data sent anywhere?**
No. LANVault makes zero network calls. All data stays in the file on your disk.

**The app shows a security warning on macOS — is it safe?**
Yes. Unsigned Electron apps trigger Gatekeeper on macOS. Right-click the app and choose "Open" to bypass the warning on first launch. Future releases will be signed with an Apple Developer certificate.

---

## License

Copyright 2026 — Released under the [Apache License 2.0](LICENSE).

You are free to use, modify, and distribute this software under the terms of the Apache 2.0 licence. See the [LICENSE](LICENSE) file for the full text.

---

## Acknowledgements

- [Electron](https://www.electronjs.org/) — cross-platform desktop framework
- [Phosphor Icons](https://phosphoricons.com/) — icon set used throughout the UI
- [electron-builder](https://www.electron.build/) — packaging and distribution
