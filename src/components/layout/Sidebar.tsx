import React from 'react';
import { Home, AlertTriangle, CalendarCheck, Users, BarChart3, Settings, ShieldCheck, Flame, LogOut, User as UserIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { NavTab } from './BottomNav';
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'checkin', label: 'Daily Check-In', icon: CalendarCheck },
    { id: 'emergency', label: 'SOS Urge Interrupter', icon: AlertTriangle, isSos: true },
    { id: 'guidance', label: 'Guidance & Mentors', icon: Users },
    { id: 'mentees', label: 'My Mentees Roster', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics & Impact', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-900 p-5 h-screen sticky top-0 justify-between shrink-0">
      <div className="space-y-6">
        {/* Sleek App Brand */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-100 tracking-tight">
              Breaking Chains
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">PMO Recovery Platform</p>
          </div>
        </div>

        {/* User Badge */}
        {user && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
              <UserIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="overflow-hidden text-left flex-1">
              <span className="text-xs font-bold text-slate-100 block truncate">{user.fullName}</span>
              <span className="text-[10px] text-slate-400 block truncate">@{user.username}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Minimalist Live Streak Metric */}
        <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Current Streak</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {currentStreak} Days
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1.5 border-t border-slate-800/80">
            <span>Clean Ratio</span>
            <span className="font-mono font-bold text-emerald-400">{cleanRatioPercent}%</span>
          </div>
        </div>

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
                    ? 'bg-slate-900 border border-slate-800 text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
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
