import React from 'react';
import { Brain } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface DopamineRebootCardProps {
  currentCleanDays: number;
}

export const DopamineRebootCard: React.FC<DopamineRebootCardProps> = ({
  currentCleanDays,
}) => {
  const progressPercent = Math.min(100, (currentCleanDays / 90) * 100);

  const getDopamineStageText = (days: number) => {
    if (days <= 3) return { title: 'Early Recovery', desc: 'Early recovery stage: cravings may feel stronger.' };
    if (days <= 14) return { title: 'Flatline & Rebalancing', desc: 'Temporary low energy / brain fog. Brain chemistry is restoring balance.' };
    if (days <= 40) return { title: 'Neural Pathway Rewiring', desc: 'New healthy habits forming. High mental clarity restoration.' };
    return { title: 'Restored Balance', desc: 'Baseline dopamine sensitivity restored. High self-mastery.' };
  };

  const stageInfo = getDopamineStageText(currentCleanDays);

  return (
    <Card variant="glass" className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            90-Day Dopamine Reboot
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{currentCleanDays}/90 Days</span>
      </div>

      <ProgressBar
        value={progressPercent}
        label={`Current Biological Stage: ${stageInfo.title}`}
        variant="emerald"
      />
    </Card>
  );
};
