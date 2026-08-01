import { apiFetch } from './apiClient';
import type { EmergencySession } from '../types/emergency';

export async function startEmergencySession(chainId: string): Promise<EmergencySession> {
  return apiFetch<EmergencySession>('/api/v1/emergency/start', {
    method: 'POST',
    body: JSON.stringify({ chainId }),
  });
}

export async function completeEmergencySession(
  sessionId: string,
  durationSeconds: number
): Promise<EmergencySession> {
  return apiFetch<EmergencySession>(`/api/v1/emergency/${sessionId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ durationSeconds, isCompleted: true }),
  });
}
