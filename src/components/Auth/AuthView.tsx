import React, { useState } from "react";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import type { User } from "../../types";

export function AuthView() {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGuestMode = () => {
    const guestUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      isGuest: true,
      preferences: {
        theme: "system",
        language: "fr",
        remindersPeriod: true,
        remindersFertile: true,
        averageCycleLength: 28,
        averagePeriodLength: 5,
        temperatureUnit: "celsius",
        showPredictions: true,
      },
    };
    dispatch({ type: "SET_USER", payload: guestUser });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would connect to Supabase
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      isGuest: false,
      preferences: {
        theme: "system",
        language: "fr",
        remindersPeriod: true,
        remindersFertile: true,
        averageCycleLength: 28,
        averagePeriodLength: 5,
        temperatureUnit: "celsius",
        showPredictions: true,
      },
    };
    dispatch({ type: "SET_USER", payload: user });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full bg-white border border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
        <div className="p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
              <span className="text-xl font-bold text-white">CT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CycleTracker
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Suivez votre cycle en toute confidentialité
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              {isLogin ? (
                <LogIn className="w-5 h-5 mr-2" />
              ) : (
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              {isLogin ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium transition-colors text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {isLogin
                ? "Pas de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>

          {/* Guest Mode */}
          <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGuestMode}
              className="w-full px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              Continuer en mode invité
            </button>
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Vos données resteront uniquement sur cet appareil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
