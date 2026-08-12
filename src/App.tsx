import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PmoProvider, usePmo } from './context/PmoContext';
import { ThemeProvider } from './context/ThemeContext';
import { MobileLayout } from './components/layout/MobileLayout';
import type { NavTab } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { GuidancePage } from './pages/GuidancePage';
import { MenteesPage } from './pages/MenteesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { EmergencySosModal } from './components/pmo/EmergencySosModal';
import { CheckInModal } from './components/pmo/CheckInModal';
import type { LogStatus, PMOTriggerTag } from './types/log';

function ProtectedAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState<boolean>(false);
  const [isAutoOnboardingStarted, setIsAutoOnboardingStarted] = useState<boolean>(false);

  const { user } = useAuth();
  const role = user?.role || 'USER';

  const { chain, isApiLoading, currentStreak, cleanRatioPercent, submitCheckIn, startSos, completeSos, createCustomChain } = usePmo();

  useEffect(() => {
    if (role === 'USER' && chain === null && !isApiLoading && !isOnboardingDismissed && !isAutoOnboardingStarted) {
      setIsAutoOnboardingStarted(true);
      createCustomChain({
        title: 'My Recovery Journey',
        strategy: 'PMO_RECOVERY',
        privacyLevel: 'LEVEL_2_FULL_COUNSEL',
        triggerTags: ['🌙 Late Night Solitude', '⚡ Stress & Anxiety'],
        intentStatement: 'I commit to seeking purity, self-mastery, and spiritual growth.',
      }).then(() => {
        setIsOnboardingDismissed(true);
      }).catch((err) => {
        console.error("Auto onboarding failed:", err);
      });
    }
  }, [role, chain, isApiLoading, isOnboardingDismissed, isAutoOnboardingStarted, createCustomChain]);

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

  const handleSubmitLog = async (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string, logTimestamp?: string) => {
    await submitCheckIn(status, triggerTag, notes, logTimestamp);
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

          {activeTab === 'guidance' && (
            <GuidancePage onOpenMenteesPage={() => setActiveTab('mentees')} />
          )}

          {activeTab === 'meetings' && (
            <MeetingsPage onOpenGuidance={() => setActiveTab('guidance')} />
          )}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'privacy' && <PrivacyPage />}

          {activeTab === 'mentees' && (
            <MenteesPage onBack={() => setActiveTab('guidance')} />
          )}

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
    </MobileLayout>
  );
}

function ControlledAccessGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Securing your connection...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  return (
    <PmoProvider>
      <ProtectedAppContent />
    </PmoProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ControlledAccessGuard />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
