import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Cycle } from "../../types";
import dayjs from "dayjs";

interface CycleChartProps {
  cycles: Cycle[];
}

export function CycleChart({ cycles }: CycleChartProps) {
  const chartData = cycles
    .filter((cycle) => cycle.endDate)
    .slice(-12) // Last 12 cycles
    .map((cycle, index) => ({
      cycle: `Cycle ${index + 1}`,
      duree: dayjs(cycle.endDate).diff(dayjs(cycle.startDate), "day") + 1,
      date: dayjs(cycle.startDate).format("MMM YYYY"),
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution des cycles
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Pas assez de données pour afficher le graphique</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Évolution des cycles
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="cycle"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value} jours`, "Durée"]}
            />
            <Bar
              dataKey="duree"
              fill="#EC4899"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
