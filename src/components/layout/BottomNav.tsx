import { Home, AlertTriangle, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export type NavTab = 'dashboard' | 'checkin' | 'emergency' | 'guidance' | 'mentees' | 'analytics' | 'settings';

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
  const { user } = useAuth();
  const role = user?.role || 'USER';

  const tabs: TabItem[] = role === 'ADMIN' ? [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'guidance', label: 'Audit', icon: Users },
  ] : role === 'MENTOR' ? [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'guidance', label: 'Chat', icon: Users },
  ] : [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'emergency', label: 'SOS Urge', icon: AlertTriangle, isSos: true },
    { id: 'guidance', label: 'Guidance', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/90 py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSos) {
            return (
              <button
                key={tab.id}
                onClick={onTriggerSos}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none cursor-pointer"
                aria-label="Trigger 1-Tap SOS Emergency Interrupter"
              >
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 shadow-md shadow-rose-500/10 dark:shadow-rose-950/30 flex items-center justify-center group-active:scale-95 transition-transform hover:shadow-rose-500/20">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 stroke-[2.2]" />
                </div>
                <span className="text-[9px] font-bold text-rose-700 dark:text-rose-400 mt-1.5 uppercase tracking-wider">
                  SOS Helper
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-h-[48px] min-w-[56px] cursor-pointer',
                isActive ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
