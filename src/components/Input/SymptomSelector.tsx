import { Smile, Frown, Zap, Heart } from "lucide-react";
import type { Symptom, SymptomType } from "../../types";
import clsx from "clsx";

interface SymptomSelectorProps {
  symptoms: Symptom[];
  onChange: (symptoms: Symptom[]) => void;
}

const symptomCategories = [
  {
    title: "Humeur",
    icon: Smile,
    symptoms: [
      { type: "mood-happy" as SymptomType, label: "Heureuse", icon: "😊" },
      { type: "mood-sad" as SymptomType, label: "Triste", icon: "😢" },
      { type: "mood-irritable" as SymptomType, label: "Irritable", icon: "😤" },
      { type: "mood-anxious" as SymptomType, label: "Anxieuse", icon: "😰" },
    ],
  },
  {
    title: "Douleurs",
    icon: Frown,
    symptoms: [
      { type: "pain-cramps" as SymptomType, label: "Crampes", icon: "🤕" },
      {
        type: "pain-headache" as SymptomType,
        label: "Maux de tête",
        icon: "🤯",
      },
      { type: "pain-backache" as SymptomType, label: "Mal de dos", icon: "🦴" },
      {
        type: "pain-breast" as SymptomType,
        label: "Seins sensibles",
        icon: "💚",
      },
    ],
  },
  {
    title: "Énergie",
    icon: Zap,
    symptoms: [
      { type: "energy-high" as SymptomType, label: "Énergique", icon: "⚡" },
      { type: "energy-low" as SymptomType, label: "Fatiguée", icon: "😴" },
    ],
  },
  {
    title: "Libido",
    icon: Heart,
    symptoms: [
      { type: "libido-high" as SymptomType, label: "Élevée", icon: "💕" },
      { type: "libido-low" as SymptomType, label: "Faible", icon: "💙" },
    ],
  },
];

export function SymptomSelector({ symptoms, onChange }: SymptomSelectorProps) {
  const toggleSymptom = (type: SymptomType) => {
    const existingSymptom = symptoms.find((s) => s.type === type);

    if (existingSymptom) {
      onChange(symptoms.filter((s) => s.type !== type));
    } else {
      const newSymptom: Symptom = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        intensity: 2,
      };
      onChange([...symptoms, newSymptom]);
    }
  };

  const updateIntensity = (type: SymptomType, intensity: 1 | 2 | 3) => {
    onChange(symptoms.map((s) => (s.type === type ? { ...s, intensity } : s)));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Symptômes
      </h3>
      <div className="space-y-6">
        {symptomCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.title}>
              <div className="flex items-center mb-3">
                <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {category.title}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {category.symptoms.map((symptom) => {
                  const isSelected = symptoms.some(
                    (s) => s.type === symptom.type
                  );
                  const selectedSymptom = symptoms.find(
                    (s) => s.type === symptom.type
                  );

                  return (
                    <div key={symptom.type}>
                      <button
                        onClick={() => toggleSymptom(symptom.type)}
                        className={clsx(
                          "w-full flex items-center py-3 px-4 rounded-lg border-2 transition-all duration-200",
                          isSelected
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                            : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <span className="text-lg mr-3">{symptom.icon}</span>
                        <span className="font-medium">{symptom.label}</span>
                      </button>

                      {isSelected && (
                        <div className="mt-2 flex space-x-1">
                          {[1, 2, 3].map((intensity) => (
                            <button
                              key={intensity}
                              onClick={() =>
                                updateIntensity(
                                  symptom.type,
                                  intensity as 1 | 2 | 3
                                )
                              }
                              className={clsx(
                                "flex-1 py-1 px-2 rounded text-xs font-medium transition-colors",
                                selectedSymptom?.intensity === intensity
                                  ? "bg-primary-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                              )}
                            >
                              {intensity === 1
                                ? "Léger"
                                : intensity === 2
                                ? "Modéré"
                                : "Intense"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
