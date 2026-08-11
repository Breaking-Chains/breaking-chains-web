import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { MenteeCareTerminal } from '../components/pmo/MenteeCareTerminal';
import { getMentees } from '../services/partnerService';
import { 
  Users, 
  Check, 
  X, 
  Search,
  Lock,
  Mail,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { cn } from '../utils/cn';

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

  // Load roster and requests
  useEffect(() => {
    if (isDemoSession) {
      setRequests([
        { id: 'req-1', name: 'Zayd Malik', username: 'zayd_m', date: 'Today', code: 'MENTOR-BC-7890' },
        { id: 'req-2', name: 'Omar Farooq', username: 'omar_f', date: 'Yesterday', code: 'MENTOR-BC-7890' },
      ]);
      const demoMentees = [
        { id: 'm-1', chainId: 'c-1', name: 'Zayd Malik', username: 'zayd_m', streak: 12, ratio: 95, lastStatus: 'CLEAN', lastCheckIn: '2 hrs ago' },
        { id: 'm-2', chainId: 'c-2', name: 'Bilal Khan', username: 'bilal_k', streak: 0, ratio: 80, lastStatus: 'SLIP_UP', lastCheckIn: '5 hrs ago' },
        { id: 'm-3', chainId: 'c-3', name: 'Tariq Ali', username: 'tariq_a', streak: 42, ratio: 100, lastStatus: 'CLEAN', lastCheckIn: '1 day ago' },
      ];
      setActiveMentees(demoMentees);
      setSelectedMentee(demoMentees[0]);
    } else {
      const loadRealMentees = async () => {
        try {
          const chains = await getMentees().catch(() => []);
          const mapped = chains.map((c) => ({
            id: c.id, // Chain ID
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
          if (mapped.length > 0) {
            setSelectedMentee(mapped[0]);
          }
        } catch {
          // Ignore
        }
      };
      loadRealMentees();
    }
  }, [isDemoSession]);

  // Actions for Connection Requests
  const handleAcceptConnection = (reqId: string, name: string, username: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    const newMentee = { 
      id: `m-${Date.now()}`, 
      name, 
      username, 
      streak: 0, 
      ratio: 100, 
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
      <div className="flex flex-col gap-2">
        {/* Privacy Shield Banner */}
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/60 rounded-xl p-3 mb-2 w-fit">
          <Lock className="w-4 h-4 text-primary" />
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Mentor-Mentee communications are encrypted and confidential.
          </span>
        </div>
      </div>

      {/* 12-Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Assigned Users & Connection Requests (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assigned Users Card */}
          <div className="bg-white dark:bg-slate-950 border border-outline-variant rounded-xl p-5 flex flex-col h-[520px] shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Assigned Users
              </h2>
              <Badge variant="emerald">{filteredMentees.length} Active</Badge>
            </div>
            
            {/* Roster Search Bar */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary font-semibold"
              />
            </div>

            {/* Roster Scroll Container */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-1">
              {filteredMentees.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 italic">
                  No connected mentees found.
                </div>
              ) : (
                filteredMentees.map((mentee) => {
                  const isSelected = selectedMentee?.id === mentee.id;
                  return (
                    <button
                      key={mentee.id}
                      onClick={() => setSelectedMentee(mentee)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer",
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-900/80 border-primary shadow-2xs"
                          : "bg-white dark:bg-slate-950 border-outline-variant hover:border-slate-400 hover:shadow-3xs"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                      )}
                      
                      <div className="flex items-center gap-3 pl-1">
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350"
                        )}>
                          {mentee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {mentee.name}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Check-in: {mentee.lastCheckIn}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          mentee.lastStatus === 'SLIP_UP' ? "bg-rose-500" : "bg-emerald-500"
                        )} />
                        <span className={cn(
                          "text-[9px] font-bold mt-1 uppercase tracking-wider",
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
          </div>

          {/* Connection Requests Card (Invite Code Partnerships) */}
          <div className="bg-white dark:bg-slate-950 border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Connection Invites
              </h2>
              {requests.length > 0 && (
                <Badge variant="rose" className="animate-pulse">{requests.length} Pending</Badge>
              )}
            </div>

            {requests.length === 0 ? (
              <p className="text-[11px] text-slate-450 italic text-center py-4">
                No pending invite code connections.
              </p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-outline-variant/65 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-xs font-bold text-slate-800 dark:text-slate-205">{req.name}</strong>
                        <span className="text-[10px] text-slate-500 block font-mono">@{req.username}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">{req.date}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-100/50 dark:border-slate-800/40">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-200/50 dark:border-slate-800">
                        {req.code}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAcceptConnection(req.id, req.name, req.username)}
                          className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                          title="Accept"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineConnection(req.id)}
                          className="p-1 rounded-lg bg-rose-50 hover:bg-rose-105 dark:bg-rose-955 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 cursor-pointer"
                          title="Decline"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Selected User Details & Meeting Requests (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {selectedMentee ? (
            <div className="bg-white dark:bg-slate-950 border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
              
              {/* Mentee Profile Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold font-display-lg text-lg shadow-sm">
                    {selectedMentee.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedMentee.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Day {selectedMentee.streak} of Sobriety</span>
                    </p>
                  </div>
                </div>

                {/* Advice Tab Action Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveCareTerminalTab('chat')}
                    className="flex-1 sm:flex-none px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={() => setActiveCareTerminalTab('nasiha')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200/50 dark:border-slate-800 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nasiha</span>
                  </button>
                  <button
                    onClick={() => setActiveCareTerminalTab('analytics')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200/50 dark:border-slate-800 cursor-pointer"
                    title="Detailed Analytics Workspace"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Analytics</span>
                  </button>
                  <button 
                    className="p-2 border border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-550 dark:hover:bg-slate-900 rounded-lg shrink-0 cursor-pointer"
                    title="Send Email Alert"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Goal Linear Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Goal: 90 Days Milestone</span>
                  <span>{selectedMentee.streak}/90 Days ({Math.min(100, Math.round((selectedMentee.streak / 90) * 100)) || 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (selectedMentee.streak / 90) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Check-in History (4-Week Grid Layout) */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  <span>Check-in History</span>
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {/* Render 4 column stacks representing the last 4 weeks */}
                    {Array.from({ length: 4 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1.5 shrink-0">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const dayNum = (colIdx * 7) + rowIdx;
                          let cellClass = "bg-secondary"; // Default Solid Green
                          
                          // Mocking missed status for visual parity
                          const isSlipUp = selectedMentee.lastStatus === 'SLIP_UP' && colIdx === 3 && rowIdx === 6;
                          if (isSlipUp) {
                            cellClass = "bg-rose-500";
                          } else if ((colIdx === 0 && rowIdx === 3) || (colIdx === 2 && rowIdx === 5)) {
                            cellClass = "bg-slate-200 dark:bg-slate-800"; // Missed check-in
                          } else if (dayNum % 3 === 0) {
                            cellClass = "bg-secondary/40"; // Light clean green
                          } else if (colIdx === 3 && rowIdx === 4) {
                            cellClass = "bg-white dark:bg-slate-900 border-2 border-primary"; // Selected / Today
                          }
                          
                          return (
                            <div
                              key={rowIdx}
                              className={cn("w-4 h-4 rounded-sm transition-colors", cellClass)}
                              title={`Week ${colIdx + 1}, Day ${rowIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Legend */}
                  <div className="flex justify-end gap-3 mt-3.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-sm" />
                      <span>Missed</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-secondary rounded-sm" />
                      <span>Sober</span>
                    </span>
                    {selectedMentee.lastStatus === 'SLIP_UP' && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" />
                        <span>Slip</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <Card variant="glass" className="p-12 text-center text-xs text-slate-505 italic border-slate-250 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20 rounded-xl">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <span>Select a mentee from the roster to view their progress details.</span>
            </Card>
          )}

          {/* Meeting Requests Card */}
          <div className="bg-white dark:bg-slate-950 border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>Meeting Requests</span>
              </h2>
              {meetingRequests.filter(m => m.status === 'PENDING').length > 0 && (
                <Badge variant="rose" className="animate-pulse">
                  {meetingRequests.filter(m => m.status === 'PENDING').length} Pending
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {meetingRequests.map((meet) => (
                <div 
                  key={meet.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-550 dark:bg-slate-900/40 border border-outline-variant/65 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
                      {meet.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{meet.name}</h4>
                      <p className="text-[10px] text-slate-505 font-medium">{meet.time}</p>
                      {meet.status === 'PENDING' ? (
                        <p className="text-[11px] text-slate-600 dark:text-slate-350 italic mt-1 font-serif">
                          "{meet.message}"
                        </p>
                      ) : (
                        <span className={cn(
                          "inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wider",
                          meet.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
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
                        className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleApproveMeeting(meet.id)}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-primary text-white rounded-lg text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Side Drawer / Wide Modal for Mentee Care Terminal (Tabs overlay) */}
      {activeCareTerminalTab && selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col h-[90vh] sm:h-[85vh] overflow-hidden transform duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Care Workspace: {selectedMentee.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCareTerminalTab(null)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
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
