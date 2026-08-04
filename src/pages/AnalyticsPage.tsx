import React from 'react';
import { Award, ShieldCheck, Flame, Clock, Heart } from 'lucide-react';
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
    { title: 'Day 3 Survivor', desc: 'Acute urge waves overcome', achieved: currentStreak >= 3 },
    { title: 'Day 7 Flatline Warrior', desc: 'Dopamine re-balancing started', achieved: currentStreak >= 7 },
    { title: 'Day 21 Rewire Master', desc: 'New neural pathways forming', achieved: currentStreak >= 21 },
    { title: 'Day 40 Heart Purity', desc: 'Deep spiritual Tazkiyah milestone', achieved: currentStreak >= 40 },
  ];

  const hoursSaved = analytics?.estimatedHoursSaved ?? currentStreak * 2;
  const moneySaved = analytics?.estimatedMoneySaved ?? currentStreak * 3;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary Section */}
      <Card variant="emerald" className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-300 text-sm font-bold select-none">✵</span>
          <div>
            <h2 className="text-xs font-bold text-emerald-950 dark:text-white uppercase tracking-wider">
              PMO Recovery Analytics & Barakah Metrics
            </h2>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-250 font-medium">Behavioral progress indicators and trigger maps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          {/* Metric 1: Clean Ratio */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[110px]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="mt-2 flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase tracking-wider font-bold">Clean Ratio Score</span>
              {cleanRatioPercent === 0 ? (
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 italic mt-1.5 block">First Check-in Pending</span>
              ) : (
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">{cleanRatioPercent}%</span>
              )}
            </div>
          </div>

          {/* Metric 2: Current Streak */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[110px]">
            <Flame className="w-5 h-5 text-amber-550 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            <div className="mt-2 flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase tracking-wider font-bold">Current Streak</span>
              {currentStreak === 0 ? (
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 italic mt-1.5 block">No Active Streak</span>
              ) : (
                <span className="text-xl font-black text-amber-600 dark:text-amber-300 font-mono mt-0.5 block">{currentStreak} Days</span>
              )}
            </div>
          </div>

          {/* Metric 3: Time Reclaimed */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[110px]">
            <Clock className="w-5 h-5 text-teal-650 dark:text-teal-400 animate-pulse" />
            <div className="mt-2 flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase tracking-wider font-bold">Time Reclaimed</span>
              {hoursSaved === 0 ? (
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 italic mt-1.5 block">Save Hours Tomorrow</span>
              ) : (
                <span className="text-xl font-black text-teal-600 dark:text-teal-450 font-mono mt-0.5 block">{hoursSaved} Hours</span>
              )}
            </div>
          </div>

          {/* Metric 4: Sadaqah Potential */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[110px]">
            <Heart className="w-5 h-5 text-rose-600 dark:text-rose-455" />
            <div className="mt-2 flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase tracking-wider font-bold">Sadaqah Potential</span>
              {moneySaved === 0 ? (
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 italic mt-1.5 block">Charity Pool Starting</span>
              ) : (
                <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">${moneySaved} Saved</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Multi-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trigger Radar */}
        <Card variant="dark" className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              PMO Craving Triggers Radar
            </h3>
          </div>

          {topTriggers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <svg className="w-24 h-24 text-slate-200 dark:text-slate-800" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                {/* Soft desaturated indicator points */}
                <circle cx="35" cy="40" r="3" fill="#10b981" className="opacity-40 animate-pulse" />
                <circle cx="65" cy="30" r="2.5" fill="#f59e0b" className="opacity-40 animate-pulse" />
                <circle cx="45" cy="70" r="3.5" fill="#ec4899" className="opacity-40 animate-pulse" />
              </svg>
              <p className="text-[11px] text-slate-650 dark:text-slate-400 text-center max-w-[240px] leading-normal font-semibold italic">
                No trigger data logged yet. Complete daily check-ins to map your triggers here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
              {/* Visual radar graphic next to the trigger list */}
              <svg className="w-24 h-24 text-slate-200 dark:text-slate-850 shrink-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                {/* Real active indicator points */}
                {topTriggers.map((trig, index) => {
                  const angle = (index * 2 * Math.PI) / topTriggers.length;
                  const distance = 15 + (trig.percent / 100) * 30; // map between radius 15 and 45
                  const cx = 50 + distance * Math.cos(angle);
                  const cy = 50 + distance * Math.sin(angle);
                  const colors = ['#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
                  return (
                    <circle
                      key={trig.name}
                      cx={cx}
                      cy={cy}
                      r="3.5"
                      fill={colors[index % colors.length]}
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>

              <div className="space-y-3 flex-1 w-full">
                {topTriggers.map((trig) => (
                  <div key={trig.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{trig.name.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{trig.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full"
                        style={{ width: `${trig.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Right Column: Milestones Timeline */}
        <Card variant="glass" className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-550 dark:text-amber-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Neuroplasticity & Nafs Milestones
            </h3>
          </div>

          {/* Horizontal Timeline Scrollable container */}
          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory">
            {defaultBadges.map((bdg) => (
              <div
                key={bdg.title}
                className={`min-w-[190px] sm:min-w-[210px] p-4 rounded-2xl border snap-start flex flex-col justify-between space-y-3 relative overflow-hidden transition-all duration-200 ${
                  bdg.achieved
                    ? 'bg-white dark:bg-slate-900 border-amber-500/35 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-900/60 opacity-55'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    bdg.achieved ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  {/* Status node */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    bdg.achieved ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {bdg.achieved ? 'Achieved' : 'Locked'}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold tracking-tight">{bdg.title}</h4>
                  <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-snug mt-1 font-semibold">{bdg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
