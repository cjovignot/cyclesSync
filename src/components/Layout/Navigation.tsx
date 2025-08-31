import { Calendar, BarChart3, Plus, User, Circle } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import clsx from "clsx";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const { state, dispatch } = useApp();

  const navItems = [
    {
      id: "calendar" as const,
      label: "Calendrier",
      icon: Calendar,
    },
    {
      id: "dashboard" as const,
      label: "Tableau de bord",
      icon: BarChart3,
    },
    {
      id: "cycle" as const,
      label: "Cycle",
      icon: Circle,
    },
    {
      id: "input" as const,
      label: "Saisie",
      icon: Plus,
    },
  ];

  const handleNavClick = (view: typeof state.currentView) => {
    dispatch({ type: "SET_VIEW", payload: view });
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav
        className={clsx(
          "max-sm:rounded-2xl max-sm:h-fit fixed max-sm:top-2 max-sm:left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50",
          "md:relative md:top-0 md:transform-none md:block",
          isOpen ? "translate-x-2" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={clsx(
                    "w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon
                    className={clsx(
                      "h-5 w-5 mr-3",
                      isActive ? "text-primary-600 dark:text-primary-400" : ""
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {state.user && (
            <div className="pt-4 mt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4 py-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {state.user.isGuest ? "Mode invité" : state.user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {state.cycles.length} cycle(s) enregistré(s)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
