import { apiFetch } from './apiClient';
import type { AnalyticsSummary, MilestoneBadge } from '../types/analytics';

export async function getChainAnalytics(chainId: string): Promise<AnalyticsSummary> {
  return apiFetch<AnalyticsSummary>(`/api/v1/chains/${chainId}/analytics`, {
    method: 'GET',
  });
}

export async function getMilestones(): Promise<MilestoneBadge[]> {
  return apiFetch<MilestoneBadge[]>('/api/v1/milestones', {
    method: 'GET',
  });
}
