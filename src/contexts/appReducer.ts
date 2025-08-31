import type { AppState, AppAction } from "../types";
import type { DashboardStats } from "../types";
import {
  calculateCycleLength,
  calculatePeriodLength,
  getCurrentCycleDay,
  predictNextPeriod,
} from "../utils/cycleCalculations";

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

    case "SET_PREFERENCES":
      return { ...state, preferences: action.payload };

    case "SET_VIEW":
      return { ...state, currentView: action.payload };

    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "CALCULATE_STATS": {
      if (state.cycles.length === 0) {
        return { ...state, stats: null };
      }

      const avgCycleLength = calculateCycleLength(state.cycles);
      const avgPeriodLength = calculatePeriodLength(state.cycles);
      const lastCycle = state.cycles[state.cycles.length - 1];
      const lastPeriodDate =
        lastCycle?.startDate || new Date().toISOString().split("T")[0];
      const nextPredictedPeriod = predictNextPeriod(
        lastPeriodDate,
        avgCycleLength
      );
      const currentCycleDay = getCurrentCycleDay(lastPeriodDate);

      const stats: DashboardStats = {
        averageCycleLength: avgCycleLength,
        averagePeriodLength: avgPeriodLength,
        lastPeriodDate,
        nextPredictedPeriod,
        currentCycleDay,
        totalCycles: state.cycles.length,
      };

      return { ...state, stats };
    }

    default:
      return state;
  }
}
