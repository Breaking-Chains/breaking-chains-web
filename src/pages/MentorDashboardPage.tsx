import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { MenteeCareTerminal } from '../components/pmo/MenteeCareTerminal';
import { getMentees } from '../services/partnerService';
import { 
  Users, 
  Check, 
  X, 
  Search, 
  Mail, 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ClipboardList,
  Flame,
  Trophy,
  Compass,
  Shield
} from 'lucide-react';
import { cn } from '../utils/cn';
import mentorContent from '../data/mentorContent.json';

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

  // Modal / Drawer Care Terminal State
  const [activeCareTerminalTab, setActiveCareTerminalTab] = useState<'chat' | 'nasiha' | 'analytics' | null>(null);
  
  // Feedback States
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // TanStack React Query for async roster sync
  const { data: realMenteesData } = useQuery({
    queryKey: ['mentees'],
    queryFn: getMentees,
    enabled: !isDemoSession,
  });

  // Sync roster and mock requests
  useEffect(() => {
    if (isDemoSession) {
      setRequests([
        { id: 'req-1', name: 'Zayd Malik', username: 'zayd_m', date: 'Today', code: 'MENTOR-BC-7890' },
        { id: 'req-2', name: 'Omar Farooq', username: 'omar_f', date: 'Yesterday', code: 'MENTOR-BC-7890' },
      ]);
      const demoMentees = [
        { id: 'm-1', chainId: 'c-1', name: 'Zayd Malik', username: 'zayd_m', streak: 12, longestStreak: 25, ratio: 95, resilienceScore: 92, lastStatus: 'CLEAN', lastCheckIn: '2 hrs ago' },
        { id: 'm-2', chainId: 'c-2', name: 'Bilal Khan', username: 'bilal_k', streak: 0, longestStreak: 14, ratio: 80, resilienceScore: 78, lastStatus: 'SLIP_UP', lastCheckIn: '5 hrs ago' },
        { id: 'm-3', chainId: 'c-3', name: 'Tariq Ali', username: 'tariq_a', streak: 42, longestStreak: 42, ratio: 100, resilienceScore: 98, lastStatus: 'CLEAN', lastCheckIn: '1 day ago' },
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

  // Set initial selected mentee when roster is loaded
  useEffect(() => {
    if (activeMentees.length > 0 && !selectedMentee) {
      setSelectedMentee(activeMentees[0]);
    }
  }, [activeMentees, selectedMentee]);

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

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filter roster
  const filteredMentees = activeMentees.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-inner md:flex hidden">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
        </div>
      </div>

      {/* 12-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Assigned Users & Connection Requests (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
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
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-205 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold transition-all"
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
                  const isSelected = selectedMentee?.id === mentee.id;
                  return (
                    <button
                      key={mentee.id}
                      onClick={() => setSelectedMentee(mentee)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-955 text-left transition-all relative overflow-hidden cursor-pointer hover:scale-[1.01] hover:border-emerald-500/40",
                        isSelected && "bg-slate-55 dark:bg-slate-900/80 border-emerald-500 dark:border-emerald-500 shadow-2xs"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />
                      )}
                      
                      <div className="flex items-center gap-3 pl-1">
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                          isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350"
                        )}>
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
                    </button>
                  );
                })
              )}
            </div>
          </Card>

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
              <p className="text-[10px] text-slate-400 dark:text-slate-505 italic text-center py-4 font-medium">
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

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-105 dark:border-slate-805/40">
                      <span className="text-[9px] bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300 px-2 py-0.5 rounded-lg font-mono border border-slate-200/50 dark:border-slate-800 font-bold">
                        {req.code}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptConnection(req.id, req.name, req.username)}
                          className="p-1.5 rounded-lg bg-emerald-55 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 cursor-pointer transition-colors"
                          title={mentorContent.invites.acceptTooltip}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineConnection(req.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 cursor-pointer transition-colors"
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

        {/* RIGHT COLUMN: Selected User Details & Meeting Requests (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {selectedMentee ? (
            <Card variant="glass" className="p-6 md:p-8 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
              
              {/* Mentee Profile Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 dark:from-emerald-955/40 dark:to-teal-955/40 border border-emerald-500/20 dark:border-emerald-850 flex items-center justify-center font-black text-emerald-600 dark:text-emerald-400 text-base shadow-inner select-none">
                    {selectedMentee.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {selectedMentee.name}
                    </h2>
                    <p className="text-[10px] text-slate-505 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Day {selectedMentee.streak} of Sobriety</span>
                    </p>
                  </div>
                </div>

                {/* Advice Tab Action Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveCareTerminalTab('chat')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{mentorContent.detail.actions.message}</span>
                  </button>
                  <button
                    onClick={() => setActiveCareTerminalTab('nasiha')}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-3xs cursor-pointer hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{mentorContent.detail.actions.nasiha}</span>
                  </button>
                  <button
                    onClick={() => setActiveCareTerminalTab('analytics')}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-3xs cursor-pointer hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
                    title={mentorContent.detail.actions.analytics}
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{mentorContent.detail.actions.analytics}</span>
                  </button>
                  <button 
                    className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl shrink-0 cursor-pointer shadow-3xs transition-colors"
                    title={mentorContent.detail.actions.email}
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

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
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs text-left">
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

              {/* Progress Goal Linear Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span>{mentorContent.detail.milestoneLabel}</span>
                  <span>{selectedMentee.streak}/90 Days ({Math.min(100, Math.round((selectedMentee.streak / 90) * 100)) || 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200/20">
                  <div 
                    className="bg-emerald-500 dark:bg-emerald-450 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (selectedMentee.streak / 90) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Check-in History Heatmap */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none text-left">
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  <span>{mentorContent.detail.heatmapTitle}</span>
                </h3>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {/* Render 4 column stacks representing the last 4 weeks */}
                    {Array.from({ length: 4 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1.5 shrink-0">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const dayNum = (colIdx * 7) + rowIdx;
                          let cellClass = "bg-emerald-500"; // Default Solid Green
                          
                          // Mocking missed status for visual parity
                          const isSlipUp = selectedMentee.lastStatus === 'SLIP_UP' && colIdx === 3 && rowIdx === 6;
                          if (isSlipUp) {
                            cellClass = "bg-rose-500";
                          } else if ((colIdx === 0 && rowIdx === 3) || (colIdx === 2 && rowIdx === 5)) {
                            cellClass = "bg-slate-200 dark:bg-slate-800"; // Missed check-in
                          } else if (dayNum % 3 === 0) {
                            cellClass = "bg-emerald-500/40"; // Light clean green
                          } else if (colIdx === 3 && rowIdx === 4) {
                            cellClass = "bg-white dark:bg-slate-900 border-2 border-emerald-500"; // Selected / Today
                          }
                          
                          return (
                            <div
                              key={rowIdx}
                              className={cn("w-4.5 h-4.5 rounded-md transition-all border border-slate-200/10 hover:scale-105", cellClass)}
                              title={`Week ${colIdx + 1}, Day ${rowIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Legend */}
                  <div className="flex justify-end gap-3.5 mt-4 text-[10px] text-slate-450 font-bold uppercase tracking-wider select-none border-t border-slate-105 dark:border-slate-805/60 pt-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <span>{mentorContent.detail.legendMissed}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-md" />
                      <span>{mentorContent.detail.legendSober}</span>
                    </span>
                    {selectedMentee.lastStatus === 'SLIP_UP' && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-md" />
                        <span>{mentorContent.detail.legendSlip}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </Card>
          ) : (
            <Card variant="glass" className="p-12 text-center text-xs text-slate-550 italic border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/20 rounded-3xl">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <span>{mentorContent.detail.emptyState}</span>
            </Card>
          )}

          {/* Meeting Requests Card */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-405" />
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
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center py-4 font-medium">
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
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 font-serif">
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
                          className="flex-1 sm:flex-none px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
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

      </div>

      {/* Floating Side Drawer / Wide Modal for Mentee Care Terminal (Tabs overlay) */}
      {activeCareTerminalTab && selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl flex flex-col h-[90vh] sm:h-[85vh] overflow-hidden transform duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-450 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {mentorContent.terminal.workspaceTitle} {selectedMentee.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCareTerminalTab(null)}
                className="p-2 text-slate-505 hover:text-slate-900 dark:hover:text-white hover:bg-slate-150 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Content - Loads MenteeCareTerminal inside */}
            <div className="p-6 overflow-y-auto flex-1">
              <MenteeCareTerminal
                mentee={selectedMentee}
                onBack={() => setActiveCareTerminalTab(null)}
                isDemo={isDemoSession}
                initialTab={activeCareTerminalTab}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
