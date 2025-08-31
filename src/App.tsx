import { useState } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Header } from "./components/Layout/Header";
import { Navigation } from "./components/Layout/Navigation";
import { DashboardView } from "./components/Dashboard/DashboardView";
import { CycleCircleView } from "./components/CycleCircle/CycleCircleView";
import { InputView } from "./components/Input/InputView";
import { SettingsView } from "./components/Settings/SettingsView";
import { AuthView } from "./components/Auth/AuthView";
import { useTheme } from "./hooks/useTheme";
import { usePWA } from "./hooks/usePWA";
import { CalendarView } from "./components/Calendar/CalendarView";

function AppContent() {
  const { state } = useApp();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isInstallable, installApp } = usePWA();

  useTheme();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!state.user) {
    return <AuthView />;
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "dashboard":
        return <DashboardView />;
      case "calendar":
        return <CalendarView />;
      case "input":
        return <InputView />;
      case "settings":
        return <SettingsView />;
      case "cycle":
        return <CycleCircleView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setIsNavOpen(true)} />

      <div className="flex">
        <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <main className="flex-1 transition-all duration-300 md:ml-0">
          {/* PWA Install Banner */}
          {isInstallable && (
            <div className="p-4 text-center text-white bg-primary-600">
              <p className="text-sm">
                Installez CycleTracker sur votre appareil pour une meilleure
                expérience
                <button
                  onClick={installApp}
                  className="ml-2 underline hover:no-underline"
                >
                  Installer maintenant
                </button>
              </p>
            </div>
          )}

          <div className="animate-fade-in">{renderCurrentView()}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
