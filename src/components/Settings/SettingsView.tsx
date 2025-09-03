import React from "react";
import {
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  User,
  Bell,
  Palette,
  Globe,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { storage } from "../../utils/storage";
import clsx from "clsx";

export function SettingsView() {
  const { state, dispatch } = useApp();
  const { preferences } = state;

  const handleBack = () => {
    dispatch({ type: "SET_VIEW", payload: "calendar" });
  };

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cycletracker-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = storage.importData(content);
      if (success) {
        window.location.reload(); // Reload to apply imported data
      } else {
        alert("Erreur lors de l'importation des données");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      confirm(
        "Êtes-vous sûre de vouloir supprimer toutes vos données ? Cette action est irréversible."
      )
    ) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const updatePreferences = (updates: Partial<typeof preferences>) => {
    dispatch({
      type: "SET_PREFERENCES",
      payload: { ...preferences, ...updates },
    });
  };

  return (
    <div className="p-4 mx-auto">
      <div className="bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            className="p-2 mr-3 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Paramètres
          </h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Settings */}
          <div>
            <div className="flex items-center mb-4">
              <Palette className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Apparence
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updatePreferences({ theme })}
                  className={clsx(
                    "py-2 px-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                    preferences.theme === theme
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {theme === "light"
                    ? "Clair"
                    : theme === "dark"
                    ? "Sombre"
                    : "Système"}
                </button>
              ))}
            </div>
          </div>

          {/* Cycle Settings */}
          <div>
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cycle
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Durée moyenne du cycle (jours)
                </label>
                <input
                  type="number"
                  value={preferences.averageCycleLength}
                  onChange={(e) =>
                    updatePreferences({
                      averageCycleLength: parseInt(e.target.value) || 28,
                    })
                  }
                  min="21"
                  max="35"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Durée moyenne des règles (jours)
                </label>
                <input
                  type="number"
                  value={preferences.averagePeriodLength}
                  onChange={(e) =>
                    updatePreferences({
                      averagePeriodLength: parseInt(e.target.value) || 5,
                    })
                  }
                  min="3"
                  max="8"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Rappel des règles
                </span>
                <input
                  type="checkbox"
                  checked={preferences.remindersPeriod}
                  onChange={(e) =>
                    updatePreferences({ remindersPeriod: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Rappel période fertile
                </span>
                <input
                  type="checkbox"
                  checked={preferences.remindersFertile}
                  onChange={(e) =>
                    updatePreferences({ remindersFertile: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Données
              </h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center w-full px-4 py-3 text-gray-700 transition-colors border border-gray-200 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Exporter mes données
              </button>

              <label className="flex items-center justify-center w-full px-4 py-3 text-gray-700 transition-colors border border-gray-200 rounded-lg cursor-pointer dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                <Upload className="w-5 h-5 mr-2" />
                Importer des données
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleClearData}
                className="flex items-center justify-center w-full px-4 py-3 text-red-600 transition-colors border border-red-200 rounded-lg dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Supprimer toutes les données
              </button>
              <span className="flex justify-center pt-10 text-xs">
                Version Alpha 1.0.3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
