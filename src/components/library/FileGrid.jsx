import { useRef, useState } from "react";
import FileIcon from "../ui/FileIcon";
import StatusBadge from "../ui/StatusBadge";
import { DownloadIcon, TrashIcon, DragHandleIcon } from "../ui/Icons";
import { useTheme } from "../../context/ThemeContext";
import useFlip from "../../hooks/useFlip";

function ActionBtn({ icon: Icon, label, onClick, danger, isDark }) {
  return (
    <button title={label} onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150
        ${danger ? "text-red-400 hover:bg-red-500/20"
          : isDark ? "text-gray-400 hover:bg-white/15 hover:text-gray-200"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
      <Icon size={15} />
    </button>
  );
}

export default function FileGrid({ files, selected, onToggle, onPreview, onDownload, onDelete, onReorder }) {
  const { isDark } = useTheme();
  const dragItem = useRef(null); // index being dragged
  const containerRef = useRef(null);
  const [draggableId, setDraggableId] = useState(null);

  const readPositions = useFlip(containerRef, files);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-reorder", "true");
    // Slight delay so the ghost image captures before opacity change
    setTimeout(() => {
      if (e.target) e.target.style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnterItem = (e, index) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    readPositions();
    onReorder(dragItem.current, index);
    dragItem.current = index;
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    dragItem.current = null;
    setDraggableId(null);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3">
      {files.map((file, index) => {
        const isSelected = selected.includes(file.id);
        return (
          <div
            key={file.id}
            data-id={file.id}
            draggable={draggableId === file.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnterItem(e, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onClick={() => onPreview(file)}
            className={`group relative flex flex-col rounded-xl sm:rounded-2xl border
              cursor-pointer overflow-hidden transition-all duration-200 select-none
              ${isSelected
                ? isDark ? "border-blue-500/70 bg-blue-500/10 shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
                  : "border-blue-400 bg-blue-50 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]"
                : isDark ? "border-[#1e2f58] bg-[#0f1e3d] hover:border-[#2a3f70]"
                  : "border-border-muted bg-bg-light hover:border-blue-200 hover:shadow-md"}`}
          >
            {/* Thumbnail */}
            <div className={`relative flex items-center justify-center h-24 sm:h-32 md:h-36
              ${isDark ? "bg-[#0a1630]" : "bg-bg-dark"}`}>

              {/* Drag Handle — top-left corner */}
              <div
                className={`absolute top-2 left-2 z-10 transition-opacity duration-150 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing
                  ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                onMouseDown={() => setDraggableId(file.id)}
                onMouseUp={() => setDraggableId(null)}
              >
                <DragHandleIcon size={15} />
              </div>

              {file.objectURL && file.icon === "image" ? (
                <img src={file.objectURL} alt={file.name} className="w-full h-full object-cover" />
              ) : file.objectURL && file.icon === "video" ? (
                <video src={file.objectURL} muted className="w-full h-full object-cover" />
              ) : file.objectURL && file.type?.toLowerCase().includes("pdf") ? (
                <div className="w-full h-full overflow-hidden relative rounded-t-xl sm:rounded-t-2xl">
                  <iframe
                    src={file.objectURL + "#toolbar=0&navpanes=0&scrollbar=0&view=FitH"}
                    title={file.name}
                    className="absolute border-0 pointer-events-none select-none"
                    style={{
                      width: "calc(100% + 24px)",
                      height: "calc(100% + 24px)",
                      top: 0,
                      left: 0,
                    }}
                    scrolling="no"
                  />
                </div>
              ) : (
                <FileIcon type={file.icon} color={file.color} size={26} />
              )}

              {/* Checkbox — top-right corner */}
              <div
                className={`absolute top-2 right-2 z-10 transition-opacity duration-150
                  ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                <label
                  onClick={(e) => { e.stopPropagation(); onToggle(file.id); }}
                  className="anim-checkbox-wrap"
                >
                  <input type="checkbox" checked={isSelected} onChange={() => onToggle(file.id)} />
                  <div className={`anim-checkbox-mark ${isDark ? "text-gray-400" : "text-gray-300"}`} />
                </label>
              </div>
            </div>

            {/* Info */}
            <div className="px-2 sm:px-2.5 pt-2 pb-2 flex flex-col gap-1">
              {/* File name */}
              <p className={`text-[11px] sm:text-xs font-semibold truncate
                ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {file.name}
              </p>
              <p className={`text-[10px] sm:text-[11px] truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {file.size} · {file.date}
              </p>

              {/* Status badge + actions on same row */}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <div className="w-fit flex-shrink-0"><StatusBadge status={file.status} /></div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <ActionBtn icon={DownloadIcon} label="Download" onClick={() => onDownload(file)} isDark={isDark} />
                  <ActionBtn icon={TrashIcon} label="Delete" onClick={() => onDelete(file.id)} danger isDark={isDark} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
