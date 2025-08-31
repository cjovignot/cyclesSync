import dayjs from "dayjs";
import type { Cycle, CalendarDayType, Predictions } from "../types";

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

/**
 * Prédit la prochaine date de règles
 * @param lastPeriodStart - date de début de la dernière période (ISO string)
 * @param averageCycleLength - longueur moyenne du cycle en jours
 * @returns date ISO de la prochaine période
 */
export const predictNextPeriod = (
  lastPeriodStart: string,
  averageCycleLength: number
): string => {
  let nextPeriod = dayjs(lastPeriodStart).add(averageCycleLength, "day");

  // Si la date prédite est passée, itérer jusqu'à trouver une date future
  while (nextPeriod.isBefore(dayjs(), "day")) {
    nextPeriod = nextPeriod.add(averageCycleLength, "day");
  }

  return nextPeriod.format("YYYY-MM-DD");
};

/**
 * Prédit la date d'ovulation en se basant sur la dernière date de règles
 * et la durée moyenne du cycle.
 *
 * @param lastPeriodDate - Date du dernier début de règles (YYYY-MM-DD)
 * @param averageCycleLength - Durée moyenne du cycle en jours
 * @returns Date prévue d'ovulation au format YYYY-MM-DD
 */
export const predictOvulation = (
  lastPeriodDate: string,
  averageCycleLength: number
): string => {
  // L’ovulation se produit généralement 14 jours avant le début des prochaines règles
  const ovulationDay = averageCycleLength - 14;

  // Ajouter ovulationDay à la dernière date de règles
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

export function generateCalendarDays(
  year: number,
  month: number,
  cycles: Cycle[],
  predictions: Predictions
): CalendarDayType[] {
  const startOfMonth = dayjs().year(year).month(month).startOf("month");
  const endOfMonth = dayjs().year(year).month(month).endOf("month");

  const days: CalendarDayType[] = [];
  let current = startOfMonth.startOf("week"); // début du calendrier à la semaine

  while (current.isBefore(endOfMonth.endOf("week"))) {
    const dateStr = current.format("YYYY-MM-DD");

    // Chercher si c’est un jour déjà enregistré dans les cycles
    let existingDay;
    for (const cycle of cycles) {
      existingDay = cycle.days.find(
        (d) => dayjs(d.date).format("YYYY-MM-DD") === dateStr
      );
      if (existingDay) break;
    }

    const day: CalendarDayType = {
      date: dateStr,
      isPeriod: existingDay?.isPeriod ?? false,
      symptoms: existingDay?.symptoms ?? [],
      temperature: existingDay?.temperature,
      notes: existingDay?.notes,
      sexualActivity: existingDay?.sexualActivity,
      sexualActivityProtected: existingDay?.sexualActivityProtected,
      // Prédictions
      isPredictedPeriod: dateStr === predictions.nextPeriod,
      isPredictedOvulation: dateStr === predictions.ovulation,
      isOvulation: dateStr === predictions.ovulation,
      isFertile:
        dateStr >= predictions.fertileWindow.start &&
        dateStr <= predictions.fertileWindow.end,
    };

    days.push(day);
    current = current.add(1, "day");
  }

  return days;
}
