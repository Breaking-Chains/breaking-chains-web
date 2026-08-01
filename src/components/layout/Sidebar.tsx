import React from 'react';
import { Home, AlertTriangle, CalendarCheck, Users, BarChart3, Settings, ShieldCheck, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { QuickHideButton } from '../ui/QuickHideButton';
import type { NavTab } from './BottomNav';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerSos: () => void;
  currentStreak?: number;
  cleanRatioPercent?: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: LucideIcon;
  isSos?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onTriggerSos,
  currentStreak = 18,
  cleanRatioPercent = 94.7,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'checkin', label: 'Daily Check-In', icon: CalendarCheck },
    { id: 'emergency', label: 'SOS Urge Interrupter', icon: AlertTriangle, isSos: true },
    { id: 'guidance', label: 'Guidance & Mentor', icon: Users },
    { id: 'analytics', label: 'Analytics & Barakah', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-950 border-r border-slate-800/80 p-4 h-screen sticky top-0 justify-between shrink-0">
      {/* Top Logo & App Title */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              Breaking Chains
            </h1>
            <p className="text-xs text-emerald-400 font-medium">PMO Recovery Platform</p>
          </div>
        </div>

        {/* Live Streak & Clean Ratio Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Current Streak</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
              {currentStreak} Days Clean
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Clean Ratio</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{cleanRatioPercent}%</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isSos) {
              return (
                <button
                  key={item.id}
                  onClick={onTriggerSos}
                  className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold shadow-lg shadow-rose-950/50 transition-all duration-200 animate-pulse-glow"
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-emerald-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Stealth Privacy Toggle */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-slate-400 font-medium">Stealth Privacy (Satr)</span>
          <QuickHideButton />
        </div>
        <p className="text-[11px] text-slate-500 text-center">
          Breaking Chains v1.0 • Offline Ready
        </p>
      </div>
    </aside>
  );
};
