import { Home, Calendar, Settings, Sun, Moon, Circle } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import type { View } from "../../contexts/AppContext";

export function BottomNav() {
  const { state, dispatch } = useApp();
  const { preferences, currentView } = state;

  const setView = (view: View) => {
    dispatch({ type: "SET_VIEW", payload: view });
  };

  const toggleTheme = () => {
    const newTheme = preferences.theme === "dark" ? "light" : "dark";
    dispatch({
      type: "SET_PREFERENCES",
      payload: { ...preferences, theme: newTheme },
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700 md:hidden">
      <div className="flex items-center justify-around h-14">
        <button
          onClick={() => setView("home")}
          className={`flex flex-col items-center text-xs ${
            currentView === "home"
              ? "text-primary-600"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Home className="w-5 h-5" />
          {/* Tableau de bord */}
        </button>

        <button
          onClick={() => setView("calendar")}
          className={`flex flex-col items-center text-xs ${
            currentView === "calendar"
              ? "text-primary-600"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Circle className="w-5 h-5" />
          Cycle
        </button>

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          <Calendar className="w-5 h-5" />
          Calendrier
        </button>

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          {preferences.theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          Thème
        </button>

        <button
          onClick={() => setView("settings")}
          className={`flex flex-col items-center text-xs ${
            currentView === "settings"
              ? "text-primary-600"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Settings className="w-5 h-5" />
          {/* Réglages */}
        </button>
      </div>
    </nav>
  );
}
