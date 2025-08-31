import { Heart, Shield, ShieldOff } from "lucide-react";
import clsx from "clsx";

interface SexualActivityInputProps {
  sexualActivity: boolean;
  sexualActivityProtected: boolean;
  onChange: (sexualActivity: boolean, sexualActivityProtected: boolean) => void;
}

export function SexualActivityInput({
  sexualActivity,
  sexualActivityProtected,
  onChange,
}: SexualActivityInputProps) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h4 className="font-medium text-gray-900 dark:text-white">
          Activité sexuelle
        </h4>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onChange(!sexualActivity, sexualActivityProtected)}
          className={clsx(
            "w-full flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-200",
            sexualActivity
              ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
              : "border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600 text-gray-700 dark:text-gray-300"
          )}
        >
          <Heart className="h-5 w-5 mr-2" />
          <span className="font-medium">
            {sexualActivity
              ? "Activité enregistrée"
              : "Enregistrer une activité"}
          </span>
        </button>

        {sexualActivity && (
          <div className="flex space-x-3">
            <button
              onClick={() => onChange(true, true)}
              className={clsx(
                "flex-1 flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-200",
                sexualActivityProtected
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 text-gray-700 dark:text-gray-300"
              )}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Protégée</span>
            </button>

            <button
              onClick={() => onChange(true, false)}
              className={clsx(
                "flex-1 flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all duration-200",
                !sexualActivityProtected
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                  : "border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 text-gray-700 dark:text-gray-300"
              )}
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Non protégée</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
