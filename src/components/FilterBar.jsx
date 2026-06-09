import { useState, useRef, useEffect, useCallback } from "react";
import { SearchIcon, ChevronDownIcon, ListIcon, GridIcon, MoonIcon, SunIcon, CheckIcon } from "./ui/Icons";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = {
  Category: ["All", "Pictures", "Documents", "Videos", "Audio", "Other"],
  Status: ["All", "Uploading", "Uploaded", "Failed", "Validating", "Cancelled"],
  Sort: ["Newest", "Name (A–Z)", "Size"],
};

function Dropdown({ label, options, value, onChange }) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setFocusedIdx(-1); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Scroll focused item into view
  useEffect(() => {
    if (open && focusedIdx >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIdx];
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIdx, open]);

  // Set focus to current value when opening
  const handleOpen = () => {
    const idx = options.indexOf(value);
    setFocusedIdx(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  const handleKeyDown = useCallback((e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); handleOpen(); }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIdx >= 0) { onChange(options[focusedIdx]); setOpen(false); setFocusedIdx(-1); }
        break;
      case "Escape":
      case "Tab":
        setOpen(false); setFocusedIdx(-1);
        break;
      default: break;
    }
  }, [open, focusedIdx, options, onChange]);

  const triggerClass = `
    relative flex items-center gap-1 px-3 h-10 rounded-xl text-sm cursor-pointer select-none
    whitespace-nowrap flex-shrink-0 outline-none border transition-all duration-200
    ${isDark
      ? open ? "bg-[#1a2744] text-gray-100 border-blue-500/60"
        : "bg-[#1a2744] text-gray-200 border-[#2a3a5c] hover:border-blue-500/40 hover:bg-[#1f2f52]"
      : open ? "bg-gray-50 text-gray-800 border-blue-400 shadow-md"
        : "bg-gray-50 text-gray-700 border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md"
    }`;

  const menuClass = `
    absolute top-[calc(100%+6px)] left-0 z-50 min-w-[160px] rounded-xl overflow-hidden
    border shadow-xl transition-all duration-200 origin-top
    ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
    ${isDark ? "bg-[#0f1e3d] border-[#1e3060]" : "bg-gray-50 border-gray-200"}`;

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        className={triggerClass}
        onClick={() => open ? (setOpen(false), setFocusedIdx(-1)) : handleOpen()}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Filter by ${label}`}
      >
        <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}:</span>
        <span className="font-bold ml-0.5">{value}</span>
        <ChevronDownIcon size={13} className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={menuClass} role="listbox">
        <ul ref={listRef} className="py-1.5">
          {options.map((opt, i) => {
            const isActive = opt === value;
            const isFocused = i === focusedIdx;
            return (
              <li key={opt} role="option" aria-selected={isActive}>
                <button
                  onMouseEnter={() => setFocusedIdx(i)}
                  onClick={() => { onChange(opt); setOpen(false); setFocusedIdx(-1); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors duration-100
                    ${isFocused
                      ? isDark ? "bg-[#1a3a6e] text-white" : "bg-blue-50 text-blue-700"
                      : isActive
                        ? isDark ? "bg-[#162f5c] text-white" : "bg-blue-50/60 text-blue-600"
                        : isDark ? "text-gray-200 hover:bg-[#1a2a4e]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{opt}</span>
                  {isActive && <CheckIcon size={14} className={isDark ? "text-blue-400" : "text-blue-500"} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function FilterBar({ viewMode, setViewMode, filters, setFilters, searchQuery, setSearchQuery }) {
  const { isDark, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  const iconBtn = (active, tooltip) => ({
    className: `w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${active ? "bg-blue-600 text-white"
        : isDark ? "text-gray-400 hover:bg-[#243358]" : "text-gray-500 hover:bg-gray-100"}`,
    title: tooltip,
  });

  return (
    <div className="flex flex-col gap-2.5 px-4 pt-4 pb-3 flex-shrink-0">
      {/* Row 1: Title · Theme · List/Grid */}
      <div className="flex items-center justify-between gap-3">
        <h1 className={`font-bold text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
          Your files
        </h1>
        <div className="flex items-center gap-3">
          <label
            className={`theme-toggle rounded-xl border transition-all duration-200
              ${isDark ? "bg-[#1a2744] border-[#2a3a5c] hover:border-blue-500/40"
                : "bg-gray-50 border-gray-200 shadow-sm hover:border-blue-300"}`}
            title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
          >
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <svg viewBox="0 0 20 20" fill="currentColor" stroke="none"
              className={isDark ? "text-amber-400" : "text-gray-500"}>
              <mask id="tm-moon-mask">
                <rect x="0" y="0" width="20" height="20" fill="white" />
                <circle cx="11" cy="3" r="8" fill="black" />
              </mask>
              <circle className="sun-moon" cx="10" cy="10" r="8" mask="url(#tm-moon-mask)" />
              <g>
                <circle className="sun-ray sun-ray-1" cx="18" cy="10" r="1.5" />
                <circle className="sun-ray sun-ray-2" cx="14" cy="16.928" r="1.5" />
                <circle className="sun-ray sun-ray-3" cx="6" cy="16.928" r="1.5" />
                <circle className="sun-ray sun-ray-4" cx="2" cy="10" r="1.5" />
                <circle className="sun-ray sun-ray-5" cx="6" cy="3.1718" r="1.5" />
                <circle className="sun-ray sun-ray-6" cx="14" cy="3.1718" r="1.5" />
              </g>
            </svg>
          </label>
          <div className={`flex items-center gap-0.5 p-1 rounded-xl border transition-colors duration-300
            ${isDark ? "bg-[#1a2744] border-[#2a3a5c]" : "bg-gray-50 border-gray-200 shadow-sm"}`}>
            <button {...iconBtn(viewMode === "list", "List view")} onClick={() => setViewMode("list")}><ListIcon size={17} /></button>
            <button {...iconBtn(viewMode === "grid", "Grid view")} onClick={() => setViewMode("grid")}><GridIcon size={17} /></button>
          </div>
        </div>
      </div>

      {/* Row 2: Search — full width */}
      <div className={`flex items-center gap-2 px-3 h-10 rounded-xl text-sm w-full border transition-all duration-200
        ${searchFocused
          ? isDark ? "bg-[#1a2744] border-blue-500/70 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
            : "bg-gray-50 border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
          : isDark ? "bg-[#1a2744] border-[#2a3a5c] hover:border-blue-500/30"
            : "bg-gray-50 border-gray-200 shadow-sm hover:border-blue-300"
        }`}>
        <SearchIcon size={15} className={`flex-shrink-0 ${isDark ? "text-gray-300" : "text-gray-400"}`} />
        <input
          type="text"
          placeholder="Search files"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`flex-1 bg-transparent outline-none text-sm
            ${isDark ? "text-gray-200 placeholder:text-gray-500" : "text-gray-700 placeholder:text-gray-400"}`}
        />
      </div>

      {/* Row 3: Filter dropdowns */}
      <div className="flex flex-wrap gap-2">
        <Dropdown label="Category" options={OPTIONS.Category} value={filters.category} onChange={(v) => setFilters((f) => ({ ...f, category: v }))} />
        <Dropdown label="Status" options={OPTIONS.Status} value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} />
        <Dropdown label="Sort" options={OPTIONS.Sort} value={filters.sort} onChange={(v) => setFilters((f) => ({ ...f, sort: v }))} />
      </div>
    </div>
  );
}
