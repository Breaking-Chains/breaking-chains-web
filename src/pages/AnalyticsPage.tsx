import React from 'react';
import { BarChart3, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface AnalyticsPageProps {
  currentStreak: number;
  cleanRatioPercent: number;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  currentStreak = 18,
  cleanRatioPercent = 94.7,
}) => {
  const topTriggers = [
    { name: '🌙 Late Night Solitude', count: 12, percent: 54 },
    { name: '⚡ Stress & Work Anxiety', count: 6, percent: 27 },
    { name: '📱 Social Media Peeking', count: 4, percent: 19 },
  ];

  const badges = [
    { title: 'Day 3 Survivor', desc: 'Acute Withdrawal Wave Overcome', achieved: true },
    { title: 'Day 7 Flatline Warrior', desc: 'Dopamine Re-balancing Initialized', achieved: true },
    { title: 'Day 21 Rewire Master', desc: 'New Neural Pathways Formed', achieved: false },
    { title: 'Day 40 Heart Purity', desc: 'Deep Spiritual Tazkiyah Milestone', achieved: false },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <Card variant="emerald" className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            PMO Recovery Analytics & Barakah
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Clean Ratio</span>
            <span className="text-xl font-black text-emerald-300 font-mono">{cleanRatioPercent}%</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Current Streak</span>
            <span className="text-xl font-black text-amber-300 font-mono">{currentStreak} Days</span>
          </div>
        </div>
      </Card>

      <Card variant="dark" className="p-4 space-y-3 border-slate-800">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Top PMO Craving Triggers
        </h3>
        <div className="space-y-2">
          {topTriggers.map((trig) => (
            <div key={trig.name} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{trig.name}</span>
                <span className="font-mono text-emerald-400">{trig.percent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${trig.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="glass" className="p-4 space-y-3 border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Neuroplasticity & Nafs Badges
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {badges.map((bdg) => (
            <div
              key={bdg.title}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                bdg.achieved
                  ? 'bg-slate-900/80 border-amber-500/40 text-amber-100'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{bdg.title}</h4>
                <p className="text-[10px] text-slate-400">{bdg.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
