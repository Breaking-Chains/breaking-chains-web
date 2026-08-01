import React from 'react';
import { CalendarCheck, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChaserEffectBanner } from '../components/pmo/ChaserEffectBanner';
import { NafsProgressTracker } from '../components/pmo/NafsProgressTracker';
import { DopamineRebootCard } from '../components/pmo/DopamineRebootCard';
import { GuardingGazeCard } from '../components/pmo/GuardingGazeCard';

interface DashboardPageProps {
  currentStreak: number;
  cleanRatioPercent: number;
  chaserEffectActive: boolean;
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentStreak = 18,
  cleanRatioPercent = 94.7,
  chaserEffectActive = false,
  onOpenCheckIn,
  onTriggerSos,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <ChaserEffectBanner isActive={chaserEffectActive} hoursRemaining={32} />

      <Card variant="emerald" className="p-5 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">
              Active Chain Status
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">PMO Purity & Recovery</h2>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium">
              Category: Spiritual Purification (*Tazkiyah*)
            </p>
          </div>
          <div className="p-3 bg-emerald-900/60 border border-emerald-500/40 rounded-2xl text-center min-w-[70px]">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto animate-bounce" />
            <span className="text-lg font-black text-white font-mono">{currentStreak}</span>
            <span className="text-[9px] text-amber-300 block uppercase font-bold">Days Clean</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-200">Resilience Clean Ratio:</span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-300">{cleanRatioPercent}%</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="emerald"
          size="lg"
          onClick={onOpenCheckIn}
          className="flex-col py-4 h-auto text-left items-start space-y-1"
        >
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-white" />
            <span className="font-bold">Daily Check-In</span>
          </div>
          <span className="text-[11px] text-emerald-100 font-normal">Log Muhasabah & Status</span>
        </Button>

        <Button
          variant="sos"
          size="lg"
          onClick={onTriggerSos}
          className="flex-col py-4 h-auto text-left items-start space-y-1"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="font-bold">SOS Urge Surfing</span>
          </div>
          <span className="text-[11px] text-rose-100 font-normal">1-Tap Urge Interrupter</span>
        </Button>
      </div>

      <GuardingGazeCard cleanGazeDays={currentStreak} />

      <DopamineRebootCard
        currentCleanDays={currentStreak}
        estimatedHoursSaved={currentStreak * 2}
        estimatedMoneySaved={currentStreak * 3}
      />

      <NafsProgressTracker currentStage="NAFS_AL_LAWWAMAH" currentCleanDays={currentStreak} />
    </div>
  );
};
