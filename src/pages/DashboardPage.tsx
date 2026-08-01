import React from 'react';
import { MinimalStreakHero } from '../components/pmo/MinimalStreakHero';
import { ChaserEffectBanner } from '../components/pmo/ChaserEffectBanner';
import { NafsProgressTracker } from '../components/pmo/NafsProgressTracker';
import { DopamineRebootCard } from '../components/pmo/DopamineRebootCard';
import { GuardingGazeCard } from '../components/pmo/GuardingGazeCard';
import { usePmo } from '../context/PmoContext';

interface DashboardPageProps {
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCheckIn,
  onTriggerSos,
}) => {
  const { currentStreak, cleanRatioPercent, chaserEffectActive, analytics } = usePmo();

  const hoursSaved = analytics?.estimatedHoursSaved ?? currentStreak * 2;
  const moneySaved = analytics?.estimatedMoneySaved ?? currentStreak * 3;
  const nafsStage = analytics?.nafsStage || (currentStreak <= 7 ? 'NAFS_AL_AMMARAH' : currentStreak <= 40 ? 'NAFS_AL_LAWWAMAH' : 'NAFS_AL_MUTMAINNAH');

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* 48-Hour Chaser Effect Shield Banner */}
      <ChaserEffectBanner isActive={chaserEffectActive} hoursRemaining={chaserEffectActive ? 48 : 0} />

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
