import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { NavTab } from './BottomNav';

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
  currentStreak,
  cleanRatioPercent,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-emerald-500/30">
      <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative border-x border-slate-900 shadow-2xl">
        <Header currentStreak={currentStreak} cleanRatioPercent={cleanRatioPercent} />
        <main className="flex-1 px-4 py-5 pb-28 space-y-5 overflow-y-auto">{children}</main>
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} onTriggerSos={onTriggerSos} />
      </div>
    </div>
  );
};
