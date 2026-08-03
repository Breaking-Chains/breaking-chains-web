import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import type { NavTab } from './BottomNav';
import { useTheme } from '../../context/ThemeContext';
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

      {/* Main Content Workspace (Fully responsive across Mobile & Desktop) */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden">
        {/* Mobile Header (hidden on md and up) */}
        <div className="md:hidden">
          <Header
            currentStreak={currentStreak}
            cleanRatioPercent={cleanRatioPercent}
            onOpenSettings={() => onTabChange('settings')}
          />
        </div>

        {/* Desktop Header Topbar (visible on md and up) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 capitalize">
              {activeTab === 'dashboard' ? 'PMO Recovery Command Center' : activeTab}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Islamic Spiritual Psychology (*Tazkiyah*) & Dopamine Neuro-Reboot
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onTriggerSos}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 animate-pulse-glow transition-all"
            >
              1-Tap SOS Urge Interrupter
            </button>
          </div>
        </header>

        {/* Responsive Content Container */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 pb-24 md:pb-10 max-w-7xl mx-auto w-full space-y-6">
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
