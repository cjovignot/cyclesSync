/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { AppState, AppAction } from "../types";
import { appReducer } from "./appReducer";
import { initialState } from "../types";
import { storage } from "../utils/storage";
// import { generateMockCycles } from "../utils/mockCycles"; // <- notre utilitaire

// -------------------- Context --------------------
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// -------------------- Provider --------------------
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Inject mock data only in dev
  // const isDev = import.meta.env.MODE === "development"; // Vite/CRA
  const initial =
    // isDev
    //   ? {
    //       ...initialState,
    //       cycles: generateMockCycles(10),
    //       stats: {
    //         currentCycleDay: 7,
    //         nextPredictedPeriod: new Date(
    //           Date.now() + 5 * 24 * 60 * 60 * 1000
    //         ).toISOString(),
    //         averageCycleLength: 28,
    //         averagePeriodLength: 5, // ajouté
    //         lastPeriodDate: new Date(
    //           Date.now() - 23 * 24 * 60 * 60 * 1000
    //         ).toISOString(), // ajouté
    //         totalCycles: 10,
    //       },
    //     }
    //   :
    initialState;

  const [state, dispatch] = useReducer(appReducer, initial);

  // Load data from storage (real user data) – overrides mocks if available
  useEffect(() => {
    const user = storage.getUser();
    const cycles = storage.getCycles();
    const preferences = storage.getPreferences();

    if (user) dispatch({ type: "SET_USER", payload: user });
    if (cycles.length > 0) dispatch({ type: "SET_CYCLES", payload: cycles });
    if (preferences)
      dispatch({ type: "SET_PREFERENCES", payload: preferences });
    dispatch({ type: "CALCULATE_STATS" });
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  // Save to storage on changes
  useEffect(() => {
    if (!state.isLoading) {
      if (state.user) storage.setUser(state.user);
      storage.setCycles(state.cycles);
      storage.setPreferences(state.preferences);
    }
  }, [state.user, state.cycles, state.preferences, state.isLoading]);

  // Recalculate stats when cycles change
  useEffect(() => {
    dispatch({ type: "CALCULATE_STATS" });
  }, [state.cycles.length]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// -------------------- Hook --------------------
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
