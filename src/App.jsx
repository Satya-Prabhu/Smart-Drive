import { useState, useCallback, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import FilterBar    from "./components/FilterBar";
import EmptyLibrary from "./components/library/EmptyLibrary";
import UploadPanel  from "./components/UploadPanel";
import UploadButton from "./components/UploadButton";
import UploadQueue  from "./components/UploadQueue";
import FileList     from "./components/library/FileList";
import FileGrid     from "./components/library/FileGrid";
import SelectionBar from "./components/library/SelectionBar";
import PreviewModal from "./components/library/PreviewModal";
import { useUploadManager } from "./state/useUploadManager";

function Layout() {
  const { isDark } = useTheme();

  const [viewMode,     setViewMode]    = useState("list");
  const [filters,      setFilters]     = useState({ category: "All", status: "All", sort: "Newest" });
  const [searchQuery,  setSearchQuery] = useState("");
  const [selected,     setSelected]    = useState([]);
  const [previewFile,  setPreviewFile] = useState(null);
  const [isDragging,   setIsDragging]  = useState(false);
  const [dragCounter,  setDragCounter] = useState(0);

  const {
    library, queue, queueOpen, setQueueOpen,
    addFiles, cancelUpload, retryUpload,
    removeFromQueue, clearCompleted, deleteFile, reorderFiles,
  } = useUploadManager();

  const handleDragEnter = useCallback((e) => {
    const isInternalDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("application/x-reorder");
    if (isInternalDrag) return;
    const isFileDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files");
    if (!isFileDrag) return;
    e.preventDefault(); e.stopPropagation();
    setDragCounter(c => { if (c === 0) setIsDragging(true); return c + 1; });
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragCounter(c => { const n = c - 1; if (n <= 0) { setIsDragging(false); return 0; } return n; });
  }, []);

  const handleDragOver = useCallback((e) => {
    const isInternalDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("application/x-reorder");
    if (isInternalDrag) return;
    e.preventDefault(); e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    const isInternalDrag = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("application/x-reorder");
    if (isInternalDrag) return;
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false); setDragCounter(0);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  useEffect(() => {
    const handleWindowDragLeave = (e) => {
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false);
        setDragCounter(0);
      }
    };
    const handleWindowDrop = () => { setIsDragging(false); setDragCounter(0); };
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);
    return () => {
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  const filtered = library
    .filter(f => {
      if (filters.category !== "All" && f.category !== filters.category) return false;
      if (filters.status   !== "All" && f.status   !== filters.status)   return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.type?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "Name (A–Z)") return a.name.localeCompare(b.name);
      if (filters.sort === "Size") {
        const parse = s => parseFloat(s) * (s.includes("MB") ? 1024 : 1);
        return parse(b.size) - parse(a.size);
      }
      return 0;
    });

  const toggleSelect = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map(f => f.id));
    }
  };

  const handleDeleteSelected = () => {
    selected.forEach(id => deleteFile(id));
    setSelected([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (filtered.length > 0) {
          setSelected(prev => (prev.length === filtered.length ? [] : filtered.map(f => f.id)));
        }
      } else if (e.key === "Delete" || e.key === "Del") {
        if (selected.length > 0) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered, selected, handleDeleteSelected]);

  const handleDownload = file => {
    if (file.objectURL) {
      const a = document.createElement("a");
      a.href = file.objectURL; a.download = file.name; a.click();
    } else {
      alert(`"${file.name}" can be downloaded once re-uploaded this session.`);
    }
  };

  const handleDelete = id => {
    deleteFile(id);
    setSelected(s => s.filter(x => x !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  };

  const handleDownloadSelected = () =>
    selected.forEach(id => { const f = library.find(x => x.id === id); if (f) handleDownload(f); });

  const handleReorder = (fromIdx, toIdx) => {
    const fromId = filtered[fromIdx]?.id;
    const toId   = filtered[toIdx]?.id;
    if (!fromId || !toId) return;
    const libFrom = library.findIndex(x => x.id === fromId);
    const libTo   = library.findIndex(x => x.id === toId);
    if (libFrom >= 0 && libTo >= 0) reorderFiles(libFrom, libTo);
  };

  const activeCount = queue.filter(x => ["Idle","Validating","Uploading"].includes(x.status)).length;
  const bg = isDark ? "bg-[#080f23]" : "bg-[#e8eef8]";
  const libraryBorderColor = isDark
    ? isDragging ? "#3b82f6" : "#1a2744"
    : isDragging ? "#60a5fa" : "#e5e7eb";

  return (
    <div className={`h-screen flex flex-col ${bg} transition-colors duration-300`}>
      <div className="relative flex-1 min-h-0 flex flex-col w-full max-w-[1024px] mx-auto">

        <FilterBar
          viewMode={viewMode}       setViewMode={setViewMode}
          filters={filters}         setFilters={setFilters}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        />

        {selected.length > 0 && (
          <SelectionBar
            count={selected.length}
            total={filtered.length}
            onSelectAll={handleSelectAll}
            onDownload={handleDownloadSelected}
            onDelete={handleDeleteSelected}
            onClear={() => setSelected([])}
          />
        )}

        <div
          className="flex-1 min-h-0 px-3 sm:px-4 pb-4 flex flex-col"
          onDragEnter={handleDragEnter}
        >
          <div
            className={`relative flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? "bg-[#0d1b3e]" : "bg-gray-50"}`}
            style={{ border: `2px dashed ${libraryBorderColor}` }}
          >
            <div className="flex-1 overflow-y-auto flex flex-col custom-scroll">
              {filtered.length === 0
                ? <EmptyLibrary />
                : viewMode === "list"
                  ? <FileList   files={filtered} selected={selected}
                                onToggle={toggleSelect} onPreview={setPreviewFile}
                                onDownload={handleDownload} onDelete={handleDelete} onReorder={handleReorder} />
                  : <FileGrid   files={filtered} selected={selected}
                                onToggle={toggleSelect} onPreview={setPreviewFile}
                                onDownload={handleDownload} onDelete={handleDelete} onReorder={handleReorder} />
              }
            </div>

            <UploadPanel
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>
        </div>

        <UploadQueue
          queue={queue}
          isOpen={queueOpen}
          onCancel={cancelUpload}
          onRetry={retryUpload}
          onRemove={removeFromQueue}
          onClearCompleted={clearCompleted}
          onClose={() => setQueueOpen(false)}
        />

        <div className="absolute bottom-6 right-4 sm:right-6 z-50 inline-flex">
          <UploadButton onFiles={addFiles} queueCount={activeCount} />
        </div>
      </div>

      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
