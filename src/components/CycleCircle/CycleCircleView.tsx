import { useApp } from "../../contexts/AppContext";
import { CycleCircle } from "./CycleCircle";
import {
  getFertileWindow,
  predictOvulation,
} from "../../utils/cycleCalculations";

export function CycleCircleView() {
  const { state } = useApp();
  const stats = state.stats;

  if (!stats) {
    return (
      <p className="p-6 text-center">Aucune donnée de cycle disponible.</p>
    );
  }

  const lastCycle = state.cycles[state.cycles.length - 1];
  // const firstPeriodDay = lastCycle.days
  //   .filter((d) => d.isPeriod)
  //   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const periodDays = lastCycle.days
    .filter((d) => d.isPeriod)
    .map((d) => {
      const dayNum = new Date(d.date).getDate();
      return dayNum;
    });

  const predictedOvulation = predictOvulation(
    stats.lastPeriodDate,
    stats.averageCycleLength
  );

  const fertileWindow = getFertileWindow(predictedOvulation);

  return (
    <div className="max-w-md p-4 mx-auto">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Visualisation du cycle
      </h2>

      <CycleCircle
        averageCycleLength={stats.averageCycleLength}
        currentCycleDay={stats.currentCycleDay}
        periodDays={periodDays}
        predictedPeriodDays={[...Array(5)].map(
          (_, idx) => idx + stats.currentCycleDay
        )}
        ovulationDay={new Date(predictedOvulation).getDate()}
        fertileWindow={{
          start: new Date(fertileWindow.start).getDate(),
          end: new Date(fertileWindow.end).getDate(),
        }}
      />
    </div>
  );
}
