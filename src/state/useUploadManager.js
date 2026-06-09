import { useState, useCallback, useRef, useEffect } from "react";
import { validateFile, simulateUpload, formatSize, getFileMetadata } from "../services/uploadService";
import { loadLibrary, saveLibrary, storeFileBlob, getFileBlob, deleteFileBlob } from "../services/storageService";

export function useUploadManager() {
  const [library,   setLibrary]   = useState(() => loadLibrary());
  const [queue,     setQueue]     = useState([]);
  const [queueOpen, setQueueOpen] = useState(false);

  const cancelsRef = useRef({});
  const queueRef   = useRef([]);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { saveLibrary(library); }, [library]);

  useEffect(() => {
    let active = true;
    async function restoreObjectURLs() {
      const storedLibrary = loadLibrary();
      if (storedLibrary.length === 0) return;
      const updated = [];
      for (const file of storedLibrary) {
        const blob = await getFileBlob(file.id);
        if (blob && active) {
          updated.push({ ...file, objectURL: URL.createObjectURL(blob) });
        } else {
          updated.push(file);
        }
      }
      if (active) setLibrary(updated);
    }
    restoreObjectURLs();
    return () => { active = false; };
  }, []);

  const runUpload = useCallback((itemId, sizeBytes) => {
    const cancel = simulateUpload(sizeBytes, {
      onProgress: ({ pct, speed, eta }) => {
        setQueue(q => q.map(x =>
          x.id === itemId
            ? { ...x, progress: pct, uploadSpeed: speed, timeRemaining: eta }
            : x
        ));
      },
      onComplete: () => {
        delete cancelsRef.current[itemId];
        const item = queueRef.current.find(x => x.id === itemId);
        if (item && item.status !== "Cancelled") {
          if (item._file) {
            storeFileBlob(item.id, item._file).catch(err => console.error(err));
          }
          setLibrary(lib => {
            if (lib.some(x => x.id === itemId)) return lib;
            return [{
              id: item.id, name: item.name, type: item.displayType,
              category: item.category, size: formatSize(item.sizeRaw),
              date: "Today", status: "Uploaded",
              color: item.color, icon: item.icon, objectURL: item.objectURL,
            }, ...lib];
          });
          setQueue(q => q.map(x => x.id === itemId
            ? { ...x, status: "Uploaded", progress: 100, uploadSpeed: null, timeRemaining: null }
            : x
          ));
        }
      },
    });
    cancelsRef.current[itemId] = cancel;
  }, []);

  const addFiles = useCallback((rawFiles) => {
    const taken = new Set([
      ...loadLibrary().map(f => f.name),
      ...queueRef.current
        .filter(q => !["Cancelled","Failed"].includes(q.status))
        .map(q => q.name),
    ]);

    const items = Array.from(rawFiles).map(file => {
      const meta  = getFileMetadata(file) ?? { category:"Other", icon:"archive", color:"#6366f1" };
      const error = validateFile(file, taken);
      taken.add(file.name);
      const id  = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const ext = file.name.split('.').pop()?.toUpperCase() ?? "FILE";
      return {
        id, name: file.name,
        displayType: ext + " file",
        fileType: file.type, category: meta.category, icon: meta.icon, color: meta.color,
        sizeRaw: file.size, size: formatSize(file.size),
        status: error ? "Failed" : "Idle", progress: 0, error,
        date: "Today",
        objectURL: !error ? URL.createObjectURL(file) : null,
        uploadSpeed: null, timeRemaining: null,
        _file: !error ? file : null,
      };
    });

    setQueue(q => [...q, ...items]);
    setQueueOpen(true);

    items.forEach(item => {
      if (item.status === "Failed") return;
      const id = item.id;
      setTimeout(() => setQueue(q => q.map(x => x.id===id ? {...x,status:"Validating"} : x)), 50);
      setTimeout(() => {
        setQueue(q => {
          const cur = q.find(x => x.id === id);
          if (!cur || cur.status === "Cancelled") return q;
          return q.map(x => x.id===id ? {...x,status:"Uploading"} : x);
        });
        setTimeout(() => runUpload(id, item.sizeRaw), 0);
      }, 750);
    });
  }, [runUpload]);

  const cancelUpload = useCallback((id) => {
    cancelsRef.current[id]?.();
    delete cancelsRef.current[id];
    setQueue(q => q.map(x =>
      x.id===id && ["Idle","Validating","Uploading"].includes(x.status)
        ? {...x, status:"Cancelled", progress:0, uploadSpeed:null, timeRemaining:null} : x
    ));
  }, []);

  const retryUpload = useCallback((id) => {
    const item = queueRef.current.find(x => x.id === id);
    if (!item?._file) return;
    const { sizeRaw } = item;
    setQueue(q => q.map(x => x.id===id ? {...x,status:"Idle",progress:0,error:null} : x));
    setTimeout(() => setQueue(q => q.map(x => x.id===id ? {...x,status:"Validating"} : x)), 50);
    setTimeout(() => {
      setQueue(q => {
        const cur = q.find(x => x.id===id);
        if (!cur || cur.status==="Cancelled") return q;
        return q.map(x => x.id===id ? {...x,status:"Uploading"} : x);
      });
      setTimeout(() => runUpload(id, sizeRaw), 0);
    }, 750);
  }, [runUpload]);

  const removeFromQueue = useCallback((id) => {
    cancelsRef.current[id]?.();
    delete cancelsRef.current[id];
    setQueue(q => q.filter(x => x.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue(q => q.filter(x => !["Uploaded","Cancelled","Failed"].includes(x.status)));
  }, []);

  const deleteFile = useCallback((id) => {
    setLibrary(f => f.filter(x => x.id !== id));
    deleteFileBlob(id).catch(err => console.error(err));
  }, []);

  const reorderFiles = useCallback((fromIndex, toIndex) => {
    setLibrary(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return {
    library, queue, queueOpen, setQueueOpen,
    addFiles, cancelUpload, retryUpload,
    removeFromQueue, clearCompleted, deleteFile, reorderFiles,
  };
}
