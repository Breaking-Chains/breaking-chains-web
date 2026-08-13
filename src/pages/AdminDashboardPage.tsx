import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { 
  ShieldCheck, 
  Bell, 
  Award, 
  Percent,
  Sliders,
  Users,
  X,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllMentorApplications, getVerifiedMentors, updateMentorStatus } from '../services/mentorService';
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

  // Modal states
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isMentorsModalOpen, setIsMentorsModalOpen] = useState(false);
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [mentorsSearchQuery, setMentorsSearchQuery] = useState('');
  
  // Auditing states
  const [applications, setApplications] = useState<Application[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
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
      setAnnouncements([
        { id: 'a-1', title: 'Prepare for Ramadan Tazkiyah Program', date: 'August 1' },
        { id: 'a-2', title: 'Daily Check-in Streaks System Update', date: 'July 28' },
      ]);
    } else {
      setActiveMembers([
        { id: 'mem-1', name: 'Zayd Malik', username: 'zayd_m', initials: 'ZM', streakDays: 12, status: 'ACTIVE', assignedMentor: 'Shaykh Ahmad' },
        { id: 'mem-2', name: 'Bilal Khan', username: 'bilal_k', initials: 'BK', streakDays: 0, status: 'NEEDS_ATTENTION', assignedMentor: 'Shaykh Ahmad' },
        { id: 'mem-3', name: 'Tariq Ali', username: 'tariq_a', initials: 'TA', streakDays: 42, status: 'ACTIVE', assignedMentor: 'Shaykh Luqman' },
        { id: 'mem-4', name: 'Yousef Ahmed', username: 'yousef_a', initials: 'YA', streakDays: 18, status: 'ACTIVE', assignedMentor: 'Shaykh Ahmad' },
        { id: 'mem-5', name: 'Hamza Rizwan', username: 'hamza_r', initials: 'HR', streakDays: 5, status: 'ACTIVE', assignedMentor: 'Dr. Tariq Mahmood' }
      ]);
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
        const mappedCaps = verifiedMentorsData.map((mentor) => ({
          id: mentor.id,
          name: mentor.fullName,
          current: 0, // Mocked workload load metric
          capacity: 10, // Default active capacity
          color: 'emerald' as const,
        }));
        setMentorCapacities(mappedCaps);
      }
    }
  }, [realAppsData, verifiedMentorsData, isDemoSession]);

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

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    setAnnouncements((prev) => [
      { id: `a-${Date.now()}`, title: newAnnouncementText.trim(), date: 'Just now' },
      ...prev,
    ]);
    setNewAnnouncementText('');
    triggerToast('Announcement broadcasted successfully!');
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };



  const pendingAppsCount = applications.filter((app) => app.status === 'PENDING').length;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Recoverees */}
        <div onClick={() => setIsUsersModalOpen(true)} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/35 cursor-pointer text-left bg-emerald-500/5 dark:bg-emerald-955/5 border-emerald-500/15 dark:border-emerald-505/10">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.recoverees}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {isDemoSession ? activeMembers.length : 128}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 mt-1 block">Active Accounts</span>
          </div>
        </div>

        {/* Active Guides */}
        <div onClick={() => setIsMentorsModalOpen(true)} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/35 cursor-pointer text-left bg-blue-500/5 dark:bg-blue-955/5 border-blue-500/15 dark:border-blue-505/10">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.mentors}</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {isDemoSession ? mentorCapacities.length : 8}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-600 mt-1 block">Verified Mentors</span>
          </div>
        </div>

        {/* Pending Onboarding Applications */}
        <div className={cn(
          "p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs text-left bg-amber-500/5 dark:bg-amber-955/5 border-amber-500/15 dark:border-amber-500/10",
          pendingAppsCount > 0 && "animate-pulse border-amber-500/30"
        )}>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.applications}</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              {pendingAppsCount}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 mt-1 block">Applications</span>
          </div>
        </div>

        {/* Workload health score */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between h-[100px] hover:-translate-y-0.5 hover:shadow-xs text-left bg-purple-500/5 dark:bg-purple-955/5 border-purple-500/15 dark:border-purple-505/10">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-450">{adminContent.stats.capacity}</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">
              94%
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-purple-600 mt-1 block">Workload</span>
          </div>
        </div>
      </div>

      {/* Main Bento Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Platform Roster & Onboarding Applications (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          


          {/* Onboarding Applications board */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                <span>{adminContent.applications.title}</span>
              </h2>
              {pendingAppsCount > 0 && (
                <Badge variant="rose" className="animate-pulse">
                  {pendingAppsCount} {adminContent.applications.pendingBadge}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center py-4 font-medium border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
                  {adminContent.applications.emptyMessage}
                </p>
              ) : (
                applications.map((app) => (
                  <div 
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/65 dark:border-slate-800/65 gap-4 transition-all duration-200 hover:border-emerald-500/25"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 font-extrabold text-xs shrink-0 select-none border border-slate-200 dark:border-slate-800">
                        {app.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{app.fullName}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">@{app.username}</p>
                        
                        <div className="flex gap-4 mt-2 border-t border-slate-100 dark:border-slate-800/40 pt-1.5 text-[9px] font-bold text-slate-500 uppercase">
                          <span>
                            {adminContent.applications.qualificationLabel}: <span className="text-slate-700 dark:text-slate-300 font-medium normal-case">{app.qualification}</span>
                          </span>
                          <span>
                            {adminContent.applications.experienceLabel}: <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">{app.experience} Years</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end items-center">
                      {app.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleReject(app.id, app.fullName)}
                            className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-200 dark:border-slate-850 text-slate-750 dark:text-slate-350 hover:border-rose-500/40 hover:text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            {adminContent.applications.btnReject}
                          </button>
                          <button
                            onClick={() => handleApprove(app.id, app.fullName)}
                            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
                          >
                            {adminContent.applications.btnApprove}
                          </button>
                        </>
                      ) : (
                        <span className={cn(
                          "text-[9px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border",
                          app.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-rose-500/10 text-rose-750 border-rose-500/20"
                        )}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Capacity Monitoring & Broadcast Center (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Capacity monitoring */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-left">
            <div className="border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {adminContent.capacity.title}
              </h2>
            </div>

            <div className="space-y-4 pr-1">
              {mentorCapacities.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">{item.name}</span>
                    <span className="text-slate-400 font-mono">
                      {item.current}/{item.capacity} {adminContent.capacity.capacitySuffix}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-250/20">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.color === 'emerald' ? 'bg-emerald-600' : item.color === 'rose' ? 'bg-rose-550' : 'bg-amber-600'
                      )} 
                      style={{ width: `${(item.current / item.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements composer */}
          <Card variant="glass" className="p-5 border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {adminContent.announcements.title}
              </h2>
              <Badge variant="slate">Broadcasts</Badge>
            </div>

            {/* Broadcast Form */}
            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <textarea
                rows={3}
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                placeholder={adminContent.announcements.placeholder}
                className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-505 font-medium transition-all resize-none"
              />
              <button
                type="submit"
                disabled={!newAnnouncementText.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{adminContent.announcements.btnPost}</span>
              </button>
            </form>

            {/* Active Announcements List */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block select-none">
                Active Broadcasts
              </span>
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-medium italic text-center py-4">
                    {adminContent.announcements.emptyMessage}
                  </p>
                ) : (
                  announcements.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-1.5 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <p className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed text-left">{item.title}</p>
                      <span className="text-[9px] text-slate-400 font-mono font-bold self-start">{item.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

        </div>

      </div>

      {/* Users Registry Modal */}
      {isUsersModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-fade-in text-left">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Platform Users Registry</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Active Struggle Accounts ({activeMembers.length})
                </p>
              </div>
              <button 
                onClick={() => { setIsUsersModalOpen(false); setUsersSearchQuery(''); }}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-955 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors border border-slate-250/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-955/20 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <input
                type="text"
                placeholder="Search users by name, username or guide..."
                value={usersSearchQuery}
                onChange={(e) => setUsersSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-[10px] text-slate-400/80 dark:text-slate-550 leading-relaxed font-semibold italic bg-slate-50 dark:bg-slate-955/35 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 mb-2">
                🔒 Struggle logs, streaks, and check-ins reside strictly under client-side isolation for safety. Only basic profile directories are accessible.
              </div>

              {activeMembers
                .filter((member) => 
                  member.name.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
                  (member.username && member.username.toLowerCase().includes(usersSearchQuery.toLowerCase())) ||
                  member.assignedMentor.toLowerCase().includes(usersSearchQuery.toLowerCase())
                )
                .map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/30 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-emerald-500/20">
                        {member.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{member.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                          @{member.username || member.name.toLowerCase().replace(' ', '_')} • Guide: {member.assignedMentor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-900 dark:text-white block leading-none">
                        {member.streakDays} Days
                      </span>
                      <span className={cn(
                        "text-[8px] font-black mt-1 uppercase tracking-wider block",
                        member.status === 'NEEDS_ATTENTION' ? "text-rose-600" : "text-emerald-600"
                      )}>
                        {member.status === 'NEEDS_ATTENTION' ? 'Needs Care' : 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 flex justify-end shrink-0">
              <button 
                onClick={() => { setIsUsersModalOpen(false); setUsersSearchQuery(''); }}
                className="px-4 py-2 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-355 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentors Directory Modal */}
      {isMentorsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-fade-in text-left">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Verified Mentors Directory</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Active Guides ({mentorCapacities.length})
                </p>
              </div>
              <button 
                onClick={() => { setIsMentorsModalOpen(false); setMentorsSearchQuery(''); }}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-955 flex items-center justify-center text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors border border-slate-250/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search filter */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-955/20 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <input
                type="text"
                placeholder="Search mentors by name..."
                value={mentorsSearchQuery}
                onChange={(e) => setMentorsSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {mentorCapacities.length === 0 ? (
                <p className="text-[10px] text-slate-450 italic text-center py-6 font-medium">No verified mentors active yet.</p>
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
                      <div key={mentor.id} className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/30 dark:bg-slate-955/20 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{mentor.name}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-wider leading-relaxed">
                              {specs}
                            </p>
                          </div>
                          <Badge variant="emerald" className="text-[8px] font-black uppercase tracking-wider shrink-0">Active</Badge>
                        </div>

                        {/* Copyable invite code block */}
                        <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-900/60">
                          <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Connection Code</span>
                            <span className="text-[11px] font-mono font-bold text-slate-805 dark:text-slate-200 mt-1 block select-all">{invite}</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(invite);
                              triggerToast(`Copied invite code for ${mentor.name}`);
                            }}
                            disabled={invite === 'N/A'}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 dark:border-slate-800 text-slate-400 dark:text-slate-350 cursor-pointer transition-colors"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 flex justify-end shrink-0">
              <button 
                onClick={() => { setIsMentorsModalOpen(false); setMentorsSearchQuery(''); }}
                className="px-4 py-2 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
