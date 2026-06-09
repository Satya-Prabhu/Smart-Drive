# Smart Asset Manager

A fully client-side file management application built with **React 18**, **Vite 5**, and **Tailwind CSS 3**. Upload, browse, preview, and organize files entirely in the browser — no backend, no server, no account required.

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Architecture Overview](#architecture-overview)
3. [State Management Approach](#state-management-approach)
4. [Assumptions and Tradeoffs](#assumptions-and-tradeoffs)
5. [Future Improvements](#future-improvements)
6. [AI Usage Disclosure](#ai-usage-disclosure)

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Install and Run

```bash
# 1. Clone the repository
git clone <https://github.com/V7-AI-Hiring/satya-prabhu>
cd smart-asset-manager

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build the optimised production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |

> **No environment variables are required.** The app runs entirely in the browser with no API keys or backend configuration.

---

## Architecture Overview

```
src/
├── App.jsx                        # Root layout; wires all state and event handlers
├── main.jsx                       # React entry point
├── index.css                      # Tailwind directives and global styles
│
├── context/
│   └── ThemeContext.jsx           # Light/dark theme context + toggle
│
├── hooks/
│   └── useFlip.js                 # FLIP animation hook for smooth drag-reorder
│
├── services/
│   ├── uploadService.js           # File validation, metadata extraction, upload simulation
│   └── storageService.js          # localStorage (metadata) + IndexedDB (binary blobs)
│
├── state/
│   └── useUploadManager.js        # Central upload and library state (custom hook)
│
└── components/
    ├── FilterBar.jsx               # Search input, filter dropdowns, view toggle, theme toggle
    ├── UploadButton.jsx            # Floating upload FAB with active-upload badge
    ├── UploadPanel.jsx             # Full-screen drag-and-drop overlay
    ├── UploadQueue.jsx             # Upload progress panel (speed, ETA, cancel, retry)
    │
    ├── ui/
    │   ├── Icons.jsx               # Reusable SVG icon components
    │   └── FileIcon.jsx            # File-type icon resolver
    │
    └── library/
        ├── FileList.jsx            # List view with drag-to-reorder
        ├── FileGrid.jsx            # Grid view with drag-to-reorder
        ├── SelectionBar.jsx        # Bulk-action bar (download, delete, clear selection)
        ├── EmptyLibrary.jsx        # Empty state placeholder UI
        └── PreviewModal.jsx        # In-app preview for images, video, audio, PDF
```

### Data Flow

```
User action (drop / click upload)
        │
        ▼
  useUploadManager          ← central state hook
  ├── queue[]               ← in-flight uploads with progress / speed / ETA
  └── library[]             ← completed, persisted file metadata
        │
        ├─► storageService  ← persists to localStorage + IndexedDB
        └─► App.jsx         ← derives filtered view, passes down to components
```

### Storage Architecture

All data lives entirely in the browser — no server calls are made.

| Layer | Technology | What Is Stored |
|---|---|---|
| Metadata | `localStorage` (`sam_library_v2`) | Name, type, size, category, status, date |
| Binary blobs | `IndexedDB` (`sam_db_v2 / files_store`) | Raw `File` objects (enables download after page refresh) |
| Ephemeral URLs | `URL.createObjectURL()` | In-memory preview URLs, recreated from IndexedDB on mount |

On startup, the app reads metadata from `localStorage` and asynchronously restores `objectURL`s from `IndexedDB` so downloaded files remain accessible across sessions.

---

## State Management Approach

The project uses **React's built-in state primitives only** — no external state library (no Redux, Zustand, Jotai, etc.).

### `useUploadManager` — custom hook (central state)

Located in `src/state/useUploadManager.js`, this hook owns the two core state slices:

| State | Type | Purpose |
|---|---|---|
| `library` | `File[]` | Completed, persisted assets shown in the library |
| `queue` | `QueueItem[]` | Active / recent upload tasks with live progress |

Key design decisions:

- **`useRef` for cancel tokens** — upload cancellation functions are stored in `cancelsRef` (a plain object ref) rather than state to avoid triggering re-renders on every progress tick.
- **`queueRef` mirror** — a `useRef` copy of `queue` is kept in sync via `useEffect` so async upload callbacks can read the latest queue without closure-staleness issues.
- **Derived state in `App.jsx`** — filtering, sorting, and search results are computed inline from `library` on each render. No separate "filtered library" state is stored, avoiding sync issues.
- **`useEffect` for persistence** — `saveLibrary(library)` is called inside a `useEffect` whenever `library` changes, keeping storage writes decoupled from the update logic.

### `ThemeContext` — React Context

Light/dark mode is managed through a `ThemeProvider` wrapping the app root. The `isDark` boolean is stored in `localStorage` so the preference survives page reloads. Components access the theme via the `useTheme()` hook.

### Local UI state in `App.jsx`

Transient UI state (view mode, filters, search query, drag status, selection) lives in `useState` calls directly inside `App.jsx / Layout`. This keeps them co-located with the event handlers that drive them.

---

## Assumptions and Tradeoffs

### Assumptions

- **No authentication required.** The app is treated as a single-user, local tool. There is no concept of user accounts or shared files.
- **Upload simulation only.** `uploadService.js` simulates a timed upload with realistic speed and ETA values. No actual HTTP request is made; the file is written directly to IndexedDB.
- **Browser storage is sufficient.** The 50 MB per-file limit and the browser's IndexedDB quota are assumed to be acceptable constraints for the target use case.
- **Modern browser.** The app targets evergreen browsers (Chrome, Edge, Firefox, Safari). It relies on the Drag and Drop API, IndexedDB, `URL.createObjectURL`, and CSS features that are not available in legacy browsers.

### Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| **No backend** | Zero infrastructure, instant setup | Files exist only in one browser on one device; no sharing or cross-device sync |
| **localStorage for metadata** | Simple, synchronous reads on startup | Susceptible to storage quota limits; key collisions if app is opened in multiple tabs |
| **Simulated upload** | Realistic UX without a server | Does not exercise real network conditions or server-side validation |
| **Tailwind CSS** | Rapid styling, consistent utility classes | Larger HTML attribute verbosity; harder to scan styles at a glance |
| **Flat component tree / no router** | Simple single-page layout | Would require significant refactoring to add multi-page navigation |
| **FLIP for drag animation** | Smooth reorder animation with minimal DOM thrash | Hook complexity; limited to the list/grid views and not reusable for other contexts |
| **`objectURL` restored from IndexedDB** | Downloads work after page refresh | Adds async latency on app mount; `objectURL`s must be manually revoked to prevent memory leaks (not currently implemented) |

---

## Future Improvements

### Core Functionality
- **Real upload backend** — integrate a REST or GraphQL API (e.g., S3 pre-signed URLs) to replace the simulated upload with actual file transfer.
- **Multi-user / cloud sync** — store files in a cloud provider so the library is available across devices and shareable with collaborators.
- **Folder support** — allow creating folders and drag-files-into-folders to support hierarchical organisation.
- **Rename files** — inline editing of file names directly in the library.

### UX Enhancements
- **Pagination or virtualised list** — `react-virtual` or similar to handle libraries with thousands of files without DOM bloat.
- **Undo/redo** — revert accidental deletes or reorders.
- **Bulk download as ZIP** — use a client-side library (e.g., `jszip`) to package selected files into a single archive.
- **Right-click context menu** — contextual actions on files without cluttering the primary UI.
- **Accessibility audit** — full ARIA label coverage, keyboard-accessible drag-and-drop, focus management in modals.

### Technical Improvements
- **`objectURL` cleanup** — revoke `URL.createObjectURL()` URLs when files are deleted or when the component unmounts to prevent memory leaks.
- **Tab synchronisation** — use the `storage` event or `BroadcastChannel` API to keep state in sync when the app is open in multiple tabs.
- **Unit & integration tests** — add Vitest + React Testing Library coverage for `useUploadManager`, `storageService`, and key components.
- **TypeScript migration** — add static types to improve maintainability and developer experience.
- **Progressive Web App (PWA)** — add a service worker and web app manifest to enable offline use and home-screen installation.

---

## AI Usage Disclosure

AI tools were used during the development of this project in the following ways:

- **Code generation assistance** — Claude.ai / ChatGPT - based tools were consulted to scaffold boilerplate (hook structure, component templates) and to suggest idiomatic React patterns.
- **Debugging** — AI suggestions were used to diagnose issues with the `dragCounter` approach for detecting drag-leave across nested elements, and the `queueRef` pattern for avoiding stale closures in async upload callbacks.
- **Documentation** — This README was drafted with AI assistance and reviewed and edited manually to accurately reflect the actual implementation.

All AI-generated output was reviewed, tested, and modified as needed by the developer. No code was blindly copied without understanding and verification.

---

## Features at a Glance

| Feature | Details |
|---|---|
| Upload | Drag & drop anywhere on the library, or click the floating upload button |
| Upload queue | Live progress bar, upload speed (KB/s – MB/s), ETA, cancel, and retry |
| File library | List or grid view; drag rows/cards to reorder |
| Search | Real-time name / type / category search |
| Filters | Category (Pictures, Documents, Videos, Audio, Archives) and Status |
| Sort | Newest first, Name A–Z, Size (largest first) |
| Preview | In-app modal for images, video, audio, PDFs |
| Bulk actions | Select all (`Ctrl+A`), delete selected (`Del`), download selected |
| Theme | Light / dark mode, persisted across sessions |
| Persistence | Metadata in `localStorage`; binaries in `IndexedDB` |

## Supported File Types

| Category | Formats |
|---|---|
| Pictures | PNG, JPG, GIF, WEBP, SVG |
| Documents | PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, RTF |
| Videos | MP4, WEBM, MOV, MKV |
| Audio | MP3, WAV, OGG, M4A |
| Archives | ZIP, RAR, 7Z, TAR, GZ |

**Maximum file size: 50 MB**
