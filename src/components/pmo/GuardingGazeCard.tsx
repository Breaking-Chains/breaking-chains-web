import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

interface GuardingGazeCardProps {
  cleanGazeDays: number;
}

export const GuardingGazeCard: React.FC<GuardingGazeCardProps> = ({ cleanGazeDays }) => {
  return (
    <Card variant="gold" className="p-4 border-amber-500/20 dark:border-amber-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-xs font-bold text-amber-850 dark:text-amber-200 uppercase tracking-wider">
            Guarding the Gaze (Hafd al-Basar)
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          {cleanGazeDays} Days Guarded
        </div>
      </div>
      <p className="text-xs text-amber-900/90 dark:text-amber-100/90 mt-2 font-serif italic">
        "The gaze is a poisoned arrow from the arrows of Iblis. Whoever lowers it out of fear of Allah, Allah grants them sweetness of faith in their heart."
      </p>
    </Card>
  );
};
