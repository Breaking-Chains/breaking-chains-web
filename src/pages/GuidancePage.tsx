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

  const [activeTab, setActiveTab] = useState<'my-mentor' | 'directory'>('my-mentor');

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
        setActiveTab('my-mentor');
      } else {
        setUserPartnerships(partnerships);
        const hasActive = partnerships.some(
          (p) => (p.role === 'MENTOR' || p.role === 'SPIRITUAL_MENTOR') && (p.status === 'ACCEPTED' || p.status === 'PENDING_TERMINATION')
        );
        setActiveTab(hasActive ? 'my-mentor' : 'directory');
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
    (p) => (p.role === 'MENTOR' || p.role === 'SPIRITUAL_MENTOR') && (p.status === 'ACCEPTED' || p.status === 'PENDING_TERMINATION')
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
        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {connectErrorMsg && (
        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {connectErrorMsg}
        </div>
      )}

      {connectSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {connectSuccessMsg}
        </div>
      )}

      {role === 'USER' && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/30 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-xs sm:max-w-sm">
          <button
            onClick={() => setActiveTab('my-mentor')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'my-mentor'
                ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/40 dark:border-slate-800/50'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            👤 My Mentor
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/40 dark:border-slate-800/50'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            🔍 Browse Directory
          </button>
        </div>
      )}

      {/* SECTION 1: My Mentor */}
      {role === 'USER' && activeTab === 'my-mentor' && (
        <div className="space-y-6 animate-fade-in">
          {activeMentorship ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Mentor Profile Card */}
              <div className="lg:col-span-1 space-y-6">
                <Card variant="glass" className="overflow-hidden border-slate-200/60 dark:border-slate-800/80 relative flex flex-col p-6 space-y-6 shadow-sm">
                  {/* Profile Card Header with Avatar & Online Dot */}
                  <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 text-4xl font-extrabold shadow-sm select-none">
                        {(activeMentorship.partnerFullName || 'M')[0]}
                      </div>
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 animate-pulse shadow-sm" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-manrope text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {activeMentorship.partnerFullName || 'Verified Mentor'}
                      </h4>
                      {(() => {
                        const details = verifiedMentors.find(m => m.userId === activeMentorship.partnerUserId);
                        return (
                          <div className="space-y-2">
                            <span className="inline-block text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                              {activeMentorship.status === 'PENDING_TERMINATION' ? 'Transitioning' : 'Active Guide'}
                            </span>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-black uppercase tracking-wide px-4">
                              {details?.specialization || 'Spiritual Counselor & Tazkiyah Guide'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Bio & Information List */}
                  {(() => {
                    const details = verifiedMentors.find(m => m.userId === activeMentorship.partnerUserId);
                    return (
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 text-xs">
                        {details?.organization && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Affiliation</span>
                            <span className="font-bold text-slate-700 dark:text-slate-350">{details.organization}</span>
                          </div>
                        )}
                        {details?.yearsOfExperience !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Experience</span>
                            <span className="font-bold text-slate-700 dark:text-slate-350">{details.yearsOfExperience} Years</span>
                          </div>
                        )}
                        <div className="bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850/50 text-[11px] text-slate-500 dark:text-slate-405 italic leading-relaxed text-center font-serif">
                          "Your recovery and spiritual journey is kept strictly confidential."
                        </div>
                      </div>
                    );
                  })()}

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                    >
                      💬 Chat
                    </button>
                    {activeMentorship.status === 'ACCEPTED' && (
                      <button
                        onClick={() => setIsExitSurveyOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-rose-750 dark:text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all border border-rose-200/60 dark:border-rose-800/80 cursor-pointer"
                      >
                        ✕ Leave
                      </button>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Columns (Span 2): Nasiha Advisory Feed & Guidance Journey */}
              <div className="lg:col-span-2 space-y-6">
                <Card variant="glass" className="p-6 md:p-8 border-slate-200/60 dark:border-slate-800/80 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <h3 className="font-manrope text-base font-extrabold text-primary tracking-tight">
                          Spiritual Counsel (Nasiha)
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Advices & reminders from your guide</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {notesList.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <span className="text-3xl block select-none">📖</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                          No Nasiha counsel notes posted yet by your mentor.
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-xs mx-auto">
                          Whenever your mentor shares targeted advisories, reflections, or homework assignments, they will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-emerald-500/20 dark:border-emerald-500/10 space-y-6 py-2">
                        {notesList.map((note) => (
                          <div key={note.id} className="relative space-y-2 group">
                            {/* Timeline Bullet node */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform duration-200 shadow-sm" />
                            
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                              <span className="text-slate-650 dark:text-slate-400">{activeMentorship.partnerFullName || 'Spiritual Mentor'}</span>
                              <span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            
                            <div className="p-5 rounded-2xl bg-amber-50/20 dark:bg-amber-950/10 border border-amber-500/15 dark:border-amber-500/5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif shadow-xs">
                              "{note.counselText}"
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            /* Unconnected Mentor Card */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Connect Side */}
              <Card variant="glass" className="p-6 md:p-8 border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg shadow-2xs select-none">
                    🔑
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-manrope text-base font-extrabold text-primary tracking-tight uppercase">Connect with a Mentor</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                      Enter the unique Invite Code provided by your assigned spiritual mentor or recovery coach to establish a connection.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleConnectMentor} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. MENTOR-BC-7890"
                      value={inviteCodeInput}
                      onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 shadow-2xs uppercase"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="emerald"
                    className="w-full text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer py-2.5 shadow-md shadow-emerald-500/10"
                  >
                    Establish Connection
                  </Button>
                </form>
              </Card>

              {/* Benefits/Why side */}
              <Card variant="glass" className="p-6 md:p-8 border-slate-200/60 dark:border-slate-800/80 space-y-6 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]">
                <h4 className="font-manrope text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  ✵ Why Spiritual Mentorship?
                </h4>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-base select-none shrink-0">🛡️</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">100% Confidentiality</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        All logs, reflections, and chats are encrypted and only accessible by your direct guide.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-base select-none shrink-0">✨</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Tazkiyah Counseling</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Combine neuroscience recovery with heart purification guidance to overcome underlying spiritual root causes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-base select-none shrink-0">🤝</span>
                    <div className="space-y-0.5">
                      <strong className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Active Accountability</strong>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Your mentor monitors check-ins and offers targeted, structured advisories during chaser effect peaks.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Community Mentors Directory */}
      {role === 'USER' && activeTab === 'directory' && (
        <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
              <div>
                <h3 className="font-manrope text-base font-extrabold text-primary tracking-tight">
                  Community Mentors Directory
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spiritual Guides & Recovery Coaches</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 cursor-pointer rounded-xl font-bold bg-amber-50/50 dark:bg-amber-950/20 px-3 py-1.5 border border-amber-500/10"
              >
                <LinkIcon className="w-3.5 h-3.5" /> Connect via Code
              </Button>
            </div>
          </div>

          {isLoadingMentors ? (
            <div className="text-center py-12 text-xs text-slate-500">Loading verified mentors...</div>
          ) : mentorList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 text-center space-y-3">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-400 italic">No verified mentors listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorList.map((mentor) => {
                const isCurrentMentor = activeMentorship && (activeMentorship.partnerUserId === mentor.userId || activeMentorship.inviteCode === mentor.inviteCode);
                const hasAnyMentor = !!activeMentorship;
                
                return (
                  <div
                    key={mentor.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 space-y-4 text-xs shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider">{mentor.fullName}</strong>
                          <span className="text-[8px] font-black py-0.5 px-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 uppercase tracking-widest animate-pulse">
                            VERIFIED
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{mentor.yearsOfExperience} Yrs Exp</span>
                      </div>
                      
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-black uppercase tracking-wide">
                        {mentor.specialization}
                      </p>
                      
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-normal">
                        {mentor.qualification} {mentor.organization ? `(${mentor.organization})` : ''}
                      </p>
                      
                      {mentor.bio && (
                        <p className="text-[11px] text-slate-650 dark:text-slate-350 italic font-serif leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-3">
                          "{mentor.bio}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-bold">Code: <span className="font-extrabold text-amber-700 dark:text-amber-400 uppercase">{mentor.inviteCode || 'N/A'}</span></span>
                      {role === 'USER' && (
                        <Button
                          variant={isCurrentMentor ? "outline" : "emerald"}
                          size="sm"
                          disabled={connectingMentorId === mentor.id || (hasAnyMentor && !isCurrentMentor)}
                          onClick={() => handleDirectConnect(mentor)}
                          className="cursor-pointer font-black text-[9px] uppercase tracking-wider rounded-lg px-3 py-1.5 shadow-2xs"
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
      )}

      {role === 'MENTOR' && (
        <div className="space-y-6 animate-fade-in">
          <Card variant="glass" className="p-6 md:p-8 border-slate-200/60 dark:border-slate-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-450 text-xl shadow-2xs select-none">
                  🛡️
                </div>
                <div>
                  <h3 className="font-manrope text-base font-extrabold text-primary tracking-tight uppercase">
                    Verified Advisor space
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Welcome to your counsel terminal, {user?.fullName || 'Mentor'}
                  </p>
                </div>
              </div>

              <Button
                variant="emerald"
                onClick={handleOpenMentees}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-md cursor-pointer self-start sm:self-auto px-4 py-2.5"
              >
                <Users className="w-4 h-4" /> Go to Mentee Roster
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Counsel Qualifications</h4>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Specialization</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-right">{myProfile?.specialization || 'Islamic Spiritual Counsel (Tazkiyah)'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Affiliation</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-right">{myProfile?.organization || 'Independent counselor'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Experience</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{myProfile?.yearsOfExperience || 0} Years</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Connection Sharing</h4>
                <div className="p-5 rounded-2xl bg-amber-50/20 dark:bg-amber-950/10 border border-amber-500/15 dark:border-amber-500/5 space-y-3 flex flex-col justify-between h-[115px]">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                    Share this unique invite code with your students/mentees so they can request active guidance under your care.
                  </p>
                  <code className="text-sm font-mono font-black text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-amber-500/20 block w-fit shadow-2xs uppercase tracking-wider select-all">
                    {myProfile?.inviteCode || 'MENTOR-BC-7890'}
                  </code>
                </div>
              </div>
            </div>

            {myProfile?.bio && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Advisor Biography</h4>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed font-serif pl-5 border-l-4 border-l-emerald-500 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl">
                  "{myProfile.bio}"
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

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
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
              {connectErrorMsg}
            </div>
          )}

          {connectSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {connectSuccessMsg}
            </div>
          )}

          <Button type="submit" variant="emerald" size="lg" className="w-full text-xs">
            Connect & Start Guidance
          </Button>
        </form>
      </Modal>



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
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs text-center animate-fade-in">
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
              className="flex-1 text-xs py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
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
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs text-center animate-fade-in">
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
              className="flex-1 text-xs py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
            >
              {isSubmittingCancel ? 'Saving...' : 'Keep Connection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
