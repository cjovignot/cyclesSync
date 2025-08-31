import { Calendar, Clock, TrendingUp, Heart } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { StatsCard } from "./StatsCard";
import { CycleChart } from "./CycleChart";
import dayjs from "dayjs";
import clsx from "clsx";

export function DashboardView() {
  const { state } = useApp();
  const { stats, cycles } = state;

  if (!stats) {
    return (
      <div className="p-4 mx-auto">
        <div className="p-8 text-center bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Aucune donnée disponible
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Commencez par enregistrer votre premier cycle pour voir vos
            statistiques.
          </p>
        </div>
      </div>
    );
  }

  const daysUntilNextPeriod = dayjs(stats.nextPredictedPeriod).diff(
    dayjs(),
    "day"
  );
  const nextPeriodText =
    daysUntilNextPeriod > 0
      ? `Dans ${daysUntilNextPeriod} jour${daysUntilNextPeriod > 1 ? "s" : ""}`
      : daysUntilNextPeriod === 0
      ? "Aujourd'hui"
      : "En retard";

  return (
    <div className="p-4 mx-auto">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de votre cycle et tendances
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Jour du cycle"
          value={`Jour ${stats.currentCycleDay}`}
          icon={Calendar}
          color="primary"
        />
        <StatsCard
          title="Prochaines règles"
          value={nextPeriodText}
          icon={Clock}
          color="secondary"
        />
        <StatsCard
          title="Cycle moyen"
          value={`${stats.averageCycleLength} jours`}
          icon={TrendingUp}
          color="accent"
        />
        <StatsCard
          title="Cycles suivis"
          value={stats.totalCycles.toString()}
          icon={Heart}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CycleChart cycles={cycles} />

        {/* Recent Activity */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Activité récente
          </h3>
          <div className="space-y-3">
            {cycles
              .slice(-5)
              .reverse()
              .map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Cycle commencé le{" "}
                      {dayjs(cycle.startDate).format("DD/MM/YYYY")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cycle.endDate
                        ? `Durée: ${
                            dayjs(cycle.endDate).diff(
                              dayjs(cycle.startDate),
                              "day"
                            ) + 1
                          } jours`
                        : "En cours"}
                    </p>
                  </div>
                  <div
                    className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      cycle.endDate
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    )}
                  >
                    {cycle.endDate ? "Terminé" : "Actuel"}
                  </div>
                </div>
              ))}
            {cycles.length === 0 && (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                Aucun cycle enregistré pour le moment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
