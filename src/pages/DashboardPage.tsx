import React, { useState, useEffect } from 'react';
import { usePmo } from '../context/PmoContext';
import { useAuth } from '../context/AuthContext';
import { getCheckInLogs } from '../services/logService';
import type { LogEntry, LogStatus } from '../types/log';
import type { NavTab } from '../components/layout/BottomNav';
import { Flame, Trophy, History, Lock, Calendar, AlertTriangle } from 'lucide-react';
import dashboardContent from '../data/dashboardContent.json';
import './DashboardPage.css';

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

  const longestStreak = analytics?.longestStreak ?? chain?.longestStreak ?? (isOfflineDemo ? 128 : currentStreak);

  // Generate a chronological 7x52 contribution grid representing the last 364 days
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
        <div className="db-stat-card">
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
        <div className="db-stat-card">
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
        <div className="db-stat-card">
          <div className="db-stat-icon-wrapper db-stat-icon-tertiary">
            <History className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="db-stat-label">{stats.totalRelapses.label}</h3>
          <div className="db-stat-val-container">
            <span className="db-stat-value">
              {isLoadingLogs ? '...' : totalRelapses}
            </span>
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
                  
                  return (
                    <div
                      key={cell.dateStr}
                      className={`db-heatmap-cell ${colorClass}`}
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
      <div className="db-privacy-banner">
        <Lock className="db-privacy-icon" />
        <span>{privacy.shieldText}</span>
      </div>
    </div>
  );
};

export default DashboardPage;
