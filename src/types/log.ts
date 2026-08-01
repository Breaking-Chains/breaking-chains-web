export type LogStatus = 'CLEAN' | 'URGE_RESISTED' | 'PEEKED_EDGED' | 'SLIP_UP';

export type PMOTriggerTag = 
  | 'LATE_NIGHT_SOLITUDE' 
  | 'STRESS_ANXIETY' 
  | 'BOREDOM_IDLENESS' 
  | 'SOCIAL_MEDIA_SCROLLING' 
  | 'FATIGUE_EXHAUSTION' 
  | 'OTHER';

export interface LogEntry {
  id: string;
  chainId: string;
  userId: string;
  logTimestamp: string;
  status: LogStatus;
  triggerTag?: PMOTriggerTag;
  notes?: string;
  chaserEffectActive?: boolean;
}

export interface PostSlipTawbahResponse {
  chaserEffectActive: boolean;
  chaserWindowExpiresAt: string;
  suggestedSadaqahAmount: number;
  tawbahGuide: {
    title: string;
    steps: string[];
    duaaArabic?: string;
    duaaTranslation?: string;
  };
}
