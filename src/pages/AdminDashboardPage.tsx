import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { 
  ShieldCheck, 
  Award, 
  Sliders,
  Users,
  Copy,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../services/authService';
import { getAllMentorApplications, getVerifiedMentors, updateMentorStatus } from '../services/mentorService';
import { getAllPartnerships } from '../services/partnerService';
import { cn } from '../utils/cn';
import adminContent from '../data/adminContent.json';

interface Application {
  id: string;
  fullName: string;
  username: string;
  qualification: string;
  experience: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ActiveMember {
  id: string;
  name: string;
  username?: string;
  initials: string;
  streakDays: number;
  status: 'ACTIVE' | 'NEEDS_ATTENTION';
  assignedMentor: string;
}

interface MentorCapacity {
  id: string;
  name: string;
  current: number;
  capacity: number;
  color: 'emerald' | 'amber' | 'rose';
}

export const AdminDashboardPage: React.FC = () => {
  const { isDemoSession } = useAuth();
  
  // Roster states
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const [mentorCapacities, setMentorCapacities] = useState<MentorCapacity[]>([]);

  // Navigation states
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'mentors' | 'applications'>('dashboard');
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [mentorsSearchQuery, setMentorsSearchQuery] = useState('');
  
  // Auditing states
  const [applications, setApplications] = useState<Application[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // TanStack Query for Mentor Onboarding Applications
  const { data: realAppsData, refetch: refetchRealApps } = useQuery({
    queryKey: ['mentorApplications'],
    queryFn: getAllMentorApplications,
    enabled: !isDemoSession,
  });

  // TanStack Query for Verified Mentors Directory
  const { data: verifiedMentorsData, refetch: refetchVerifiedMentors } = useQuery({
    queryKey: ['verifiedMentors'],
    queryFn: getVerifiedMentors,
    enabled: !isDemoSession,
  });

  // TanStack Query for All Users Registry
  const { data: realUsersData } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
    enabled: !isDemoSession,
  });

  // TanStack Query for All Partnerships
  const { data: realPartnershipsData } = useQuery({
    queryKey: ['allPartnerships'],
    queryFn: getAllPartnerships,
    enabled: !isDemoSession,
  });

  useEffect(() => {
    if (isDemoSession) {
      setActiveMembers([
        { id: 'mem-1', name: 'Zayd Malik', username: 'zayd_m', initials: 'ZM', streakDays: 12, status: 'ACTIVE', assignedMentor: 'Shaykh Ahmad' },
        { id: 'mem-2', name: 'Bilal Khan', username: 'bilal_k', initials: 'BK', streakDays: 0, status: 'NEEDS_ATTENTION', assignedMentor: 'Shaykh Ahmad' },
        { id: 'mem-3', name: 'Tariq Ali', username: 'tariq_a', initials: 'TA', streakDays: 42, status: 'ACTIVE', assignedMentor: 'Shaykh Luqman' }
      ]);
      setMentorCapacities([
        { id: 'cap-1', name: 'Shaykh Ahmad', current: 2, capacity: 5, color: 'emerald' },
        { id: 'cap-2', name: 'Shaykh Luqman', current: 5, capacity: 5, color: 'rose' },
        { id: 'cap-3', name: 'Dr. Tariq Mahmood', current: 0, capacity: 8, color: 'amber' }
      ]);
      setApplications([
        { id: 'app-1', fullName: 'Shaykh Luqman', username: 'luqman_h', qualification: 'MA Islamic Counseling', experience: 8, status: 'PENDING' },
        { id: 'app-2', fullName: 'Dr. Tariq Mahmood', username: 'tariq_m', qualification: 'PhD Clinical Psychology', experience: 15, status: 'PENDING' },
      ]);
    } else {
      if (realUsersData) {
        const mappedUsers = realUsersData
          .filter((u) => u.role === 'USER')
          .map((u) => {
            const userPartnership = realPartnershipsData?.find((p) => p.userId === u.id && p.status === 'ACCEPTED');
            const mentorName = userPartnership?.partnerFullName || 'Unassigned';
            return {
              id: u.id,
              name: u.fullName,
              username: u.username,
              initials: u.fullName
                ? u.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                : 'U',
              streakDays: 0,
              status: 'ACTIVE' as const,
              assignedMentor: mentorName,
            };
          });
        setActiveMembers(mappedUsers);
      } else {
        setActiveMembers([]);
      }
      if (realAppsData) {
        const mappedApps = realAppsData.map((app) => ({
          id: app.id,
          fullName: app.fullName,
          username: app.username,
          qualification: app.qualification,
          experience: app.yearsOfExperience,
          status: app.status as 'PENDING' | 'APPROVED' | 'REJECTED',
        }));
        setApplications(mappedApps);
      }
      if (verifiedMentorsData) {
        const mappedCaps = verifiedMentorsData.map((mentor) => {
          const currentMentees = realPartnershipsData?.filter((p) => p.partnerUserId === mentor.userId && p.status === 'ACCEPTED') || [];
          return {
            id: mentor.id,
            name: mentor.fullName,
            current: currentMentees.length,
            capacity: 10,
            color: currentMentees.length >= 8 ? 'rose' as const : currentMentees.length >= 5 ? 'amber' as const : 'emerald' as const,
          };
        });
        setMentorCapacities(mappedCaps);
      }
    }
  }, [realAppsData, verifiedMentorsData, realUsersData, realPartnershipsData, isDemoSession]);

  useEffect(() => {
    setSelectedMentor(null);
  }, [activeView]);

  const handleApprove = async (appId: string, name: string) => {
    try {
      if (!isDemoSession) {
        await updateMentorStatus(appId, { status: 'APPROVED' });
        refetchRealApps();
        refetchVerifiedMentors();
      } else {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: 'APPROVED' } : app))
        );
      }
      triggerToast(`Approved verification for ${name}`);
    } catch {
      // Ignore
    }
  };

  const handleReject = async (appId: string, name: string) => {
    try {
      if (!isDemoSession) {
        await updateMentorStatus(appId, { status: 'REJECTED' });
        refetchRealApps();
      } else {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: 'REJECTED' } : app))
        );
      }
      triggerToast(`Rejected application for ${name}`);
    } catch {
      // Ignore
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };



  const pendingAppsCount = applications.filter((app) => app.status === 'PENDING').length;

  if (activeView === 'users') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
        {/* Toast Alert */}
        {successToast && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={() => { setActiveView('dashboard'); setUsersSearchQuery(''); }}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer select-none"
        >
          <span>← Back to Operations Hub</span>
        </button>

        {/* Header Card */}
        <div className="relative overflow-hidden px-6 py-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/3 pointer-events-none select-none" />
          <div className="relative z-10 space-y-1">
            <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase">
              Platform Users Registry
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Confidential recoveree accounts directory and mentor assignments mapping.
            </p>
          </div>
          <Badge variant="emerald">{activeMembers.length} Accounts</Badge>
        </div>

        {/* Search filter */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-405 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, username or guide..."
            value={usersSearchQuery}
            onChange={(e) => setUsersSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-855 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-855 dark:text-slate-200 focus:outline-none focus:border-emerald-550 font-semibold transition-all"
          />
        </div>

        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850/60">
          🔒 Confidential Data Isolation — Struggle logs, streaks, and check-ins reside strictly under client-side isolation for safety. Only basic profile records are accessible.
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMembers.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-xs text-slate-400 italic border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
              No active users registry available.
            </div>
          ) : (
            activeMembers
              .filter((member) => 
                member.name.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
                (member.username && member.username.toLowerCase().includes(usersSearchQuery.toLowerCase())) ||
                member.assignedMentor.toLowerCase().includes(usersSearchQuery.toLowerCase())
              )
              .map((member) => (
                <Card variant="glass" key={member.id} className="p-4 flex items-center justify-between border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-slate-200/60 dark:border-slate-850/60">
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{member.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-wider">
                        @{member.username || member.name.toLowerCase().replace(' ', '_')} • Guide: {member.assignedMentor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white block leading-none">
                      {member.streakDays} Days
                    </span>
                    <span className={cn(
                      "text-[8px] font-black mt-1.5 uppercase tracking-wider block",
                      member.status === 'NEEDS_ATTENTION' ? "text-rose-600" : "text-emerald-600"
                    )}>
                      {member.status === 'NEEDS_ATTENTION' ? 'Needs Care' : 'Active'}
                    </span>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'mentors') {
    if (selectedMentor) {
      // Find connected recoverees
      const connectedMentees = activeMembers.filter((m) => m.assignedMentor === selectedMentor.name);

      return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
          {/* Toast Alert */}
          {successToast && (
            <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
              <ShieldCheck className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Back to list button */}
          <button 
            onClick={() => setSelectedMentor(null)}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer select-none"
          >
            <span>← Back to Verified Mentors</span>
          </button>

          {/* Mentor Profile Details Header Card */}
          <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/3 pointer-events-none select-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-455 flex items-center justify-center font-bold text-xl shrink-0 select-none border border-blue-500/20">
                {selectedMentor.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  {selectedMentor.name}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1.5">
                  {selectedMentor.specialization}
                </p>
                {selectedMentor.organization && (
                  <p className="text-[9px] text-slate-500 font-semibold pt-0.5">
                    {selectedMentor.organization}
                  </p>
                )}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-end gap-2 shrink-0">
              <Badge variant="emerald" className="text-[9px] font-black uppercase tracking-wider">Active Guide</Badge>
              <span className="text-[10px] font-bold text-slate-400">Joined {new Date(selectedMentor.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* LEFT COLUMN: Workload and invite code info (col-span-1) */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Capacity Card */}
              <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block select-none">
                  Workload Status
                </span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-800 dark:text-slate-200">Active Load</span>
                    <span className="text-slate-400 font-mono">
                      {selectedMentor.current}/{selectedMentor.capacity} recoverees
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-955 h-2 rounded-full overflow-hidden border border-slate-250/20">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        selectedMentor.color === 'emerald' ? 'bg-emerald-600' : selectedMentor.color === 'rose' ? 'bg-rose-550' : 'bg-amber-600'
                      )} 
                      style={{ width: `${(selectedMentor.current / selectedMentor.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Copy Invite Code Card */}
              <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block select-none">
                  Connection Invitation
                </span>
                
                <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-900/60">
                  <div>
                    <span className="text-[8px] font-black text-slate-450 uppercase tracking-widest block leading-none">Invite Code</span>
                    <span className="text-[11px] font-mono font-bold text-slate-805 dark:text-slate-200 mt-1.5 block select-all">{selectedMentor.inviteCode}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMentor.inviteCode);
                      triggerToast(`Copied invite code for ${selectedMentor.name}`);
                    }}
                    disabled={selectedMentor.inviteCode === 'N/A'}
                    className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-600 dark:border-slate-800 text-slate-400 dark:text-slate-350 cursor-pointer transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: Connected recoverees and bio detail (col-span-2) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Connected Mentees Card */}
              <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block select-none">
                  Assigned Recoverees ({connectedMentees.length})
                </span>

                <div className="space-y-2">
                  {connectedMentees.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 italic border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
                      No recoverees currently connected.
                    </div>
                  ) : (
                    connectedMentees.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-900/60 bg-white/30 dark:bg-slate-900/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-955 text-slate-705 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-slate-200/60 dark:border-slate-850/60">
                            {member.initials}
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white leading-none">{member.name}</h5>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                              @{member.username}
                            </p>
                          </div>
                        </div>
                        <Badge variant={member.status === 'NEEDS_ATTENTION' ? 'rose' : 'emerald'}>
                          {member.status === 'NEEDS_ATTENTION' ? 'Needs Care' : 'Active'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Bio & Details Card */}
              <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block select-none">
                  Professional Credentials
                </span>

                <div className="space-y-4 text-xs font-medium text-slate-705 dark:text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Years of experience</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedMentor.yearsOfExperience || 0} Years</span>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Biography</span>
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {selectedMentor.bio || "No professional biography provided."}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
        {/* Toast Alert */}
        {successToast && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={() => { setActiveView('dashboard'); setMentorsSearchQuery(''); }}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer select-none"
        >
          <span>← Back to Operations Hub</span>
        </button>

        {/* Header Card */}
        <div className="relative overflow-hidden px-6 py-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/3 pointer-events-none select-none" />
          <div className="relative z-10 space-y-1">
            <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase">
              Verified Mentors Directory
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Approved counselors, spiritual advisors and copyable connection invite codes.
            </p>
          </div>
          <Badge variant="emerald">{mentorCapacities.length} Guides</Badge>
        </div>

        {/* Search filter */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search mentors by name..."
            value={mentorsSearchQuery}
            onChange={(e) => setMentorsSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-855 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-855 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold transition-all"
          />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentorCapacities.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-xs text-slate-400 italic border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
              No verified mentors active yet.
            </div>
          ) : (
            mentorCapacities
              .filter((m) => 
                m.name.toLowerCase().includes(mentorsSearchQuery.toLowerCase())
              )
              .map((mentor) => {
                const matchedDetail = verifiedMentorsData?.find((realM) => realM.fullName === mentor.name);
                const specs = matchedDetail?.specialization || "Islamic Counseling & Tazkiyah";
                const invite = matchedDetail?.inviteCode || "N/A";
                
                return (
                  <Card 
                    variant="glass" 
                    key={mentor.id} 
                    onClick={() => setSelectedMentor({
                      ...mentor,
                      specialization: specs,
                      inviteCode: invite,
                      bio: matchedDetail?.bio,
                      organization: matchedDetail?.organization,
                      yearsOfExperience: matchedDetail?.yearsOfExperience,
                      createdAt: matchedDetail?.createdAt
                    })}
                    className="p-5 border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/20 space-y-4 text-left hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/35 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{mentor.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-wider leading-relaxed">
                          {specs}
                        </p>
                      </div>
                      <Badge variant="emerald" className="text-[8px] font-black uppercase tracking-wider shrink-0">Active</Badge>
                    </div>

                    {/* Copyable connection invite code block */}
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-900/60" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Connection Code</span>
                        <span className="text-[11px] font-mono font-bold text-slate-805 dark:text-slate-200 mt-1.5 block select-all">{invite}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(invite);
                          triggerToast(`Copied invite code for ${mentor.name}`);
                        }}
                        disabled={invite === 'N/A'}
                        className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-600 dark:border-slate-800 text-slate-400 dark:text-slate-350 cursor-pointer transition-colors"
                        title="Copy Code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                );
              })
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'applications') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
        {/* Toast Alert */}
        {successToast && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer select-none"
        >
          <span>← Back to Operations Hub</span>
        </button>

        {/* Header Card */}
        <div className="relative overflow-hidden px-6 py-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/3 pointer-events-none select-none" />
          <div className="relative z-10 space-y-1">
            <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase">
              Mentor Onboarding Applications
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Review and verify prospective counselors and spiritual advisors applying to the platform.
            </p>
          </div>
          {pendingAppsCount > 0 && (
            <Badge variant="rose" className="animate-pulse">
              {pendingAppsCount} Awaiting Review
            </Badge>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-3.5">
          {applications.filter((app) => app.status === 'PENDING').length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-405 italic border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
              No applications awaiting review at the moment.
            </div>
          ) : (
            applications
              .filter((app) => app.status === 'PENDING')
              .map((app) => (
              <Card 
                variant="glass" 
                key={app.id} 
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/20 gap-4 transition-all duration-200 hover:border-amber-505/25"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-955 text-slate-700 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-slate-200/60 dark:border-slate-850/60">
                    {app.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{app.fullName}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-wider">@{app.username}</p>
                    
                    <div className="flex gap-4 mt-3 border-t border-slate-100 dark:border-slate-800/40 pt-1.5 text-[9px] font-bold text-slate-500 uppercase">
                      <span>
                        Qualification: <span className="text-slate-700 dark:text-slate-300 font-medium normal-case">{app.qualification}</span>
                      </span>
                      <span>
                        Experience: <span className="text-slate-750 dark:text-slate-300 font-mono font-medium">{app.experience} Years</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end items-center">
                  {app.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleReject(app.id, app.fullName)}
                        className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 dark:border-slate-850 text-slate-750 dark:text-slate-350 hover:border-rose-500/40 hover:text-rose-650 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(app.id, app.fullName)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
                      >
                        Approve & Verify
                      </button>
                    </>
                  ) : (
                    <span className={cn(
                      "text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border",
                      app.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-rose-500/10 text-rose-750 border-rose-500/20"
                    )}>
                      {app.status}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
          <ShieldCheck className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative overflow-hidden px-6 py-5 sm:px-8 sm:py-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex justify-between items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/3 pointer-events-none select-none" />
        <div className="relative z-10 space-y-1 text-left">
          <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-455 tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 block w-fit">
            {adminContent.header.shieldText}
          </span>
          <h2 className="text-lg font-black font-manrope tracking-tight text-slate-900 dark:text-white uppercase pt-2">
            {adminContent.header.title}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {adminContent.header.subtitle}
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-955/40 border border-emerald-200 dark:border-emerald-800 shadow-inner md:flex hidden animate-pulse">
          <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
        </div>
      </div>

      {/* High-Level Statistics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Recoverees */}
        <div onClick={() => setActiveView('users')} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/35 cursor-pointer text-left bg-emerald-500/5 dark:bg-emerald-955/5 border-emerald-500/15 dark:border-emerald-505/10">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.recoverees}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {activeMembers.length}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 mt-1 block">Active Accounts</span>
          </div>
        </div>

        {/* Active Guides */}
        <div onClick={() => setActiveView('mentors')} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/35 cursor-pointer text-left bg-blue-500/5 dark:bg-blue-955/5 border-blue-500/15 dark:border-blue-505/10">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.mentors}</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {mentorCapacities.length}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 mt-1 block">Verified Mentors</span>
          </div>
        </div>

        {/* Pending Onboarding Applications */}
        <div 
          onClick={() => setActiveView('applications')}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-md hover:border-amber-500/35 cursor-pointer text-left bg-amber-500/5 dark:bg-amber-955/5 border-amber-500/15 dark:border-amber-505/10",
            pendingAppsCount > 0 && "animate-pulse border-amber-500/30"
          )}
        >
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-455">{adminContent.stats.applications}</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {pendingAppsCount}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-605 mt-1 block">Applications</span>
          </div>
        </div>
      </div>

    </div>
  );
};
