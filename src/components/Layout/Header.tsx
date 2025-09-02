import { Settings, Sun, Moon } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export function Header() {
  const { state, dispatch } = useApp();
  const { preferences } = state;

  const toggleTheme = () => {
    const newTheme = preferences.theme === "dark" ? "light" : "dark";
    dispatch({
      type: "SET_PREFERENCES",
      payload: { ...preferences, theme: newTheme },
    });
  };

  return (
    <header className="items-center justify-between hidden px-4 py-3 bg-white border-b border-gray-200 shadow-sm md:flex dark:bg-gray-900 dark:border-gray-700">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Cycle Tracker
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-primary-600"
        >
          {preferences.theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button className="text-gray-600 dark:text-gray-300 hover:text-primary-600">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
