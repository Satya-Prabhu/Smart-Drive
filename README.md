# Smart Asset Manager

A frontend file management application built with React and Tailwind CSS. Supports uploading, browsing, previewing, and deleting files — with persistent local storage, drag-and-drop, and light/dark theme support.

---

## Features

- **Upload files** — drag and drop onto the library area or use the upload button
- **Live upload queue** — progress tracking, speed display, cancel, and retry
- **File library** — browse uploaded assets in list or grid view
- **Search & filters** — filter by category, status, and sort order
- **Preview** — in-app preview for images, videos, audio, PDFs, and documents
- **Download & delete** — single or bulk actions with keyboard shortcuts
- **Drag to reorder** — rearrange files in the library via drag and drop
- **Light / Dark theme** — toggleable, persisted across sessions
- **Keyboard shortcuts** — `Ctrl+A` to select all, `Del` to delete selected

---

## Tech Stack

| Technology | Version |
|---|---|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3 |
| Font | DM Sans (Google Fonts) |

---

## Project Structure

```
src/
├── App.jsx                        # Root layout and state wiring
├── main.jsx                       # React entry point
├── index.css                      # Tailwind directives and global styles
│
├── context/
│   └── ThemeContext.jsx           # Light/dark mode state and toggle
│
├── hooks/
│   └── useFlip.js                 # FLIP animation hook for drag-reorder
│
├── services/
│   ├── uploadService.js           # File validation, metadata, upload simulation
│   └── storageService.js          # localStorage (metadata) + IndexedDB (binaries)
│
├── state/
│   └── useUploadManager.js        # Upload and library state management
│
└── components/
    ├── FilterBar.jsx               # Search, filter dropdowns, view mode, theme toggle
    ├── UploadButton.jsx            # Floating upload button with active badge
    ├── UploadPanel.jsx             # Drag-and-drop overlay
    ├── UploadQueue.jsx             # Upload progress panel
    │
    ├── ui/
    │   ├── Icons.jsx               # SVG icon components
    │   └── FileIcon.jsx            # File type icon resolver
    │
    └── library/
        ├── FileList.jsx            # List view with drag-to-reorder
        ├── FileGrid.jsx            # Grid view with drag-to-reorder
        ├── SelectionBar.jsx        # Bulk action bar (download, delete, clear)
        ├── EmptyLibrary.jsx        # Empty state UI
        └── PreviewModal.jsx        # In-app file preview modal
```

---

## Storage Architecture

File data is stored entirely in the browser — no backend required.

| Layer | Technology | Stores |
|---|---|---|
| Metadata | `localStorage` | File name, type, size, category, status |
| Binary | `IndexedDB` | Raw file blob (enables download after refresh) |

---

## Getting Started

**Install dependencies**
```bash
npm install
```

**Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Build for production**
```bash
npm run build
```

---

## Supported File Types

| Category | Formats |
|---|---|
| Pictures | PNG, JPG, GIF, WEBP, SVG |
| Documents | PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, RTF |
| Videos | MP4, WEBM, MOV, MKV |
| Audio | MP3, WAV, OGG, M4A |
| Archives | ZIP, RAR, 7Z, TAR, GZ |

Maximum file size: **50 MB**
