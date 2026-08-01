import { useState } from 'react';
import { PmoProvider, usePmo } from './context/PmoContext';
import { MobileLayout } from './components/layout/MobileLayout';
import type { NavTab } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GuidancePage } from './pages/GuidancePage';
import { SettingsPage } from './pages/SettingsPage';
import { EmergencySosModal } from './components/pmo/EmergencySosModal';
import { CheckInModal } from './components/pmo/CheckInModal';
import type { LogStatus, PMOTriggerTag } from './types/log';

function AppContent() {
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

export function App() {
  return (
    <PmoProvider>
      <AppContent />
    </PmoProvider>
  );
}

export default App;
