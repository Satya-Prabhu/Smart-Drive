export const MAX_MB    = 50;
export const MAX_BYTES = MAX_MB * 1024 * 1024;

export const ALLOWED_TYPES = {
  "image/png":        { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "image/jpeg":       { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "image/gif":        { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "image/webp":       { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "image/svg+xml":    { category: "Pictures",  icon: "image",    color: "#a855f7" },

  "application/pdf":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/msword":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/vnd.ms-powerpoint":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/vnd.ms-excel":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      { category: "Documents", icon: "document", color: "#0ea5e9" },
  "text/plain":       { category: "Documents", icon: "document", color: "#0ea5e9" },
  "text/csv":         { category: "Documents", icon: "document", color: "#0ea5e9" },
  "application/rtf":  { category: "Documents", icon: "document", color: "#0ea5e9" },

  "video/mp4":        { category: "Videos",    icon: "video",    color: "#ec4899" },
  "video/webm":       { category: "Videos",    icon: "video",    color: "#ec4899" },
  "video/quicktime":  { category: "Videos",    icon: "video",    color: "#ec4899" },
  "video/x-matroska": { category: "Videos",    icon: "video",    color: "#ec4899" },

  "audio/mpeg":       { category: "Audio",     icon: "audio",    color: "#f97316" },
  "audio/wav":        { category: "Audio",     icon: "audio",    color: "#f97316" },
  "audio/ogg":        { category: "Audio",     icon: "audio",    color: "#f97316" },
  "audio/x-m4a":      { category: "Audio",     icon: "audio",    color: "#f97316" },

  "application/zip":                { category: "Other", icon: "archive", color: "#6366f1" },
  "application/x-zip-compressed":   { category: "Other", icon: "archive", color: "#6366f1" },
  "application/x-rar-compressed":   { category: "Other", icon: "archive", color: "#6366f1" },
  "application/vnd.rar":             { category: "Other", icon: "archive", color: "#6366f1" },
  "application/x-7z-compressed":    { category: "Other", icon: "archive", color: "#6366f1" },
  "application/x-tar":               { category: "Other", icon: "archive", color: "#6366f1" },
  "application/gzip":                { category: "Other", icon: "archive", color: "#6366f1" },
};

export const ALLOWED_EXTENSIONS = {
  "png":  { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "jpg":  { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "jpeg": { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "gif":  { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "webp": { category: "Pictures",  icon: "image",    color: "#a855f7" },
  "svg":  { category: "Pictures",  icon: "image",    color: "#a855f7" },

  "pdf":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "doc":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "docx": { category: "Documents", icon: "document", color: "#0ea5e9" },
  "ppt":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "pptx": { category: "Documents", icon: "document", color: "#0ea5e9" },
  "xls":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "xlsx": { category: "Documents", icon: "document", color: "#0ea5e9" },
  "txt":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "csv":  { category: "Documents", icon: "document", color: "#0ea5e9" },
  "rtf":  { category: "Documents", icon: "document", color: "#0ea5e9" },

  "mp4":  { category: "Videos",    icon: "video",    color: "#ec4899" },
  "webm": { category: "Videos",    icon: "video",    color: "#ec4899" },
  "mov":  { category: "Videos",    icon: "video",    color: "#ec4899" },
  "mkv":  { category: "Videos",    icon: "video",    color: "#ec4899" },

  "mp3":  { category: "Audio",     icon: "audio",    color: "#f97316" },
  "wav":  { category: "Audio",     icon: "audio",    color: "#f97316" },
  "ogg":  { category: "Audio",     icon: "audio",    color: "#f97316" },
  "m4a":  { category: "Audio",     icon: "audio",    color: "#f97316" },

  "zip":  { category: "Other",     icon: "archive",  color: "#6366f1" },
  "rar":  { category: "Other",     icon: "archive",  color: "#6366f1" },
  "7z":   { category: "Other",     icon: "archive",  color: "#6366f1" },
  "tar":  { category: "Other",     icon: "archive",  color: "#6366f1" },
  "gz":   { category: "Other",     icon: "archive",  color: "#6366f1" },
};

export function getFileMetadata(file) {
  if (file.type && ALLOWED_TYPES[file.type]) return ALLOWED_TYPES[file.type];
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext && ALLOWED_EXTENSIONS[ext]) return ALLOWED_EXTENSIONS[ext];
  return null;
}

export function formatSize(b) {
  if (b < 1024)    return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

export function formatSpeed(bps) {
  if (bps < 1024)    return `${Math.round(bps)} B/s`;
  if (bps < 1048576) return `${Math.round(bps/1024)} KB/s`;
  return `${(bps/1048576).toFixed(1)} MB/s`;
}

export function formatTime(sec) {
  return sec < 60 ? `${Math.ceil(sec)}s` : `${Math.floor(sec/60)}m ${Math.ceil(sec%60)}s`;
}

export function validateFile(file, takenNames) {
  const meta = getFileMetadata(file);
  if (!meta) return `File type "${file.type || "unknown"}" is not supported`;
  if (file.size > MAX_BYTES) return `Exceeds ${MAX_MB} MB limit (${formatSize(file.size)})`;
  if (takenNames.has(file.name)) return `"${file.name}" already exists in your library`;
  return null;
}

export function simulateUpload(sizeBytes, { onProgress, onComplete }) {
  const DURATION = Math.max(1500, Math.min(4000, sizeBytes / 15000));
  const TICK     = 150;
  const STEPS    = Math.ceil(DURATION / TICK);
  const STEP_PCT = 100 / STEPS;
  let ticks      = 0;
  const startedAt = Date.now();

  const id = setInterval(() => {
    ticks++;
    const pct     = Math.min(100, Math.round(ticks * STEP_PCT));
    const elapsed = (Date.now() - startedAt) / 1000;
    const done    = (pct / 100) * sizeBytes;
    const speed   = elapsed > 0 ? done / elapsed : 0;
    const eta     = speed > 0 && pct < 100 ? (sizeBytes - done) / speed : null;

    if (pct < 100) {
      onProgress({ pct, speed: formatSpeed(speed), eta: eta ? formatTime(eta) : null });
    } else {
      clearInterval(id);
      onComplete();
    }
  }, TICK);

  return () => clearInterval(id);
}
