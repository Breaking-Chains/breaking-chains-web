import React, { useState } from 'react';
import { MinimalStreakHero } from '../components/pmo/MinimalStreakHero';
import { ChaserEffectBanner } from '../components/pmo/ChaserEffectBanner';
import { NafsProgressTracker } from '../components/pmo/NafsProgressTracker';
import { DopamineRebootCard } from '../components/pmo/DopamineRebootCard';
import { GuardingGazeCard } from '../components/pmo/GuardingGazeCard';
import { usePmo } from '../context/PmoContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, ShieldCheck, ChevronDown, ChevronUp, Brain, Compass, BarChart3, Clock, DollarSign } from 'lucide-react';
import type { NavTab } from '../components/layout/BottomNav';

interface DashboardPageProps {
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
  onTabChange?: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCheckIn,
  onTriggerSos,
  onTabChange,
}) => {
  const { currentStreak, cleanRatioPercent, chaserEffectActive, analytics, apiError, counselNotes } = usePmo();
  
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(true);
  const [isSpiritualOpen, setIsSpiritualOpen] = useState(false);
  const [isImpactOpen, setIsImpactOpen] = useState(false);

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

      {/* Collapsible Sections Layout */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* 1. Recovery Progress */}
        <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setIsRecoveryOpen(!isRecoveryOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Recovery Progress</span>
            </div>
            {isRecoveryOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {isRecoveryOpen && (
            <div className="p-4 border-t border-slate-900 animate-fade-in space-y-4 bg-slate-950/20">
              <DopamineRebootCard
                currentCleanDays={currentStreak}
                estimatedHoursSaved={hoursSaved}
                estimatedMoneySaved={moneySaved}
              />
            </div>
          )}
        </div>

        {/* 2. Spiritual Growth */}
        <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setIsSpiritualOpen(!isSpiritualOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Spiritual Growth</span>
            </div>
            {isSpiritualOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {isSpiritualOpen && (
            <div className="p-4 border-t border-slate-900 animate-fade-in space-y-4 bg-slate-950/20">
              <GuardingGazeCard cleanGazeDays={currentStreak} />
              <NafsProgressTracker currentStage={nafsStage} currentCleanDays={currentStreak} />
            </div>
          )}
        </div>

        {/* 3. Impact & Analytics */}
        <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setIsImpactOpen(!isImpactOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Impact & Analytics</span>
            </div>
            {isImpactOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {isImpactOpen && (
            <div className="p-4 border-t border-slate-900 animate-fade-in space-y-4 bg-slate-950/20">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-950 text-teal-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Time Reclaimed</span>
                    <span className="text-xs font-bold text-slate-100 font-mono">{hoursSaved} Hours</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-950 text-amber-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Sadaqah Potential</span>
                    <span className="text-xs font-bold text-slate-100 font-mono">${moneySaved} Saved</span>
                  </div>
                </div>
              </div>

              {onTabChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTabChange('analytics')}
                  className="w-full flex items-center justify-center gap-2 border-slate-800 text-teal-400 hover:border-teal-500/40"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Open Detailed Analytics</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
