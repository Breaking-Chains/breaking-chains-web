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
  createCustomChain: (options: {
    title: string;
    strategy: string;
    privacyLevel: string;
    triggerTags: string[];
    intentStatement: string;
  }) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PmoContext = createContext<PmoContextType | undefined>(undefined);

export const PmoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<HabitChain | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [chaserEffectActive, setChaserEffectActive] = useState<boolean>(false);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(false);
  const [activeSosSessionId, setActiveSosSessionId] = useState<string | null>(null);

  const fetchLiveData = async () => {
    setIsApiLoading(true);
    try {
      const chains = await getUserChains();
      const activeChain = Array.isArray(chains)
        ? chains.find((c) => c.strategy === 'PMO_RECOVERY') || chains[0]
        : null;

      setChain(activeChain || null);
      setIsOfflineDemo(false);

      if (activeChain) {
        try {
          const stats = await getChainAnalytics(activeChain.id);
          setAnalytics(stats);
          setChaserEffectActive(stats?.chaserEffectActive || false);
        } catch {
          setAnalytics(null);
          setChaserEffectActive(false);
        }
      } else {
        setAnalytics(null);
        setChaserEffectActive(false);
      }
    } catch {
      setChain(null);
      setAnalytics(null);
      setChaserEffectActive(false);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const createCustomChain = async (options: {
    title: string;
    strategy: string;
    privacyLevel: string;
    triggerTags: string[];
    intentStatement: string;
  }) => {
    setIsApiLoading(true);
    try {
      const newChain = await createPmoChain(options);
      setChain(newChain);
      await fetchLiveData();
    } finally {
      setIsApiLoading(false);
    }
  };

  const submitCheckIn = async (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => {
    if (!chain) return;

    try {
      await submitCheckInLog(chain.id, status, triggerTag, notes);
      await fetchLiveData();
      return;
    } catch (err) {
      console.warn('API call failed during checkin:', err);
    }
  };

  const startSos = async (): Promise<string> => {
    if (!chain) {
      const demoId = `sos-${Date.now()}`;
      setActiveSosSessionId(demoId);
      return demoId;
    }
    try {
      const session = await startEmergencySession(chain.id);
      setActiveSosSessionId(session.id);
      return session.id;
    } catch {
      const demoId = `sos-${Date.now()}`;
      setActiveSosSessionId(demoId);
      return demoId;
    }
  };

  const completeSos = async (durationSeconds: number): Promise<void> => {
    if (activeSosSessionId) {
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
        currentStreak: chain?.currentStreak ?? 0,
        cleanRatioPercent: chain?.cleanRatioPercent ?? 0,
        chaserEffectActive,
        isApiLoading,
        isOfflineDemo,
        activeSosSessionId,
        submitCheckIn,
        startSos,
        completeSos,
        createCustomChain,
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
