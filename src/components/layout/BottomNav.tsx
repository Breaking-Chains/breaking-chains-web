import React from 'react';
import { Home, AlertTriangle, CalendarCheck, Users, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type NavTab = 'dashboard' | 'checkin' | 'emergency' | 'guidance' | 'analytics' | 'settings';

interface TabItem {
  id: NavTab;
  label: string;
  icon: LucideIcon;
  isSos?: boolean;
}

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onTriggerSos,
}) => {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'checkin', label: 'Check-In', icon: CalendarCheck },
    { id: 'emergency', label: 'SOS Urge', icon: AlertTriangle, isSos: true },
    { id: 'guidance', label: 'Guidance', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSos) {
            return (
              <button
                key={tab.id}
                onClick={onTriggerSos}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
                aria-label="Trigger 1-Tap SOS Emergency Interrupter"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-xl shadow-rose-950/70 border-2 border-slate-950 flex items-center justify-center animate-pulse-glow group-active:scale-90 transition-transform">
                  <AlertTriangle className="w-7 h-7 text-white stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-rose-400 mt-1 uppercase tracking-wider">
                  SOS Panic
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[56px]',
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-[11px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
