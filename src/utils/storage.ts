import type { Cycle, User, UserPreferences } from "../types";

const STORAGE_KEYS = {
  CYCLES: "cycletracker_cycles",
  USER: "cycletracker_user",
  PREFERENCES: "cycletracker_preferences",
} as const;

export const storage = {
  // Cycles
  getCycles: (): Cycle[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CYCLES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCycles: (cycles: Cycle[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
    } catch (error) {
      console.error("Failed to save cycles:", error);
    }
  },

  // User
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  },

  // Preferences
  getPreferences: (): UserPreferences => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data
        ? JSON.parse(data)
        : {
            theme: "system",
            language: "fr",
            remindersPeriod: true,
            remindersFertile: true,
            averageCycleLength: 28,
            averagePeriodLength: 5,
            temperatureUnit: "celsius",
            showPredictions: true,
          };
    } catch {
      return {
        theme: "system",
        language: "fr",
        remindersPeriod: true,
        remindersFertile: true,
        averageCycleLength: 28,
        averagePeriodLength: 5,
        temperatureUnit: "celsius",
        showPredictions: true,
      };
    }
  },

  setPreferences: (preferences: UserPreferences): void => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // Export data
  exportData: (): string => {
    const data = {
      cycles: storage.getCycles(),
      user: storage.getUser(),
      preferences: storage.getPreferences(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import data
  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.cycles) storage.setCycles(data.cycles);
      if (data.user) storage.setUser(data.user);
      if (data.preferences) storage.setPreferences(data.preferences);
      return true;
    } catch {
      return false;
    }
  },
};
