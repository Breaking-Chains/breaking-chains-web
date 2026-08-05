import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { RecoveryAnalytics } from '../components/pmo/RecoveryAnalytics';
import { getMentees, getCounselNotes, sendCounselNote, getPartnershipMessages, sendPartnershipMessage } from '../services/partnerService';
import type { MentorshipChatMessage } from '../types/partner';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { formatApiErrorMessage } from '../services/apiClient';
import { 
  Users, 
  Flame, 
  HeartHandshake, 
  Check, 
  X, 
  ChevronRight, 
  TrendingUp, 
  Send
} from 'lucide-react';

interface MenteeRequest {
  id: string;
  name: string;
  username: string;
  date: string;
  code: string;
}

export const MentorDashboardPage: React.FC = () => {
  const { user, isDemoSession } = useAuth();
  const [requests, setRequests] = useState<MenteeRequest[]>([]);
  const [activeMentees, setActiveMentees] = useState<any[]>([]);

  // Drawer States
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [counselNotes, setCounselNotes] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'analytics' | 'chat'>('analytics');
  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([]);
  const [activeRosterTab, setActiveRosterTab] = useState<'mentees' | 'requests'>('mentees');

  useEffect(() => {
    if (isDemoSession) {
      setRequests([
        { id: 'req-1', name: 'Zayd Malik', username: 'zayd_m', date: 'Today', code: 'MENTOR-BC-7890' },
        { id: 'req-2', name: 'Omar Farooq', username: 'omar_f', date: 'Yesterday', code: 'MENTOR-BC-7890' },
      ]);
      setActiveMentees([
        { id: 'm-1', chainId: 'c-1', name: 'Zayd Malik', username: 'zayd_m', streak: 12, ratio: 95, lastStatus: 'CLEAN', lastCheckIn: '3 hrs ago' },
        { id: 'm-2', chainId: 'c-2', name: 'Bilal Khan', username: 'bilal_k', streak: 0, ratio: 80, lastStatus: 'SLIP_UP', lastCheckIn: '5 hrs ago' },
        { id: 'm-3', chainId: 'c-3', name: 'Tariq Ali', username: 'tariq_a', streak: 27, ratio: 100, lastStatus: 'CLEAN', lastCheckIn: '1 day ago' },
      ]);
    } else {
      const loadRealMentees = async () => {
        try {
          const chains = await getMentees().catch(() => []);
          const mapped = chains.map((c) => ({
            id: c.id, // Chain ID used to query logs and counsel notes
            partnershipId: c.partnershipId,
            name: `Recoveree #${c.userId.substring(0, 6)}`,
            username: `user_${c.userId.substring(0, 6)}`,
            streak: c.currentStreak,
            longestStreak: c.longestStreak,
            ratio: c.cleanRatioPercent,
            resilienceScore: c.resilienceScore,
            lastStatus: c.currentStreak > 0 ? 'CLEAN' : 'SLIP_UP',
            lastCheckIn: c.lastCheckInDate ? new Date(c.lastCheckInDate).toLocaleDateString() : 'No check-in yet',
          }));
          setActiveMentees(mapped);
        } catch {
          // Ignore
        }
      };
      loadRealMentees();
    }
  }, [isDemoSession]);

  // Load detailed mentee metrics when drawer opens
  useEffect(() => {
    if (selectedMentee) {
      const loadDetails = async () => {
        setIsLoadingDetails(true);
        setDrawerError(null);
        try {
          if (isDemoSession) {
            // Mock counsel notes
            setCounselNotes([
              { id: 'n-1', mentorFullName: 'Shaykh Ahmad', counselText: 'Keep up with evening Adhkar. Try going to sleep immediately after Isha.', createdAt: new Date(Date.now() - 172800000).toISOString() },
            ]);
          } else {
            const notes = await getCounselNotes(selectedMentee.id);
            setCounselNotes(notes);
          }
        } catch (err: unknown) {
          setDrawerError(formatApiErrorMessage(err));
        } finally {
          setIsLoadingDetails(false);
        }
      };
      loadDetails();
    }
  }, [selectedMentee, isDemoSession]);

  // Reset drawer tab when a new mentee is opened
  useEffect(() => {
    if (selectedMentee) {
      setDrawerTab('analytics');
    }
  }, [selectedMentee]);

  // Load chat messages and poll in background when on chat tab
  useEffect(() => {
    if (!selectedMentee || drawerTab !== 'chat') {
      setChatMessages([]);
      return;
    }

    if (isDemoSession) {
      setChatMessages([
        {
          id: 'msg-mock-1',
          partnershipId: 'p-1',
          senderId: selectedMentee.id,
          senderFullName: selectedMentee.name,
          senderUsername: selectedMentee.username,
          messageContent: 'Assalamu alaikum Sheikh, I had some strong urges today but wudu helped.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        }
      ]);
      return;
    }

    if (!selectedMentee.partnershipId) return;

    const fetchChat = async () => {
      try {
        const msgs = await getPartnershipMessages(selectedMentee.partnershipId);
        setChatMessages(msgs);
      } catch (err) {
        console.warn('Failed to load mentee chat messages:', err);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [selectedMentee, drawerTab, isDemoSession]);

  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || !selectedMentee) return;

    if (isDemoSession) {
      const newMsg: MentorshipChatMessage = {
        id: `msg-${Date.now()}`,
        partnershipId: 'p-1',
        senderId: 'me',
        senderFullName: user?.fullName || 'Sheikh Ahmad',
        senderUsername: user?.username || 'sheikh_ahmad',
        messageContent: text,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
    } else if (selectedMentee.partnershipId) {
      try {
        const sent = await sendPartnershipMessage(selectedMentee.partnershipId, text.trim());
        setChatMessages((prev) => [...prev, sent]);
      } catch (err) {
        console.warn('Failed to send chat message to mentee:', err);
      }
    }
  };

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

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedMentee) return;
    setIsSubmittingNote(true);
    setDrawerError(null);
    try {
      if (isDemoSession) {
        const addedNote = {
          id: `n-${Date.now()}`,
          mentorFullName: 'Shaykh Ahmad',
          counselText: newNoteText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCounselNotes((prev) => [addedNote, ...prev]);
        setNewNoteText('');
      } else {
        const addedNote = await sendCounselNote(selectedMentee.id, newNoteText.trim());
        setCounselNotes((prev) => [addedNote, ...prev]);
        setNewNoteText('');
      }
    } catch (err: unknown) {
      setDrawerError(formatApiErrorMessage(err));
    } finally {
      setIsSubmittingNote(false);
    }
  };


  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Segmented Tab Bar Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-150/30 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-850/50 max-w-xs sm:max-w-sm shrink-0">
        <button
          onClick={() => setActiveRosterTab('mentees')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeRosterTab === 'mentees'
              ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-200/40 dark:border-slate-850/50'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          👥 Mentees ({activeMentees.length})
        </button>
        <button
          onClick={() => setActiveRosterTab('requests')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            activeRosterTab === 'requests'
              ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-200/40 dark:border-slate-850/50'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <span>📩 Requests ({requests.length})</span>
          {requests.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
          )}
        </button>
      </div>

      {activeRosterTab === 'mentees' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-205 uppercase tracking-wider">
              Connected Mentees Active Roster
            </h3>
          </div>

          {activeMentees.length === 0 ? (
            <Card variant="glass" className="p-8 text-center space-y-3 border-slate-200 dark:border-slate-900 bg-slate-100/20 dark:bg-slate-950/20">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">No Mentees Connected Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Provide your advisor invite code to recoverees so they can connect with your mentorship roster.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeMentees.map((mentee) => (
                <Card 
                  key={mentee.id} 
                  variant="dark" 
                  className="p-4 space-y-3 border-slate-150 dark:border-slate-800 shadow-xs hover:border-emerald-500/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedMentee(mentee)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-105 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-800 dark:text-slate-200 font-black text-xs">
                        {mentee.name.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-slate-905 dark:text-slate-100 text-xs font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          {mentee.name}
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                        </strong>
                        <span className="text-[10px] text-slate-700 dark:text-slate-400 block font-mono">@{mentee.username}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 font-mono font-medium">Last active: {mentee.lastCheckIn}</span>
                      {mentee.lastStatus === 'SLIP_UP' ? (
                        <Badge variant="rose" className="font-extrabold animate-pulse">🔴 RELAPSE ALERT</Badge>
                      ) : mentee.lastStatus === 'PEEKED_EDGED' ? (
                        <Badge variant="amber" className="font-extrabold">⚠️ URGE WARNING</Badge>
                      ) : (
                        <Badge variant="emerald">🟢 STABLE</Badge>
                      )}
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
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                        {mentee.ratio}% Purity
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="text-amber-500 dark:text-amber-450 text-sm font-bold select-none">✵</span>
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-205 uppercase tracking-wider">
              Pending Connection Requests
            </h3>
          </div>

          {requests.length === 0 ? (
            <Card variant="glass" className="p-8 text-center space-y-2 border-slate-200 dark:border-slate-900 bg-slate-100/20 dark:bg-slate-950/20">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">No pending connection requests.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-455 cursor-pointer"
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
      )}

      {/* Sliding Mentee Details Drawer */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => setSelectedMentee(null)}
            ></div>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-900 flex flex-col h-full animate-slide-in">
                {/* Header */}
                <div className="p-5 border-b border-slate-150 dark:border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs shrink-0">
                      {selectedMentee.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{selectedMentee.name}</h3>
                      <p className="text-[10px] text-slate-700 dark:text-slate-400 font-mono">@{selectedMentee.username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedMentee(null)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Tabs */}
                <div className="flex border-b border-slate-150 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 p-1.5 gap-1 shrink-0">
                  <button
                    onClick={() => setDrawerTab('analytics')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      drawerTab === 'analytics'
                        ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-100 dark:border-slate-800'
                        : 'text-slate-600 hover:text-slate-805 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    📈 Analytics & Nasiha
                  </button>
                  <button
                    onClick={() => setDrawerTab('chat')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      drawerTab === 'chat'
                        ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-100 dark:border-slate-800'
                        : 'text-slate-600 hover:text-slate-805 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    💬 Live Chat
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-5 space-y-6">
                  {drawerError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold text-center">
                      {drawerError}
                    </div>
                  )}

                  {isLoadingDetails ? (
                    <div className="py-20 text-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-[10px] text-slate-400 font-mono">Loading complete analytics...</p>
                    </div>
                  ) : drawerTab === 'chat' ? (
                    <MentorshipChat
                      partnerName={selectedMentee.name}
                      messages={chatMessages}
                      onSendMessage={handleSendChatMessage}
                      currentUserId={isDemoSession ? 'me' : user?.id}
                    />
                  ) : (
                    <>
                      <RecoveryAnalytics chainId={selectedMentee.id} isDemo={isDemoSession} />

                      {/* Section: Counsel Notes (Nasiha) */}
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                        <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-250 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Log Spiritual Counsel (Nasiha)
                        </h4>

                        <form onSubmit={handlePostNote} className="space-y-2">
                          <textarea
                            placeholder="Write official advisor counsel, instructions, or Quranic references..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            rows={3}
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-850 text-[11px] focus:outline-none placeholder:text-slate-500 text-slate-900 dark:text-slate-100 shadow-xs"
                            required
                          />
                          <Button 
                            type="submit" 
                            variant="emerald" 
                            size="sm" 
                            isLoading={isSubmittingNote}
                            className="w-full text-xs font-bold py-2 flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Publish Nasiha
                          </Button>
                        </form>

                        {/* Counsel Timeline */}
                        <div className="space-y-3">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-500 block">Past counsel logs</span>
                          {counselNotes.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic text-center py-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl">No counsel notes recorded yet.</p>
                          ) : (
                            <div className="space-y-3 border-l border-slate-100 dark:border-slate-900 pl-3 ml-2.5">
                              {counselNotes.map((note) => (
                                <div key={note.id} className="relative space-y-1">
                                  <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-950"></div>
                                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-600 dark:text-slate-500">
                                    <span>{note.mentorFullName || 'Advisor'}</span>
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-[10px] leading-relaxed text-slate-800 dark:text-slate-200 italic bg-slate-50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                                    "{note.counselText || note.noteContent}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
