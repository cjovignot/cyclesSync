/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { AppState, AppAction } from "../types";
import { appReducer } from "./appReducer";
import { initialState } from "../types";
import { storage } from "../utils/storage";

// -------------------- Context --------------------
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// -------------------- Provider --------------------
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const user = storage.getUser();
    const cycles = storage.getCycles();
    const preferences = storage.getPreferences();

    dispatch({ type: "SET_USER", payload: user });
    dispatch({ type: "SET_CYCLES", payload: cycles });
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
  }, [state.cycles]);

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
