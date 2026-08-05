import React, { useState, useEffect } from 'react';
import { Home, AlertTriangle, CalendarCheck, Users, Settings, ShieldCheck, Flame, LogOut, User as UserIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { NavTab } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { getMentees } from '../../services/partnerService';

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
  const { user, logout, isDemoSession } = useAuth();
  const role = user?.role || 'USER';
  const [activeMenteesCount, setActiveMenteesCount] = useState<number>(3);

  useEffect(() => {
    if (role === 'MENTOR') {
      if (isDemoSession) {
        setActiveMenteesCount(3);
      } else {
        getMentees()
          .then((chains) => {
            setActiveMenteesCount(chains.length);
          })
          .catch(() => {});
      }
    }
  }, [role, isDemoSession]);

  const navItems: NavItem[] = role === 'ADMIN' ? [
    { id: 'dashboard', label: 'System Overview', icon: Home },
    { id: 'guidance', label: 'Audit & Approvals', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] : role === 'MENTOR' ? [
    { id: 'dashboard', label: 'Mentee Roster', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'checkin', label: 'Daily Check-In', icon: CalendarCheck },
    { id: 'emergency', label: 'SOS Urge Interrupter', icon: AlertTriangle, isSos: true },
    { id: 'guidance', label: 'Guidance & Mentors', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 p-5 h-screen sticky top-0 justify-between shrink-0">
      <div className="space-y-4">
        {/* Sleek App Brand Header block */}
        <div className="space-y-4 pb-4 border-b border-slate-150 dark:border-slate-900/60 bg-slate-50/50 dark:bg-slate-950/20 -mx-5 px-5 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-250 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5 uppercase">
                Breaking Chains <span className="text-emerald-655 dark:text-emerald-400 select-none text-[10px]">✵</span>
              </h1>
              <p className="text-[9px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider">PMO Recovery Platform</p>
            </div>
          </div>

          {/* User Badge */}
          {user && (
            <div className="flex items-center gap-2.5 py-0.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs shrink-0 shadow-xs">
                <UserIcon className="w-4 h-4 text-emerald-655 dark:text-emerald-450" />
              </div>
              <div className="overflow-hidden text-left flex-1 min-w-0">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 block truncate leading-tight">{user.fullName}</span>
                <span className="text-[10px] text-slate-700 dark:text-slate-400 block truncate leading-tight font-semibold">@{user.username}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-700 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-455 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Minimalist Live Streak Metric */}
        {role === 'USER' ? (
          <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/60 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Current Streak</span>
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
                {currentStreak} Days
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
              <span>Clean Ratio</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cleanRatioPercent}%</span>
            </div>
          </div>
        ) : role === 'MENTOR' ? (
          <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/60 p-3 rounded-xl space-y-1 text-xs text-slate-700 dark:text-slate-400">
            <div className="flex justify-between font-semibold">
              <span>Mentees Cap</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {activeMenteesCount}/10 Active
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/60 p-3 rounded-xl space-y-1 text-xs text-slate-700 dark:text-slate-400">
            <div className="flex justify-between font-semibold">
              <span>System Health</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">100% Online</span>
            </div>
          </div>
        )}

        {/* Minimal Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isSos) {
              return (
                <button
                  key={item.id}
                  onClick={onTriggerSos}
                  className="w-full mt-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all duration-200"
                >
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
