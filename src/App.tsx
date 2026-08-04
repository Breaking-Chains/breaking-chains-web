import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PmoProvider, usePmo } from './context/PmoContext';
import { ThemeProvider } from './context/ThemeContext';
import { MobileLayout } from './components/layout/MobileLayout';
import type { NavTab } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GuidancePage } from './pages/GuidancePage';
import { MenteesPage } from './pages/MenteesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EmergencySosModal } from './components/pmo/EmergencySosModal';
import { CheckInModal } from './components/pmo/CheckInModal';
import { OnboardingWizardModal } from './components/pmo/OnboardingWizardModal';
import type { LogStatus, PMOTriggerTag } from './types/log';
import type { PrivacyLevel } from './types/chain';

function ProtectedAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState<boolean>(false);

  const { user } = useAuth();
  const role = user?.role || 'USER';

  const { chain, isApiLoading, currentStreak, cleanRatioPercent, submitCheckIn, startSos, completeSos, createCustomChain } = usePmo();

  const showOnboarding = chain === null && !isApiLoading && !isOnboardingDismissed;

  const handleTriggerSos = async () => {
    await startSos();
    setIsSosOpen(true);
  };

  const handleCloseSos = async (durationSeconds: number) => {
    await completeSos(durationSeconds);
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

  const handleCompleteOnboarding = async (data: {
    title: string;
    strategy: string;
    privacyLevel: PrivacyLevel;
    triggerTags: string[];
    intentStatement: string;
  }) => {
    await createCustomChain(data);
    setIsOnboardingDismissed(true);
  };

  return (
    <MobileLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onTriggerSos={handleTriggerSos}
      currentStreak={currentStreak}
      cleanRatioPercent={cleanRatioPercent}
    >
      {role === 'ADMIN' ? (
        <>
          {activeTab === 'dashboard' && <AdminDashboardPage />}
          {activeTab === 'guidance' && <AdminDashboardPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </>
      ) : role === 'MENTOR' ? (
        <>
          {activeTab === 'dashboard' && <MentorDashboardPage />}
          {activeTab === 'guidance' && (
            <GuidancePage onOpenMenteesPage={() => setActiveTab('mentees')} />
          )}
          {activeTab === 'mentees' && (
            <MenteesPage onBack={() => setActiveTab('guidance')} />
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onTriggerSos={handleTriggerSos}
              onTabChange={setActiveTab}
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

          {activeTab === 'guidance' && (
            <GuidancePage onOpenMenteesPage={() => setActiveTab('mentees')} />
          )}

          {activeTab === 'mentees' && (
            <MenteesPage onBack={() => setActiveTab('guidance')} />
          )}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'checkin' && (
            <DashboardPage
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onTriggerSos={handleTriggerSos}
              onTabChange={setActiveTab}
            />
          )}
        </>
      )}

      {/* Emergency SOS Modal */}
      <EmergencySosModal isOpen={isSosOpen} onClose={handleCloseSos} />

      {/* Daily Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmitLog={handleSubmitLog}
      />

      {/* New User Onboarding Setup Wizard */}
      <OnboardingWizardModal
        isOpen={showOnboarding}
        onClose={() => setIsOnboardingDismissed(true)}
        onCompleteOnboarding={handleCompleteOnboarding}
      />
    </MobileLayout>
  );
}

function ControlledAccessGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Securing your connection...</span>
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
    <ThemeProvider>
      <AuthProvider>
        <ControlledAccessGuard />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
