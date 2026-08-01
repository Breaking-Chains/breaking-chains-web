import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PmoProvider, usePmo } from './context/PmoContext';
import { MobileLayout } from './components/layout/MobileLayout';
import type { NavTab } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GuidancePage } from './pages/GuidancePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { EmergencySosModal } from './components/pmo/EmergencySosModal';
import { CheckInModal } from './components/pmo/CheckInModal';
import type { LogStatus, PMOTriggerTag } from './types/log';

function ProtectedAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);

  const { currentStreak, cleanRatioPercent, submitCheckIn, startSos, completeSos } = usePmo();

  const handleTriggerSos = async () => {
    await startSos();
    setIsSosOpen(true);
  };

  const handleCloseSos = async () => {
    await completeSos(60);
    setIsSosOpen(false);
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'checkin') {
      setIsCheckInOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSubmitLog = async (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => {
    await submitCheckIn(status, triggerTag, notes);
  };

  return (
    <MobileLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onTriggerSos={handleTriggerSos}
      currentStreak={currentStreak}
      cleanRatioPercent={cleanRatioPercent}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onTriggerSos={handleTriggerSos}
        />
      )}

      {activeTab === 'emergency' && (
        <EmergencyPage onTriggerSosModal={handleTriggerSos} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage
          currentStreak={currentStreak}
          cleanRatioPercent={cleanRatioPercent}
        />
      )}

      {activeTab === 'guidance' && <GuidancePage />}

      {activeTab === 'settings' && <SettingsPage />}

      {activeTab === 'checkin' && (
        <DashboardPage
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onTriggerSos={handleTriggerSos}
        />
      )}

      {/* Emergency SOS Modal */}
      <EmergencySosModal isOpen={isSosOpen} onClose={handleCloseSos} />

      {/* Daily Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmitLog={handleSubmitLog}
      />
    </MobileLayout>
  );
}

function ControlledAccessGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono">Verifying JWT Tokens...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <PmoProvider>
      <ProtectedAppContent />
    </PmoProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ControlledAccessGuard />
    </AuthProvider>
  );
}

export default App;
