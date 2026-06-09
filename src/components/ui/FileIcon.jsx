import { DocumentIcon, ImageIcon, VideoIcon, AudioIcon, ArchiveIcon } from "./Icons";

const iconMap = {
  document: DocumentIcon,
  image: ImageIcon,
  video: VideoIcon,
  audio: AudioIcon,
  archive: ArchiveIcon,
};

export default function FileIcon({ type, color, size = 26 }) {
  const Icon = iconMap[type] || DocumentIcon;
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ width: size * 2, height: size * 2, backgroundColor: color + "22" }}
    >
      <span style={{ color }}><Icon size={size} /></span>
    </div>
  );
}
