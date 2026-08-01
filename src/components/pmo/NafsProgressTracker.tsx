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
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isActive = currentStage === stg.id;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900/90 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold text-slate-100">{stg.title}</span>
                </div>
                <Badge variant={stg.badgeColor} size="sm">
                  {stg.subtitle.split('(')[1]?.replace(')', '') || ''}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal pl-6">{stg.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
