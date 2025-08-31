import { Droplets, Droplet as DropletOff } from "lucide-react";
import clsx from "clsx";

interface PeriodControlsProps {
  isPeriod: boolean;
  onChange: (isPeriod: boolean) => void;
}

export function PeriodControls({ isPeriod, onChange }: PeriodControlsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Règles
      </h3>
      <div className="flex space-x-3">
        <button
          onClick={() => onChange(true)}
          className={clsx(
            "flex-1 flex items-center justify-center py-4 px-6 rounded-xl border-2 transition-all duration-200",
            isPeriod
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
              : "border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 text-gray-700 dark:text-gray-300"
          )}
        >
          <Droplets className="h-6 w-6 mr-3" />
          <span className="font-medium">Jour de règles</span>
        </button>

        <button
          onClick={() => onChange(false)}
          className={clsx(
            "flex-1 flex items-center justify-center py-4 px-6 rounded-xl border-2 transition-all duration-200",
            !isPeriod
              ? "border-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
          )}
        >
          <DropletOff className="h-6 w-6 mr-3" />
          <span className="font-medium">Pas de règles</span>
        </button>
      </div>
    </div>
  );
}
