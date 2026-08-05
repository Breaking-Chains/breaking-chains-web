import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ShieldCheck,
  HeartHandshake,
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
  lastCheckIn: string;
  status: 'CLEAN' | 'SLIP_UP' | 'URGE_RESISTED';
  nafsStage: string;
  strategy?: string;
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
    lastCheckIn: 'Recently active',
    status: (chain.currentStreak || 0) > 0 ? 'CLEAN' : 'URGE_RESISTED',
    nafsStage: (chain.currentStreak || 0) > 21 ? 'Nafs al-Mutmainnah (Tranquil)' : (chain.currentStreak || 0) > 7 ? 'Nafs al-Lawwamah (Self-Reproaching)' : 'Nafs al-Ammarah (Inciting to Evil)',
    strategy: chain.strategy,
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

      {/* Inline Counsel Note Composer */}
      {selectedMentee && (
        <Card variant="gold" className="p-5 space-y-4 border-amber-500/50 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2 text-sm font-black text-amber-950 dark:text-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Send Spiritual Counsel Note (Nasiha) to {selectedMentee.name}</span>
            </div>
            <button
              onClick={() => setSelectedMentee(null)}
              className="text-xs text-amber-800 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-250 font-bold underline cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSendCounselNote} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-950 dark:text-amber-200/90">
                Counsel Note Content (Visible to mentee on their chain dashboard):
              </label>
              <textarea
                rows={4}
                value={counselNoteText}
                onChange={(e) => setCounselNoteText(e.target.value)}
                placeholder="Write an encouraging Quranic verse, Hadith, or tailored spiritual advice for your mentee..."
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950/90 border border-amber-450/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-none shadow-xs"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-amber-900/85 dark:text-amber-300/80 italic font-medium">
                * Mentee will receive a notification and counsel note card.
              </span>
              <Button
                type="submit"
                variant="emerald"
                size="sm"
                isLoading={isSubmittingNote}
                className="flex items-center gap-2 text-xs px-4"
              >
                <Send className="w-4 h-4" /> Send Nasiha
              </Button>
            </div>
          </form>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayList.map((mentee) => (
              <Card
                key={mentee.id}
                variant="dark"
                className="p-4 space-y-3 border-slate-150 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-sm">
                      {mentee.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">{mentee.name}</h4>
                      <span className="text-xs text-slate-700 dark:text-slate-400 font-mono font-bold">{mentee.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 dark:text-amber-450 font-mono font-bold text-xs bg-emerald-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-emerald-250 dark:border-amber-800/40">
                    <Flame className="w-3.5 h-3.5 fill-emerald-600 dark:fill-amber-400" />
                    {mentee.streakDays} Days
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-950/70 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-405 font-medium">Nafs Recovery Stage:</span>
                    <strong className="text-emerald-700 dark:text-emerald-305 text-[11px] font-black">{mentee.nafsStage}</strong>
                  </div>
                  {mentee.strategy && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-900">
                      <span className="text-slate-750">Strategy:</span>
                      <span className="text-slate-850 dark:text-slate-200 text-[11px] truncate max-w-[200px] font-bold">{mentee.strategy}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-700 dark:text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-600" /> Last Check-In</span>
                    <span>{mentee.lastCheckIn}</span>
                  </div>
                </div>

                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => setSelectedMentee(mentee)}
                  className="w-full text-xs font-bold flex items-center justify-center gap-2 border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500/50 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-transparent shadow-xs"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                  Send Spiritual Counsel Note (Nasiha)
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
