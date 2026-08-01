export type EmergencyStep = 'PHYSICAL_CIRCUIT' | 'WUDU_HYDROTHERAPY' | 'SPIRITUAL_SHIELD' | 'BOX_BREATHING';

export interface EmergencySession {
  id: string;
  userId: string;
  chainId: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  currentStep: EmergencyStep;
  isCompleted: boolean;
}
