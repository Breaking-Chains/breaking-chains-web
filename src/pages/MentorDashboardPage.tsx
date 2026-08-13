import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { RecoveryAnalytics } from '../components/pmo/RecoveryAnalytics';
import { getMentees, getCounselNotes, sendCounselNote, getPartnershipMessages, sendPartnershipMessage } from '../services/partnerService';
import { 
  Users, 
  Check, 
  X, 
  Search, 
  CalendarDays, 
  CheckCircle2, 
  ClipboardList,
  Flame,
  Trophy,
  Compass,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../utils/cn';
import mentorContent from '../data/mentorContent.json';
import type { MentorshipChatMessage } from '../types/partner';

interface MenteeRequest {
  id: string;
  name: string;
  username: string;
  date: string;
  code: string;
}

interface MockMeeting {
  id: string;
  name: string;
  username: string;
  initials: string;
  time: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'RESCHEDULED';
}

export const MentorDashboardPage: React.FC = () => {
  const { isDemoSession } = useAuth();
  
  // Navigation View State
  const [view, setView] = useState<'dashboard' | 'workspace'>('dashboard');
  const [workspaceTab, setWorkspaceTab] = useState<'nasiha' | 'chat'>('nasiha');

  // Roster & Requests State
  const [requests, setRequests] = useState<MenteeRequest[]>([]);
  const [activeMentees, setActiveMentees] = useState<any[]>([]);
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Meeting Requests Mock State
  const [meetingRequests, setMeetingRequests] = useState<MockMeeting[]>([
    { 
      id: 'meet-1', 
      name: 'Michael Ross', 
      username: 'michael_r', 
      initials: 'MR', 
      time: 'Tomorrow, 3:00 PM - 3:30 PM', 
      message: 'Feeling a bit overwhelmed, need to talk.', 
      status: 'PENDING' 
    }
  ]);

  // Nasiha & Chat States
  const [counselNotes, setCounselNotes] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  
  // Feedback States
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // TanStack React Query for async roster sync
  const { data: realMenteesData } = useQuery({
    queryKey: ['mentees'],
    queryFn: getMentees,
    enabled: !isDemoSession,
  });

  // TanStack React Query for selected mentee's Nasiha notes
  const { data: realNotesData, refetch: refetchRealNotes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['counselNotes', selectedMentee?.id],
    queryFn: () => getCounselNotes(selectedMentee?.id || ''),
    enabled: !!selectedMentee && !isDemoSession && view === 'workspace',
  });

  // TanStack React Query for selected mentee's messages
  const { data: realMessagesData } = useQuery({
    queryKey: ['messages', selectedMentee?.partnershipId],
    queryFn: () => getPartnershipMessages(selectedMentee?.partnershipId || ''),
    enabled: !!selectedMentee && !isDemoSession && !!selectedMentee.partnershipId && view === 'workspace',
    refetchInterval: 5000,
  });

  // Sync roster and mock requests
  useEffect(() => {
    if (isDemoSession) {
      setRequests([
        { id: 'req-1', name: 'Zayd Malik', username: 'zayd_m', date: 'Today', code: 'MENTOR-BC-7890' },
        { id: 'req-2', name: 'Omar Farooq', username: 'omar_f', date: 'Yesterday', code: 'MENTOR-BC-7890' },
      ]);
      const demoMentees = [
        { id: 'm-1', chainId: 'c-1', partnershipId: 'p-1', name: 'Zayd Malik', username: 'zayd_m', streak: 12, longestStreak: 25, ratio: 95, resilienceScore: 92, lastStatus: 'CLEAN', lastCheckIn: '2 hrs ago' },
        { id: 'm-2', chainId: 'c-2', partnershipId: 'p-2', name: 'Bilal Khan', username: 'bilal_k', streak: 0, longestStreak: 14, ratio: 80, resilienceScore: 78, lastStatus: 'SLIP_UP', lastCheckIn: '5 hrs ago' },
        { id: 'm-3', chainId: 'c-3', partnershipId: 'p-3', name: 'Tariq Ali', username: 'tariq_a', streak: 42, longestStreak: 42, ratio: 100, resilienceScore: 98, lastStatus: 'CLEAN', lastCheckIn: '1 day ago' },
      ];
      setActiveMentees(demoMentees);
    } else if (realMenteesData) {
      const mapped = realMenteesData.map((c) => ({
        id: c.id, // Chain ID
        partnershipId: c.partnershipId,
        name: `Recoveree #${c.userId.substring(0, 6)}`,
        username: `user_${c.userId.substring(0, 6)}`,
        streak: c.currentStreak,
        longestStreak: c.longestStreak,
        ratio: c.cleanRatioPercent,
        resilienceScore: c.resilienceScore || 85,
        lastStatus: c.currentStreak > 0 ? 'CLEAN' : 'SLIP_UP',
        lastCheckIn: c.lastCheckInDate ? new Date(c.lastCheckInDate).toLocaleDateString() : 'No check-in yet',
      }));
      setActiveMentees(mapped);
    }
  }, [realMenteesData, isDemoSession]);

  // Sync counsel notes for selected recoveree
  useEffect(() => {
    if (isDemoSession && selectedMentee) {
      setCounselNotes([
        { id: 'n-1', mentorFullName: 'Shaykh Ahmad', counselText: 'Keep up with evening Adhkar. Try going to sleep immediately after Isha.', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'n-2', mentorFullName: 'Shaykh Ahmad', counselText: 'Resisting the first 5 minutes of an urge is 90% of the battle. Keep striving!', createdAt: new Date(Date.now() - 518400000).toISOString() },
      ]);
    } else if (realNotesData) {
      setCounselNotes(realNotesData);
    }
  }, [realNotesData, selectedMentee, isDemoSession]);

  // Sync messages for selected recoveree
  useEffect(() => {
    if (isDemoSession && selectedMentee) {
      setChatMessages([
        {
          id: 'msg-1',
          partnershipId: 'p-1',
          senderId: 'alex-1',
          senderFullName: selectedMentee.name,
          senderUsername: selectedMentee.username,
          messageContent: 'Assalamu Alaikum Sheikh, the cravings are extremely intense tonight. I am feeling restless.',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'msg-2',
          partnershipId: 'p-1',
          senderId: 'me',
          senderFullName: 'Sheikh Ahmad Al-Taji',
          senderUsername: 'sheikh_ahmad',
          messageContent: 'Wa Alaikum Assalam, my dear son. Stand up immediately. Go splash cold water on your face, perform fresh wudu, and recite the 3 Quls. The physical urge will pass in a few minutes. Guard your gaze.',
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        }
      ]);
    } else if (realMessagesData) {
      setChatMessages(realMessagesData);
    }
  }, [realMessagesData, selectedMentee, isDemoSession]);

  // Actions for Connection Requests
  const handleAcceptConnection = (reqId: string, name: string, username: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    const newMentee = { 
      id: `m-${Date.now()}`, 
      name, 
      username, 
      streak: 0, 
      longestStreak: 0,
      ratio: 100, 
      resilienceScore: 85,
      lastStatus: 'CLEAN', 
      lastCheckIn: 'Just now' 
    };
    setActiveMentees((prev) => [...prev, newMentee]);
    setSelectedMentee(newMentee);
    setView('workspace');
    triggerToast(`Successfully connected to ${name}!`);
  };

  const handleDeclineConnection = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    triggerToast('Connection request declined.');
  };

  // Actions for Meeting Requests
  const handleApproveMeeting = (id: string) => {
    setMeetingRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'APPROVED' } : m))
    );
    triggerToast('Meeting request approved successfully!');
  };

  const handleRescheduleMeeting = (id: string) => {
    setMeetingRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'RESCHEDULED', time: 'Pending Reschedule' } : m))
    );
    triggerToast('Meeting rescheduling request submitted.');
  };

  // Actions for posting Nasiha Note
  const handlePostNote = async () => {
    if (!newNoteText.trim() || !selectedMentee) return;
    setIsSubmittingNote(true);
    try {
      if (isDemoSession) {
        const newNote = {
          id: `n-${Date.now()}`,
          mentorFullName: 'Shaykh Ahmad',
          counselText: newNoteText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCounselNotes((prev) => [newNote, ...prev]);
        triggerToast('Nasiha note posted successfully!');
      } else {
        await sendCounselNote(selectedMentee.id, newNoteText.trim());
        refetchRealNotes();
        triggerToast('Nasiha note posted successfully!');
      }
      setNewNoteText('');
    } catch {
      // Ignore
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Actions for sending chat message
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || !selectedMentee) return;
    if (isDemoSession) {
      const newMsg: MentorshipChatMessage = {
        id: `msg-${Date.now()}`,
        partnershipId: 'p-1',
        senderId: 'me',
        senderFullName: 'Sheikh Ahmad Al-Taji',
        senderUsername: 'sheikh_ahmad',
        messageContent: text,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            partnershipId: 'p-1',
            senderId: 'alex-1',
            senderFullName: selectedMentee.name,
            senderUsername: selectedMentee.username,
            messageContent: 'Jazakallahu khair Sheikh. I will do that immediately and pray.',
            isRead: false,
            createdAt: new Date().toISOString(),
          }
        ]);
      }, 2000);
    } else if (selectedMentee.partnershipId) {
      try {
        await sendPartnershipMessage(selectedMentee.partnershipId, text.trim());
        const msgs = await getPartnershipMessages(selectedMentee.partnershipId);
        setChatMessages(msgs);
      } catch (err) {
        console.warn('Failed to send message:', err);
      }
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filter roster
  const filteredMentees = activeMentees.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // VIEW 1: Mentee Workspace View
  if (view === 'workspace' && selectedMentee) {
    return (
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
        
        {/* Toast Alert */}
        {successToast && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Top Header Section with Back button */}
        <div className="relative overflow-hidden px-6 py-5 sm:px-8 sm:py-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={() => setView('dashboard')}
              className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-505 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer shadow-3xs transition-colors shrink-0 flex items-center justify-center mr-1"
              title="Back to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-455 tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 block w-fit">
                📊 Detailed Performance Workspace
              </span>
              <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase pt-2">
                {selectedMentee.name}
              </h2>
            </div>
          </div>
          <Badge variant="emerald" className="animate-pulse">Active Workspace</Badge>
        </div>

        {/* 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Recovery metrics & Analytics (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mentees KPIs Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Active Streak Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs bg-emerald-500/5 dark:bg-emerald-955/5 border-emerald-500/15 dark:border-emerald-505/10 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Streak</span>
                  <Flame className="w-4 h-4 text-emerald-500 dark:text-emerald-450" />
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
                    {selectedMentee.streak}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 mt-1 block">Clean Days</span>
                </div>
              </div>

              {/* Longest Streak Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs bg-amber-500/5 dark:bg-amber-955/5 border-amber-500/15 dark:border-amber-500/10 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Longest</span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
                    {selectedMentee.longestStreak || selectedMentee.streak}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 mt-1 block">Peak Days</span>
                </div>
              </div>

              {/* Clean Ratio Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs bg-blue-500/5 dark:bg-blue-955/5 border-blue-500/15 dark:border-blue-505/10 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ratio</span>
                  <Compass className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
                    {selectedMentee.ratio}%
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 mt-1 block">Sober Rate</span>
                </div>
              </div>

              {/* Resilience Score Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs text-left bg-purple-500/5 dark:bg-purple-955/5 border-purple-500/15 dark:border-purple-505/10">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Resilience</span>
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
                    {selectedMentee.resilienceScore || 85}%
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-purple-600 mt-1 block">Cognitive</span>
                </div>
              </div>

            </div>



            {/* RecoveryAnalytics Charts / Logs */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-455 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none text-left">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                <span>Performance & Check-in Logs</span>
              </h3>
              <Card variant="glass" className="p-6 border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <RecoveryAnalytics chainId={selectedMentee.id} isDemo={isDemoSession} />
              </Card>
            </div>

          </div>

          {/* RIGHT COLUMN: Chat / Nasiha advisories (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col h-[550px]">
              
              {/* Tab Toggles */}
              <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800/50 pb-2 mb-4 shrink-0">
                <button
                  onClick={() => setWorkspaceTab('nasiha')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                    workspaceTab === 'nasiha'
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  ✍ Nasiha Notes
                </button>
                <button
                  onClick={() => setWorkspaceTab('chat')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                    workspaceTab === 'chat'
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  💬 Live Chat
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {workspaceTab === 'nasiha' ? (
                  <div className="space-y-4 text-left">
                    {/* Note Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 block">
                        Post new Nasiha Note
                      </label>
                      <textarea
                        rows={3}
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Write a message of spiritual encouragement or advice..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-805 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all resize-none"
                      />
                      <button
                        onClick={handlePostNote}
                        disabled={isSubmittingNote || !newNoteText.trim()}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {isSubmittingNote ? 'Posting...' : 'Post Nasiha'}
                      </button>
                    </div>

                    {/* Notes Log */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                        Past Advisories
                      </span>
                      {isLoadingNotes ? (
                        <p className="text-[10px] text-slate-400 italic">Loading notes...</p>
                      ) : counselNotes.length === 0 ? (
                        <p className="text-[10px] text-slate-450 italic">No notes posted yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {counselNotes.map((note) => (
                            <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
                              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed font-serif">
                                "{note.counselText}"
                              </p>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col min-h-0">
                    <MentorshipChat
                      partnerName={selectedMentee.name}
                      inviteCode={selectedMentee.partnershipId || 'MENTOR-BC-7890'}
                      messages={chatMessages}
                      onSendMessage={handleSendChatMessage}
                    />
                  </div>
                )}
              </div>

            </Card>

          </div>

        </div>

      </div>
    );
  }

  // VIEW 2: Decluttered Main Dashboard
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Section */}
      <div className="relative overflow-hidden px-6 py-5 sm:px-8 sm:py-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/3 pointer-events-none select-none" />
        <div className="relative z-10 space-y-1 text-left">
          <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-455 tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 block w-fit">
            {mentorContent.header.shieldText}
          </span>
          <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase pt-2">
            {mentorContent.header.title}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {mentorContent.header.subtitle}
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-955/40 border border-emerald-200 dark:border-emerald-800 shadow-inner md:flex hidden">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
        </div>
      </div>

      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Assigned Recoverees & Meeting requests (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Assigned Users Card */}
          <Card variant="glass" className="p-5 flex flex-col h-[520px] border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {mentorContent.roster.title}
              </h2>
              <Badge variant="emerald">{filteredMentees.length} {mentorContent.roster.activeBadge}</Badge>
            </div>
            
            {/* Roster Search Bar */}
            <div className="relative mb-3 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={mentorContent.roster.searchPlaceholder}
                className="w-full bg-slate-55 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-808 dark:text-slate-205 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold transition-all"
              />
            </div>

            {/* Roster Scroll Container */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-1 text-left">
              {filteredMentees.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 italic">
                  {mentorContent.roster.emptyMessage}
                </div>
              ) : (
                filteredMentees.map((mentee) => {
                  return (
                    <button
                      key={mentee.id}
                      onClick={() => {
                        setSelectedMentee(mentee);
                        setView('workspace');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 text-left transition-all relative overflow-hidden cursor-pointer hover:scale-[1.01] hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <div className="flex items-center gap-3 pl-1">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          {mentee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {mentee.name}
                          </h3>
                          <p className="text-[9px] text-slate-400 font-mono font-bold mt-0.5 uppercase tracking-wider">
                            {mentorContent.roster.checkinPrefix} {mentee.lastCheckIn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-900 dark:text-white block leading-none">
                            {mentee.streak} Days
                          </span>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-450 mt-1 block">
                            Streak
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            mentee.lastStatus === 'SLIP_UP' ? "bg-rose-500" : "bg-emerald-500"
                          )} />
                          <span className={cn(
                            "text-[9px] font-black mt-1.5 uppercase tracking-wider",
                            mentee.lastStatus === 'SLIP_UP' ? "text-rose-600" : "text-emerald-600"
                          )}>
                            {mentee.lastStatus === 'SLIP_UP' ? 'Slip' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {/* Meeting Requests Card */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{mentorContent.meetings.title}</span>
              </h2>
              {meetingRequests.filter(m => m.status === 'PENDING').length > 0 && (
                <Badge variant="rose" className="animate-pulse">
                  {meetingRequests.filter(m => m.status === 'PENDING').length} {mentorContent.meetings.pendingBadge}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {meetingRequests.length === 0 ? (
                <p className="text-[10px] text-slate-405 dark:text-slate-500 italic text-center py-4 font-medium">
                  {mentorContent.meetings.emptyMessage}
                </p>
              ) : (
                meetingRequests.map((meet) => (
                  <div 
                    key={meet.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/65 dark:border-slate-800/65 gap-4 transition-all duration-200 hover:border-emerald-500/25"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-extrabold text-xs shrink-0 select-none">
                        {meet.initials}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{meet.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{meet.time}</p>
                        {meet.status === 'PENDING' ? (
                          <p className="text-[11px] text-slate-550 dark:text-slate-400 italic mt-1 font-serif">
                            "{meet.message}"
                          </p>
                        ) : (
                          <span className={cn(
                            "inline-block text-[8px] font-black px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider border",
                            meet.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          )}>
                            {meet.status === 'APPROVED' ? 'Approved' : 'Reschedule Requested'}
                          </span>
                        )}
                      </div>
                    </div>

                    {meet.status === 'PENDING' && (
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <button 
                          onClick={() => handleRescheduleMeeting(meet.id)}
                          className="flex-1 sm:flex-none px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {mentorContent.meetings.btnReschedule}
                        </button>
                        <button 
                          onClick={() => handleApproveMeeting(meet.id)}
                          className="flex-1 sm:flex-none px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
                        >
                          {mentorContent.meetings.btnApprove}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Connection Invites (col-span-4) */}
        <div className="lg:col-span-4">
          
          {/* Connection Requests Card (Invite Code Partnerships) */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {mentorContent.invites.title}
              </h2>
              {requests.length > 0 && (
                <Badge variant="rose" className="animate-pulse">{requests.length} {mentorContent.invites.pendingBadge}</Badge>
              )}
            </div>

            {requests.length === 0 ? (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center py-4 font-medium">
                {mentorContent.invites.emptyMessage}
              </p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <strong className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{req.name}</strong>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 block font-mono">@{req.username}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono font-bold">{req.date}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-105 dark:border-slate-800/40">
                      <span className="text-[9px] bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg font-mono border border-slate-200/50 dark:border-slate-800 font-bold">
                        {req.code}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptConnection(req.id, req.name, req.username)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 cursor-pointer transition-colors"
                          title={mentorContent.invites.acceptTooltip}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineConnection(req.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-955 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 cursor-pointer transition-colors"
                          title={mentorContent.invites.declineTooltip}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>

    </div>
  );
};
