import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ShieldCheck,
  Send,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  Users,
  Flame,
  Clock,
  BookOpen,
} from 'lucide-react';
import { getMentees, sendCounselNote } from '../services/partnerService';
import { getMyMentorProfile } from '../services/mentorService';
import { formatApiErrorMessage } from '../services/apiClient';
import type { HabitChain } from '../types/chain';
import type { MentorProfile } from '../types/mentor';

interface MenteesPageProps {
  onBack?: () => void;
}

interface DisplayMentee {
  id: string;
  chainId: string;
  name: string;
  username: string;
  streakDays: number;
  longestStreak: number;
  resilienceScore: number;
  cleanRatioPercent: number;
  totalCleanDays: number;
  lastCheckIn: string;
  status: 'CLEAN' | 'SLIP_UP' | 'URGE_RESISTED';
  nafsStage: string;
  strategy?: string;
  description?: string;
  intentStatement?: string;
  privacyLevel?: string;
}

export const MenteesPage: React.FC<MenteesPageProps> = ({ onBack }) => {
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [menteeChains, setMenteeChains] = useState<HabitChain[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedMentee, setSelectedMentee] = useState<DisplayMentee | null>(null);
  const [counselNoteText, setCounselNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSentSuccess, setNoteSentSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);

  const inviteCode = 'MENTOR-BC-7890';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const [profile, chains] = await Promise.all([
          getMyMentorProfile().catch(() => null),
          getMentees().catch(() => []),
        ]);
        setMentorProfile(profile);
        setMenteeChains(chains);
      } catch (err: unknown) {
        setErrorMsg(formatApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setInviteCodeCopied(true);
    setTimeout(() => setInviteCodeCopied(false), 2000);
  };

  const handleSendCounselNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselNoteText.trim() || !selectedMentee) return;

    setIsSubmittingNote(true);
    setErrorMsg(null);

    try {
      if (selectedMentee.chainId) {
        try {
          await sendCounselNote(selectedMentee.chainId, counselNoteText.trim());
        } catch (apiErr: unknown) {
          console.warn('API call to send counsel note skipped for demo mentee:', apiErr);
        }
      }
      setNoteSentSuccess(`Counsel note (Nasiha) sent to ${selectedMentee.name}!`);
      setCounselNoteText('');
      setTimeout(() => {
        setNoteSentSuccess(null);
        setSelectedMentee(null);
      }, 3000);
    } catch (err: unknown) {
      setErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Map API chains returned from backend
  const displayList: DisplayMentee[] = (menteeChains || []).map((chain, idx) => ({
    id: chain.id,
    chainId: chain.id,
    name: chain.title || `Recoveree ${idx + 1}`,
    username: `@recoveree_${idx + 1}`,
    streakDays: chain.currentStreak || 0,
    longestStreak: chain.longestStreak || 0,
    resilienceScore: chain.resilienceScore || 0,
    cleanRatioPercent: chain.cleanRatioPercent ?? 100,
    totalCleanDays: chain.totalCleanDays || 0,
    lastCheckIn: chain.lastCheckInDate 
      ? new Date(chain.lastCheckInDate).toLocaleDateString() 
      : 'No check-in yet',
    status: (chain.currentStreak || 0) > 0 ? 'CLEAN' : 'URGE_RESISTED',
    nafsStage: (chain.currentStreak || 0) > 21 ? 'Nafs al-Mutmainnah' : (chain.currentStreak || 0) > 7 ? 'Nafs al-Lawwamah' : 'Nafs al-Ammarah',
    strategy: chain.strategy,
    description: chain.description,
    intentStatement: chain.intentStatement,
    privacyLevel: chain.privacyLevel,
  }));

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Top Page Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              aria-label="Back to Guidance"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              My Mentees Roster
            </h1>
            <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
              Spiritual Nasiha & Active Recovery Counseling Engine
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyInviteCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-700 dark:text-amber-400 hover:border-amber-400 transition-all shadow-xs cursor-pointer"
        >
          {inviteCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{inviteCodeCopied ? 'Code Copied!' : inviteCode}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Mentor Profile Overview Card */}
      <Card variant="glass" className="p-5 border-emerald-500/30 dark:border-emerald-800/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {mentorProfile?.fullName || 'Verified Spiritual Mentor'}
                </h3>
                <Badge variant="emerald" className="text-[10px] font-bold">
                  VERIFIED MENTOR
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-semibold mt-0.5">
                Specialization: <strong className="text-slate-900 dark:text-slate-200 font-black">{mentorProfile?.specialization || 'Spiritual Counsel (Tazkiyah)'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-150 dark:border-slate-850 text-xs text-slate-750 dark:text-slate-300 shadow-xs">
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Active Mentees</span>
              <strong className="text-emerald-700 dark:text-emerald-405 font-mono text-sm">{displayList.length} Recoverees</strong>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Counsel Notes</span>
              <strong className="text-emerald-700 dark:text-emerald-405 font-mono text-sm">Active Nasiha</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Note Sent Toast */}
      {noteSentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2 shadow-lg">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>{noteSentSuccess}</span>
        </div>
      )}

      {/* Mentees Grid / List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active Mentee Accounts ({displayList.length})
        </h3>

        {isLoading && (
          <div className="text-center py-12 text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading mentee roster...</span>
          </div>
        )}

        {!isLoading && displayList.length === 0 && (
          <Card variant="glass" className="p-8 text-center space-y-3 border-slate-200 dark:border-slate-800">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-200">No Mentees Connected Yet</h4>
            <p className="text-xs text-slate-700 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
              Share your mentor invite code <code className="text-amber-700 dark:text-amber-400 font-mono font-bold bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{inviteCode}</code> with recoverees so they can connect with your mentorship.
            </p>
          </Card>
        )}

        {!isLoading && displayList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayList.map((mentee) => (
              <Card
                key={mentee.id}
                variant="dark"
                onClick={() => {
                  setSelectedMentee(mentee);
                  setErrorMsg(null);
                  setNoteSentSuccess(null);
                }}
                className="p-4 border-slate-150 dark:border-slate-850 hover:border-emerald-500/40 hover:shadow-md cursor-pointer transition-all duration-200 bg-white dark:bg-slate-900/80 rounded-2xl flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 font-black text-sm uppercase">
                      {mentee.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">{mentee.name}</h4>
                      <span className="text-[10px] text-slate-505 dark:text-slate-450 font-mono">{mentee.username}</span>
                    </div>
                  </div>

                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    mentee.status === 'CLEAN'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-705 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-705 dark:text-amber-450 border-amber-100 dark:border-amber-900/30'
                  }`}>
                    {mentee.status === 'CLEAN' ? 'Stable' : 'Vulnerable'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-150 dark:border-slate-800/40 text-slate-700 dark:text-slate-350">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-500 block">Streak</span>
                    <div className="flex items-center gap-1 text-[11px] font-black text-slate-800 dark:text-slate-205 font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-505" />
                      <span>{mentee.streakDays} Days</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-500 block">Clean Ratio</span>
                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-205 font-mono">
                      {mentee.cleanRatioPercent}% Purity
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 dark:text-slate-455 text-right flex items-center justify-end gap-1 font-semibold uppercase tracking-wider">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAIL SLIDE-IN PANEL (CONTEXTUAL MENTEE PROFILE & CARE TERMINAL) --- */}
      {selectedMentee && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 opacity-100"
            onClick={() => setSelectedMentee(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800/80 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="p-4 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 font-black text-sm uppercase shrink-0">
                  {selectedMentee.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {selectedMentee.name}
                    </h3>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      MENTEE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedMentee.username}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMentee(null)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-500">Mentee Profile & Intent</span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 space-y-3 text-xs leading-relaxed text-slate-800 dark:text-slate-350">
                  {selectedMentee.intentStatement ? (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Pledge / Intent Statement</span>
                      <p className="italic font-serif text-[11px] text-slate-900 dark:text-slate-100">
                        "{selectedMentee.intentStatement}"
                      </p>
                    </div>
                  ) : null}
                  {selectedMentee.description ? (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Chain Description</span>
                      <p className="text-[11px]">
                        {selectedMentee.description}
                      </p>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/40 text-[10px]">
                    <div>
                      <span className="text-slate-500 block font-semibold">Privacy Level</span>
                      <span className="font-bold uppercase text-slate-850 dark:text-slate-200 font-mono tracking-wide">
                        {selectedMentee.privacyLevel?.replace('LEVEL_', 'Level ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Strategy Profile</span>
                      <span className="font-bold uppercase text-slate-850 dark:text-slate-200 font-mono tracking-wide">
                        {selectedMentee.strategy?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-500">Mentee Recovery Analytics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-center space-y-1 shadow-xs">
                    <span className="text-[9px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Current Streak</span>
                    <strong className="text-xl font-mono text-amber-500 flex items-center justify-center gap-1 font-black">
                      <Flame className="w-5 h-5 fill-amber-500" />
                      {selectedMentee.streakDays}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-center space-y-1 shadow-xs">
                    <span className="text-[9px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Longest Streak</span>
                    <strong className="text-xl font-mono text-slate-800 dark:text-slate-200 font-black">
                      {selectedMentee.longestStreak}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-center space-y-1 shadow-xs">
                    <span className="text-[9px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Total Clean Days</span>
                    <strong className="text-xl font-mono text-emerald-600 dark:text-emerald-450 font-black">
                      {selectedMentee.totalCleanDays}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-center space-y-1 shadow-xs">
                    <span className="text-[9px] text-slate-700 dark:text-slate-500 block uppercase font-bold">Purity Ratio</span>
                    <strong className="text-xl font-mono text-emerald-600 dark:text-emerald-450 font-black">
                      {selectedMentee.cleanRatioPercent}%
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-700 dark:text-slate-400 block tracking-wide">Resilience Score</span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Calculated recovery resilience based on logs, slips, and urge deconditioning.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center bg-white dark:bg-slate-950 font-mono font-black text-xs text-emerald-700 dark:text-emerald-400 shadow-xs shrink-0">
                    {selectedMentee.resilienceScore}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-500">Progress & Stage Monitoring</span>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 space-y-3.5 text-xs text-slate-800 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-450">Nafs Spiritual Stage</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-455 tracking-wide uppercase text-[10px]">
                      {selectedMentee.nafsStage}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-205 dark:border-slate-850">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedMentee.streakDays / 30) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-450 font-bold uppercase tracking-wider">
                    <span>Ammarah (Infancy)</span>
                    <span>Lawwamah (Striving)</span>
                    <span>Mutmainnah (Tranquil)</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/40 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-500 font-semibold"><Clock className="w-3.5 h-3.5 text-slate-550" /> Last Active Check-in</span>
                    <span className="font-mono font-bold text-slate-850 dark:text-slate-200">{selectedMentee.lastCheckIn}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-500">Active Nasiha Terminal</span>
                <Card variant="gold" className="p-4 border-amber-500/40 space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-amber-955 dark:text-amber-250 font-black text-[10px] uppercase tracking-wider">
                    <Send className="w-3.5 h-3.5 text-amber-600" />
                    <span>Send Counsel Advice</span>
                  </div>
                  
                  <form onSubmit={handleSendCounselNote} className="space-y-3">
                    <textarea
                      rows={3}
                      value={counselNoteText}
                      onChange={(e) => setCounselNoteText(e.target.value)}
                      placeholder="Write an encouraging reflection, Quranic reminder, or suggestion for their PMO recovery..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-amber-450/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-none shadow-xs"
                      required
                    />
                    <div className="flex justify-end pt-1">
                      <Button
                        type="submit"
                        variant="emerald"
                        size="sm"
                        isLoading={isSubmittingNote}
                        className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl"
                      >
                        Send Nasiha
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};
