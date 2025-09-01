import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { useApp } from "../../contexts/AppContext";
import {
  generateCalendarDays,
  predictOvulation,
  getFertileWindow,
  predictSPMWindowCalendar,
} from "../../utils/cycleCalculations";
import { CalendarDay } from "./CalendarDay";

export function CalendarView() {
  const { state, dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const stats = state.stats;

  // Si pas de stats, on renvoie un objet vide
  const predictions = stats
    ? {
        nextPeriod: stats.nextPredictedPeriod,
        ovulation: predictOvulation(
          stats.lastPeriodDate,
          stats.averageCycleLength
        ),
        fertileWindow: getFertileWindow(
          predictOvulation(stats.lastPeriodDate, stats.averageCycleLength)
        ),
        averagePeriodLength: stats.averagePeriodLength,
      }
    : {
        nextPeriod: "",
        ovulation: "",
        fertileWindow: { start: "", end: "" },
        averagePeriodLength: 5,
      };

  // Calcul des jours de SPM (5 jours avant la période prévue)
  const predictedPeriodDays = Array.from(
    { length: predictions.averagePeriodLength },
    (_, i) => dayjs(predictions.nextPeriod).add(i, "day").date()
  );
  const spmDays = predictSPMWindowCalendar(predictedPeriodDays); // renvoie les 5 jours avant

  // Génération des jours du calendrier
  const calendarDays = generateCalendarDays(
    currentDate.year(),
    currentDate.month(),
    state.cycles,
    {
      nextPeriod: predictions.nextPeriod,
      ovulation: predictions.ovulation,
      fertileWindow: predictions.fertileWindow,
    }
  ).map((day) => {
    // On ne marque SPM que si le mois de day.date correspond au mois de la prochaine période
    const nextPeriodMonth = dayjs(predictions.nextPeriod).month();
    const isSameMonthAsNextPeriod = dayjs(day.date).month() === nextPeriodMonth;

    return {
      ...day,
      isSPM:
        isSameMonthAsNextPeriod && spmDays.includes(dayjs(day.date).date()),
    };
  });

  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")
    );
  };

  const handleDayClick = (date: string) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
    dispatch({ type: "SET_VIEW", payload: "input" });
  };

  const isCurrentMonth = (date: string) =>
    dayjs(date).month() === currentDate.month();

  return (
    <div className="p-4 mx-auto">
      {/* Calendar Header et Grid */}
      <div className="mb-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentDate.format("MMMM YYYY")}
          </h2>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex items-center justify-center h-10 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => (
              <CalendarDay
                key={day.date}
                day={day}
                isCurrentMonth={isCurrentMonth(day.date)}
                isToday={dayjs(day.date).isSame(dayjs(), "day")}
                onClick={() => handleDayClick(day.date)}
                isSPM={day.isSPM} // <- ici on passe la prédiction SPM
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Légende
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Règles
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 border-2 border-red-300 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Prédictions
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 bg-green-300 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Période fertile
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Ovulation
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 border-2 border-yellow-300 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              SPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
