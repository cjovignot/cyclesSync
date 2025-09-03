import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { CycleCircle } from "./CycleCircle";

export function CycleCircleView() {
  const { state } = useApp();
  const stats = state.stats;
  const [selectedDay, setSelectedDay] = useState(stats?.currentCycleDay);

  if (!stats) {
    return (
      <p className="p-6 text-center">Aucune donnée de cycle disponible.</p>
    );
  }

  const lastCycle = state.cycles[state.cycles.length - 1];

  const periodDays = lastCycle.days
    .filter((d) => d.isPeriod)
    .map((d) => new Date(d.date).getDate());

  return (
    <div className="max-w-md p-4 mx-auto">
      <h2 className="mb-4 mb-16 text-3xl font-semibold text-gray-900 dark:text-white">
        Jour {selectedDay} / {stats.averageCycleLength}
      </h2>

      <CycleCircle
        averageCycleLength={stats.averageCycleLength}
        currentCycleDay={stats.currentCycleDay}
        periodDays={periodDays}
        SPMDays={stats.SPMDays} // <- on passe les jours de SPM ici
        onSelectedDayChange={setSelectedDay} // <- récupère selectedDay ici
      />
    </div>
  );
}
