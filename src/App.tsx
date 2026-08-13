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
import { MentorshipChat } from './components/pmo/MentorshipChat';
import { getUserPartnerships, getPartnershipMessages, sendPartnershipMessage } from './services/partnerService';
import type { LogStatus, PMOTriggerTag } from './types/log';
import type { MentorshipChatMessage, AccountabilityPartnership } from './types/partner';

function ProtectedAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState<boolean>(false);
  const [isAutoOnboardingStarted, setIsAutoOnboardingStarted] = useState<boolean>(false);

  const { user } = useAuth();
  const role = user?.role || 'USER';

  const { chain, isApiLoading, currentStreak, cleanRatioPercent, submitCheckIn, startSos, completeSos, createCustomChain } = usePmo();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([]);
  const [activeMentorship, setActiveMentorship] = useState<AccountabilityPartnership | null>(null);
  const { isDemoSession } = useAuth();

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

  // Fetch mentorship connection globally
  const loadMentorship = async () => {
    try {
      const partnerships = isDemoSession ? [] : await getUserPartnerships().catch(() => []);
      if (isDemoSession) {
        setActiveMentorship({
          id: 'p-1',
          chainId: 'c0000000-0000-0000-0000-000000000001',
          userId: 'demo-user-1',
          partnerUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
          partnerFullName: 'Sheikh Ahmad Al-Taji',
          partnerUsername: 'sheikh_ahmad',
          role: 'MENTOR',
          status: 'ACCEPTED',
          createdAt: new Date().toISOString(),
        });
      } else {
        const active = partnerships.find(
          (p) => (p.role === 'MENTOR' || p.role === 'SPIRITUAL_MENTOR') && (p.status === 'ACCEPTED' || p.status === 'PENDING_TERMINATION')
        );
        setActiveMentorship(active || null);
      }
    } catch (err) {
      console.warn('Failed to load mentorship connection in app root:', err);
    }
  };

  useEffect(() => {
    loadMentorship();
  }, [isDemoSession]);

  // Sync messages globally
  useEffect(() => {
    if (isDemoSession) {
      setChatMessages([
        {
          id: 'msg-1',
          partnershipId: 'p-1',
          senderId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
          senderFullName: 'Sheikh Ahmad Al-Taji',
          senderUsername: 'sheikh_ahmad',
          messageContent: 'Assalamu alaikum! Remember to guard your gaze and keep up your daily Muhasabah check-ins.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } else if (activeMentorship) {
      const fetchMessages = async () => {
        try {
          const msgs = await getPartnershipMessages(activeMentorship.id);
          setChatMessages(msgs);
        } catch (err) {
          console.warn('Failed to load chat messages in app root:', err);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    } else {
      setChatMessages([]);
    }
  }, [activeMentorship, isDemoSession]);

  const handleSendMessage = async (content: string) => {
    if (isDemoSession) {
      const newMsg: MentorshipChatMessage = {
        id: `msg-${Date.now()}`,
        partnershipId: 'p-1',
        senderId: 'demo-user-1',
        senderFullName: 'Alex Smith',
        senderUsername: 'alex_smith',
        messageContent: content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            partnershipId: 'p-1',
            senderId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            senderFullName: 'Sheikh Ahmad Al-Taji',
            senderUsername: 'sheikh_ahmad',
            messageContent: 'Barakallahu feek. Stay strong and continue in prayer.',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 2000);
    } else if (activeMentorship) {
      try {
        const newMsg = await sendPartnershipMessage(activeMentorship.id, content);
        setChatMessages((prev) => [...prev, newMsg]);
      } catch (err) {
        console.warn('Failed to send message:', err);
      }
    }
  };

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
            <GuidancePage 
              onOpenMenteesPage={() => setActiveTab('mentees')} 
              onOpenChat={() => setIsChatOpen(true)}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsPage onOpenChat={() => setIsChatOpen(true)} />
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

      {/* Global slide-in Mentorship Chat drawer */}
      {activeMentorship && (
        <>
          <div 
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
              isChatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsChatOpen(false)}
          />
          <div 
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800/80 flex flex-col transform transition-all duration-300 ease-in-out ${
              isChatOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
            }`}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-455 text-sm font-bold select-none">✵</span>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Mentor Chat
                </h3>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/10 dark:bg-slate-950/20">
              <MentorshipChat
                partnerName={activeMentorship.partnerFullName || 'Spiritual Mentor'}
                inviteCode={activeMentorship.inviteCode}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </>
      )}
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
