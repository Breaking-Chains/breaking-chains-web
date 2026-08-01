import React from 'react';
import { Brain, Clock, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface DopamineRebootCardProps {
  currentCleanDays: number;
  estimatedHoursSaved: number;
  estimatedMoneySaved: number;
}

export const DopamineRebootCard: React.FC<DopamineRebootCardProps> = ({
  currentCleanDays,
  estimatedHoursSaved,
  estimatedMoneySaved,
}) => {
  const progressPercent = Math.min(100, (currentCleanDays / 90) * 100);

  const getDopamineStageText = (days: number) => {
    if (days <= 3) return { title: 'Acute Withdrawal', desc: 'Dopamine receptors upregulation initialized. Expect craving waves.' };
    if (days <= 14) return { title: 'Flatline & Rebalancing', desc: 'Temporary low energy / brain fog. Receptors are sensitivity healing.' };
    if (days <= 40) return { title: 'Neural Pathway Rewiring', desc: 'New healthy habits forming. High mental clarity restoration.' };
    return { title: 'Complete Neuro-Reboot', desc: 'Baseline dopamine sensitivity restored. High self-mastery.' };
  };

  const stageInfo = getDopamineStageText(currentCleanDays);

  return (
    <Card variant="glass" className="space-y-4 p-4 border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            90-Day Dopamine Neuro-Reboot
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400">{currentCleanDays}/90 Days</span>
      </div>

      <ProgressBar
        value={progressPercent}
        label={`Current Biological Stage: ${stageInfo.title}`}
        subLabel={stageInfo.desc}
        variant="emerald"
      />

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-950 text-teal-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Time Reclaimed</span>
            <span className="text-xs font-bold text-slate-100 font-mono">{estimatedHoursSaved} Hours</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-950 text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Money/Charity Impact</span>
            <span className="text-xs font-bold text-slate-100 font-mono">${estimatedMoneySaved} Saved</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
