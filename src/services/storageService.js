const KEY = "sam_library_v2";

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveLibrary(files) {
  try {
    localStorage.setItem(KEY, JSON.stringify(
      files.map(({ objectURL, _file, ...rest }) => rest)
    ));
  } catch { /* storage quota exceeded */ }
}

const DB_NAME    = "sam_db_v2";
const STORE_NAME = "files_store";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror  = (e) => reject(e.target.error);
  });
}

export async function storeFileBlob(id, file) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction([STORE_NAME], "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req   = store.put(file, id);
      req.onsuccess = () => resolve();
      req.onerror   = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("Failed to save file to IndexedDB", err);
  }
}

export async function getFileBlob(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction([STORE_NAME], "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req   = store.get(id);
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror   = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("Failed to load file from IndexedDB", err);
    return null;
  }
}

export async function deleteFileBlob(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction([STORE_NAME], "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req   = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("Failed to delete file from IndexedDB", err);
  }
}
