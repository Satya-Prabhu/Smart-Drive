import { useRef, useState } from "react";
import FileIcon from "../ui/FileIcon";
import StatusBadge from "../ui/StatusBadge";
import { DownloadIcon, TrashIcon, DragHandleIcon } from "../ui/Icons";
import { useTheme } from "../../context/ThemeContext";
import useFlip from "../../hooks/useFlip";

function ActionBtn({ icon: Icon, label, onClick, danger, isDark }) {
  return (
    <button title={label} onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150
        ${danger ? "text-red-400 hover:bg-red-500/15"
          : isDark ? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
      <Icon size={16} />
    </button>
  );
}

export default function FileList({ files, selected, onToggle, onPreview, onDownload, onDelete, onReorder }) {
  const { isDark } = useTheme();
  const dragItem = useRef(null);
  const containerRef = useRef(null);
  const [draggableId, setDraggableId] = useState(null);

  const readPositions = useFlip(containerRef, files);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-reorder", "true");
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
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    dragItem.current = null;
    setDraggableId(null);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1 p-2 sm:p-3">
      {files.map((file, index) => {
        const isSelected = selected.includes(file.id);
        return (
          <div key={file.id}
            data-id={file.id}
            draggable={draggableId === file.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnterItem(e, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onClick={() => onPreview(file)}
            className={`group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-xl
              cursor-pointer border transition-all duration-150 select-none
              ${isSelected
                ? isDark ? "border-blue-500/50 bg-blue-500/10"
                  : "border-blue-400/40 bg-blue-50"
                : isDark ? "border-transparent hover:border-[#1e3060] hover:bg-white/[0.03]"
                  : "border-transparent hover:border-gray-200 hover:bg-gray-50"}`}
          >
            {/* Drag Handle */}
            <div
              className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150"
              onMouseDown={() => setDraggableId(file.id)}
              onMouseUp={() => setDraggableId(null)}
            >
              <DragHandleIcon size={16} />
            </div>

            {/* Animated checkbox */}
            <label className="anim-checkbox-wrap flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); onToggle(file.id); }}>
              <input type="checkbox" checked={isSelected} onChange={() => onToggle(file.id)} />
              <div className={`anim-checkbox-mark ${isDark ? "text-[#243358]" : "text-gray-300"}`} />
            </label>

            <div className="flex-shrink-0">
              <FileIcon type={file.icon} color={file.color} size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-xs sm:text-sm font-medium truncate
                ${isDark ? "text-gray-100" : "text-gray-800"}`}>{file.name}</p>
              <p className={`text-[11px] mt-0.5 truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {file.type} · {file.size} · {file.date}
              </p>
            </div>

            <div className="hidden sm:block flex-shrink-0">
              <StatusBadge status={file.status} />
            </div>

            <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
              <ActionBtn icon={DownloadIcon} label="Download" onClick={() => onDownload(file)} isDark={isDark} />
              <ActionBtn icon={TrashIcon} label="Delete" onClick={() => onDelete(file.id)} danger isDark={isDark} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
