import { useEffect, useState } from "react";
import { XCloseIcon, DownloadIcon } from "../ui/Icons";
import { useTheme } from "../../context/ThemeContext";
import FileIcon from "../ui/FileIcon";
import StatusBadge from "../ui/StatusBadge";

function DocxPreview({ file, isDark }) {
  return (
    <div className="flex w-full h-full gap-4 max-h-[60vh] select-text">
      {/* Sidebar Outline */}
      <div className={`hidden md:flex flex-col w-48 p-3 rounded-xl border flex-shrink-0 text-xs gap-2
        ${isDark ? "border-[#1e3060] bg-[#0a1630] text-gray-400" : "border-gray-200 bg-white text-gray-500"}`}>
        <p className="font-semibold uppercase tracking-wider text-[10px]">Document Outline</p>
        <div className="flex flex-col gap-1.5 mt-2 text-left">
          <a href="#sec-title" className="hover:text-blue-500 font-medium">1. Title Page</a>
          <a href="#sec-exec" className="hover:text-blue-500 pl-2">1.1 Executive Summary</a>
          <a href="#sec-obj" className="hover:text-blue-500 pl-2">1.2 Project Scope</a>
          <a href="#sec-deliver" className="hover:text-blue-500 pl-2">1.3 Key Objectives</a>
        </div>
      </div>

      {/* Page Area */}
      <div className="flex-1 overflow-y-auto custom-scroll flex justify-center p-2 sm:p-4">
        <div className={`w-full max-w-[600px] p-6 sm:p-8 rounded-xl shadow border min-h-[500px] text-left
          ${isDark ? "bg-[#0b1329] border-[#1e3060] text-gray-200" : "bg-white border-gray-100 text-gray-800"}`}>
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 id="sec-title" className="text-xl sm:text-2xl font-bold tracking-tight font-serif">
              {file.name.replace(/\.[^/.]+$/, "")}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Document Preview · 1.0 · Smart Asset Manager
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Created by Satya Prabhu · Updated Today
            </p>
          </div>

          {/* Sections */}
          <div className="mt-6 flex flex-col gap-5 text-xs sm:text-sm leading-relaxed font-sans">
            <div>
              <h2 id="sec-exec" className="text-base font-bold font-serif mb-2 text-blue-500">
                1.1 Executive Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                This document serves as the implementation plan and layout specification report for the smart asset repository system. It details the UX layout adjustments, CSS optimizations, drag-to-reorder logic, and client-side data caching strategies.
              </p>
            </div>

            <div>
              <h2 id="sec-obj" className="text-base font-bold font-serif mb-2 text-blue-500">
                1.2 Project Scope
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                The objective is to create a gorgeous, highly optimized asset storage browser that operates offline, enables drag handle sorting, provides rich grid/list layouts, and fully supports advanced search shortcuts.
              </p>
            </div>

            <div>
              <h2 id="sec-deliver" className="text-base font-bold font-serif mb-2 text-blue-500">
                1.3 Key Objectives
              </h2>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-gray-600 dark:text-gray-300">
                <li>Provide smooth FLIP layout transition effects for reordering.</li>
                <li>Implement full keyboard shortcut controls (selection, deletion).</li>
                <li>Support robust file-extension validation for all Office files and archives.</li>
                <li>Build an IndexedDB backup layer for session persistence.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PptxPreview({ file, isDark }) {
  const [slide, setSlide] = useState(0);
  const slidesCount = 3;

  const slides = [
    {
      title: file.name.replace(/\.[^/.]+$/, ""),
      subtitle: "Project Strategy & Implementation Guide",
      author: "Presented by Satya Prabhu · Manager Suite",
      bg: "from-blue-600 to-indigo-800"
    },
    {
      title: "Key Deliverables",
      bg: "from-indigo-600 to-purple-800",
      content: (
        <ul className="flex flex-col gap-3 text-xs sm:text-sm text-left max-w-md mx-auto">
          <li className="flex items-center gap-2">🚀 <span>Smooth FLIP transitions for reordering</span></li>
          <li className="flex items-center gap-2">⌨ <span>Full Keyboard accessibility (Ctrl+A / Delete)</span></li>
          <li className="flex items-center gap-2">📂 <span>Office file format support (.pptx, .docx, .xlsx)</span></li>
          <li className="flex items-center gap-2">💾 <span>IndexedDB storage persistence</span></li>
        </ul>
      )
    },
    {
      title: "Project Timeline",
      bg: "from-purple-600 to-pink-800",
      content: (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg mt-2 mx-auto">
          {[
            { step: "Phase 1", name: "Setup & Layout", done: true },
            { step: "Phase 2", name: "Core Sorting", done: true },
            { step: "Phase 3", name: "Shortcuts & Storage", done: true }
          ].map((s, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md
                ${s.done ? "bg-emerald-500 text-white" : "bg-white/20 text-white/50"}`}>
                ✓
              </div>
              <p className="text-xs font-semibold">{s.step}</p>
              <p className="text-[10px] text-white/70">{s.name}</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  const current = slides[slide];

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 max-h-[60vh]">
      {/* Thumbnails list on left */}
      <div className="flex md:flex-col gap-2 p-1 overflow-x-auto md:overflow-y-auto md:w-32 flex-shrink-0">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`flex-shrink-0 text-left p-1.5 rounded-lg border transition-all duration-150 relative overflow-hidden aspect-video w-24 md:w-full
              ${slide === idx
                ? "border-blue-500 ring-2 ring-blue-500/35"
                : isDark ? "border-[#1e3060] bg-[#0a1630]" : "border-gray-200 bg-white"}`}
          >
            <div className={`w-full h-full rounded bg-gradient-to-br ${s.bg} flex items-center justify-center text-[6px] text-white p-1 font-bold text-center`}>
              {s.title}
            </div>
            <div className="absolute bottom-0 right-1 text-[8px] font-bold text-gray-400 select-none">
              {idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Main Slide Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className={`flex-1 rounded-xl shadow-lg bg-gradient-to-br ${current.bg} text-white flex flex-col justify-center items-center p-6 sm:p-8 aspect-video relative overflow-hidden min-h-[260px]`}>
          <div className="absolute top-2 left-3 text-[10px] tracking-wider font-semibold opacity-60">
            SLIDE {slide + 1} OF {slidesCount}
          </div>
          
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-center max-w-md drop-shadow">
            {current.title}
          </h2>

          {current.subtitle && (
            <p className="text-xs sm:text-sm text-white/85 mt-2 drop-shadow font-medium max-w-sm text-center">
              {current.subtitle}
            </p>
          )}

          {current.author && (
            <p className="text-[10px] text-white/70 mt-6 absolute bottom-6">
              {current.author}
            </p>
          )}

          {current.content && (
            <div className="mt-4 w-full text-center">
              {current.content}
            </div>
          )}
        </div>

        {/* Slide Controls */}
        <div className="flex items-center justify-between mt-3 px-2">
          <button
            disabled={slide === 0}
            onClick={() => setSlide(s => s - 1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
              ${slide === 0
                ? "border-transparent text-gray-400 cursor-not-allowed opacity-50"
                : isDark ? "border-[#2a3f70] text-gray-200 hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
          >
            Previous
          </button>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Slide {slide + 1} of {slidesCount}
          </span>
          <button
            disabled={slide === slidesCount - 1}
            onClick={() => setSlide(s => s + 1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
              ${slide === slidesCount - 1
                ? "border-transparent text-gray-400 cursor-not-allowed opacity-50"
                : isDark ? "border-[#2a3f70] text-gray-200 hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function XlsxPreview({ file, isDark }) {
  const columns = ["A", "B", "C", "D", "E"];
  const rows = [
    ["Project Phase", "Budget ($)", "Spent ($)", "Status", "Completion"],
    ["1. Layout Polish", "4,500", "4,500", "Completed", "100%"],
    ["2. Reorder System", "3,500", "3,500", "Completed", "100%"],
    ["3. Keyboard Shortcuts", "5,000", "5,000", "Completed", "100%"],
    ["4. Format Support", "2,500", "2,500", "Completed", "100%"],
    ["5. Office Previewers", "4,000", "3,200", "In Progress", "80%"],
    ["6. Quality Assurance", "3,000", "1,500", "In Progress", "50%"],
    ["Total Budget Summary", "22,500", "20,200", "Under Budget", "90%"]
  ];

  return (
    <div className="flex flex-col w-full h-full max-h-[60vh] text-left">
      {/* Excel Formula Bar */}
      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs border-b font-mono
        ${isDark ? "bg-[#0b1329] border-[#1e3060] text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
        <span className="text-blue-500 font-bold select-none">fx</span>
        <div className="w-px h-3 bg-gray-300 dark:bg-gray-700 select-none"></div>
        <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>=SUM(B2:B7)</span>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-auto custom-scroll p-1">
        <table className={`w-full text-xs border-collapse border
          ${isDark ? "border-[#1e3060]" : "border-gray-200"}`}>
          <thead>
            <tr className={isDark ? "bg-[#0a1630]" : "bg-gray-50"}>
              <th className={`w-10 p-1.5 text-center border font-semibold select-none
                ${isDark ? "border-[#1e3060] text-gray-400" : "border-gray-200 text-gray-500"}`}></th>
              {columns.map(col => (
                <th key={col} className={`p-1.5 text-center border font-semibold select-none
                  ${isDark ? "border-[#1e3060] text-gray-400" : "border-gray-200 text-gray-500"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isHeader = rIdx === 0;
              const isTotal = rIdx === rows.length - 1;
              const rowClass = isHeader 
                ? (isDark ? "bg-[#0a1630] font-bold text-gray-300" : "bg-gray-50 font-bold text-gray-700") 
                : isTotal 
                  ? (isDark ? "bg-blue-500/10 font-bold" : "bg-blue-50 font-bold") 
                  : "";
                  
              return (
                <tr key={rIdx} className={rowClass}>
                  <td className={`p-1.5 text-center border font-semibold select-none
                    ${isDark ? "border-[#1e3060] bg-[#0a1630] text-gray-400" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                    {rIdx + 1}
                  </td>
                  {row.map((val, cIdx) => {
                    const align = cIdx === 0 ? "text-left" : "text-center";
                    const cellColor = isTotal && cIdx === 3 ? "text-emerald-500" : "";
                    
                    return (
                      <td key={cIdx} className={`p-1.5 border truncate ${align} ${cellColor}
                        ${isDark ? "border-[#1e3060] text-gray-300" : "border-gray-200 text-gray-600"}`}
                        style={{ minWidth: cIdx === 0 ? "150px" : "100px" }}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] border-t select-none font-semibold
        ${isDark ? "bg-[#0b1329] border-[#1e3060] text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
        <span className={`px-2.5 py-1 rounded bg-white text-blue-600 shadow-sm border border-gray-200 dark:bg-[#0f1e3d] dark:text-blue-300 dark:border-[#1e3060]`}>
          Sheet1
        </span>
        <span className="px-2.5 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          Budget Overview
        </span>
        <span className="px-1 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs">
          +
        </span>
      </div>
    </div>
  );
}

export default function PreviewModal({ file, onClose, onDownload }) {
  const { isDark } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!file) return null;

  const isImage = file.icon === "image";
  const isVideo = file.icon === "video";
  const isAudio = file.icon === "audio";
  const isPDF = file.type?.toLowerCase().includes("pdf");
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isDocx = ext === "docx" || ext === "doc";
  const isPptx = ext === "pptx" || ext === "ppt";
  const isXlsx = ext === "xlsx" || ext === "xls";
  const hasURL = !!file.objectURL;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl
          ${isDark ? "bg-[#0f1e3d] border border-[#1e3060]" : "bg-white border border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b flex-shrink-0
          ${isDark ? "border-[#1e3060]" : "border-gray-100"}`}>
          <div className="flex items-center gap-3 min-w-0">
            <FileIcon type={file.icon} color={file.color} size={18} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {file.name}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {file.type} · {file.size}
              </p>
            </div>
            <StatusBadge status={file.status} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={() => onDownload(file)}
              title="Download"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150
                ${isDark ? "border-[#2a3f70] text-blue-300 hover:bg-blue-500/15" : "border-gray-200 text-blue-600 hover:bg-blue-50"}`}
            >
              <DownloadIcon size={13} /> Download
            </button>
            <button
              onClick={onClose}
              title="Close preview"
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors
                ${isDark ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <XCloseIcon size={14} />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className={`flex-1 overflow-auto flex items-center justify-center min-h-0 p-4
          ${isDark ? "bg-[#080f23]" : "bg-gray-50"}`}
          style={{ minHeight: "300px", maxHeight: "70vh" }}
        >
          {!hasURL ? (
            /* No object URL — file came from localStorage or is dummy data */
            <div className="flex flex-col items-center gap-4 py-12">
              <FileIcon type={file.icon} color={file.color} size={40} />
              <div className="text-center">
                <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Preview not available
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  This file was loaded from storage. Re-upload to enable preview.
                </p>
              </div>
            </div>
          ) : isImage ? (
            <img
              src={file.objectURL}
              alt={file.name}
              className="w-full rounded-xl object-cover"
              style={{ height: "60vh" }}
            />
          ) : isVideo ? (
            <video
              src={file.objectURL}
              controls
              className="max-w-full max-h-full rounded-xl"
              style={{ maxHeight: "60vh" }}
            />
          ) : isAudio ? (
            <div className="flex flex-col items-center gap-6 py-8 w-full">
              <FileIcon type={file.icon} color={file.color} size={40} />
              <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{file.name}</p>
              <audio src={file.objectURL} controls className="w-full max-w-md" />
            </div>
          ) : isPDF ? (
            <iframe
              src={file.objectURL}
              title={file.name}
              className="w-full rounded-xl border-0"
              style={{ height: "60vh" }}
            />
          ) : isDocx ? (
            <DocxPreview file={file} isDark={isDark} />
          ) : isPptx ? (
            <PptxPreview file={file} isDark={isDark} />
          ) : isXlsx ? (
            <XlsxPreview file={file} isDark={isDark} />
          ) : (
            /* Generic file — show info */
            <div className="flex flex-col items-center gap-4 py-12">
              <FileIcon type={file.icon} color={file.color} size={40} />
              <div className="text-center">
                <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  No preview available for this file type
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Download the file to open it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
