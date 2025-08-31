import { useApp } from "../../contexts/AppContext";
import dayjs from "dayjs";
import clsx from "clsx";

export function CycleCircle() {
  const { state } = useApp();

  const lastCycle = state.cycles[state.cycles.length - 1];

  if (!lastCycle || !lastCycle.days || lastCycle.days.length === 0) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Aucun cycle disponible pour afficher le cercle.
      </div>
    );
  }

  const cycleDays = lastCycle.days;
  const cycleLength = cycleDays.length;

  const todayStr = dayjs().format("YYYY-MM-DD");

  // On crée un tableau avec un objet par jour
  const daysArray = cycleDays.map((day, idx) => {
    const isToday = day.date === todayStr;
    return {
      ...day,
      dayNumber: idx + 1,
      isToday,
      color: day.isPeriod
        ? "bg-red-500"
        : day.isPredictedPeriod
        ? "bg-red-300"
        : day.isOvulation
        ? "bg-blue-500"
        : day.isPredictedOvulation
        ? "bg-blue-300"
        : day.isFertile
        ? "bg-green-300"
        : "bg-gray-200",
    };
  });

  const radius = 120; // rayon du cercle
  const center = radius + 20;
  const angleStep = (2 * Math.PI) / cycleLength;

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        Cycle actuel ({cycleLength} jours)
      </h2>

      <svg
        width={2 * center}
        height={2 * center}
        viewBox={`0 0 ${2 * center} ${2 * center}`}
      >
        {daysArray.map((day, idx) => {
          const angle = -Math.PI / 2 + idx * angleStep; // commence en haut
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={12}
              className={clsx(
                day.color,
                day.isToday && "stroke-yellow-400 stroke-2"
              )}
            />
          );
        })}
      </svg>

      <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
        <LegendItem color="bg-red-500" label="Règles" />
        <LegendItem color="bg-red-300" label="Règles prév." />
        <LegendItem color="bg-blue-500" label="Ovulation" />
        <LegendItem color="bg-green-300" label="Fenêtre fertile" />
        <LegendItem color="bg-yellow-400" label="Jour actuel" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center">
      <div className={clsx("w-4 h-4 mr-2 rounded-full", color)}></div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}
