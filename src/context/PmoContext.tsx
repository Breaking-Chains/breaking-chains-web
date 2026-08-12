import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HabitChain } from '../types/chain';
import type { AnalyticsSummary } from '../types/analytics';
import type { LogStatus, PMOTriggerTag } from '../types/log';
import { getUserChains, createPmoChain } from '../services/chainService';
import { getChainAnalytics } from '../services/analyticsService';
import { submitCheckInLog } from '../services/logService';
import { startEmergencySession, completeEmergencySession } from '../services/emergencyService';

import type { CounselNote } from '../types/partner';
import { getCounselNotes } from '../services/partnerService';
import { formatApiErrorMessage } from '../services/apiClient';

interface PmoContextType {
  chain: HabitChain | null;
  analytics: AnalyticsSummary | null;
  counselNotes: CounselNote[];
  currentStreak: number;
  cleanRatioPercent: number;
  chaserEffectActive: boolean;
  isApiLoading: boolean;
  isOfflineDemo: boolean;
  activeSosSessionId: string | null;
  apiError: string | null;
  clearApiError: () => void;
  submitCheckIn: (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string, logTimestamp?: string) => Promise<void>;
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
  const queryClient = useQueryClient();
  const [activeSosSessionId, setActiveSosSessionId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isOfflineDemo] = useState<boolean>(false);

  const clearApiError = () => setMutationError(null);

  // 1. Fetch user chains
  const { 
    data: chains, 
    isLoading: isChainsLoading, 
    error: chainsError 
  } = useQuery({
    queryKey: ['user-chains'],
    queryFn: getUserChains,
    enabled: !!localStorage.getItem('accessToken'),
  });

  // Calculate the active chain
  const chain = Array.isArray(chains)
    ? chains.find((c) => c.strategy === 'PMO_RECOVERY') || chains[0]
    : null;

  // 2. Fetch Dependent chain stats/analytics
  const { 
    data: analyticsData, 
    isLoading: isAnalyticsLoading 
  } = useQuery({
    queryKey: ['chain-analytics', chain?.id],
    queryFn: () => getChainAnalytics(chain!.id),
    enabled: !!chain?.id,
  });
  const analytics = analyticsData || null;

  // 3. Fetch Dependent counsel notes
  const { 
    data: notesData, 
    isLoading: isNotesLoading 
  } = useQuery({
    queryKey: ['counsel-notes', chain?.id],
    queryFn: () => getCounselNotes(chain!.id),
    enabled: !!chain?.id,
  });
  const counselNotes = Array.isArray(notesData) ? notesData : [];

  // Derive loading and error states
  const isApiLoading = isChainsLoading || isAnalyticsLoading || isNotesLoading;
  const apiError = mutationError || (chainsError ? formatApiErrorMessage(chainsError) : null);
  const chaserEffectActive = analytics?.chaserEffectActive || false;

  // 4. Submit daily check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async ({ status, triggerTag, notes, logTimestamp }: { status: LogStatus; triggerTag?: PMOTriggerTag; notes?: string; logTimestamp?: string }) => {
      if (!chain) {
        throw new Error('No active habit chain found to check in.');
      }
      return submitCheckInLog(chain.id, status, triggerTag, notes, logTimestamp);
    },
    onSuccess: () => {
      // Invalidate both chains and stats queries to trigger background refetch
      queryClient.invalidateQueries({ queryKey: ['user-chains'] });
      queryClient.invalidateQueries({ queryKey: ['chain-analytics', chain?.id] });
      queryClient.invalidateQueries({ queryKey: ['counsel-notes', chain?.id] });
      setMutationError(null);
    },
    onError: (err) => {
      setMutationError(formatApiErrorMessage(err));
    },
  });

  const submitCheckIn = async (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string, logTimestamp?: string) => {
    try {
      await checkInMutation.mutateAsync({ status, triggerTag, notes, logTimestamp });
    } catch (err) {
      throw err;
    }
  };

  // 5. Create custom chain mutation
  const createChainMutation = useMutation({
    mutationFn: async (options: {
      title: string;
      strategy: string;
      privacyLevel: string;
      triggerTags: string[];
      intentStatement: string;
    }) => {
      return createPmoChain(options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-chains'] });
      setMutationError(null);
    },
    onError: (err) => {
      setMutationError(formatApiErrorMessage(err));
    },
  });

  const createCustomChain = async (options: {
    title: string;
    strategy: string;
    privacyLevel: string;
    triggerTags: string[];
    intentStatement: string;
  }) => {
    try {
      await createChainMutation.mutateAsync(options);
    } catch (err) {
      throw err;
    }
  };

  // 6. SOS Sessions handlers
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
    } catch (err) {
      console.warn('API call failed during SOS start, falling back to local session:', err);
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

  // 7. Manual refresh method
  const refreshData = async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['user-chains'] }),
      chain?.id ? queryClient.refetchQueries({ queryKey: ['chain-analytics', chain.id] }) : Promise.resolve(),
      chain?.id ? queryClient.refetchQueries({ queryKey: ['counsel-notes', chain.id] }) : Promise.resolve(),
    ]);
  };

  return (
    <PmoContext.Provider
      value={{
        chain,
        analytics,
        counselNotes,
        currentStreak: analytics?.currentStreak ?? chain?.currentStreak ?? 0,
        cleanRatioPercent: analytics?.cleanRatioPercent ?? chain?.cleanRatioPercent ?? 0,
        chaserEffectActive,
        isApiLoading,
        isOfflineDemo,
        activeSosSessionId,
        apiError,
        clearApiError,
        submitCheckIn,
        startSos,
        completeSos,
        createCustomChain,
        refreshData,
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
