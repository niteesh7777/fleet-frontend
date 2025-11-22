import { useThemeStore } from "../../store/themeStore";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect } from "react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Toggle Theme"
        >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
    );
}
