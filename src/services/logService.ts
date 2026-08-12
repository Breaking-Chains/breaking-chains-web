import { apiFetch } from './apiClient';
import type { LogEntry, LogStatus, PMOTriggerTag, PostSlipTawbahResponse } from '../types/log';

export async function submitCheckInLog(
  chainId: string,
  status: LogStatus,
  triggerTag?: PMOTriggerTag,
  notes?: string,
  logTimestamp?: string
): Promise<{ log: LogEntry; tawbahProtocol?: PostSlipTawbahResponse }> {
  return apiFetch<{ log: LogEntry; tawbahProtocol?: PostSlipTawbahResponse }>(
    `/api/v1/chains/${chainId}/logs`,
    {
      method: 'POST',
      body: JSON.stringify({
        status,
        triggerTag,
        reflectionNote: notes,
        logTimestamp,
      }),
    }
  );
}

export async function getCheckInLogs(chainId: string): Promise<LogEntry[]> {
  const res = await apiFetch<any[]>(`/api/v1/chains/${chainId}/logs`, {
    method: 'GET',
  });
  const list = Array.isArray(res) ? res : [];
  return list.map((log) => ({
    id: log.id,
    chainId: log.chainId,
    userId: log.userId,
    logTimestamp: log.logTimestamp,
    status: log.status,
    triggerTag: log.triggerTag,
    notes: log.reflectionNote || '',
    chaserEffectActive: log.chaserAlertActive || false,
  }));
}
