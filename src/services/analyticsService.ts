import { apiFetch } from './apiClient';
import type { AnalyticsSummary, MilestoneBadge, NafsStage } from '../types/analytics';

export async function getChainAnalytics(chainId: string): Promise<AnalyticsSummary> {
  const data = await apiFetch<any>(`/api/v1/chains/${chainId}/analytics`, {
    method: 'GET',
  });
  
  const currentStreak = data.currentStreakDays ?? 0;
  const longestStreak = data.longestStreakDays ?? 0;
  const totalCleanDays = data.totalCleanDays ?? 0;
  const totalDays = data.totalDaysTracked ?? 1;
  const resilienceScore = totalDays > 0 ? Math.min(100, Math.round((totalCleanDays / totalDays) * 100)) : 100;
  
  let nafsStage: NafsStage = 'NAFS_AL_AMMARAH';
  if (currentStreak >= 40) {
    nafsStage = 'NAFS_AL_MUTMAINNAH';
  } else if (currentStreak >= 7) {
    nafsStage = 'NAFS_AL_LAWWAMAH';
  }

  let dopamineStageTitle = 'Nafs al-Ammarah (Physical Withdrawal)';
  let dopamineStageDescription = 'Your brain is adjusting to the absence of high dopamine triggers. Urges are intense.';
  const dopamineRebootProgressPercent = Math.min(100, Math.round((currentStreak / 90) * 100));

  if (currentStreak >= 40) {
    dopamineStageTitle = "Nafs al-Mutma'innah (Healed Neurochemistry)";
    dopamineStageDescription = 'Dopamine receptors have substantially reset. You experience deep inner peace and self-control.';
  } else if (currentStreak >= 7) {
    dopamineStageTitle = 'Nafs al-Lawwamah (Receptor Up-regulation)';
    dopamineStageDescription = 'Receptors are recovering. You feel self-reproach after slips and higher resilience.';
  }

  const topTriggers = data.triggerBreakdown
    ? Object.entries(data.triggerBreakdown).map(([trigger, count]) => ({
        trigger,
        count: Number(count),
      })).sort((a, b) => b.count - a.count)
    : [];

  return {
    chainId: data.chainId,
    totalDaysSinceStart: totalDays,
    totalCleanDays: totalCleanDays,
    cleanRatioPercent: data.cleanPercentage ?? 100,
    currentStreak,
    longestStreak,
    resilienceScore,
    estimatedMoneySaved: Number(data.moneySaved ?? 0),
    estimatedHoursSaved: data.timeSavedHours ?? 0,
    sadaqahRedemptionPotential: Number(data.sadaqahPotential ?? 0),
    nafsStage,
    dopamineRebootProgressPercent,
    dopamineStageTitle,
    dopamineStageDescription,
    chaserEffectActive: false,
    topTriggers,
  };
}

export async function getMilestones(): Promise<MilestoneBadge[]> {
  return apiFetch<MilestoneBadge[]>('/api/v1/milestones', {
    method: 'GET',
  });
}
