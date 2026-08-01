import React from 'react';
import { BarChart3, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { usePmo } from '../context/PmoContext';

interface AnalyticsPageProps {
  currentStreak?: number;
  cleanRatioPercent?: number;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const { analytics, currentStreak, cleanRatioPercent } = usePmo();

  const totalTriggersCount = analytics?.topTriggers?.reduce((sum, t) => sum + t.count, 0) || 1;

  const topTriggers = analytics?.topTriggers?.map((trig) => ({
    name: trig.trigger,
    count: trig.count,
    percent: Math.round((trig.count / totalTriggersCount) * 100),
  })) || [];

  const defaultBadges = [
    { title: 'Day 3 Survivor', desc: 'Acute Withdrawal Wave Overcome', achieved: currentStreak >= 3 },
    { title: 'Day 7 Flatline Warrior', desc: 'Dopamine Re-balancing Initialized', achieved: currentStreak >= 7 },
    { title: 'Day 21 Rewire Master', desc: 'New Neural Pathways Formed', achieved: currentStreak >= 21 },
    { title: 'Day 40 Heart Purity', desc: 'Deep Spiritual Tazkiyah Milestone', achieved: currentStreak >= 40 },
  ];

  const hoursSaved = analytics?.estimatedHoursSaved ?? currentStreak * 2;
  const moneySaved = analytics?.estimatedMoneySaved ?? currentStreak * 3;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card variant="emerald" className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              PMO Recovery Analytics & Barakah Metrics
            </h2>
            <p className="text-xs text-emerald-200">Behavioral progress indicators and trigger maps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-xs text-slate-400 block font-medium">Clean Ratio Score</span>
            <span className="text-2xl font-black text-emerald-300 font-mono mt-1 block">{cleanRatioPercent}%</span>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-xs text-slate-400 block font-medium">Current Streak</span>
            <span className="text-2xl font-black text-amber-300 font-mono mt-1 block">{currentStreak} Days</span>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-xs text-slate-400 block font-medium">Time Reclaimed</span>
            <span className="text-2xl font-black text-teal-300 font-mono mt-1 block">{hoursSaved} Hours</span>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-xs text-slate-400 block font-medium">Sadaqah Potential</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">${moneySaved} Saved</span>
          </div>
        </div>
      </Card>

      {/* Multi-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trigger Breakdown */}
        <Card variant="dark" className="p-5 space-y-4 border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Top PMO Craving Triggers Radar
          </h3>
          <div className="space-y-3">
            {topTriggers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No triggers logged yet. Log daily check-ins to build radar maps.</p>
            ) : (
              topTriggers.map((trig) => (
                <div key={trig.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold">{trig.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{trig.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full"
                      style={{ width: `${trig.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right Column: Milestones & Badges */}
        <Card variant="glass" className="p-5 space-y-4 border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Neuroplasticity & Nafs Milestones
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {defaultBadges.map((bdg) => (
              <div
                key={bdg.title}
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  bdg.achieved
                    ? 'bg-slate-900/80 border-amber-500/40 text-amber-100 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{bdg.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">{bdg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
