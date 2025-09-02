import type { AppState, AppAction } from "../types";
import type { DashboardStats } from "../types";
import dayjs from "dayjs";
import {
  calculateCycleLength,
  calculatePeriodLength,
  getCurrentCycleDay,
  predictNextPeriod,
  predictOvulation,
} from "../utils/cycleCalculations";
import type { View } from "./AppContext";

// -------------------- Reducer --------------------
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_CYCLES":
      return { ...state, cycles: action.payload };

    case "ADD_CYCLE":
      return { ...state, cycles: [...state.cycles, action.payload] };

    case "UPDATE_CYCLE":
      return {
        ...state,
        cycles: state.cycles.map((cycle) =>
          cycle.id === action.payload.id ? action.payload : cycle
        ),
      };

    case "UPDATE_DAY": {
      const { date, data } = action.payload;

      let dayUpdated = false;
      const updatedCycles = state.cycles.map((cycle) => {
        const dayExists = cycle.days.find((d) =>
          dayjs(d.date).isSame(dayjs(date), "day")
        );

        if (dayExists) {
          dayUpdated = true;
          return {
            ...cycle,
            days: cycle.days.map((d) =>
              dayjs(d.date).isSame(dayjs(date), "day") ? { ...d, ...data } : d
            ),
          };
        }
        return cycle;
      });

      if (!dayUpdated) {
        // Vérifier si ce jour se rattache à un cycle existant
        const adjacentCycleIndex = state.cycles.findIndex((cycle) => {
          const cycleDates = cycle.days.map((d) => dayjs(d.date));
          return cycleDates.some(
            (d) =>
              dayjs(date).isSame(d.add(1, "day"), "day") ||
              dayjs(date).isSame(d.subtract(1, "day"), "day")
          );
        });

        if (adjacentCycleIndex >= 0) {
          // Ajouter le jour à un cycle existant
          const newCycles = [...updatedCycles];
          const currentStart = dayjs(newCycles[adjacentCycleIndex].startDate);
          const newStart = dayjs(date);
          newCycles[adjacentCycleIndex] = {
            ...newCycles[adjacentCycleIndex],
            days: [
              ...newCycles[adjacentCycleIndex].days,
              { date, ...data },
            ].sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()),
            startDate: currentStart.isBefore(newStart)
              ? currentStart.format("YYYY-MM-DD")
              : newStart.format("YYYY-MM-DD"),
          };
          return { ...state, cycles: newCycles };
        } else {
          // Créer un nouveau cycle avec ce jour seul
          const newCycle = {
            id: `cycle-${Date.now()}`,
            userId: state.user?.id || "guest",
            startDate: date,
            days: [{ date, ...data }],
          };
          return { ...state, cycles: [...updatedCycles, newCycle] };
        }
      }

      return { ...state, cycles: updatedCycles };
    }

    case "SET_PREFERENCES":
      return { ...state, preferences: action.payload };
    case "SET_VIEW":
      return { ...state, currentView: action.payload as View };

    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "CALCULATE_STATS": {
      if (state.cycles.length === 0) {
        return { ...state, stats: null };
      }

      // Calculer moyenne des cycles et périodes
      const avgCycleLength = calculateCycleLength(state.cycles);
      const avgPeriodLength = calculatePeriodLength(state.cycles);

      // Récupérer le dernier cycle complet
      const lastCycle = state.cycles[state.cycles.length - 1];
      const firstPeriodDay = lastCycle.days
        .filter((d) => d.isPeriod)
        .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())[0];
      const lastPeriodDate =
        firstPeriodDay?.date || dayjs().format("YYYY-MM-DD");

      const nextPredictedPeriod = predictNextPeriod(
        lastPeriodDate,
        avgCycleLength
      );
      const predictedOvulation = predictOvulation(
        lastPeriodDate,
        avgCycleLength
      );
      const currentCycleDay = getCurrentCycleDay(lastPeriodDate);

      // Calcul des jours de SPM pour le prochain cycle
      const SPMDays = Array.from(
        { length: 5 },
        (_, i) => avgCycleLength - 4 + i
      );

      // Mettre à jour le dernier cycle avec les prédictions
      const updatedCycles = state.cycles.map((cycle, idx) => ({
        ...cycle,
        predictedNextPeriod:
          idx === state.cycles.length - 1
            ? nextPredictedPeriod
            : cycle.predictedNextPeriod,
        predictedOvulation:
          idx === state.cycles.length - 1
            ? predictedOvulation
            : cycle.predictedOvulation,
      }));

      const stats: DashboardStats = {
        averageCycleLength: avgCycleLength,
        averagePeriodLength: avgPeriodLength,
        lastPeriodDate,
        nextPredictedPeriod,
        currentCycleDay,
        totalCycles: state.cycles.length,
        SPMDays: SPMDays, // <- jours de SPM calculés ici
      };

      return { ...state, stats, cycles: updatedCycles };
    }

    default:
      return state;
  }
}
