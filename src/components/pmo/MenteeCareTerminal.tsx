import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flame, HeartHandshake, Send, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { RecoveryAnalytics } from './RecoveryAnalytics';
import { MentorshipChat } from './MentorshipChat';
import { getCounselNotes, sendCounselNote, getPartnershipMessages, sendPartnershipMessage } from '../../services/partnerService';
import type { MentorshipChatMessage } from '../../types/partner';
import { formatApiErrorMessage } from '../../services/apiClient';

interface MenteeCareTerminalProps {
  mentee: {
    id: string;
    partnershipId?: string;
    name: string;
    username: string;
    streak: number;
    ratio: number;
    lastStatus: string;
    lastCheckIn: string;
  };
  onBack: () => void;
  isDemo?: boolean;
}

export const MenteeCareTerminal: React.FC<MenteeCareTerminalProps> = ({
  mentee,
  onBack,
  isDemo = false,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'chat' | 'nasiha'>('analytics');
  const [counselNotes, setCounselNotes] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load counsel notes
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      setErrorMsg(null);
      try {
        if (isDemo) {
          setCounselNotes([
            { id: 'n-1', mentorFullName: 'Shaykh Ahmad', counselText: 'Keep up with evening Adhkar. Try going to sleep immediately after Isha.', createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 'n-2', mentorFullName: 'Shaykh Ahmad', counselText: 'Resisting the first 5 minutes of an urge is 90% of the battle. Keep striving!', createdAt: new Date(Date.now() - 518400000).toISOString() },
          ]);
        } else {
          const notes = await getCounselNotes(mentee.id);
          setCounselNotes(notes);
        }
      } catch (err) {
        setErrorMsg(formatApiErrorMessage(err));
      } finally {
        setIsLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [mentee.id, isDemo]);

  // Chat message loading & polling
  useEffect(() => {
    if (activeTab !== 'chat') {
      setChatMessages([]);
      return;
    }

    if (isDemo) {
      setChatMessages([
        {
          id: 'msg-1',
          partnershipId: 'p-1',
          senderId: 'alex-1',
          senderFullName: mentee.name,
          senderUsername: mentee.username,
          messageContent: 'Assalamu Alaikum Sheikh, the cravings are extremely intense tonight. I am feeling restless.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'msg-2',
          partnershipId: 'p-1',
          senderId: 'me',
          senderFullName: user?.fullName || 'Sheikh Ahmad',
          senderUsername: user?.username || 'sheikh_ahmad',
          messageContent: 'Wa Alaikum Assalam, my dear son. Stand up immediately. Go splash cold water on your face, perform fresh wudu, and recite the 3 Quls. The physical urge will pass in a few minutes. Guard your gaze.',
          isRead: true,
          createdAt: new Date(Date.now() - 3300000).toISOString(),
        }
      ]);
    } else if (mentee.partnershipId) {
      const fetchMessages = async () => {
        try {
          const msgs = await getPartnershipMessages(mentee.partnershipId!);
          setChatMessages(msgs);
        } catch (err) {
          console.warn('Failed to load chat messages in Care Terminal:', err);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, mentee.partnershipId, isDemo, user?.fullName, user?.username, mentee.name, mentee.username]);

  // Send message handler
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    if (isDemo) {
      const newMsg: MentorshipChatMessage = {
        id: `msg-${Date.now()}`,
        partnershipId: 'p-1',
        senderId: 'me',
        senderFullName: user?.fullName || 'Sheikh Ahmad',
        senderUsername: user?.username || 'sheikh_ahmad',
        messageContent: text.trim(),
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
    } else if (mentee.partnershipId) {
      try {
        const sent = await sendPartnershipMessage(mentee.partnershipId, text.trim());
        setChatMessages((prev) => [...prev, sent]);
      } catch (err) {
        console.warn('Failed to send chat message to mentee:', err);
      }
    }
  };

  // Submit Nasiha counsel note handler
  const handlePostNasihaNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (isDemo) {
        const addedNote = {
          id: `n-${Date.now()}`,
          mentorFullName: user?.fullName || 'Shaykh Ahmad',
          counselText: newNoteText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCounselNotes((prev) => [addedNote, ...prev]);
        setNewNoteText('');
        setSuccessMsg('Spiritual Counsel Note (Nasiha) posted successfully!');
      } else {
        const addedNote = await sendCounselNote(mentee.id, newNoteText.trim());
        setCounselNotes((prev) => [addedNote, ...prev]);
        setNewNoteText('');
        setSuccessMsg('Spiritual Counsel Note (Nasiha) posted successfully!');
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar navigation & Mentee badge details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-205 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-700 dark:text-slate-305 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Roster
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250/20 flex items-center justify-center text-emerald-600 dark:text-emerald-450 font-black text-sm uppercase shrink-0">
              {mentee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {mentee.name}
                </h2>
                <Badge variant={mentee.lastStatus === 'SLIP_UP' ? 'rose' : 'emerald'} className="text-[8px] font-black uppercase tracking-wider">
                  {mentee.lastStatus === 'SLIP_UP' ? 'Vulnerable' : 'Stable'}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 font-mono leading-none">@{mentee.username}</p>
            </div>
          </div>
        </div>

        {/* Overview metric pills */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-850">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-505 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {mentee.streak} Days Clean
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-850">
            <HeartHandshake className="w-4 h-4 text-emerald-555 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-850 dark:text-slate-205">
              {mentee.ratio}% Purity
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Bar Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-850/80 max-w-md shrink-0">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-200/40 dark:border-slate-805/50'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          📊 Analytics Workspace
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-200/40 dark:border-slate-805/50'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          💬 Chat Terminal
        </button>
        <button
          onClick={() => setActiveTab('nasiha')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'nasiha'
              ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-405 shadow-xs border border-slate-200/40 dark:border-slate-805/50'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          ✍️ Spiritual Nasiha ({counselNotes.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold text-center shadow-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold text-center shadow-xs">
            🎉 {successMsg}
          </div>
        )}

        {/* Tab 1: Detailed date-filtered Analytics */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-slate-950/25 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-5">
            <RecoveryAnalytics chainId={mentee.id} isDemo={isDemo} />
          </div>
        )}

        {/* Tab 2: Live Chat Terminal */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-950/20 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm">
            <MentorshipChat
              partnerName={mentee.name}
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              currentUserId={isDemo ? 'me' : user?.id}
            />
          </div>
        )}

        {/* Tab 3: Nasiha & Advisories editor and feed history */}
        {activeTab === 'nasiha' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Editor composer (Col Span 1) */}
            <div className="lg:col-span-1">
              <Card variant="gold" className="p-5 border-amber-500/35 shadow-xs space-y-4">
                <div className="flex items-center gap-1.5 text-amber-955 dark:text-amber-250 font-black text-xs uppercase tracking-wider border-b border-amber-500/20 pb-3">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Send Nasiha (Advice)</span>
                </div>

                <form onSubmit={handlePostNasihaNote} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-amber-900/90 dark:text-amber-300 font-bold uppercase tracking-wider block">
                      Counsel Message Content:
                    </label>
                    <textarea
                      placeholder="Write Quranic references, reflection prompts, or strict accountability instructions for recovery..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      rows={5}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-amber-450/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 resize-none shadow-xs"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="emerald"
                    isLoading={isSubmittingNote}
                    className="w-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 py-2"
                  >
                    <Send className="w-4 h-4" /> Post Counsel Note
                  </Button>
                </form>
              </Card>
            </div>

            {/* Counsel Notes Timeline (Col Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[9px] text-slate-705 dark:text-slate-450 block uppercase font-black tracking-wider">
                Nasiha Advisory History feed ({counselNotes.length})
              </span>

              {isLoadingNotes ? (
                <div className="text-center py-8 text-xs text-slate-500">Loading Nasiha notes...</div>
              ) : counselNotes.length === 0 ? (
                <div className="p-6 rounded-3xl border border-slate-205 dark:border-slate-850/80 bg-slate-50/20 text-center text-xs text-slate-505 dark:text-slate-400 italic">
                  No spiritual counsel notes posted yet.
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {counselNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 shadow-2xs space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            Counsel from {note.mentorFullName}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="leading-relaxed font-serif text-[11px] text-slate-900 dark:text-slate-100 whitespace-pre-line p-1">
                        {note.counselText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
