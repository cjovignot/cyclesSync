import { type LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success";
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const colorClasses = {
    primary:
      "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400",
    secondary:
      "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400",
    accent:
      "bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400",
    success:
      "bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            colorClasses[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
