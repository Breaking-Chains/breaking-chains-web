export type NafsStage = 'NAFS_AL_AMMARAH' | 'NAFS_AL_LAWWAMAH' | 'NAFS_AL_MUTMAINNAH';

export interface MilestoneBadge {
  id: string;
  badgeType: string;
  title: string;
  description: string;
  iconName: string;
  achievedAt: string;
}

export interface AnalyticsSummary {
  chainId: string;
  totalDaysSinceStart: number;
  totalCleanDays: number;
  cleanRatioPercent: number;
  currentStreak: number;
  longestStreak: number;
  resilienceScore: number;
  estimatedMoneySaved: number;
  estimatedHoursSaved: number;
  sadaqahRedemptionPotential: number;
  nafsStage: NafsStage;
  dopamineRebootProgressPercent: number;
  dopamineStageTitle: string;
  dopamineStageDescription: string;
  chaserEffectActive: boolean;
  topTriggers: { trigger: string; count: number }[];
}
