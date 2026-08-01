export type ChainCategory = 'SPIRITUAL_MORAL' | 'LIFESTYLE_PRODUCTIVITY';
export type HabitStrategy = 'PMO_RECOVERY' | 'SMOKING_VAPING' | 'DIGITAL_SCROLLING' | 'GENERAL_HABIT';
export type PrivacyLevel = 'LEVEL_0_PRIVATE' | 'LEVEL_1_STREAK_ONLY' | 'LEVEL_2_FULL_COUNSEL';

export interface HabitChain {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: ChainCategory;
  strategy: HabitStrategy;
  privacyLevel: PrivacyLevel;
  startDate: string;
  totalCleanDays: number;
  currentStreak: number;
  longestStreak: number;
  resilienceScore: number;
  cleanRatioPercent: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}
