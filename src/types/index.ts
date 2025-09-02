import { storage } from "../utils/storage";
import type { View } from "../contexts/AppContext";

export interface CycleDay {
  date: string;
  isSelected?: boolean;
  isPeriod?: boolean;
  isOvulation?: boolean;
  isFertile?: boolean;
  isPredictedPeriod?: boolean;
  isPredictedOvulation?: boolean;
  symptoms?: Symptom[];
  temperature?: number;
  notes?: string;
  sexualActivity?: boolean;
  sexualActivityProtected?: boolean;
}

export interface Symptom {
  id: string;
  type: SymptomType;
  intensity: 1 | 2 | 3;
  notes?: string;
}

export type SymptomType =
  | "mood-happy"
  | "mood-sad"
  | "mood-irritable"
  | "mood-anxious"
  | "pain-cramps"
  | "pain-headache"
  | "pain-backache"
  | "pain-breast"
  | "energy-high"
  | "energy-low"
  | "sleep-good"
  | "sleep-poor"
  | "libido-high"
  | "libido-low"
  | "discharge-light"
  | "discharge-heavy"
  | "discharge-sticky"
  | "discharge-creamy";

export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  days: CycleDay[];
  averageLength?: number;
  predictedNextPeriod?: string;
  predictedOvulation?: string;
}

export interface User {
  id: string;
  email?: string;
  isGuest: boolean;
  preferences: UserPreferences;
  partnerId?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  remindersPeriod: boolean;
  remindersFertile: boolean;
  averageCycleLength: number;
  averagePeriodLength: number;
  temperatureUnit: "celsius" | "fahrenheit";
  showPredictions: boolean;
}

export interface DashboardStats {
  currentCycleDay: number;
  nextPredictedPeriod: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodDate: string;
  totalCycles: number;
  SPMDays: number[];
}

// -------------------- Types --------------------
export interface AppState {
  user: User | null;
  cycles: Cycle[];
  preferences: UserPreferences;
  currentView: View;
  selectedDate: string | null;
  isLoading: boolean;
  stats: DashboardStats | null;
}

// -------------------- Initial State --------------------
export const initialState: AppState = {
  user: null,
  cycles: [],
  preferences: storage.getPreferences(),
  currentView: "calendar",
  selectedDate: null,
  isLoading: true,
  stats: null,
};

export type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_CYCLES"; payload: Cycle[] }
  | { type: "ADD_CYCLE"; payload: Cycle }
  | { type: "UPDATE_CYCLE"; payload: Cycle }
  | { type: "SET_PREFERENCES"; payload: UserPreferences }
  | { type: "SET_VIEW"; payload: AppState["currentView"] }
  | { type: "SET_SELECTED_DATE"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_DAY"; payload: { date: string; data: Partial<CycleDay> } }
  | { type: "CALCULATE_STATS" };

export interface CalendarDayType extends CycleDay {
  isPredictedPeriod?: boolean;
  isPredictedOvulation?: boolean;
  isOvulation?: boolean;
  isFertile?: boolean;
}

export interface Predictions {
  nextPeriod: string;
  ovulation: string;
  fertileWindow: { start: string; end: string };
}

export interface CycleCircleProps {
  averageCycleLength: number;
  currentCycleDay: number;
  periodDays: number[];
  periodStartDay: number;
  periodEndDay: number;
  ovulationDay: number;
  fertileWindow: { start: number; end: number };
  predictedPeriodDays?: number[];
  SPMDays?: number[];
  onSelectedDayChange?: (day: number) => void; // callback pour remonter selectedDay
}
