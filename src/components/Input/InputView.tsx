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
    // Charger les données existantes pour la date sélectionnée
    const existingDay = state.cycles
      .flatMap((c) => c.days ?? [])
      .find((d) => dayjs(d.date).format("YYYY-MM-DD") === selectedDate);

    if (existingDay) {
      setFormData({
        isPeriod: existingDay.isPeriod ?? false,
        symptoms: existingDay.symptoms ?? [],
        temperature: existingDay.temperature?.toString() ?? "",
        notes: existingDay.notes ?? "",
        sexualActivity: existingDay.sexualActivity ?? false,
        sexualActivityProtected: existingDay.sexualActivityProtected ?? false,
      });
    } else {
      // Réinitialiser le formulaire si aucune donnée existante
      setFormData({
        isPeriod: false,
        symptoms: [],
        temperature: "",
        notes: "",
        sexualActivity: false,
        sexualActivityProtected: false,
      });
    }
  }, [selectedDate, state.cycles]);

  const handleSave = () => {
    // Mettre à jour ou créer la journée dans le reducer
    dispatch({
      type: "UPDATE_DAY",
      payload: {
        date: selectedDate,
        data: {
          isPeriod: formData.isPeriod,
          symptoms: formData.symptoms,
          temperature: formData.temperature
            ? Number(formData.temperature)
            : undefined,
          notes: formData.notes,
          sexualActivity: formData.sexualActivity,
          sexualActivityProtected: formData.sexualActivityProtected,
        },
      },
    });

    // Recalculer les stats après modification
    dispatch({ type: "CALCULATE_STATS" });

    // Retour au calendrier
    dispatch({ type: "SET_VIEW", payload: "calendar" });
  };

  const handleCancel = () => {
    dispatch({ type: "SET_SELECTED_DATE", payload: null });
    dispatch({ type: "SET_VIEW", payload: "calendar" });
  };

  return (
    <div className="p-4 mx-auto">
      <div className="bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {dayjs(selectedDate).format("dddd DD MMMM YYYY")}
              </h2>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
        <div className="flex justify-end p-6 space-x-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
