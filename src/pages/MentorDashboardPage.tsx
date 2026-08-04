import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, ShieldCheck, Flame, HeartHandshake, Check, X, Compass } from 'lucide-react';

interface MenteeRequest {
  id: string;
  name: string;
  username: string;
  date: string;
  code: string;
}

export const MentorDashboardPage: React.FC = () => {
  const [acceptingNewMentees, setAcceptingNewMentees] = useState(true);
  const [requests, setRequests] = useState<MenteeRequest[]>([
    { id: 'req-1', name: 'Zayd Malik', username: 'zayd_m', date: 'Today', code: 'MENTOR-BC-7890' },
    { id: 'req-2', name: 'Omar Farooq', username: 'omar_f', date: 'Yesterday', code: 'MENTOR-BC-7890' },
  ]);

  const [activeMentees, setActiveMentees] = useState([
    { id: 'm-1', name: 'Zayd Malik', username: 'zayd_m', streak: 12, ratio: 95, lastStatus: 'CLEAN', lastCheckIn: '3 hrs ago' },
    { id: 'm-2', name: 'Bilal Khan', username: 'bilal_k', streak: 4, ratio: 80, lastStatus: 'URGE_RESISTED', lastCheckIn: '5 hrs ago' },
    { id: 'm-3', name: 'Tariq Ali', username: 'tariq_a', streak: 27, ratio: 100, lastStatus: 'CLEAN', lastCheckIn: '1 day ago' },
  ]);

  const handleAccept = (reqId: string, name: string, username: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    setActiveMentees((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, name, username, streak: 0, ratio: 100, lastStatus: 'CLEAN', lastCheckIn: 'Just now' },
    ]);
  };

  const handleDecline = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Mentor Profile Overview Header */}
      <Card variant="emerald" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Shaykh Ahmad (Spiritual Mentor)
                </h2>
                <Badge variant="emerald" className="text-[10px] font-bold">
                  VERIFIED GUIDE
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-semibold mt-0.5">
                Specialization: <strong className="text-slate-900 dark:text-slate-200 font-black">Spiritual Counsel (Tazkiyah) & Sobriety</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-700 dark:text-slate-400 font-bold">Accepting Mentees:</span>
            <button
              onClick={() => setAcceptingNewMentees(!acceptingNewMentees)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                acceptingNewMentees
                  ? 'bg-emerald-55 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-500/30'
                  : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              {acceptingNewMentees ? 'Active & Open' : 'Roster Full'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Total Connected Mentees</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">{activeMentees.length}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Aggregate Clean Ratio</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">91.6%</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Nasiha Prompts Sent</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">14 Notes</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Connection Requests */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Pending Requests ({requests.length})
          </h3>

          {requests.length === 0 ? (
            <Card variant="glass" className="p-6 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium italic">No pending connection requests.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <Card key={req.id} variant="gold" className="p-3.5 space-y-3 border-amber-500/20 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 text-xs font-bold">{req.name}</strong>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 block font-mono">@{req.username}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium">{req.date}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[9px] text-amber-900/80 dark:text-amber-355 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 font-mono">Code: {req.code}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAccept(req.id, req.name, req.username)}
                        className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                        title="Accept Request"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 cursor-pointer"
                        title="Decline Request"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Roster Summaries */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Connected Mentees Active Roster
          </h3>

          <div className="space-y-3">
            {activeMentees.map((mentee) => (
              <Card key={mentee.id} variant="dark" className="p-4 space-y-3 border-slate-150 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-800 dark:text-slate-200 font-black text-xs">
                      {mentee.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 text-xs font-bold">{mentee.name}</strong>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 block font-mono">@{mentee.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-700 dark:text-slate-400 font-mono font-medium">Last active: {mentee.lastCheckIn}</span>
                    <Badge variant={mentee.lastStatus === 'CLEAN' ? 'emerald' : 'amber'}>
                      {mentee.lastStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-950/70 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase font-semibold">Active Streak</span>
                    <div className="flex items-center gap-1 mt-0.5 text-emerald-700 dark:text-amber-400 font-black font-mono">
                      <Flame className="w-3.5 h-3.5 fill-emerald-600" />
                      {mentee.streak} Days Clean
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase font-semibold">Clean Ratio Score</span>
                    <div className="flex items-center gap-1 mt-0.5 text-emerald-700 dark:text-emerald-450 font-black font-mono">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      {mentee.ratio}% Purity
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
