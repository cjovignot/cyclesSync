import { Thermometer } from "lucide-react";

interface TemperatureInputProps {
  temperature: string;
  onChange: (temperature: string) => void;
  unit: "celsius" | "fahrenheit";
}

export function TemperatureInput({
  temperature,
  onChange,
  unit,
}: TemperatureInputProps) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Thermometer className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h4 className="font-medium text-gray-900 dark:text-white">
          Température
        </h4>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="number"
          value={temperature}
          onChange={(e) => onChange(e.target.value)}
          placeholder={unit === "celsius" ? "36.5" : "97.7"}
          step="0.1"
          min={unit === "celsius" ? "35" : "95"}
          max={unit === "celsius" ? "42" : "108"}
          className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          °{unit === "celsius" ? "C" : "F"}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        La température basale aide à détecter l'ovulation
      </p>
    </div>
  );
}
