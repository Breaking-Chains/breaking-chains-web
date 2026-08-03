import React from 'react';
import { Sparkles, Shield, Compass, HeartHandshake } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { NafsStage } from '../../types/analytics';

interface NafsProgressTrackerProps {
  currentStage: NafsStage;
  currentCleanDays: number;
}

export const NafsProgressTracker: React.FC<NafsProgressTrackerProps> = ({
  currentStage,
  currentCleanDays,
}) => {
  const stages = [
    {
      id: 'NAFS_AL_AMMARAH',
      title: 'Nafs al-Ammarah',
      subtitle: 'The Inclining Soul (Days 1–7)',
      description: 'Acute withdrawal & high urge vulnerability. Focus on physical boundaries & emergency interrupters.',
      icon: Shield,
      badgeColor: 'rose' as const,
    },
    {
      id: 'NAFS_AL_LAWWAMAH',
      title: 'Nafs al-Lawwamah',
      subtitle: 'The Self-Aware Soul (Days 8–40)',
      description: 'Active struggle & trigger identification. Building replacement routines and resilience.',
      icon: Compass,
      badgeColor: 'gold' as const,
    },
    {
      id: 'NAFS_AL_MUTMAINNAH',
      title: "Nafs al-Mutma'innah",
      subtitle: 'The Tranquil Soul (Days 40–90+)',
      description: 'Dopamine baseline reset, spiritual peace, and deep habit consolidation.',
      icon: HeartHandshake,
      badgeColor: 'emerald' as const,
    },
  ];

  return (
    <Card variant="emerald" className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Quranic Soul Progression (Nafs Stages)
          </h3>
        </div>
        <Badge variant="emerald" size="sm">
          Day {currentCleanDays}
        </Badge>
      </div>

      <div className="space-y-2.5">
        {stages
          .filter((stg) => currentStage === stg.id)
          .map((stg) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.id}
                className="p-3 rounded-xl border bg-white dark:bg-slate-900/90 border-slate-200 dark:border-emerald-500 shadow-sm dark:shadow-md dark:shadow-emerald-950/40 dark:ring-1 dark:ring-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{stg.title}</span>
                  </div>
                  <Badge variant={stg.badgeColor} size="sm">
                    {stg.subtitle.split('(')[1]?.replace(')', '') || ''}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-normal pl-6">{stg.description}</p>
              </div>
            );
          })}
      </div>
    </Card>
  );
};
