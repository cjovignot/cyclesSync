import type { Cycle } from "../types";
import dayjs from "dayjs";

export function generateMockCycles(count = 10, userId = "mock-user"): Cycle[] {
  const cycles: Cycle[] = [];

  // Commence aujourd'hui
  let currentDate = dayjs();

  for (let i = count - 1; i >= 0; i--) {
    // Cycle entre 26 et 32 jours
    const cycleLength = 28 + Math.floor(Math.random() * 5);
    // Règles entre 4 et 6 jours
    const periodLength = 4 + Math.floor(Math.random() * 3);

    // Début du cycle
    const startDate = currentDate.subtract(cycleLength - 1, "day");
    // Fin de la période
    const endDate = startDate.add(periodLength - 1, "day");

    // Tableau des jours du cycle
    const days = Array.from({ length: cycleLength }, (_, index) => ({
      date: startDate.add(index, "day").toISOString(),
      isPeriod: index < periodLength,
    }));

    cycles.unshift({
      id: `mock-${i}`,
      userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
    });

    // Prépare la date de début du cycle précédent
    currentDate = startDate.subtract(1, "day");
  }

  return cycles;
}
