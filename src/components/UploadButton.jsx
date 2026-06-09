import { useRef } from "react";
import { UploadCloudIcon } from "./ui/Icons";
import { useTheme } from "../context/ThemeContext";

/**
 * UploadButton
 * Triggers a hidden file input for both single files and folders.
 * Calls onFiles(FileList) when user selects files.
 */
export default function UploadButton({ onFiles, queueCount = 0 }) {
  const { isDark } = useTheme();
  const fileInputRef   = useRef(null);
  const folderInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files?.length) {
      onFiles(e.target.files);
      e.target.value = ""; // reset so same file can be picked again
    }
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={fileInputRef}   type="file" multiple  onChange={handleChange} className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.rtf,.zip,.rar,.7z,.tar,.gz" />
      <input ref={folderInputRef} type="file" webkitdirectory="true" multiple onChange={handleChange} className="hidden" />

      <button
        onClick={() => fileInputRef.current?.click()}
        title="Upload files to your library"
        className={`relative flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm
          border shadow-lg transition-all duration-200 active:scale-95
          ${isDark
            ? "bg-[#1a2744] text-white border-[#2a3a5c] hover:bg-[#1f3060] hover:border-blue-500/50"
            : "bg-[#0f2d6b] text-white border-transparent hover:bg-[#1a3d7c]"
          }`}
      >
        <UploadCloudIcon size={18} />
        Upload
        {/* Badge showing active upload count */}
        {queueCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
            {queueCount > 9 ? "9+" : queueCount}
          </span>
        )}
      </button>
    </>
  );
}
