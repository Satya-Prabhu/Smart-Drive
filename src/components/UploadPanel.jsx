import { useTheme } from "../context/ThemeContext";
import { UploadCloudIcon } from "./ui/Icons";

export default function UploadPanel({ isDragging, onDragOver, onDragLeave, onDrop }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4
        transition-all duration-300 ease-in-out rounded-2xl
        ${isDragging ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        bg-bg-light/92`}
      style={{
        backdropFilter: "blur(6px)",
        border: isDragging
          ? `2px dashed ${isDark ? "rgba(59,130,246,0.7)" : "rgba(96,165,250,0.8)"}`
          : "2px dashed transparent",
        /* inset-0 already matches parent's rounded-2xl but we clip inside */
        margin: "0",
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={`flex items-center justify-center rounded-2xl w-20 h-20
        transition-all duration-300 ease-out ${isDragging ? "scale-110" : "scale-100"}
        ${isDark ? "bg-blue-950/40" : "bg-blue-50"}`}>
        <span className={`${isDark ? "text-blue-300" : "text-blue-600"} ${isDragging ? "scale-110" : "scale-100"} transition-transform duration-300`}>
          <UploadCloudIcon size={36} />
        </span>
      </div>
      <div className="text-center px-6">
        <p className="font-bold text-lg text-text">Drop files to upload</p>
        <p className={`text-sm mt-1 ${isDark ? "text-blue-300" : "text-blue-500"}`}>Release to add to your library</p>
      </div>
    </div>
  );
}
