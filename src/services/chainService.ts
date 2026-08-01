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

export async function createPmoChain(options?: {
  title?: string;
  category?: string;
  strategy?: string;
  privacyLevel?: string;
  triggerTags?: string[];
  intentStatement?: string;
}): Promise<HabitChain> {
  return apiFetch<HabitChain>('/api/v1/chains', {
    method: 'POST',
    body: JSON.stringify({
      title: options?.title || 'PMO Recovery Chain',
      category: options?.category || 'SPIRITUAL_MORAL',
      strategy: options?.strategy || 'PMO_RECOVERY',
      privacyLevel: options?.privacyLevel || 'LEVEL_0_PRIVATE',
      triggerTags: options?.triggerTags || ['🌙 Late Night Solitude', '⚡ Stress & Anxiety'],
      intentStatement: options?.intentStatement || null,
    }),
  });
}
