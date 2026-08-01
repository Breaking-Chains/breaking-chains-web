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
    <div className="space-y-6 animate-fade-in">
      {/* 48-Hour Chaser Effect Shield Banner */}
      <ChaserEffectBanner isActive={chaserEffectActive} hoursRemaining={32} />

      {/* Hero Stats Card */}
      <Card variant="emerald" className="p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
              Active Chain Status
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">PMO Purity & Recovery Chain</h2>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium max-w-xl">
              Category: Spiritual Purification (*Tazkiyah al-Nafs*). Decoupled PMO strategy combining CBT urge-surfing with Islamic spiritual shields.
            </p>
          </div>
          <div className="p-4 bg-emerald-900/60 border border-emerald-500/40 rounded-2xl text-center shrink-0 min-w-[100px]">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400 mx-auto animate-bounce" />
            <span className="text-2xl font-black text-white font-mono">{currentStreak}</span>
            <span className="text-[10px] text-amber-300 block uppercase font-bold">Days Clean</span>
          </div>
        </div>

        {/* Clean Ratio Metric */}
        <div className="mt-6 pt-4 border-t border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-200">Resilience Clean Ratio Score:</span>
          </div>
          <span className="text-base font-bold font-mono text-emerald-300">{cleanRatioPercent}%</span>
        </div>
      </Card>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="emerald"
          size="lg"
          onClick={onOpenCheckIn}
          className="flex items-center justify-between p-5 h-auto text-left shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-white" />
              <span className="font-bold text-base">Daily Check-In (Muhasabah)</span>
            </div>
            <span className="text-xs text-emerald-100 font-normal block">Log status & status reflection</span>
          </div>
        </Button>

        <Button
          variant="sos"
          size="lg"
          onClick={onTriggerSos}
          className="flex items-center justify-between p-5 h-auto text-left shadow-xl"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white" />
              <span className="font-bold text-base">SOS Urge Surfing</span>
            </div>
            <span className="text-xs text-rose-100 font-normal block">1-Tap 4-Step Urge Interrupter</span>
          </div>
        </Button>
      </div>

      {/* Multi-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Col-span 2 on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <DopamineRebootCard
            currentCleanDays={currentStreak}
            estimatedHoursSaved={currentStreak * 2}
            estimatedMoneySaved={currentStreak * 3}
          />

          <GuardingGazeCard cleanGazeDays={currentStreak} />
        </div>

        {/* Side Column (Col-span 1 on Desktop) */}
        <div className="space-y-6">
          <NafsProgressTracker currentStage="NAFS_AL_LAWWAMAH" currentCleanDays={currentStreak} />
        </div>
      </div>
    </div>
  );
};
