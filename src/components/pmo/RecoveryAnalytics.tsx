import React, { useState, useEffect } from 'react';
import { Flame, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { getCheckInLogs } from '../../services/logService';
import type { LogEntry, LogStatus, PMOTriggerTag } from '../../types/log';

interface RecoveryAnalyticsProps {
  chainId: string;
  isDemo?: boolean;
}

type FilterType = 'day' | 'month' | 'custom';

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Realistic mock logs for the offline demo session spanning the last 45 days
const MOCK_DEMO_LOGS: LogEntry[] = Array.from({ length: 45 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  const dateStr = getLocalDateString(date);

  let status: LogStatus = 'CLEAN';
  let triggerTag: PMOTriggerTag | undefined = undefined;
  let notes = 'Stayed consistent with morning prayers and kept occupied with reading.';

  if (index === 4) {
    status = 'SLIP_UP';
    triggerTag = 'BOREDOM_IDLENESS';
    notes = 'Got isolated in my room after dinner. Slipped up, but committed to starting fresh.';
  } else if (index === 11 || index === 28) {
    status = 'URGE_RESISTED';
    triggerTag = 'STRESS_ANXIETY';
    notes = 'Felt intense urge waves due to work frustration. Stepped outside for fresh air and resisted.';
  } else if (index === 18) {
    status = 'PEEKED_EDGED';
    triggerTag = 'SOCIAL_MEDIA_SCROLLING';
    notes = 'Encountered a soft trigger on social media and peeked. Immediately logged off to guard gaze.';
  } else if (index === 22) {
    status = 'SLIP_UP';
    triggerTag = 'FATIGUE_EXHAUSTION';
    notes = 'Late night exhaustion weakened my defenses. Relapsed, but making tawbah immediately.';
  }

  return {
    id: `mock-log-${index}`,
    chainId: 'demo-chain-1',
    userId: 'demo-user-1',
    logTimestamp: `${dateStr}T20:00:00Z`,
    status,
    triggerTag,
    notes,
  };
});

const getDatesInRange = (startDateStr: string, endDateStr: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const current = new Date(start);
  
  current.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  while (current <= end) {
    dates.push(getLocalDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getDatesInMonth = (monthStr: string): string[] => {
  const [year, month] = monthStr.split('-').map(Number);
  const dates: string[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

export const RecoveryAnalytics: React.FC<RecoveryAnalyticsProps> = ({ chainId, isDemo = false }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('custom');

  // Dates state
  const todayStr = getLocalDateString(new Date());
  const defaultStartStr = getLocalDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  
  const [selectedDay, setSelectedDay] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(todayStr.substring(0, 7)); // YYYY-MM
  const [startDate, setStartDate] = useState<string>(defaultStartStr);
  const [endDate, setEndDate] = useState<string>(todayStr);

  // Dynamic filter state
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedReason, setSelectedReason] = useState<string>('ALL');

  // Dynamically extract unique reasons (triggerTag) across all logs
  const uniqueReasons = React.useMemo(() => {
    const reasons = new Set<string>();
    logs.forEach((log) => {
      if (log.triggerTag) {
        reasons.add(log.triggerTag);
      }
    });
    return Array.from(reasons).sort();
  }, [logs]);

  // Dynamic filter check helper
  const isLogMatchingFilters = React.useCallback((log?: LogEntry) => {
    if (!log) return false;
    if (selectedStatus !== 'ALL' && log.status !== selectedStatus) return false;
    if (selectedReason !== 'ALL' && log.triggerTag !== selectedReason) return false;
    return true;
  }, [selectedStatus, selectedReason]);

  // Fetch / load logs
  useEffect(() => {
    if (isDemo) {
      setLogs(MOCK_DEMO_LOGS);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      getCheckInLogs(chainId)
        .then((data) => {
          setLogs(data);
        })
        .catch((err) => {
          console.error('Failed to load check-in logs for analytics:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [chainId, isDemo]);

  // Handle Month Navigation
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${date.getFullYear()}-${mm}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${date.getFullYear()}-${mm}`);
  };

  // 1. Determine active date range based on filterType
  let activeDates: string[] = [];
  if (filterType === 'day') {
    activeDates = [selectedDay];
  } else if (filterType === 'month') {
    activeDates = getDatesInMonth(selectedMonth);
  } else {
    activeDates = getDatesInRange(startDate, endDate);
  }

  // Calculate padded items for GitHub style 7-row layout
  const gridItems = React.useMemo(() => {
    if (activeDates.length === 0) return [];
    
    // Sort chronological order (activeDates is already chronologically sorted)
    const sorted = [...activeDates].sort();
    const firstDateStr = sorted[0];
    const startDayOfWeek = new Date(firstDateStr).getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    
    const items: { dateStr?: string; isPlaceholder: boolean; dayNum?: number }[] = [];
    
    // Padding at the start
    for (let i = 0; i < startDayOfWeek; i++) {
      items.push({ isPlaceholder: true });
    }
    
    // Actual dates
    sorted.forEach((dateStr) => {
      const dayNum = new Date(dateStr).getDate();
      items.push({ dateStr, isPlaceholder: false, dayNum });
    });
    
    // Padding at the end
    const totalCells = items.length;
    const remainder = totalCells % 7;
    if (remainder > 0) {
      const padEnd = 7 - remainder;
      for (let i = 0; i < padEnd; i++) {
        items.push({ isPlaceholder: true });
      }
    }
    
    return items;
  }, [activeDates]);

  // Map logs to a fast lookup dictionary by YYYY-MM-DD using priority status rules
  const logsLookup = React.useMemo(() => {
    const lookup: Record<string, LogEntry> = {};
    const getStatusWeight = (status: LogStatus): number => {
      switch (status) {
        case 'SLIP_UP': return 4;
        case 'PEEKED_EDGED': return 3;
        case 'URGE_RESISTED': return 2;
        case 'CLEAN': return 1;
        default: return 0;
      }
    };

    logs.forEach((log) => {
      const dateStr = getLocalDateString(new Date(log.logTimestamp));
      const existing = lookup[dateStr];
      if (!existing) {
        lookup[dateStr] = log;
      } else {
        const existingWeight = getStatusWeight(existing.status);
        const currentWeight = getStatusWeight(log.status);
        if (currentWeight > existingWeight) {
          lookup[dateStr] = log;
        } else if (currentWeight === existingWeight) {
          if (new Date(log.logTimestamp) > new Date(existing.logTimestamp)) {
            lookup[dateStr] = log;
          }
        }
      }
    });
    return lookup;
  }, [logs]);

  // Filtered lookup for stats computation (using priority status rules)
  const filteredLogsLookup = React.useMemo(() => {
    const lookup: Record<string, LogEntry> = {};
    const getStatusWeight = (status: LogStatus): number => {
      switch (status) {
        case 'SLIP_UP': return 4;
        case 'PEEKED_EDGED': return 3;
        case 'URGE_RESISTED': return 2;
        case 'CLEAN': return 1;
        default: return 0;
      }
    };

    logs.forEach((log) => {
      if (isLogMatchingFilters(log)) {
        const dateStr = getLocalDateString(new Date(log.logTimestamp));
        const existing = lookup[dateStr];
        if (!existing) {
          lookup[dateStr] = log;
        } else {
          const existingWeight = getStatusWeight(existing.status);
          const currentWeight = getStatusWeight(log.status);
          if (currentWeight > existingWeight) {
            lookup[dateStr] = log;
          } else if (currentWeight === existingWeight) {
            if (new Date(log.logTimestamp) > new Date(existing.logTimestamp)) {
              lookup[dateStr] = log;
            }
          }
        }
      }
    });
    return lookup;
  }, [logs, isLogMatchingFilters]);

  // Compute metrics in active range
  const {
    cleanDays,
    totalDaysTracked,
    cleanRatio,
    longestStreak,
    currentStreak,
    triggersMap,
  } = React.useMemo(() => {
    let clean = 0;
    let slips = 0;
    let totalTracked = 0;
    const triggers: Record<string, number> = {};

    activeDates.forEach((dateStr) => {
      const log = filteredLogsLookup[dateStr];
      if (log) {
        totalTracked++;
        if (log.status === 'CLEAN' || log.status === 'URGE_RESISTED') {
          clean++;
        } else if (log.status === 'SLIP_UP') {
          slips++;
        }

        if (log.triggerTag) {
          const formatted = log.triggerTag.replace(/_/g, ' ');
          triggers[formatted] = (triggers[formatted] || 0) + 1;
        }
      }
    });

    // Calculate streaks inside the filtered range (chronological evaluation)
    const sortedRangeDates = [...activeDates].sort();
    let maxStreak = 0;
    let currStreak = 0;

    sortedRangeDates.forEach((dateStr) => {
      const log = filteredLogsLookup[dateStr];
      if (log && (log.status === 'CLEAN' || log.status === 'URGE_RESISTED')) {
        currStreak++;
        if (currStreak > maxStreak) maxStreak = currStreak;
      } else if (log && log.status === 'SLIP_UP') {
        currStreak = 0;
      }
    });

    const ratio = totalTracked > 0 ? Math.round((clean / totalTracked) * 100) : 100;

    return {
      cleanDays: clean,
      slipUps: slips,
      totalDaysTracked: totalTracked,
      cleanRatio: ratio,
      longestStreak: maxStreak,
      currentStreak: currStreak,
      triggersMap: Object.entries(triggers).sort((a, b) => b[1] - a[1]),
    };
  }, [activeDates, filteredLogsLookup]);

  // List of chronological logs for the timeline (showing all entries, even multiple per day!)
  const timelineLogs = React.useMemo(() => {
    const activeDatesSet = new Set(activeDates);
    return logs
      .filter((log) => {
        const dateStr = getLocalDateString(new Date(log.logTimestamp));
        return activeDatesSet.has(dateStr) && isLogMatchingFilters(log);
      })
      .map((log) => ({
        dateStr: getLocalDateString(new Date(log.logTimestamp)),
        log,
      }));
  }, [logs, activeDates, isLogMatchingFilters]);

  const getHeatmapColorClass = (status?: LogStatus, isMatching = true) => {
    if (!status) return 'bg-slate-100 dark:bg-slate-900 border-slate-205 dark:border-slate-800/80';
    if (!isMatching) return 'bg-slate-105/30 dark:bg-slate-900/35 border-slate-250/20 dark:border-slate-800/10 opacity-30';
    switch (status) {
      case 'CLEAN':
        return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600/20';
      case 'URGE_RESISTED':
        return 'bg-teal-500 hover:bg-teal-600 border-teal-600/20';
      case 'PEEKED_EDGED':
        return 'bg-amber-500 hover:bg-amber-600 border-amber-600/20';
      case 'SLIP_UP':
        return 'bg-rose-500 hover:bg-rose-600 border-rose-600/20';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
        Loading check-in metrics and recovery logs...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Date Filter Segment Controller */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-550/5 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/50">
        <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-950/60 p-1 rounded-xl">
          {(['day', 'month', 'custom'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-405 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {type === 'day' ? 'Day' : type === 'month' ? 'Month' : 'Custom'}
            </button>
          ))}
        </div>

        {/* Dynamic Controls based on selected tab */}
        <div className="flex items-center gap-2">
          {filterType === 'day' && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDay}
                max={todayStr}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}

          {filterType === 'month' && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-1.5 py-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 px-1 select-none">
                {selectedMonth}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {filterType === 'custom' && (
            <div className="flex items-center gap-1 text-xs">
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-slate-400 px-0.5">to</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={todayStr}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Status and Reason Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 shadow-xs">
        <div className="space-y-1.5">
          <label className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold block">
            Status Type Filter:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="CLEAN">🟢 Clean Days Only</option>
            <option value="URGE_RESISTED">🔵 Resisted Cravings Only</option>
            <option value="PEEKED_EDGED">🟡 Peeked / Edged</option>
            <option value="SLIP_UP">🔴 Slip-ups / Relapses</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold block">
            Trigger Reason Filter:
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Trigger Reasons</option>
            {uniqueReasons.map((reason) => (
              <option key={reason} value={reason}>
                ⚠️ {reason.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Metrics Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 shadow-xs flex flex-col justify-between min-h-[70px]">
          <span className="text-[9px] text-slate-550 dark:text-slate-500 block uppercase font-bold tracking-wider">Clean Ratio</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-base font-black text-emerald-600 dark:text-emerald-450 font-mono">{cleanRatio}%</span>
            <span className="text-[9px] text-slate-405 font-medium">Purity</span>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 shadow-xs flex flex-col justify-between min-h-[70px]">
          <span className="text-[9px] text-slate-550 dark:text-slate-500 block uppercase font-bold tracking-wider">Clean Days</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-base font-black text-emerald-600 dark:text-emerald-455 font-mono">{cleanDays}</span>
            <span className="text-[9px] text-slate-405 font-medium">/ {totalDaysTracked} Logged</span>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 shadow-xs flex flex-col justify-between min-h-[70px]">
          <span className="text-[9px] text-slate-550 dark:text-slate-500 block uppercase font-bold tracking-wider">Period Streak</span>
          <div className="flex items-center gap-1 mt-1 text-emerald-600 dark:text-amber-450 font-black font-mono text-sm">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
            <span>{currentStreak} Days</span>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 shadow-xs flex flex-col justify-between min-h-[70px]">
          <span className="text-[9px] text-slate-550 dark:text-slate-500 block uppercase font-bold tracking-wider">Longest Streak</span>
          <div className="flex items-center gap-1 mt-1 text-slate-800 dark:text-slate-205 font-black font-mono text-sm">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{longestStreak} Days</span>
          </div>
        </div>
      </div>

      {/* Date heatmaps (Month-wise and Custom Date Range) */}
      {filterType !== 'day' && (
        <div className="bg-slate-50/30 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-850/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-755 dark:text-slate-450 block uppercase font-black tracking-wider">
              {filterType === 'month' ? 'Monthly Recovery Heatmap' : 'Range Contribution Grid'}
            </span>
            <div className="flex items-center gap-2 text-[8px] text-slate-505 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-emerald-500 inline-block" /> Clean</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-teal-555 inline-block" /> Resisted</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-amber-500 inline-block" /> Edged</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-rose-505 inline-block" /> Slipped</span>
            </div>
          </div>

          {/* GitHub-Style Heatmap Grid Wrapper */}
          <div className="flex gap-2 items-start pt-1">
            {/* Weekday Labels Column */}
            <div className="grid gap-1 text-[9px] font-extrabold text-slate-400 select-none pr-1 shrink-0" style={{ gridTemplateRows: 'repeat(7, 30px)' }}>
              <div className="flex items-center justify-end pr-0.5"></div>
              <div className="flex items-center justify-end pr-0.5">Mon</div>
              <div className="flex items-center justify-end pr-0.5"></div>
              <div className="flex items-center justify-end pr-0.5">Wed</div>
              <div className="flex items-center justify-end pr-0.5"></div>
              <div className="flex items-center justify-end pr-0.5">Fri</div>
              <div className="flex items-center justify-end pr-0.5"></div>
            </div>

            {/* Scrollable Heatmap Grid */}
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 30px)' }}>
                {gridItems.map((item, index) => {
                  if (item.isPlaceholder) {
                    return (
                      <div
                        key={`placeholder-${index}`}
                        className="w-[30px] h-[30px] rounded-md bg-transparent border border-transparent shrink-0"
                      />
                    );
                  }

                  const dateStr = item.dateStr!;
                  const log = logsLookup[dateStr];
                  const matchesFilter = log ? isLogMatchingFilters(log) : true;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDay(dateStr);
                        setFilterType('day');
                      }}
                      title={`${dateStr}: ${log ? log.status : 'Untracked'}`}
                      className={`w-[30px] h-[30px] rounded-md border text-[9px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${getHeatmapColorClass(
                        log?.status,
                        matchesFilter
                      )} ${log && matchesFilter ? 'text-white border-transparent' : 'text-slate-405 dark:text-slate-655 border-slate-200 dark:border-slate-850'}`}
                    >
                      {item.dayNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-505 italic">
            * Click on any day box above to zoom in on its specific daily log check-in details.
          </p>
        </div>
      )}

      {/* Main Analytics Layout: Left Timeline, Right Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Timeline Log List (Col Span 2) */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-[9px] text-slate-705 dark:text-slate-450 block uppercase font-black tracking-wider">
            Check-In logs Timeline ({timelineLogs.length})
          </span>

          {timelineLogs.length === 0 ? (
            <div className="p-6 rounded-2xl border border-slate-205/65 dark:border-slate-850/60 bg-slate-50/20 text-center text-xs text-slate-505 dark:text-slate-400 italic">
              No check-in logs submitted during this range.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {timelineLogs.map(({ dateStr, log }) => {
                if (!log) return null;
                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          log.status === 'CLEAN' ? 'bg-emerald-500' :
                          log.status === 'URGE_RESISTED' ? 'bg-teal-500' :
                          log.status === 'PEEKED_EDGED' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="font-mono font-bold text-slate-705 dark:text-slate-205 flex items-center gap-1.5">
                          {dateStr}
                          <span className="text-[10px] text-slate-400 font-normal">
                            at {new Date(log.logTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        log.status === 'CLEAN' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-100 dark:border-emerald-900/30' :
                        log.status === 'URGE_RESISTED' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 border-teal-100 dark:border-teal-900/30' :
                        log.status === 'PEEKED_EDGED' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-705 border-amber-100 dark:border-amber-900/30' :
                        'bg-rose-50 dark:bg-rose-950/40 text-rose-705 border-rose-100 dark:border-rose-900/30'
                      }`}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </div>

                    {log.triggerTag && (
                      <span className="inline-block text-[9px] font-mono font-black uppercase text-amber-700 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                        Trigger: {log.triggerTag.replace(/_/g, ' ')}
                      </span>
                    )}

                    {log.notes && (
                      <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-350 italic bg-slate-50/50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-105 dark:border-slate-850/60 font-serif">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Triggers Breakdown Radar Bar List (Col Span 1) */}
        <div className="space-y-3">
          <span className="text-[9px] text-slate-705 dark:text-slate-455 block uppercase font-black tracking-wider">
            Craving Triggers Map
          </span>

          {triggersMap.length === 0 ? (
            <div className="p-6 rounded-2xl border border-slate-205 dark:border-slate-850 bg-slate-50/20 text-center text-xs text-slate-500 dark:text-slate-400 italic">
              No trigger tag data logged in this range.
            </div>
          ) : (
            <Card variant="dark" className="p-4 space-y-3.5">
              {triggersMap.map(([trigger, count]) => {
                const totalTrigs = triggersMap.reduce((acc, t) => acc + t[1], 0) || 1;
                const percent = Math.round((count / totalTrigs) * 100);
                return (
                  <div key={trigger} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-750 dark:text-slate-300">
                      <span className="font-semibold">{trigger}</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-455">{count}x ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-105 dark:bg-slate-955 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
