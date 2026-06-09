import { InboxIcon } from "../ui/Icons";
import { useTheme } from "../../context/ThemeContext";

export default function EmptyLibrary() {
  const { isDark } = useTheme();
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12 select-none">
      <span className={`transition-colors duration-300 ${isDark ? "text-gray-600" : "text-gray-300"}`}>
        <InboxIcon size={48} />
      </span>
      <div className="text-center">
        <p className={`font-bold text-base transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
          Your library is empty
        </p>
        <p className={`text-sm mt-1 transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Drop files here, or pick from your device
        </p>
      </div>
    </div>
  );
}
