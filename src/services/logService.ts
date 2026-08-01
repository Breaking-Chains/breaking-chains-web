import { apiFetch } from './apiClient';
import type { LogEntry, LogStatus, PMOTriggerTag, PostSlipTawbahResponse } from '../types/log';

export async function submitCheckInLog(
  chainId: string,
  status: LogStatus,
  triggerTag?: PMOTriggerTag,
  notes?: string
): Promise<{ log: LogEntry; tawbahProtocol?: PostSlipTawbahResponse }> {
  return apiFetch<{ log: LogEntry; tawbahProtocol?: PostSlipTawbahResponse }>(
    `/api/v1/chains/${chainId}/logs`,
    {
      method: 'POST',
      body: JSON.stringify({
        status,
        triggerTag,
        reflectionNote: notes,
      }),
    }
  );
}

export async function getCheckInLogs(chainId: string): Promise<LogEntry[]> {
  const res = await apiFetch<LogEntry[]>(`/api/v1/chains/${chainId}/logs`, {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
}
