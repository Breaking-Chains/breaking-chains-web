import React, { useState, useEffect } from 'react';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { usePmo } from '../context/PmoContext';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Users, Link as LinkIcon, Sparkles } from 'lucide-react';
import { getVerifiedMentors, getMyMentorProfile } from '../services/mentorService';
import { connectWithMentorCode, getUserPartnerships, getPartnershipMessages, sendPartnershipMessage, terminatePartnership, cancelPartnershipTermination } from '../services/partnerService';
import { formatApiErrorMessage } from '../services/apiClient';
import type { MentorProfile } from '../types/mentor';
import type { MentorshipChatMessage, AccountabilityPartnership } from '../types/partner';

interface GuidancePageProps {
  onOpenMenteesPage?: () => void;
}

export const GuidancePage: React.FC<GuidancePageProps> = ({ onOpenMenteesPage }) => {
  const { user, isDemoSession } = useAuth();
  const { counselNotes } = usePmo();
  const role = user?.role || 'USER';
  const notesList = Array.isArray(counselNotes) ? counselNotes : [];
  const [verifiedMentors, setVerifiedMentors] = useState<MentorProfile[]>([]);
  const [myProfile, setMyProfile] = useState<MentorProfile | null>(null);
  const [isBecomeMentorOpen, setIsBecomeMentorOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [connectSuccessMsg, setConnectSuccessMsg] = useState<string | null>(null);
  const [connectErrorMsg, setConnectErrorMsg] = useState<string | null>(null);

  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([]);
  const [connectingMentorId, setConnectingMentorId] = useState<string | null>(null);
  const [userPartnerships, setUserPartnerships] = useState<AccountabilityPartnership[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNasihaOpen, setIsNasihaOpen] = useState(false);

  // Exit survey & termination states
  const [isExitSurveyOpen, setIsExitSurveyOpen] = useState(false);
  const [exitReason, setExitReason] = useState('STYLE_MISMATCH');
  const [exitRating, setExitRating] = useState(5);
  const [exitNotes, setExitNotes] = useState('');
  const [isSubmittingExit, setIsSubmittingExit] = useState(false);

  // Cancellation feedback states
  const [isCancelSurveyOpen, setIsCancelSurveyOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('NEED_ACCOUNTABILITY');
  const [cancelRating, setCancelRating] = useState(5);
  const [cancelNotes, setCancelNotes] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const loadMentors = async () => {
    setIsLoadingMentors(true);
    setErrorMsg(null);
    try {
      const [mentors, profile, partnerships] = await Promise.all([
        getVerifiedMentors(),
        getMyMentorProfile().catch(() => null),
        isDemoSession ? Promise.resolve([]) : getUserPartnerships().catch(() => []),
      ]);
      setVerifiedMentors(Array.isArray(mentors) ? mentors : []);
      setMyProfile(profile);
      
      if (isDemoSession) {
        setUserPartnerships([
          {
            id: 'p-1',
            chainId: 'c0000000-0000-0000-0000-000000000001',
            userId: 'demo-user-1',
            partnerUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            partnerFullName: 'Sheikh Ahmad Al-Taji',
            partnerUsername: 'sheikh_ahmad',
            role: 'MENTOR',
            status: 'ACCEPTED',
            createdAt: new Date().toISOString(),
          }
        ]);
      } else {
        setUserPartnerships(partnerships);
      }
    } catch (err: unknown) {
      setVerifiedMentors([]);
      setUserPartnerships([]);
      setErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsLoadingMentors(false);
    }
  };

  const activeMentorship = userPartnerships.find(
    (p) => (p.role === 'MENTOR' || p.role === 'SPIRITUAL_MENTOR') && p.status === 'ACCEPTED'
  );

  useEffect(() => {
    loadMentors();
  }, [isDemoSession]);

  useEffect(() => {
    if (isDemoSession) {
      setChatMessages([
        {
          id: 'msg-1',
          partnershipId: 'p-1',
          senderId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
          senderFullName: 'Sheikh Ahmad Al-Taji',
          senderUsername: 'sheikh_ahmad',
          messageContent: 'Assalamu alaikum! Remember to guard your gaze and keep up your daily Muhasabah check-ins.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } else if (activeMentorship) {
      const fetchMessages = async () => {
        try {
          const msgs = await getPartnershipMessages(activeMentorship.id);
          setChatMessages(msgs);
        } catch (err) {
          console.warn('Failed to load chat messages:', err);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    } else {
      setChatMessages([]);
    }
  }, [activeMentorship, isDemoSession]);

  const mentorList = Array.isArray(verifiedMentors) ? verifiedMentors : [];

  const handleOpenMentees = () => {
    if (onOpenMenteesPage) {
      onOpenMenteesPage();
    }
  };

  useEffect(() => {
    if (!isConnectModalOpen) {
      setInviteCodeInput('');
      setConnectSuccessMsg(null);
      setConnectErrorMsg(null);
    }
  }, [isConnectModalOpen]);

  const handleConnectMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    setConnectErrorMsg(null);
    try {
      if (isDemoSession) {
        setConnectSuccessMsg(`Successfully connected to mentor with code ${inviteCodeInput.trim()}!`);
        setInviteCodeInput('');
        setTimeout(() => {
          setConnectSuccessMsg(null);
          setIsConnectModalOpen(false);
        }, 2000);
      } else {
        await connectWithMentorCode(inviteCodeInput.trim());
        setConnectSuccessMsg(`Successfully connected! Partnership established.`);
        setInviteCodeInput('');
        loadMentors();
        setTimeout(() => {
          setConnectSuccessMsg(null);
          setIsConnectModalOpen(false);
        }, 2000);
      }
    } catch (err: unknown) {
      setConnectErrorMsg(formatApiErrorMessage(err));
    }
  };

  const handleDirectConnect = async (mentor: MentorProfile) => {
    const code = mentor.inviteCode || `MENTOR-${mentor.fullName.split(' ')[1]?.toUpperCase() || '123'}`;
    setConnectingMentorId(mentor.id);
    setConnectErrorMsg(null);
    setConnectSuccessMsg(null);
    try {
      if (isDemoSession) {
        setConnectSuccessMsg(`Successfully connected to ${mentor.fullName}!`);
        setTimeout(() => {
          setConnectSuccessMsg(null);
          setConnectingMentorId(null);
        }, 3000);
      } else {
        await connectWithMentorCode(code.trim());
        setConnectSuccessMsg(`Successfully connected to ${mentor.fullName}!`);
        loadMentors();
        setTimeout(() => {
          setConnectSuccessMsg(null);
          setConnectingMentorId(null);
        }, 3000);
      }
    } catch (err: unknown) {
      setConnectErrorMsg(formatApiErrorMessage(err));
      setConnectingMentorId(null);
    }
  };

  const handleConfirmDisconnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMentorship) return;
    setIsSubmittingExit(true);
    setConnectErrorMsg(null);
    setConnectSuccessMsg(null);
    try {
      if (isDemoSession) {
        setUserPartnerships((prev) =>
          prev.map((p) =>
            p.id === activeMentorship.id
              ? { ...p, status: 'PENDING_TERMINATION', terminationRequestedAt: new Date().toISOString() }
              : p
          )
        );
        setConnectSuccessMsg('Termination grace period initiated (Demo Mode)');
        setIsExitSurveyOpen(false);
      } else {
        await terminatePartnership(activeMentorship.id, exitReason, exitRating, exitNotes);
        setConnectSuccessMsg('Disconnection grace period initiated.');
        setIsExitSurveyOpen(false);
        await loadMentors();
      }
    } catch (err) {
      setConnectErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsSubmittingExit(false);
    }
  };

  const handleConfirmCancelDisconnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMentorship) return;
    setIsSubmittingCancel(true);
    setConnectErrorMsg(null);
    setConnectSuccessMsg(null);
    try {
      if (isDemoSession) {
        setUserPartnerships((prev) =>
          prev.map((p) =>
            p.id === activeMentorship.id
              ? { ...p, status: 'ACCEPTED', terminationRequestedAt: undefined }
              : p
          )
        );
        setConnectSuccessMsg('Termination cancelled (Demo Mode)');
        setIsCancelSurveyOpen(false);
      } else {
        await cancelPartnershipTermination(activeMentorship.id, cancelReason, cancelRating, cancelNotes);
        setConnectSuccessMsg('Guidance connection successfully restored.');
        setIsCancelSurveyOpen(false);
        await loadMentors();
      }
    } catch (err) {
      setConnectErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (isDemoSession) {
      const newMsg: MentorshipChatMessage = {
        id: `msg-${Date.now()}`,
        partnershipId: 'p-1',
        senderId: 'me',
        senderFullName: myProfile?.fullName || 'You',
        senderUsername: myProfile?.username || 'user',
        messageContent: text,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
    } else if (activeMentorship) {
      try {
        const sent = await sendPartnershipMessage(activeMentorship.id, text.trim());
        setChatMessages((prev) => [...prev, sent]);
      } catch (err) {
        console.warn('Failed to send message:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {connectErrorMsg && (
        <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-850 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {connectErrorMsg}
        </div>
      )}

      {connectSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-55/60 dark:bg-emerald-950/80 border border-emerald-250 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {connectSuccessMsg}
        </div>
      )}

      {/* SECTION 1: My Mentor */}
      {role === 'USER' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              My Mentor
            </h3>
          </div>          {activeMentorship ? (
            <div className="space-y-4">
              {/* Grace Period Pending Termination Alert Banner */}
              {activeMentorship.status === 'PENDING_TERMINATION' && (
                <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-850 dark:text-amber-300 font-medium space-y-3 shadow-xs animate-pulse">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⏳</span>
                      <div>
                        <p className="font-bold uppercase tracking-wider text-[10px] text-amber-700 dark:text-amber-400">Termination Pending</p>
                        <p className="text-[10px] text-slate-605 dark:text-slate-400 leading-tight">
                          Your connection with {activeMentorship.partnerFullName} is scheduled to end in {(() => {
                            const requestDate = new Date(activeMentorship.terminationRequestedAt || Date.now());
                            const diffTime = (requestDate.getTime() + 7 * 24 * 60 * 60 * 1000) - Date.now();
                            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                            return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
                          })()}. You remain connected and under mentor care until then.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => setIsCancelSurveyOpen(true)}
                      className="text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Cancel Disconnect
                    </Button>
                  </div>
                </div>
              )}

              {/* Connected Mentor Info Card */}
              <Card variant="glass" className="p-6 border-emerald-500/20 dark:border-emerald-500/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 text-base font-black uppercase shrink-0">
                      {(activeMentorship.partnerFullName || 'M')[0]}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          {activeMentorship.partnerFullName || 'Verified Mentor'}
                        </h4>
                        <span className="text-[8px] font-bold py-0.5 px-2 rounded-full bg-emerald-55 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-transparent uppercase tracking-wider">
                          {activeMentorship.status === 'PENDING_TERMINATION' ? 'Transition' : 'Active Guide'}
                        </span>
                      </div>
                      {(() => {
                        const details = verifiedMentors.find(m => m.userId === activeMentorship.partnerUserId);
                        return (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-extrabold uppercase tracking-wide">
                            {details?.specialization || 'Spiritual Counselor & Tazkiyah Guide'}
                          </p>
                        );
                      })()}
                      <p className="text-[10px] text-slate-500 dark:text-slate-455 max-w-md italic">
                        "Your recovery and spiritual journey is kept strictly confidential."
                      </p>
                    </div>
                  </div>

                  {/* Minimal Label Actions */}
                  <div className="flex items-center gap-3 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                    <button
                      onClick={() => setIsNasihaOpen(true)}
                      className="flex-1 md:flex-none text-center px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:text-emerald-650 dark:hover:text-emerald-400 bg-slate-100/50 dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-xl transition-all duration-200 border border-slate-200/50 dark:border-slate-850 cursor-pointer"
                    >
                      ✵ Nasiha
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex-1 md:flex-none text-center px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-750 rounded-xl shadow-md shadow-emerald-500/10 transition-all duration-200 cursor-pointer"
                    >
                      💬 Chat
                    </button>
                    {activeMentorship.status === 'ACCEPTED' && (
                      <button
                        onClick={() => setIsExitSurveyOpen(true)}
                        className="flex-1 md:flex-none text-center px-4 py-2 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 hover:text-rose-650 bg-rose-50/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all duration-200 border border-rose-200/50 dark:border-rose-850/50 cursor-pointer"
                      >
                        ✕ Disconnect
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Unconnected Mentor Card */
            <Card variant="glass" className="p-6 text-center space-y-3 border-slate-200 dark:border-slate-900 bg-slate-100/20 dark:bg-slate-950/20">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">No Active Mentor Connected</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Confidential one-on-one mentorship is available. Browse the Community Mentors directory below and connect using their code to begin.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* SECTION 2: Community Mentors Directory */}
      <Card variant="glass" className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Community Mentors
              </h3>
              <p className="text-[10px] text-slate-700 dark:text-slate-440 font-medium">Spiritual Guides & Recovery Coaches</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {role === 'USER' && (
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 cursor-pointer rounded-xl font-semibold"
              >
                <LinkIcon className="w-3.5 h-3.5" /> Connect via Code
              </Button>
            )}

            {role === 'MENTOR' && (
              <Button
                variant="emerald"
                size="sm"
                onClick={handleOpenMentees}
                className="flex items-center gap-1.5 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/5 dark:shadow-emerald-950/20"
              >
                <Users className="w-4 h-4" /> View My Mentees
              </Button>
            )}
          </div>
        </div>

        {isLoadingMentors ? (
          <div className="text-center py-4 text-xs text-slate-500">Loading verified mentors...</div>
        ) : mentorList.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 text-center space-y-2">
            <Users className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role === 'MENTOR'
                ? 'You are a verified mentor! No other mentors registered yet.'
                : 'No verified mentors listed yet.'}
            </p>
            {role === 'MENTOR' && (
              <Button
                variant="emerald"
                size="sm"
                onClick={handleOpenMentees}
              >
                View My Mentees Roster Page
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {mentorList.map((mentor) => {
              const isCurrentMentor = activeMentorship && (activeMentorship.partnerUserId === mentor.userId || activeMentorship.inviteCode === mentor.inviteCode);
              const hasAnyMentor = !!activeMentorship;
              
              return (
                <div
                  key={mentor.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 space-y-2 text-xs shadow-xs hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-slate-900 dark:text-slate-100 text-xs font-black">{mentor.fullName}</strong>
                      <span className="text-[8px] tracking-wider font-semibold py-0.5 px-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                        VERIFIED
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-700 dark:text-slate-450 font-mono font-bold">{mentor.yearsOfExperience} yrs exp</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-450 font-extrabold uppercase tracking-wide">{mentor.specialization}</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-440 font-medium leading-tight">{mentor.qualification} {mentor.organization ? `(${mentor.organization})` : ''}</p>
                  <p className="text-[11px] text-slate-800 dark:text-slate-300 italic font-serif leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-1.5 line-clamp-2">"{mentor.bio}"</p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">Code: {mentor.inviteCode || 'N/A'}</span>
                    {role === 'USER' && (
                      <Button
                        variant={isCurrentMentor ? "outline" : "emerald"}
                        size="sm"
                        disabled={connectingMentorId === mentor.id || (hasAnyMentor && !isCurrentMentor)}
                        onClick={() => handleDirectConnect(mentor)}
                        className="cursor-pointer font-bold text-[10px] rounded-lg px-2.5 py-1"
                      >
                        {connectingMentorId === mentor.id 
                          ? 'Connecting...' 
                          : isCurrentMentor 
                            ? 'Connected' 
                            : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <BecomeMentorModal
        isOpen={isBecomeMentorOpen}
        onClose={() => setIsBecomeMentorOpen(false)}
        onSuccess={loadMentors}
      />

      {/* Connect to Mentor Modal */}
      <Modal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} title="Connect with a Mentor">
        <form onSubmit={handleConnectMentor} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-350">
            Enter the unique <strong>Invite Code</strong> provided by your assigned spiritual mentor or recovery coach.
          </p>

          <Input
            label="Mentor Invite Code"
            placeholder="e.g. MENTOR-BC-7890"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
            required
          />

          {connectErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-850 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
              {connectErrorMsg}
            </div>
          )}

          {connectSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-55/60 dark:bg-emerald-950/80 border border-emerald-250 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {connectSuccessMsg}
            </div>
          )}

          <Button type="submit" variant="emerald" size="lg" className="w-full text-xs">
            Connect & Start Guidance
          </Button>
        </form>
      </Modal>

      {/* --- SLIDE-IN SIDEBAR: NASIHA FEED --- */}
      {activeMentorship && (
        <>
          <div 
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
              isNasihaOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsNasihaOpen(false)}
          />
          <div 
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800/80 flex flex-col transform transition-transform duration-300 ease-in-out ${
              isNasihaOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 dark:text-amber-455 text-sm font-bold select-none">✵</span>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Spiritual Counsel (Nasiha)
                </h3>
              </div>
              <button 
                onClick={() => setIsNasihaOpen(false)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {notesList.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-450 italic">
                  No Nasiha counsel notes posted yet by your mentor.
                </div>
              ) : (
                <div className="relative pl-5 border-l border-emerald-500/20 dark:border-emerald-500/10 space-y-6">
                  {notesList.map((note) => (
                    <div key={note.id} className="relative space-y-2">
                      <div className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                      
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                        <span>{activeMentorship.partnerFullName || 'Spiritual Mentor'}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-amber-55/10 dark:bg-amber-950/20 border border-amber-500/15 dark:border-amber-500/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif shadow-xs">
                        "{note.counselText}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- SLIDE-IN SIDEBAR: MENTORSHIP CHAT --- */}
      {activeMentorship && (
        <>
          <div 
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
              isChatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsChatOpen(false)}
          />
          <div 
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800/80 flex flex-col transform transition-transform duration-300 ease-in-out ${
              isChatOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-450 text-sm font-bold select-none">✵</span>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Mentor Chat
                </h3>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-55/10 dark:bg-slate-950/20">
              <MentorshipChat
                partnerName={activeMentorship.partnerFullName || 'Spiritual Mentor'}
                inviteCode={activeMentorship.inviteCode}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </>
      )}

      {/* Exit Survey (Disconnection Request) Modal */}
      <Modal 
        isOpen={isExitSurveyOpen} 
        onClose={() => setIsExitSurveyOpen(false)} 
        title="Request Disconnection from Guide"
      >
        <form onSubmit={handleConfirmDisconnect} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
            Please share why you are ending this guidance connection. Your partnership will enter a <strong>7-day transition period</strong> before final termination.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Reason for ending connection</label>
            <select
              value={exitReason}
              onChange={(e) => setExitReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="INACTIVITY">Inactivity (Mentor hasn't responded)</option>
              <option value="STYLE_MISMATCH">Style Mismatch (Different counseling approaches)</option>
              <option value="RELAPSE_SHAME">Relapse Shame (Distressed by a slip-up)</option>
              <option value="RECOVERED">Successfully Recovered (Ready to go solo)</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">How would you rate their guidance? (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setExitRating(star)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                    exitRating >= star
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Exit Note for your Guide (Optional)</label>
            <textarea
              placeholder="Leave a message or closing reflection..."
              value={exitNotes}
              onChange={(e) => setExitNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20 resize-none"
            />
          </div>

          {connectErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-850 text-rose-800 dark:text-rose-300 text-xs text-center animate-fade-in">
              {connectErrorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExitSurveyOpen(false)}
              className="flex-1 text-xs py-2.5 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={isSubmittingExit}
              className="flex-1 text-xs py-2.5 bg-rose-600 hover:bg-rose-750 text-white rounded-xl cursor-pointer"
            >
              {isSubmittingExit ? 'Submitting...' : 'Confirm Disconnect'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancellation Feedback Survey Modal */}
      <Modal 
        isOpen={isCancelSurveyOpen} 
        onClose={() => setIsCancelSurveyOpen(false)} 
        title="We're glad you're staying!"
      >
        <form onSubmit={handleConfirmCancelDisconnect} className="space-y-4">
          <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed">
            Please let us know what helped change your mind about ending this connection.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">What made you decide to stay?</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="MENTOR_OUTREACH">My mentor reached out to support me</option>
              <option value="URGE_PASSED">The intense urge/distress passed and I feel calmer</option>
              <option value="NEED_ACCOUNTABILITY">I realized I need accountability to remain clean</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">How helpful was the 7-day grace period? (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setCancelRating(star)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                    cancelRating >= star
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Optional Reflection / Notes</label>
            <textarea
              placeholder="Reflect on why you chose to commit further..."
              value={cancelNotes}
              onChange={(e) => setCancelNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20 resize-none"
            />
          </div>

          {connectErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-850 text-rose-800 dark:text-rose-300 text-xs text-center animate-fade-in">
              {connectErrorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelSurveyOpen(false)}
              className="flex-1 text-xs py-2.5 rounded-xl cursor-pointer"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="emerald"
              disabled={isSubmittingCancel}
              className="flex-1 text-xs py-2.5 bg-emerald-650 hover:bg-emerald-750 text-white rounded-xl cursor-pointer"
            >
              {isSubmittingCancel ? 'Saving...' : 'Keep Connection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
