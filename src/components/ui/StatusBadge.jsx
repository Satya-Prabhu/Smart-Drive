const cfg = {
  Uploaded:   { dot: "bg-green-400",  text: "text-green-500",  bg: "bg-green-500/10",  label: "Uploaded"   },
  Uploading:  { dot: "bg-blue-400",   text: "text-blue-400",   bg: "bg-blue-400/10",   label: "Uploading"  },
  Failed:     { dot: "bg-red-400",    text: "text-red-400",    bg: "bg-red-400/10",    label: "Failed"     },
  Validating: { dot: "bg-yellow-400", text: "text-yellow-400", bg: "bg-yellow-400/10", label: "Validating" },
  Cancelled:  { dot: "bg-gray-400",   text: "text-gray-400",   bg: "bg-gray-400/10",   label: "Cancelled"  },
};

export default function StatusBadge({ status }) {
  const s = cfg[status] || cfg.Uploaded;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
