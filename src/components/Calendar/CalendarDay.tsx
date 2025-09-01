import type { CycleDay } from "../../types";
import clsx from "clsx";
import dayjs from "dayjs";

interface CalendarDayProps {
  day: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSPM?: boolean;
  onClick: () => void;
}

export function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  isSPM = false, // valeur par défaut
  onClick,
}: CalendarDayProps) {
  const dayNumber = dayjs(day.date).date();

  const getDayStyles = () => {
    const baseStyles =
      "relative h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 hover:scale-105";

    if (!isCurrentMonth) {
      return clsx(
        baseStyles,
        "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
      );
    }

    if (day.isPeriod) {
      return clsx(
        baseStyles,
        "bg-red-500 text-white shadow-lg hover:bg-red-600"
      );
    }

    if (day.isOvulation) {
      return clsx(
        baseStyles,
        "bg-blue-500 text-white shadow-lg hover:bg-blue-600"
      );
    }

    if (day.isFertile) {
      return clsx(baseStyles, "bg-green-300 text-green-800 hover:bg-green-400");
    }

    if (day.isPredictedPeriod) {
      return clsx(
        baseStyles,
        "border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      );
    }

    if (day.isPredictedOvulation) {
      return clsx(
        baseStyles,
        "border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      );
    }

    if (isToday) {
      return clsx(
        baseStyles,
        "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-600 shadow-md"
      );
    }

    if (isSPM) {
      return clsx(
        baseStyles,
        "border-2 border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
      );
    }

    return clsx(
      baseStyles,
      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    );
  };

  const hasSymptoms = day.symptoms && day.symptoms.length > 0;
  const hasNotes = day.notes && day.notes.trim().length > 0;
  const hasTemperature = day.temperature !== undefined;
  const hasSexualActivity = day.sexualActivity;

  return (
    <div className={getDayStyles()} onClick={onClick}>
      <span className="z-10">{dayNumber}</span>

      {/* Indicators */}
      <div className="absolute flex space-x-1 transform -translate-x-1/2 bottom-1 left-1/2">
        {hasSymptoms && (
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
        )}
        {hasTemperature && (
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
        )}
        {hasSexualActivity && (
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
        )}
        {hasNotes && (
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
}
