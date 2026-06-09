import { useState, useRef, useEffect } from "react";
import { XCloseIcon, UploadCloudIcon } from "./ui/Icons";
import { useTheme } from "../context/ThemeContext";
import FileIcon from "./ui/FileIcon";

const STATUS_CFG = {
  Idle:       { label: "Queued",     textColor: "text-gray-400",   barColor: "bg-gray-400"   },
  Validating: { label: "Validating", textColor: "text-yellow-400", barColor: "bg-yellow-400" },
  Uploading:  { label: "Uploading",  textColor: "text-blue-400",   barColor: "bg-blue-500"   },
  Uploaded:   { label: "Uploaded",   textColor: "text-green-400",  barColor: "bg-green-500"  },
  Failed:     { label: "Failed",     textColor: "text-red-400",    barColor: "bg-red-500"    },
  Cancelled:  { label: "Cancelled",  textColor: "text-gray-500",   barColor: "bg-gray-600"   },
};

function QueueItem({ item, onCancel, onRetry, onRemove, isDark }) {
  const cfg      = STATUS_CFG[item.status] ?? STATUS_CFG.Idle;
  const isActive = ["Uploading", "Validating", "Idle"].includes(item.status);
  const isDone   = item.status === "Uploaded";
  const isFailed = item.status === "Failed" || item.status === "Cancelled";

  return (
    <div className={`px-3 py-2.5 border-b last:border-b-0 ${isDark ? "border-[#1e3060]" : "border-gray-100"}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">
          <FileIcon type={item.icon} color={item.color} size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-xs font-medium truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {item.name}
            </p>
            <span className={`text-[10px] font-semibold flex-shrink-0 ${cfg.textColor}`}>
              {cfg.label}
            </span>
          </div>

          <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {item.size}
            {item.uploadSpeed   && ` · ${item.uploadSpeed}`}
            {item.timeRemaining && ` · ${item.timeRemaining} left`}
          </p>

          {(isActive || isDone) && (
            <>
              <div className={`mt-1.5 h-1 rounded-full overflow-hidden ${isDark ? "bg-[#1e3060]" : "bg-gray-100"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-200 ${cfg.barColor}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              {item.status === "Uploading" && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {item.progress}%
                </p>
              )}
            </>
          )}

          {item.error && (
            <p className="text-[10px] text-red-400 mt-1 leading-snug">{item.error}</p>
          )}
        </div>

        <div className="flex-shrink-0 flex gap-1 items-center">
          {isActive && item.status !== "Idle" && (
            <button onClick={() => onCancel(item.id)}
              className={`text-[10px] px-1.5 py-1 rounded-lg border transition-colors
                ${isDark ? "border-[#2a3f70] text-gray-400 hover:text-red-400 hover:border-red-500/40"
                         : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300"}`}>
              Cancel
            </button>
          )}
          {isFailed && item._file && (
            <button
              onClick={() => onRetry(item.id)}
              title="Retry upload"
              className="w-6 h-6 flex items-center justify-center rounded-lg border border-blue-500/40
                text-blue-400 hover:bg-blue-500/10 transition-colors text-sm font-bold leading-none">
              ↺
            </button>
          )}
          {(isFailed || isDone) && (
            <button onClick={() => onRemove(item.id)} title="Remove"
              className={`w-5 h-5 flex items-center justify-center rounded-lg transition-colors
                ${isDark ? "text-gray-600 hover:text-gray-300 hover:bg-white/10"
                         : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"}`}>
              <XCloseIcon size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UploadQueue({ queue, isOpen, onCancel, onRetry, onRemove, onClearCompleted, onClose }) {
  const { isDark } = useTheme();
  const [minimized, setMinimized] = useState(false);
  const listRef = useRef(null);
  const prevLengthRef = useRef(queue.length);

  const activeCount    = queue.filter(x => ["Idle","Validating","Uploading"].includes(x.status)).length;
  const completedCount = queue.filter(x => ["Uploaded","Failed","Cancelled"].includes(x.status)).length;

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (queue.length > prevLengthRef.current && listRef.current && !minimized) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    prevLengthRef.current = queue.length;
  }, [queue.length, minimized]);

  if (!isOpen || queue.length === 0) return null;

  const handleHeaderClose = () => {
    if (completedCount > 0) {
      onClearCompleted();
    } else {
      onClose();
    }
  };

  const headerCloseTitle = completedCount > 0 ? "Clear done" : "Close";

  return (
    <div className={`absolute bottom-20 right-4 sm:right-6 z-40
      w-72 sm:w-80 rounded-2xl border shadow-2xl overflow-hidden
      ${isDark ? "bg-[#0f1e3d] border-[#1e3060]" : "bg-gray-50 border-gray-200"}`}>

      <div className={`flex items-center justify-between px-3 py-2.5 border-b
        ${isDark ? "border-[#1e3060] bg-[#0d1b3e]" : "border-gray-100 bg-gray-50"}`}>
        <div className="flex items-center gap-2">
          <UploadCloudIcon size={15} className={isDark ? "text-blue-400" : "text-blue-600"} />
          <span className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            Uploads
          </span>
          {activeCount > 0 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(m => !m)} title={minimized ? "Expand" : "Minimize"}
            className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-bold
              ${isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-400 hover:bg-gray-100"}`}>
            {minimized ? "▲" : "▼"}
          </button>
          <button onClick={handleHeaderClose} title={headerCloseTitle}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors
              ${isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-400 hover:bg-gray-100"}`}>
            <XCloseIcon size={10} />
          </button>
        </div>
      </div>

      {!minimized && (
        <div ref={listRef} className="max-h-64 overflow-y-auto custom-scroll">
          {queue.map(item => (
            <QueueItem key={item.id} item={item}
              onCancel={onCancel} onRetry={onRetry} onRemove={onRemove} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
}
