import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePmo } from '../context/PmoContext';
import { useAuth } from '../context/AuthContext';
import { getCheckInLogs } from '../services/logService';
import type { LogEntry, LogStatus } from '../types/log';
import type { NavTab } from '../components/layout/BottomNav';
import { Flame, Trophy, History, Lock, Calendar, AlertTriangle } from 'lucide-react';
import dashboardContent from '../data/dashboardContent.json';
import './DashboardPage.css';

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface DashboardPageProps {
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
  onTabChange?: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onTabChange,
}) => {
  const { currentStreak, chain, analytics, isOfflineDemo, apiError } = usePmo();
  const { user } = useAuth();
  
  const [selectedDayStr, setSelectedDayStr] = useState<string>(() => getLocalDateString(new Date()));

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

  const { data: logsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['chain-logs', chain?.id],
    queryFn: () => getCheckInLogs(chain!.id),
    enabled: !!chain?.id && !isOfflineDemo,
  });

  const logs = isOfflineDemo ? generateDemoLogs() : (logsData || []);

  const [drawerType, setDrawerType] = useState<'current' | 'longest' | 'slips' | null>(null);

  // 1. Compute logs belonging to the current active streak
  const currentStreakDetails = useMemo(() => {
    if (isOfflineDemo) {
      return {
        days: 8,
        logs: [
          { id: 'mock-1', logTimestamp: '2026-08-12T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-2', logTimestamp: '2026-08-11T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-3', logTimestamp: '2026-08-10T20:00:00Z', status: 'URGE_RESISTED' as LogStatus },
          { id: 'mock-4', logTimestamp: '2026-08-09T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-5', logTimestamp: '2026-08-08T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-6', logTimestamp: '2026-08-07T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-7', logTimestamp: '2026-08-06T20:00:00Z', status: 'CLEAN' as LogStatus },
          { id: 'mock-8', logTimestamp: '2026-08-05T20:00:00Z', status: 'CLEAN' as LogStatus },
        ]
      };
    }
    
    const streakLogs: LogEntry[] = [];
    const today = new Date();
    const curr = new Date(today);
    const chainStart = chain?.startDate ? new Date(chain.startDate) : today;
    const chainStartStr = getLocalDateString(chainStart);
    
    let loops = 0;
    while (loops < 365) {
      loops++;
      const dateStr = getLocalDateString(curr);
      if (dateStr < chainStartStr) break;
      
      const dayLogs = logs.filter(l => getLocalDateString(new Date(l.logTimestamp)) === dateStr);
      const hasSlip = dayLogs.some(l => l.status === 'SLIP_UP');
      if (hasSlip) break;
      
      dayLogs.forEach(l => streakLogs.push(l));
      curr.setDate(curr.getDate() - 1);
    }
    
    streakLogs.sort((a, b) => b.logTimestamp.localeCompare(a.logTimestamp));
    return {
      days: currentStreak,
      logs: streakLogs
    };
  }, [logs, chain, currentStreak, isOfflineDemo]);

  // 2. Compute date boundaries for the longest pure streak period
  const longestStreakDetails = useMemo(() => {
    if (isOfflineDemo) {
      return {
        days: 128,
        startDateStr: '2026-02-07',
        endDateStr: '2026-06-15'
      };
    }
    
    if (logs.length === 0) {
      return { days: 0, startDateStr: '', endDateStr: '' };
    }
    
    const today = new Date();
    const chainStart = chain?.startDate ? new Date(chain.startDate) : today;
    const daysDiff = Math.max(0, Math.floor((today.getTime() - chainStart.getTime()) / (1000 * 60 * 60 * 24))) + 1;
    
    let longest = 0;
    let longestStart = '';
    let longestEnd = '';
    
    let running = 0;
    let runningStart = '';
    
    for (let i = 0; i < daysDiff; i++) {
      const curr = new Date(chainStart);
      curr.setDate(chainStart.getDate() + i);
      const dateStr = getLocalDateString(curr);
      
      const dayLogs = logs.filter(l => getLocalDateString(new Date(l.logTimestamp)) === dateStr);
      const hasSlip = dayLogs.some(l => l.status === 'SLIP_UP');
      
      if (hasSlip) {
        if (running > longest) {
          longest = running;
          longestStart = runningStart;
          longestEnd = getLocalDateString(new Date(curr.getTime() - 24 * 60 * 60 * 1000));
        }
        running = 0;
        runningStart = '';
      } else {
        if (running === 0) {
          runningStart = dateStr;
        }
        running++;
        if (i === daysDiff - 1) {
          if (running > longest) {
            longest = running;
            longestStart = runningStart;
            longestEnd = dateStr;
          }
        }
      }
    }
    
    return {
      days: analytics?.longestStreak ?? longest,
      startDateStr: longestStart,
      endDateStr: longestEnd
    };
  }, [logs, chain, analytics, isOfflineDemo]);

  // 3. Compute chronological relapses history list
  const slipUpsDetails = useMemo(() => {
    const slipLogs = logs.filter(l => l.status === 'SLIP_UP');
    slipLogs.sort((a, b) => b.logTimestamp.localeCompare(a.logTimestamp));
    return slipLogs;
  }, [logs]);

  // Compute total relapses
  const totalRelapses = isOfflineDemo 
    ? 3 
    : logs.filter((log) => log.status === 'SLIP_UP').length;

  const longestStreak = analytics?.longestStreak ?? chain?.longestStreak ?? (isOfflineDemo ? 128 : currentStreak);

  const generateHeatmapGrid = () => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const cells: { dateStr: string; status?: LogStatus }[] = [];
    
    // End date is Saturday of the current week to align columns perfectly
    const endDate = new Date(today);
    const daysUntilSaturday = 6 - today.getDay();
    endDate.setDate(today.getDate() + daysUntilSaturday);
    
    // Start date is 363 days before the end date (52 weeks * 7 days - 1 = 363)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 363);
    
    const lookup: Record<string, LogStatus> = {};
    logs.forEach((log) => {
      const localDate = new Date(log.logTimestamp);
      const dateStr = getLocalDateString(localDate);
      const existing = lookup[dateStr];
      if (!existing || log.status === 'SLIP_UP') {
        lookup[dateStr] = log.status;
      }
    });

    const totalCells = 52 * 7;
    for (let i = 0; i < totalCells; i++) {
      const currentCellDate = new Date(startDate);
      currentCellDate.setDate(startDate.getDate() + i);
      const dateStr = getLocalDateString(currentCellDate);
      
      const isFuture = dateStr > todayStr;

      let status = lookup[dateStr];
      if (isOfflineDemo && !isFuture && !status) {
        // Mock some recovery days for offline demo
        const cellDate = new Date(currentCellDate);
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

  const { header, stats, journey, privacy } = dashboardContent;

  return (
    <div className="db-container animate-fade-in">
      {apiError && (
        <div className="db-api-error">
          <AlertTriangle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="db-header-section">
        <div>
          <h1 className="db-welcome-text">
            {header.welcomePrefix} {user?.fullName || 'User'}
          </h1>
          <p className="db-tagline-text">
            {header.tagline}
          </p>
        </div>
        <div className="db-actions-container">
          <button
            onClick={() => onTabChange && onTabChange('meetings')}
            className="db-btn-meeting animate-pulse-glow"
          >
            <Calendar className="w-4 h-4" />
            <span>{header.btnMeeting}</span>
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="db-stats-grid">
        {/* Card 1: Current Streak */}
        <div 
          className="db-stat-card cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-all select-none active:scale-[0.98]"
          onClick={() => setDrawerType('current')}
          title="Click to view current streak details"
        >
          <div className="db-stat-icon-wrapper db-stat-icon-primary">
            <Flame className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="db-stat-label">{stats.currentStreak.label}</h3>
          <div className="db-stat-val-container">
            <span className="db-stat-value">{currentStreak}</span>
            <span className="db-stat-unit">{stats.currentStreak.unit}</span>
          </div>
        </div>

        {/* Card 2: Longest Streak */}
        <div 
          className="db-stat-card cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800 transition-all select-none active:scale-[0.98]"
          onClick={() => setDrawerType('longest')}
          title="Click to view longest streak details"
        >
          <div className="db-stat-icon-wrapper db-stat-icon-secondary">
            <Trophy className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="db-stat-label">{stats.longestStreak.label}</h3>
          <div className="db-stat-val-container">
            <span className="db-stat-value">{longestStreak}</span>
            <span className="db-stat-unit">{stats.longestStreak.unit}</span>
          </div>
        </div>

        {/* Card 3: Total Relapses */}
        <div 
          className="db-stat-card cursor-pointer hover:border-rose-300 dark:hover:border-rose-800 transition-all select-none active:scale-[0.98]"
          onClick={() => setDrawerType('slips')}
          title="Click to view relapse analysis"
        >
          <div className="db-stat-icon-wrapper db-stat-icon-tertiary">
            <History className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="db-stat-label">{stats.totalRelapses.label}</h3>
          <div className="db-stat-val-container">
            <span className="db-stat-value">{isLoadingLogs ? '...' : totalRelapses}</span>
          </div>
        </div>
      </section>

      {/* Recovery Journey Heatmap Section */}
      <section className="db-heatmap-card">
        <div className="db-heatmap-header">
          <h2 className="db-heatmap-title">{journey.title}</h2>
          
          <div className="db-heatmap-legend">
            <div className="db-heatmap-legend-item">
              <div className="db-heatmap-legend-color db-heatmap-color-relapse"></div>
              <span>{journey.legendRelapse}</span>
            </div>
            <div className="db-heatmap-legend-item">
              <div className="db-heatmap-legend-color db-heatmap-color-edged"></div>
              <span>{journey.legendEdged}</span>
            </div>
            <div className="db-heatmap-legend-item">
              <div className="db-heatmap-legend-color db-heatmap-color-empty"></div>
              <span>{journey.legendEmpty}</span>
            </div>
            <div className="db-heatmap-legend-item">
              <div className="db-heatmap-legend-color db-heatmap-color-sober"></div>
              <span>{journey.legendSober}</span>
            </div>
          </div>
        </div>

        <div className="db-heatmap-grid-scroll">
          <div className="db-heatmap-grid">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="db-heatmap-col">
                {col.map((cell) => {
                  let colorClass = 'db-heatmap-color-empty';
                  if (cell.status === 'SLIP_UP') {
                    colorClass = 'db-heatmap-color-relapse';
                  } else if (cell.status === 'CLEAN' || cell.status === 'URGE_RESISTED') {
                    colorClass = 'db-heatmap-color-sober';
                  } else if (cell.status === 'PEEKED_EDGED') {
                    colorClass = 'db-heatmap-color-edged';
                  }
                  
                  const isSelected = cell.dateStr === selectedDayStr;
                  return (
                    <div
                      key={cell.dateStr}
                      className={`db-heatmap-cell ${colorClass} ${isSelected ? 'db-heatmap-cell-selected' : ''}`}
                      title={`${cell.dateStr} (${cell.status || 'No Log'}) - Click for details`}
                      onClick={() => setSelectedDayStr(cell.dateStr)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Details Log Section */}
      <section className="db-day-details-card animate-fade-in">
        <div className="db-day-details-header">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h2 className="db-day-details-title">
                Struggles & Reflections
              </h2>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold sm:pl-2 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 select-none">
              {new Date(selectedDayStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="db-day-details-picker-container">
            <input
              type="date"
              value={selectedDayStr}
              max={getLocalDateString(new Date())}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDayStr(e.target.value);
                }
              }}
              className="db-day-details-date-input"
            />
          </div>
        </div>

        {(() => {
          const dayLogs = logs.filter(log => {
            const dateStr = getLocalDateString(new Date(log.logTimestamp));
            return dateStr === selectedDayStr;
          }).sort((a, b) => a.logTimestamp.localeCompare(b.logTimestamp));

          if (dayLogs.length === 0) {
            return (
              <div className="db-day-details-empty">
                <AlertTriangle className="w-8 h-8 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
                <p>No check-in logs submitted on this day.</p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Use the "Log Daily Check-in" button to record details.</span>
              </div>
            );
          }

          return (
            <div className="db-day-details-timeline">
              {dayLogs.map((log) => {
                const logTime = new Date(log.logTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let badgeClass = 'badge-empty';
                let statusText = log.status.replace('_', ' ');
                if (log.status === 'SLIP_UP') {
                  badgeClass = 'badge-relapse';
                } else if (log.status === 'CLEAN') {
                  badgeClass = 'badge-sober';
                } else if (log.status === 'URGE_RESISTED') {
                  badgeClass = 'badge-resisted';
                  statusText = 'Urge Resisted';
                } else if (log.status === 'PEEKED_EDGED') {
                  badgeClass = 'badge-edged';
                  statusText = 'Peeked / Edged';
                }

                return (
                  <div key={log.id} className="db-day-log-card">
                    <div className="db-day-log-header">
                      <div className="db-day-log-meta">
                        <span className="db-day-log-time">{logTime}</span>
                        <span className={`db-day-log-status ${badgeClass}`}>
                          {statusText}
                        </span>
                      </div>
                      
                      {log.triggerTag && (
                        <span className="db-day-log-trigger">
                          Trigger: {log.triggerTag.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    {log.notes ? (
                      <blockquote className="db-day-log-notes">
                        "{log.notes}"
                      </blockquote>
                    ) : (
                      <p className="db-day-log-no-notes">No reflection journal logged for this entry.</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* Privacy Shield lock banner */}
      <div className="db-privacy-banner">
        <Lock className="db-privacy-icon" />
        <span>{privacy.shieldText}</span>
      </div>

      {/* Side Drawer Details Overlay */}
      {drawerType && (
        <div className="db-drawer-overlay animate-fade-in" onClick={() => setDrawerType(null)}>
          <div className="db-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="db-drawer-header">
              <h3 className="db-drawer-title">
                {drawerType === 'current' && 'Current Streak Details'}
                {drawerType === 'longest' && 'Longest Streak Details'}
                {drawerType === 'slips' && 'Slip-up & Relapse Analysis'}
              </h3>
              <button className="db-drawer-close" onClick={() => setDrawerType(null)}>×</button>
            </div>
            
            <div className="db-drawer-body">
              {drawerType === 'current' && (
                <div className="space-y-6">
                  <div className="db-drawer-metric-card border-l-4 border-l-blue-500">
                    <span className="db-drawer-metric-label">Current Active Streak</span>
                    <span className="db-drawer-metric-val text-blue-600 dark:text-blue-400 font-mono">{currentStreakDetails.days} Days</span>
                    <p className="db-drawer-metric-subtitle">Since your last slip-up. Keep defending your clean days!</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="db-drawer-section-title">Streak Log Timeline</h4>
                    <div className="db-drawer-timeline-container">
                      {currentStreakDetails.logs.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-6">No logs recorded in this active streak yet.</p>
                      ) : (
                        currentStreakDetails.logs.map((log, idx) => (
                          <div key={log.id || idx} className="db-drawer-timeline-item">
                            <span className="db-drawer-timeline-date font-mono">
                              {new Date(log.logTimestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className={`db-drawer-timeline-badge ${log.status === 'CLEAN' ? 'badge-sober' : 'badge-resisted'}`}>
                              {log.status === 'CLEAN' ? 'Clean' : 'Urge Resisted'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {drawerType === 'longest' && (
                <div className="space-y-6">
                  <div className="db-drawer-metric-card border-l-4 border-l-emerald-500">
                    <span className="db-drawer-metric-label">Longest Pure Streak</span>
                    <span className="db-drawer-metric-val text-emerald-600 dark:text-emerald-400 font-mono">{longestStreakDetails.days} Days</span>
                    <p className="db-drawer-metric-subtitle">Your peak neural recovery period. You have proven you can sustain this!</p>
                  </div>
                  {longestStreakDetails.startDateStr && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Peak Streak Window</span>
                      <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200 block">
                        {new Date(longestStreakDetails.startDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="text-slate-400 font-normal px-2">➔</span>
                        {new Date(longestStreakDetails.endDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-350 leading-relaxed font-medium">
                    📖 <strong>Barakah Note:</strong> "Self-discipline is built one decision at a time. The fact that you have achieved a {longestStreakDetails.days}-day streak shows that your neurochemistry is fully capable of rewiring. Stay patient, renew your intent daily, and focus on one day at a time."
                  </div>
                </div>
              )}

              {drawerType === 'slips' && (
                <div className="space-y-6">
                  <div className="db-drawer-metric-card border-l-4 border-l-rose-500">
                    <span className="db-drawer-metric-label">Total Slip-Ups</span>
                    <span className="db-drawer-metric-val text-rose-600 dark:text-rose-400 font-mono">{slipUpsDetails.length} Instances</span>
                    <p className="db-drawer-metric-subtitle">Relapses are data points for trigger swaps, not identity failures.</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="db-drawer-section-title">Trigger & Notes Analysis</h4>
                    <div className="db-drawer-timeline-container">
                      {slipUpsDetails.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-550 italic text-center py-6">No slip-ups recorded. Alhamdulillah!</p>
                      ) : (
                        slipUpsDetails.map((log, idx) => (
                          <div key={log.id || idx} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                                {new Date(log.logTimestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {log.triggerTag && (
                                <span className="text-[9px] font-mono font-black uppercase text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/10">
                                  {log.triggerTag.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                            {log.notes ? (
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic pl-3 border-l-2 border-l-rose-500 font-serif">
                                "{log.notes}"
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">No reflection notes logged.</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
