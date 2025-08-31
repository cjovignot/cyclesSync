import dayjs from "dayjs";
import type { CycleDay, Cycle } from "../types";

export const calculateCycleLength = (cycles: Cycle[]): number => {
  if (cycles.length < 2) return 28; // Default cycle length

  const completedCycles = cycles.filter((cycle) => cycle.endDate);
  if (completedCycles.length === 0) return 28;

  const lengths = completedCycles.map((cycle) => {
    const start = dayjs(cycle.startDate);
    const end = dayjs(cycle.endDate);
    return end.diff(start, "day") + 1;
  });

  return Math.round(
    lengths.reduce((sum, length) => sum + length, 0) / lengths.length
  );
};

export const calculatePeriodLength = (cycles: Cycle[]): number => {
  if (cycles.length === 0) return 5; // Default period length

  const periodLengths = cycles
    .map((cycle) => {
      const periodDays = cycle.days.filter((day) => day.isPeriod);
      return periodDays.length;
    })
    .filter((length) => length > 0);

  if (periodLengths.length === 0) return 5;

  return Math.round(
    periodLengths.reduce((sum, length) => sum + length, 0) /
      periodLengths.length
  );
};

export const predictNextPeriod = (
  lastPeriodDate: string,
  averageCycleLength: number
): string => {
  return dayjs(lastPeriodDate)
    .add(averageCycleLength, "day")
    .format("YYYY-MM-DD");
};

export const predictOvulation = (
  lastPeriodDate: string,
  averageCycleLength: number
): string => {
  const ovulationDay = averageCycleLength - 14; // Ovulation typically 14 days before next period
  return dayjs(lastPeriodDate).add(ovulationDay, "day").format("YYYY-MM-DD");
};

export const getFertileWindow = (
  ovulationDate: string
): { start: string; end: string } => {
  const ovulation = dayjs(ovulationDate);
  return {
    start: ovulation.subtract(5, "day").format("YYYY-MM-DD"), // 5 days before ovulation
    end: ovulation.add(1, "day").format("YYYY-MM-DD"), // 1 day after ovulation
  };
};

export const getCurrentCycleDay = (lastPeriodDate: string): number => {
  const today = dayjs();
  const lastPeriod = dayjs(lastPeriodDate);
  return today.diff(lastPeriod, "day") + 1;
};

export const generateCalendarDays = (
  year: number,
  month: number,
  cycles: Cycle[],
  predictions: {
    nextPeriod: string;
    ovulation: string;
    fertileWindow: { start: string; end: string };
  }
): CycleDay[] => {
  const startOfMonth = dayjs().year(year).month(month).startOf("month");
  const endOfMonth = startOfMonth.endOf("month");
  const startOfCalendar = startOfMonth.startOf("week");
  const endOfCalendar = endOfMonth.endOf("week");

  const days: CycleDay[] = [];
  let current = startOfCalendar;

  while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar)) {
    const dateStr = current.format("YYYY-MM-DD");
    const existingDay = cycles
      .flatMap((c) => c.days)
      .find((d) => d.date === dateStr);

    const day: CycleDay = {
      date: dateStr,
      ...existingDay,
      isPredictedPeriod: current.isSame(predictions.nextPeriod, "day"),
      isPredictedOvulation: current.isSame(predictions.ovulation, "day"),
      isFertile: current.isBetween(
        predictions.fertileWindow.start,
        predictions.fertileWindow.end,
        "day",
        "[]"
      ),
    };

    days.push(day);
    current = current.add(1, "day");
  }

  return days;
};
