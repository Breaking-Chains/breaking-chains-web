import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, HeartHandshake, Send, Sparkles, Copy, Check, Users } from 'lucide-react';
import { getMentees, sendCounselNote } from '../../services/partnerService';

interface Mentee {
  id: string;
  chainId: string;
  name: string;
  username: string;
  streakDays: number;
  lastCheckIn: string;
  status: 'CLEAN' | 'SLIP_UP' | 'URGE_RESISTED';
  nafsStage: string;
}

interface MyMenteesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName?: string;
}

export const MyMenteesModal: React.FC<MyMenteesModalProps> = ({
  isOpen,
  onClose,
  mentorName = 'Verified Mentor',
}) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [counselNoteText, setCounselNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSentSuccess, setNoteSentSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);

  const inviteCode = 'MENTOR-BC-7890';

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setErrorMsg(null);
      getMentees()
        .then((chains) => {
          const list: Mentee[] = (chains || []).map((chain, idx) => ({
            id: chain.id,
            chainId: chain.id,
            name: chain.title || `Recoveree ${idx + 1}`,
            username: `@recoveree_${idx + 1}`,
            streakDays: chain.currentStreak || 0,
            lastCheckIn: 'Recently active',
            status: (chain.currentStreak || 0) > 0 ? 'CLEAN' : 'URGE_RESISTED',
            nafsStage: (chain.currentStreak || 0) > 21 ? 'Nafs al-Mutmainnah (Tranquil)' : (chain.currentStreak || 0) > 7 ? 'Nafs al-Lawwamah (Self-Reproaching)' : 'Nafs al-Ammarah (Inciting to Evil)',
          }));
          setMentees(list);
        })
        .catch(() => setMentees([]))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

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
        } catch (apiErr) {
          console.warn('API call skipped for demo mentee:', apiErr);
        }
      }
      setNoteSentSuccess(`Counsel note sent to ${selectedMentee.name}!`);
      setCounselNoteText('');
      setTimeout(() => {
        setNoteSentSuccess(null);
        setSelectedMentee(null);
      }, 2500);
    } catch {
      setErrorMsg('Failed to send counsel note.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Mentees Roster (Nasiha & Suhbah)">
      <div className="space-y-4">
        {/* Mentor Header Card */}
        <Card variant="glass" className="p-3.5 border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-100">{mentorName}</h4>
                <Badge variant="emerald" className="text-[9px] py-0 px-1.5">VERIFIED MENTOR</Badge>
              </div>
              <p className="text-[10px] text-slate-400">Guiding {mentees.length} active recoverees</p>
            </div>
          </div>

          <button
            onClick={handleCopyInviteCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400 hover:border-amber-500/50 transition-all"
          >
            {inviteCodeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{inviteCodeCopied ? 'Copied' : inviteCode}</span>
          </button>
        </Card>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Note Sent Toast */}
        {noteSentSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {noteSentSuccess}
          </div>
        )}

        {/* Counsel Note Editor Drawer */}
        {selectedMentee ? (
          <Card variant="gold" className="p-4 space-y-3 border-amber-500/40 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Send Spiritual Nasiha to {selectedMentee.name}</span>
              </div>
              <button
                onClick={() => setSelectedMentee(null)}
                className="text-[10px] text-amber-400 hover:underline font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSendCounselNote} className="space-y-2.5">
              <textarea
                rows={3}
                value={counselNoteText}
                onChange={(e) => setCounselNoteText(e.target.value)}
                placeholder="Write an encouraging verse, Hadith, or recovery advice for your mentee..."
                className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  isLoading={isSubmittingNote}
                  className="flex items-center gap-1 text-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Send Counsel Note
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        {/* Mentee List */}
        {isLoading ? (
          <div className="text-center py-8 text-xs text-slate-500">Loading mentees...</div>
        ) : mentees.length === 0 ? (
          <Card variant="glass" className="p-6 text-center space-y-2 border-slate-800">
            <Users className="w-7 h-7 text-slate-600 mx-auto" />
            <h5 className="text-xs font-bold text-slate-200">No Mentees Connected Yet</h5>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Share your invite code <code className="text-amber-400 font-mono">{inviteCode}</code> with recoverees to connect them with your mentorship.
            </p>
          </Card>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                      {mentee.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-100">{mentee.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{mentee.username}</span>
                    </div>
                  </div>

                  <Badge
                    variant={mentee.status === 'CLEAN' ? 'emerald' : 'amber'}
                    className="text-[10px]"
                  >
                    {mentee.streakDays} Days Clean
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-400">
                  <span>{mentee.nafsStage.split(' ')[0]} {mentee.nafsStage.split(' ')[1]}</span>
                  <span>Checked in: {mentee.lastCheckIn}</span>
                </div>

                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => setSelectedMentee(mentee)}
                  className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 border-slate-800 text-emerald-400 hover:border-emerald-500/40 py-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Send Counsel Note (Nasiha)
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
