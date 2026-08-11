import React from 'react';
import { Home, Users, Calendar, User as UserIcon, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export type NavTab = 'dashboard' | 'checkin' | 'emergency' | 'guidance' | 'mentees' | 'analytics' | 'settings' | 'meetings' | 'privacy';

interface TabItem {
  id: NavTab;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { user } = useAuth();
  const role = user?.role || 'USER';

  const tabs: TabItem[] = role === 'ADMIN' ? [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'guidance', label: 'Audit', icon: Users },
  ] : role === 'MENTOR' ? [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] : [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'guidance', label: 'Community', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'settings', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/90 py-2 px-3 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[56px] cursor-pointer',
                isActive ? 'text-primary dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110 text-primary dark:text-white')} />
              <span className="text-[11px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
