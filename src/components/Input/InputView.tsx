import { useState, useEffect } from "react";
import { Calendar, Save, X } from "lucide-react";
import dayjs from "dayjs";
import { useApp } from "../../contexts/AppContext";
import { SymptomSelector } from "./SymptomSelector";
import { TemperatureInput } from "./TemperatureInput";
import { NotesInput } from "./NotesInput";
import { PeriodControls } from "./PeriodControls";
import { SexualActivityInput } from "./SexualActivityInput";
import type { Symptom } from "../../types";

interface FormData {
  isPeriod: boolean;
  symptoms: Symptom[];
  temperature: string;
  notes: string;
  sexualActivity: boolean;
  sexualActivityProtected: boolean;
}

export function InputView() {
  const { state, dispatch } = useApp();
  const selectedDate = state.selectedDate || dayjs().format("YYYY-MM-DD");

  const [formData, setFormData] = useState<FormData>({
    isPeriod: false,
    symptoms: [],
    temperature: "",
    notes: "",
    sexualActivity: false,
    sexualActivityProtected: false,
  });

  useEffect(() => {
    // Load existing data for selected date
    const existingDay = state.cycles
      .flatMap((c) => c.days ?? [])
      .find((d) => d.date === selectedDate);

    if (existingDay) {
      setFormData({
        isPeriod: existingDay.isPeriod ?? false,
        symptoms: existingDay.symptoms ?? [],
        temperature: existingDay.temperature?.toString() ?? "",
        notes: existingDay.notes ?? "",
        sexualActivity: existingDay.sexualActivity ?? false,
        sexualActivityProtected: existingDay.sexualActivityProtected ?? false,
      });
    }
  }, [selectedDate, state.cycles]);

  const handleSave = () => {
    // Ici tu peux dispatcher une action pour sauvegarder la journée
    console.log("Saving data for", selectedDate, formData);
    dispatch({ type: "SET_VIEW", payload: "calendar" });
  };

  const handleCancel = () => {
    dispatch({ type: "SET_SELECTED_DATE", payload: null });
    dispatch({ type: "SET_VIEW", payload: "calendar" });
  };

  return (
    <div className="mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {dayjs(selectedDate).format("dddd DD MMMM YYYY")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jour{" "}
                {dayjs(selectedDate).diff(dayjs().startOf("year"), "day") + 1}{" "}
                de l'année
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          <PeriodControls
            isPeriod={formData.isPeriod}
            onChange={(isPeriod) =>
              setFormData((prev) => ({ ...prev, isPeriod }))
            }
          />

          <SymptomSelector
            symptoms={formData.symptoms}
            onChange={(symptoms) =>
              setFormData((prev) => ({ ...prev, symptoms }))
            }
          />

          <TemperatureInput
            temperature={formData.temperature}
            onChange={(temperature) =>
              setFormData((prev) => ({ ...prev, temperature }))
            }
            unit={state.preferences.temperatureUnit}
          />

          <SexualActivityInput
            sexualActivity={formData.sexualActivity}
            sexualActivityProtected={formData.sexualActivityProtected}
            onChange={(sexualActivity, sexualActivityProtected) =>
              setFormData((prev) => ({
                ...prev,
                sexualActivity,
                sexualActivityProtected,
              }))
            }
          />

          <NotesInput
            notes={formData.notes}
            onChange={(notes) => setFormData((prev) => ({ ...prev, notes }))}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
