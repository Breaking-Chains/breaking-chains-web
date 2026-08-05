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
import { connectWithMentorCode, getUserPartnerships, getPartnershipMessages, sendPartnershipMessage } from '../services/partnerService';
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
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [isNasihaExpanded, setIsNasihaExpanded] = useState(true);

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
          </div>

          {activeMentorship ? (
            <div className="space-y-4">
              {/* Connected Mentor Info Card */}
              <Card variant="glass" className="p-5 space-y-4 border-emerald-500/20 dark:border-emerald-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-black uppercase">
                      {(activeMentorship.partnerFullName || 'M')[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {activeMentorship.partnerFullName || 'Verified Mentor'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 font-medium">Your Active Spiritual Guide</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant={isChatExpanded ? 'emerald' : 'outline'}
                      size="sm"
                      onClick={() => setIsChatExpanded(!isChatExpanded)}
                      className="text-[10px] font-bold rounded-xl flex items-center gap-1"
                    >
                      💬 Chat with Mentor
                    </Button>
                    <Button
                      variant={isNasihaExpanded ? 'emerald' : 'outline'}
                      size="sm"
                      onClick={() => setIsNasihaExpanded(!isNasihaExpanded)}
                      className="text-[10px] font-bold rounded-xl flex items-center gap-1"
                    >
                      ✵ View Nasiha
                    </Button>
                  </div>
                </div>

                {/* Additional profile details from list if match is found */}
                {(() => {
                  const details = verifiedMentors.find(m => m.userId === activeMentorship.partnerUserId);
                  if (!details) return null;
                  return (
                    <div className="text-xs space-y-2 pt-1 text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wide">
                        {details.specialization}
                      </p>
                      <p className="text-[10px] italic">
                        "{details.bio}"
                      </p>
                    </div>
                  );
                })()}
              </Card>

              {/* Toggleable Nasiha (Counsel Notes) Feed */}
              {isNasihaExpanded && notesList.length > 0 && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider px-1">
                    <span className="text-amber-500 dark:text-amber-450 select-none">✵</span> Counsel Feed (Nasiha)
                  </div>
                  {notesList.map((note) => (
                    <Card key={note.id} variant="gold" className="p-4 space-y-2 border-amber-500/40 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="text-[10px] font-bold text-amber-955 dark:text-amber-250 uppercase tracking-wider">
                            Nasiha Guidance
                          </span>
                        </div>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 dark:text-amber-100/95 leading-relaxed italic font-serif pl-5 border-l-2 border-amber-450/40">
                        "{note.counselText}"
                      </p>
                    </Card>
                  ))}
                </div>
              )}

              {/* Toggleable Mentorship Chat Box */}
              {isChatExpanded && (
                <div className="animate-fade-in">
                  <MentorshipChat
                    partnerName={activeMentorship.partnerFullName || 'Spiritual Mentor'}
                    inviteCode={activeMentorship.inviteCode}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              )}
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
    </div>
  );
};
