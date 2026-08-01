import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HabitChain } from '../types/chain';
import type { AnalyticsSummary } from '../types/analytics';
import type { LogStatus, PMOTriggerTag } from '../types/log';
import { getUserChains, createPmoChain } from '../services/chainService';
import { getChainAnalytics } from '../services/analyticsService';
import { submitCheckInLog } from '../services/logService';
import { startEmergencySession, completeEmergencySession } from '../services/emergencyService';

interface PmoContextType {
  chain: HabitChain | null;
  analytics: AnalyticsSummary | null;
  currentStreak: number;
  cleanRatioPercent: number;
  chaserEffectActive: boolean;
  isApiLoading: boolean;
  isOfflineDemo: boolean;
  activeSosSessionId: string | null;
  submitCheckIn: (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => Promise<void>;
  startSos: () => Promise<string>;
  completeSos: (durationSeconds: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PmoContext = createContext<PmoContextType | undefined>(undefined);

const DEMO_CHAIN: HabitChain = {
  id: 'demo-pmo-chain-1',
  userId: 'demo-user-1',
  title: 'PMO Recovery & Purity Chain',
  category: 'SPIRITUAL_MORAL',
  strategy: 'PMO_RECOVERY',
  privacyLevel: 'LEVEL_0_PRIVATE',
  startDate: '2026-07-14T00:00:00Z',
  totalCleanDays: 18,
  currentStreak: 18,
  longestStreak: 21,
  resilienceScore: 94.7,
  cleanRatioPercent: 94.7,
  status: 'ACTIVE',
  createdAt: '2026-07-14T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
};

const DEMO_ANALYTICS: AnalyticsSummary = {
  chainId: 'demo-pmo-chain-1',
  totalDaysSinceStart: 19,
  totalCleanDays: 18,
  cleanRatioPercent: 94.7,
  currentStreak: 18,
  longestStreak: 21,
  resilienceScore: 94.7,
  estimatedMoneySaved: 54,
  estimatedHoursSaved: 36,
  sadaqahRedemptionPotential: 54,
  nafsStage: 'NAFS_AL_LAWWAMAH',
  dopamineRebootProgressPercent: 20.0,
  dopamineStageTitle: 'Flatline & Rebalancing',
  dopamineStageDescription: 'Temporary low energy / brain fog. Receptors are sensitivity healing.',
  chaserEffectActive: false,
  topTriggers: [
    { trigger: '🌙 Late Night Solitude', count: 12 },
    { trigger: '⚡ Stress & Work Anxiety', count: 6 },
    { trigger: '📱 Social Media Peeking', count: 4 },
  ],
};

export const PmoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<HabitChain | null>(DEMO_CHAIN);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(DEMO_ANALYTICS);
  const [chaserEffectActive, setChaserEffectActive] = useState<boolean>(false);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(true);
  const [activeSosSessionId, setActiveSosSessionId] = useState<string | null>(null);

  const fetchLiveData = async () => {
    setIsApiLoading(true);
    try {
      const chains = await getUserChains();
      let activeChain = chains.find((c) => c.strategy === 'PMO_RECOVERY') || chains[0];
      
      if (!activeChain) {
        activeChain = await createPmoChain();
      }

      setChain(activeChain);
      setIsOfflineDemo(false);

      if (activeChain) {
        const stats = await getChainAnalytics(activeChain.id);
        setAnalytics(stats);
        setChaserEffectActive(stats.chaserEffectActive);
      }
    } catch {
      // Backend offline: fallback smoothly to high-performance local demo state
      setIsOfflineDemo(true);
      setChain(DEMO_CHAIN);
      setAnalytics(DEMO_ANALYTICS);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const submitCheckIn = async (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => {
    if (!chain) return;

    if (!isOfflineDemo) {
      try {
        await submitCheckInLog(chain.id, status, triggerTag, notes);
        await fetchLiveData();
        return;
      } catch (err) {
        console.warn('API call failed, falling back to local state:', err);
      }
    }

    // Local state fallback update
    if (status === 'CLEAN' || status === 'URGE_RESISTED') {
      setChain((prev) => prev ? { ...prev, currentStreak: prev.currentStreak + 1, totalCleanDays: prev.totalCleanDays + 1 } : prev);
    } else if (status === 'PEEKED_EDGED') {
      setChaserEffectActive(true);
    } else if (status === 'SLIP_UP') {
      setChain((prev) => prev ? { ...prev, currentStreak: 0 } : prev);
      setChaserEffectActive(true);
    }
  };

  const startSos = async (): Promise<string> => {
    if (!chain || isOfflineDemo) {
      const demoId = `sos-demo-${Date.now()}`;
      setActiveSosSessionId(demoId);
      return demoId;
    }
    try {
      const session = await startEmergencySession(chain.id);
      setActiveSosSessionId(session.id);
      return session.id;
    } catch {
      const demoId = `sos-demo-${Date.now()}`;
      setActiveSosSessionId(demoId);
      return demoId;
    }
  };

  const completeSos = async (durationSeconds: number): Promise<void> => {
    if (activeSosSessionId && !isOfflineDemo) {
      try {
        await completeEmergencySession(activeSosSessionId, durationSeconds);
      } catch (err) {
        console.warn('Complete SOS API error:', err);
      }
    }
    setActiveSosSessionId(null);
  };

  return (
    <PmoContext.Provider
      value={{
        chain,
        analytics,
        currentStreak: chain?.currentStreak ?? 18,
        cleanRatioPercent: chain?.cleanRatioPercent ?? 94.7,
        chaserEffectActive,
        isApiLoading,
        isOfflineDemo,
        activeSosSessionId,
        submitCheckIn,
        startSos,
        completeSos,
        refreshData: fetchLiveData,
      }}
    >
      {children}
    </PmoContext.Provider>
  );
};

export const usePmo = () => {
  const context = useContext(PmoContext);
  if (!context) {
    throw new Error('usePmo must be used within a PmoProvider');
  }
  return context;
};
