import React, { useState, useEffect } from 'react';
import { usePmo } from '../context/PmoContext';
import { useAuth } from '../context/AuthContext';
import { getCheckInLogs } from '../services/logService';
import type { LogEntry, LogStatus } from '../types/log';
import type { NavTab } from '../components/layout/BottomNav';
import { Flame, Trophy, History, Lock, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface DashboardPageProps {
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
  onTabChange?: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCheckIn,
  onTabChange,
}) => {
  const { currentStreak, chain, isOfflineDemo, apiError } = usePmo();
  const { user } = useAuth();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Generate demo logs for offline mode to simulate recovery history
  const generateDemoLogs = (): LogEntry[] => {
    const mockLogs: LogEntry[] = [];
    const today = new Date();
    const relapseOffsets = [5, 45, 120]; // relapse 5 days ago, 45 days ago, 120 days ago

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      if (relapseOffsets.includes(i)) {
        mockLogs.push({
          id: `demo-log-${i}`,
          chainId: 'demo-chain-1',
          userId: 'demo-user-1',
          logTimestamp: `${dateStr}T20:00:00Z`,
          status: 'SLIP_UP',
        });
      } else if (i > 5) {
        mockLogs.push({
          id: `demo-log-${i}`,
          chainId: 'demo-chain-1',
          userId: 'demo-user-1',
          logTimestamp: `${dateStr}T20:00:00Z`,
          status: 'CLEAN',
        });
      }
    }
    return mockLogs;
  };

  useEffect(() => {
    if (!chain) {
      setIsLoadingLogs(false);
      return;
    }

    if (isOfflineDemo) {
      setLogs(generateDemoLogs());
      setIsLoadingLogs(false);
    } else {
      setIsLoadingLogs(true);
      getCheckInLogs(chain.id)
        .then((data) => {
          setLogs(data);
        })
        .catch((err) => {
          console.error("Failed to load logs for dashboard:", err);
        })
        .finally(() => {
          setIsLoadingLogs(false);
        });
    }
  }, [chain, isOfflineDemo]);

  // Compute total relapses
  const totalRelapses = isOfflineDemo 
    ? 3 
    : logs.filter((log) => log.status === 'SLIP_UP').length;

  const longestStreak = chain?.longestStreak ?? (isOfflineDemo ? 128 : currentStreak);

  // Generate a chronological 7x52 contribution grid representing the last 364 days
  const generateHeatmapGrid = () => {
    const today = new Date();
    const cells: { dateStr: string; status?: LogStatus }[] = [];
    
    // First day is 363 days ago to fit exactly 52 columns * 7 rows = 364 cells
    const startDate = new Date();
    startDate.setDate(today.getDate() - 363);
    
    // Pad to start of week (Sunday is 0)
    const startDayOfWeek = startDate.getDay();
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() - startDayOfWeek);
    
    const lookup: Record<string, LogStatus> = {};
    logs.forEach((log) => {
      const dateStr = log.logTimestamp.split('T')[0];
      const existing = lookup[dateStr];
      if (!existing || log.status === 'SLIP_UP') {
        lookup[dateStr] = log.status;
      }
    });

    const totalCells = 52 * 7;
    for (let i = 0; i < totalCells; i++) {
      const currentCellDate = new Date(adjustedStartDate);
      currentCellDate.setDate(adjustedStartDate.getDate() + i);
      const dateStr = currentCellDate.toISOString().split('T')[0];
      
      const cellDate = new Date(dateStr);
      const isFuture = cellDate > today;

      let status = lookup[dateStr];
      if (isOfflineDemo && !isFuture && !status) {
        // Mock some recovery days for offline demo
        const offset = Math.floor((today.getTime() - cellDate.getTime()) / (1000 * 60 * 60 * 24));
        if ([5, 45, 120].includes(offset)) {
          status = 'SLIP_UP';
        } else if (offset > 5) {
          status = 'CLEAN';
        }
      }

      cells.push({
        dateStr,
        status: isFuture ? undefined : status,
      });
    }
    
    return cells;
  };

  const cells = generateHeatmapGrid();
  // Chunk cells into columns of 7 rows
  const columns = [];
  for (let c = 0; c < 52; c++) {
    columns.push(cells.slice(c * 7, (c + 1) * 7));
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-[1140px] mx-auto pb-8">
      {apiError && (
        <div className="p-3 rounded-lg bg-error-container border border-error border-opacity-20 text-on-error-container text-xs font-semibold text-center shadow-sm">
          ⚠️ {apiError}
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-manrope text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p className="font-label-sm text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
            Stay strong on your journey
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onOpenCheckIn}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-error-container text-on-error-container font-manrope text-xs font-bold px-6 py-3 rounded-lg border border-error border-opacity-20 hover:bg-opacity-80 transition-all cursor-pointer shadow-xs"
          >
            <AlertTriangle className="w-4 h-4 text-error" />
            <span>Record a Relapse</span>
          </button>
          
          <button
            onClick={() => onTabChange && onTabChange('meetings')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary font-manrope text-xs font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-xs animate-pulse-glow"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Request Meeting</span>
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current Streak */}
        <Card variant="glass" className="p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-outline-variant/60 shadow-2xs">
          <Flame className="w-8 h-8 text-primary mb-2 stroke-[2.2]" />
          <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Current Streak</h3>
          <div className="flex items-baseline gap-1">
            <span className="font-manrope text-3xl font-black text-primary font-mono">{currentStreak}</span>
            <span className="font-inter text-xs text-on-surface-variant">days</span>
          </div>
        </Card>

        {/* Card 2: Longest Streak */}
        <Card variant="glass" className="p-6 flex flex-col items-center justify-center border border-outline-variant/60 shadow-2xs">
          <Trophy className="w-8 h-8 text-secondary mb-2 stroke-[2.2]" />
          <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Longest Streak</h3>
          <div className="flex items-baseline gap-1">
            <span className="font-manrope text-3xl font-black text-on-surface font-mono">{longestStreak}</span>
            <span className="font-inter text-xs text-on-surface-variant">days</span>
          </div>
        </Card>

        {/* Card 3: Total Relapses */}
        <Card variant="glass" className="p-6 flex flex-col items-center justify-center border border-outline-variant/60 shadow-2xs">
          <History className="w-8 h-8 text-on-surface-variant mb-2 stroke-[2.2]" />
          <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Total Relapses</h3>
          <div className="flex items-baseline gap-1">
            <span className="font-manrope text-3xl font-black text-on-surface font-mono">
              {isLoadingLogs ? '...' : totalRelapses}
            </span>
          </div>
        </Card>
      </section>

      {/* Recovery Journey Heatmap Section */}
      <section className="bg-surface rounded-xl border border-outline-variant p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <h2 className="font-manrope text-sm md:text-base font-bold text-primary">Recovery Journey</h2>
          
          <div className="flex items-center gap-4 font-label-sm text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-error"></div>
              <span>Relapse</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#F1F5F9] dark:bg-slate-900 border border-outline-variant/30"></div>
              <span>Empty</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-secondary"></div>
              <span>Sober</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <div className="min-w-[700px] flex gap-1 justify-between select-none">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1 shrink-0">
                {col.map((cell) => {
                  let colorClass = 'bg-[#F1F5F9] dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60';
                  if (cell.status === 'SLIP_UP') {
                    colorClass = 'bg-error border-error/20';
                  } else if (cell.status === 'CLEAN' || cell.status === 'URGE_RESISTED') {
                    colorClass = 'bg-secondary border-secondary/20';
                  } else if (cell.status === 'PEEKED_EDGED') {
                    colorClass = 'bg-amber-500 border-amber-600/20';
                  }
                  
                  return (
                    <div
                      key={cell.dateStr}
                      className={`w-3.5 h-3.5 rounded-[2px] transition-all hover:scale-115 ${colorClass}`}
                      title={`${cell.dateStr} (${cell.status || 'No Log'})`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Shield lock banner */}
      <div className="flex items-center justify-center gap-2 py-4 border-t border-outline-variant/40 text-on-surface-variant font-geist text-xs font-semibold">
        <Lock className="w-3.5 h-3.5 text-on-surface-variant/80" />
        <span>Privacy Shield Active: Your data is encrypted and zero-knowledge protected.</span>
      </div>
    </div>
  );
};
