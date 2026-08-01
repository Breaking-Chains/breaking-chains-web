import { apiFetch } from './apiClient';
import type { HabitChain } from '../types/chain';

export async function getUserChains(): Promise<HabitChain[]> {
  return apiFetch<HabitChain[]>('/api/v1/chains?status=ACTIVE', {
    method: 'GET',
  });
}

export async function getChainById(id: string): Promise<HabitChain> {
  return apiFetch<HabitChain>(`/api/v1/chains/${id}`, {
    method: 'GET',
  });
}

export async function createPmoChain(title = 'PMO Recovery Chain'): Promise<HabitChain> {
  return apiFetch<HabitChain>('/api/v1/chains', {
    method: 'POST',
    body: JSON.stringify({
      title,
      category: 'SPIRITUAL_MORAL',
      strategy: 'PMO_RECOVERY',
      privacyLevel: 'LEVEL_0_PRIVATE',
    }),
  });
}
