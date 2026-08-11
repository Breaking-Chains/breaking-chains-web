import React from 'react';
import { Home, CalendarCheck, Users, Settings, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentStreak: _currentStreak = 18,
  cleanRatioPercent: _cleanRatioPercent = 94.7,
}) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'USER';

  const navItems: NavItem[] = role === 'ADMIN' ? [
    { id: 'dashboard', label: 'System Overview', icon: Home },
    { id: 'guidance', label: 'Audit & Approvals', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] : role === 'MENTOR' ? [
    { id: 'dashboard', label: 'Mentee Roster', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'guidance', label: 'Mentorship', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: CalendarCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background border-r border-outline-variant p-6 h-screen sticky top-0 justify-between shrink-0 z-40">
      <div className="flex flex-col gap-6">
        {/* Sleek App Brand Header block */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex items-center justify-center border border-outline-variant shrink-0">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-manrope text-sm font-bold text-primary leading-tight">Recovery Path</h2>
            <p className="font-geist text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">One day at a time</p>
          </div>
        </div>

        {/* Log Daily Check-in Button */}
        {role === 'USER' && (
          <button
            onClick={() => onTabChange('checkin')}
            className="bg-primary hover:bg-primary/90 text-on-primary font-manrope text-xs font-bold rounded-xl py-3 px-4 w-full flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Log Daily Check-in</span>
          </button>
        )}

        {/* Minimal Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-surface-container border border-outline-variant text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-on-surface-variant')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-outline-variant pt-4 space-y-2">
        {/* User Info Block */}
        {user && (
          <div className="flex items-center gap-2.5 py-1.5 px-2 bg-surface-container-low rounded-xl border border-outline-variant/40 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
              {user.fullName[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden text-left flex-1 min-w-0">
              <span className="text-[11px] font-bold text-on-surface block truncate leading-tight">{user.fullName}</span>
              <span className="text-[9px] text-on-surface-variant block truncate leading-tight">@{user.username}</span>
            </div>
          </div>
        )}

        {role === 'USER' && (
          <button
            onClick={() => onTabChange('privacy')}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer',
              activeTab === 'privacy'
                ? 'bg-surface-container border border-outline-variant text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy</span>
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-error hover:bg-error-container/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
