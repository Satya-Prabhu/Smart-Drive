import { DownloadIcon, TrashIcon, XCloseIcon } from "../ui/Icons";
import { useTheme } from "../../context/ThemeContext";

export default function SelectionBar({ count, total, onSelectAll, onDownload, onDelete, onClear }) {
  const { isDark } = useTheme();
  if (count === 0) return null;

  const allSelected = count === total;

  return (
    <div className={`flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 mx-3 sm:mx-4 mb-2
      rounded-2xl border transition-all duration-300
      ${isDark ? "bg-[#0f1e3d] border-[#1e3060]" : "bg-gray-50 border-gray-200 shadow-sm"}`}>

      <div className="flex items-center gap-2 flex-shrink-0">
        <label
          className="anim-checkbox-wrap"
          title={allSelected ? "Deselect all" : "Select all"}
          onClick={(e) => { e.preventDefault(); onSelectAll(); }}
        >
          <input type="checkbox" checked={allSelected} onChange={onSelectAll} />
          <div className={`anim-checkbox-mark ${isDark ? "text-[#1e3060]" : "text-gray-300"}`} />
        </label>

        <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {count} selected
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={onDownload} title="Download selected"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl
            text-xs font-semibold border transition-all duration-150
            ${isDark
              ? "border-[#2a3f70] text-blue-300 hover:bg-blue-500/15 hover:border-blue-500/50"
              : "border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            }`}>
          <DownloadIcon size={12} />
          <span className="hidden xs:inline">Download</span>
        </button>

        <button onClick={onDelete} title="Delete selected"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl
            text-xs font-semibold border border-red-500/40 text-red-400 bg-red-500/10
            hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-150">
          <TrashIcon size={12} />
          <span className="hidden xs:inline">Delete</span>
        </button>

        <div className={`w-px h-4 flex-shrink-0 ${isDark ? "bg-[#1e3060]" : "bg-gray-200"}`} />

        <button onClick={onClear} title="Clear selection"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium
            border border-transparent transition-all duration-150
            ${isDark ? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
                     : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
          <XCloseIcon size={12} />
          <span className="hidden xs:inline">Clear</span>
        </button>
      </div>
    </div>
  );
}
