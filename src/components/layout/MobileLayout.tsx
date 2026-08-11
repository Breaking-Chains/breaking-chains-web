import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import type { NavTab } from './BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerSos: () => void;
  currentStreak?: number;
  cleanRatioPercent?: number;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onTriggerSos,
  currentStreak = 18,
  cleanRatioPercent = 94.7,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.role || 'USER';

  const getHeaderTitle = () => {
    if (role === 'ADMIN') {
      return activeTab === 'dashboard' ? 'System Overview Panel' : activeTab === 'guidance' ? 'Mentor Audit & Compliance' : activeTab;
    }
    if (role === 'MENTOR') {
      return activeTab === 'dashboard' ? 'Mentees Roster Dashboard' : activeTab === 'guidance' ? 'Confidential Recovery Counsel' : activeTab;
    }
    return activeTab === 'dashboard' ? 'PMO Recovery Dashboard' : activeTab === 'guidance' ? 'Community Guidance' : activeTab;
  };

  const getHeaderSubtitle = () => {
    if (role === 'ADMIN') {
      return activeTab === 'dashboard' ? 'Global statistics & active guides engagement' : 'Audit logs, applications & policy triggers';
    }
    if (role === 'MENTOR') {
      return activeTab === 'dashboard' ? 'Active recoverees & wudu check-in monitors' : 'Encrypted direct Nasiha advisory chat';
    }
    if (activeTab === 'dashboard') return 'Your healing progress & daily reflection';
    if (activeTab === 'guidance') return 'Confidential spiritual counsel & guidance';
    if (activeTab === 'analytics') return 'Spiritual psychology & reboot metrics';
    if (activeTab === 'meetings') return 'Your upcoming counsel meetings & schedules';
    if (activeTab === 'privacy') return 'End-to-end encryption & privacy standards';
    return 'Urge circuit breakers & emergency resets';
  };

  const isUserDashboard = role === 'USER' && activeTab === 'dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex selection:bg-emerald-500/30">
      {/* Desktop Sidebar (visible on md screens and up) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onTriggerSos={onTriggerSos}
        currentStreak={currentStreak}
        cleanRatioPercent={cleanRatioPercent}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden">
        {/* Mobile Header (hidden on md and up) */}
        <div className="md:hidden">
          <Header
            currentStreak={currentStreak}
            cleanRatioPercent={cleanRatioPercent}
            onOpenSettings={() => onTabChange('settings')}
          />
        </div>

        {/* Desktop Header Topbar (hidden on md and up, and hidden on User Dashboard to match mockup layout) */}
        {!isUserDashboard && (
          <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/40 sticky top-0 z-30">
            <div className="space-y-0.5">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 capitalize flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 select-none">✵</span> {getHeaderTitle()}
              </h2>
              <p className="text-[10px] text-slate-650 dark:text-slate-400 font-medium">
                {getHeaderSubtitle()}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className="p-1.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </header>
        )}

        {/* Responsive Content Container */}
        <main className={`flex-1 px-4 sm:px-6 md:px-8 py-6 pb-24 md:pb-10 max-w-7xl mx-auto w-full space-y-6 ${isUserDashboard ? 'pt-20 md:pt-8' : ''}`}>
          {children}
        </main>

        {/* Mobile Bottom Navigation (hidden on md and up) */}
        <div className="md:hidden">
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} onTriggerSos={onTriggerSos} />
        </div>
      </div>
    </div>
  );
};
