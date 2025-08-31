import { Menu, Settings, Moon, Sun } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { preferences } = state;

  const toggleTheme = () => {
    const newTheme = preferences.theme === "dark" ? "light" : "dark";
    dispatch({
      type: "SET_PREFERENCES",
      payload: { ...preferences, theme: newTheme },
    });
  };

  const handleSettingsClick = () => {
    dispatch({ type: "SET_VIEW", payload: "settings" });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Menu */}
          <div className="flex items-center space-x-2">
            {/* Hamburger menu sur mobile */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo et nom */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <span className="text-sm font-bold text-white">CT</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                CycleTracker
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {preferences.theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 text-gray-600 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
