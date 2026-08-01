import React from 'react';
import { MinimalStreakHero } from '../components/pmo/MinimalStreakHero';
import { ChaserEffectBanner } from '../components/pmo/ChaserEffectBanner';
import { NafsProgressTracker } from '../components/pmo/NafsProgressTracker';
import { DopamineRebootCard } from '../components/pmo/DopamineRebootCard';
import { GuardingGazeCard } from '../components/pmo/GuardingGazeCard';
import { usePmo } from '../context/PmoContext';

import { Card } from '../components/ui/Card';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface DashboardPageProps {
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCheckIn,
  onTriggerSos,
}) => {
  const { currentStreak, cleanRatioPercent, chaserEffectActive, analytics, apiError, counselNotes } = usePmo();

  const hoursSaved = analytics?.estimatedHoursSaved ?? currentStreak * 2;
  const moneySaved = analytics?.estimatedMoneySaved ?? currentStreak * 3;
  const nafsStage = analytics?.nafsStage || (currentStreak <= 7 ? 'NAFS_AL_AMMARAH' : currentStreak <= 40 ? 'NAFS_AL_LAWWAMAH' : 'NAFS_AL_MUTMAINNAH');

  const notesList = Array.isArray(counselNotes) ? counselNotes : [];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {apiError && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium text-center shadow-lg">
          ⚠️ {apiError}
        </div>
      )}
      {/* 48-Hour Chaser Effect Shield Banner */}
      <ChaserEffectBanner isActive={chaserEffectActive} hoursRemaining={chaserEffectActive ? 48 : 0} />

      {/* Mentor Nasiha / Counsel Notes Banner */}
      {notesList.length > 0 && (
        <div className="space-y-3">
          {notesList.map((note) => (
            <Card key={note.id} variant="gold" className="p-4 space-y-2 border-amber-500/40 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Mentor Counsel Note (Nasiha)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{note.mentorFullName || 'Verified Mentor'}</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/95 leading-relaxed italic font-serif pl-6 border-l-2 border-amber-400/40">
                "{note.noteContent}"
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Sleek Minimalist Hero Display */}
      <MinimalStreakHero
        currentStreak={currentStreak}
        cleanRatioPercent={cleanRatioPercent}
        onOpenCheckIn={onOpenCheckIn}
        onTriggerSos={onTriggerSos}
      />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Column Section */}
        <div className="lg:col-span-2 space-y-6">
          <DopamineRebootCard
            currentCleanDays={currentStreak}
            estimatedHoursSaved={hoursSaved}
            estimatedMoneySaved={moneySaved}
          />

          <GuardingGazeCard cleanGazeDays={currentStreak} />
        </div>

        {/* Side Column Section */}
        <div className="space-y-6">
          <NafsProgressTracker currentStage={nafsStage} currentCleanDays={currentStreak} />
        </div>
      </div>
    </div>
  );
};
