import { useState } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import type { NavTab } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GuidancePage } from './pages/GuidancePage';
import { SettingsPage } from './pages/SettingsPage';
import { EmergencySosModal } from './components/pmo/EmergencySosModal';
import { CheckInModal } from './components/pmo/CheckInModal';
import type { LogStatus } from './types/log';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);

  // App State
  const [currentStreak, setCurrentStreak] = useState<number>(18);
  const [cleanRatioPercent, setCleanRatioPercent] = useState<number>(94.7);
  const [chaserEffectActive, setChaserEffectActive] = useState<boolean>(false);

  const handleTriggerSos = () => {
    setIsSosOpen(true);
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'checkin') {
      setIsCheckInOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSubmitLog = (status: LogStatus) => {
    if (status === 'CLEAN' || status === 'URGE_RESISTED') {
      setCurrentStreak((prev) => prev + 1);
      setCleanRatioPercent(95.2);
    } else if (status === 'PEEKED_EDGED') {
      setChaserEffectActive(true);
    } else if (status === 'SLIP_UP') {
      setCurrentStreak(0);
      setChaserEffectActive(true);
      setCleanRatioPercent(92.1);
    }
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
          currentStreak={currentStreak}
          cleanRatioPercent={cleanRatioPercent}
          chaserEffectActive={chaserEffectActive}
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
          currentStreak={currentStreak}
          cleanRatioPercent={cleanRatioPercent}
          chaserEffectActive={chaserEffectActive}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onTriggerSos={handleTriggerSos}
        />
      )}

      {/* Emergency SOS Modal */}
      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Daily Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmitLog={handleSubmitLog}
      />
    </MobileLayout>
  );
}

export default App;
