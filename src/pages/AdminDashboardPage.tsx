import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Bell, 
  ShieldAlert, 
  Award, 
  Search, 
  Filter, 
  MoreVertical 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllMentorApplications } from '../services/mentorService';
import { cn } from '../utils/cn';

interface Application {
  id: string;
  fullName: string;
  username: string;
  qualification: string;
  experience: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface FlaggedMessage {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  flagReason: string;
  resolved: boolean;
}

interface ActiveMember {
  id: string;
  name: string;
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
  color: 'primary' | 'error' | 'secondary';
}

export const AdminDashboardPage: React.FC = () => {
  const { isDemoSession } = useAuth();
  
  // Roster states
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const [mentorCapacities, setMentorCapacities] = useState<MentorCapacity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auditing states
  const [applications, setApplications] = useState<Application[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoSession) {
      // Mock bento roster data
      setActiveMembers([
        { id: 'mem-1', name: 'John Doe', initials: 'JD', streakDays: 45, status: 'ACTIVE', assignedMentor: 'Sarah Connor' },
        { id: 'mem-2', name: 'Alice Smith', initials: 'AS', streakDays: 0, status: 'NEEDS_ATTENTION', assignedMentor: 'Unassigned' },
        { id: 'mem-3', name: 'Michael Ross', initials: 'MR', streakDays: 120, status: 'ACTIVE', assignedMentor: 'David Palmer' }
      ]);
      setMentorCapacities([
        { id: 'cap-1', name: 'Sarah Connor', current: 4, capacity: 5, color: 'primary' },
        { id: 'cap-2', name: 'David Palmer', current: 5, capacity: 5, color: 'error' },
        { id: 'cap-3', name: 'Elena Rodriguez', current: 1, capacity: 5, color: 'secondary' }
      ]);
      setApplications([
        { id: 'app-1', fullName: 'Shaykh Luqman', username: 'luqman_h', qualification: 'MA Islamic Counseling', experience: 8, status: 'PENDING' },
        { id: 'app-2', fullName: 'Dr. Tariq Mahmood', username: 'tariq_m', qualification: 'PhD Clinical Psychology', experience: 15, status: 'PENDING' },
      ]);
      setFlaggedMessages([
        { id: 'flag-1', sender: '@user_3', receiver: '@mentor_1', message: 'I shared my private phone number here to connect directly...', flagReason: 'External Link / Direct Contact Sharing Policy', resolved: false },
        { id: 'flag-2', sender: '@user_7', receiver: '@mentor_4', message: 'Check out this website link for reboot resources...', flagReason: 'Link sharing policy trigger', resolved: false },
      ]);
      setAnnouncements([
        { id: 'a-1', title: 'Prepare for Ramadan Tazkiyah Program', date: 'August 1' },
        { id: 'a-2', title: 'Daily Check-in Streaks System Update', date: 'July 28' },
      ]);
    } else {
      const loadRealData = async () => {
        try {
          const apps = await getAllMentorApplications().catch(() => []);
          const mappedApps = apps.map((app) => ({
            id: app.id,
            fullName: app.fullName,
            username: app.username,
            qualification: app.qualification,
            experience: app.yearsOfExperience,
            status: app.status,
          }));
          setApplications(mappedApps);
        } catch {
          // Ignore
        }
      };
      loadRealData();
    }
  }, [isDemoSession]);

  const handleApprove = (appId: string, name: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'APPROVED' } : app))
    );
    triggerToast(`Approved verification for ${name}`);
  };

  const handleReject = (appId: string, name: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'REJECTED' } : app))
    );
    triggerToast(`Rejected application for ${name}`);
  };

  const handleResolveFlag = (flagId: string) => {
    setFlaggedMessages((prev) =>
      prev.map((msg) => (msg.id === flagId ? { ...msg, resolved: true } : msg))
    );
    triggerToast('Compliance flag resolved.');
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter members list
  const filteredMembers = activeMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.assignedMentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
          <ShieldCheck className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header & Global Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Admin Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage users, mentors, and program assignments.
          </p>
        </div>

        {/* Global Search Header Panel */}
        <div className="flex items-center w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className="w-full bg-white dark:bg-slate-950 border border-outline-variant rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center p-2 bg-white dark:bg-slate-950 border border-outline-variant rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* primary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (col-span-2): Active Members list */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col h-[380px]">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Active Members
              </h3>
              <button 
                onClick={() => triggerToast('Viewing all active members list')} 
                className="text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 italic">
                  No active members found matching search query.
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary font-bold text-xs border border-slate-200/50 dark:border-slate-800 shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 select-none">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            member.status === 'NEEDS_ATTENTION' ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                          )} />
                          <span>{member.status === 'NEEDS_ATTENTION' ? 'Needs Attention' : `Day ${member.streakDays}`}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">Assigned Mentor</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{member.assignedMentor}</p>
                      </div>
                      <button 
                        className="text-slate-400 hover:text-slate-850 dark:hover:text-white transition-colors cursor-pointer"
                        title="Member Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (col-span-1): Stats & Capacity Cards */}
        <div className="space-y-6">
          
          {/* Mentor Capacity Card */}
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-outline-variant p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 select-none">
              Mentor Capacity
            </h3>
            
            <div className="space-y-4">
              {mentorCapacities.map((mentor) => (
                <div key={mentor.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{mentor.name}</p>
                    <p className="font-mono text-slate-500 font-medium">{mentor.current}/{mentor.capacity} Mentees</p>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        mentor.color === 'error' ? "bg-rose-500" : mentor.color === 'secondary' ? "bg-emerald-500" : "bg-primary"
                      )} 
                      style={{ width: `${Math.round((mentor.current / mentor.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scrollToSection('verification-section')}
              className="w-full mt-5 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center block"
            >
              Manage Mentors
            </button>
          </div>

          {/* System Status Card */}
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-outline-variant p-5 shadow-sm relative overflow-hidden">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
              <svg height="100%" width="100%">
                <defs>
                  <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-primary" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider select-none">
                System Status
              </h3>
              
              <div className="flex items-center gap-2 mb-2 bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider">All services operational</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="bg-slate-50/30 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <p className="text-xl font-black text-primary leading-none mb-1 font-mono">128</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none">Total Active</p>
                </div>
                <div className="bg-slate-50/30 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <p className="text-xl font-black text-primary leading-none mb-1 font-mono">12</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none">New Today</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Compliance & Operations Control (Queues) */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-8 space-y-8">
        
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Compliance &amp; Operations Control
          </h3>
        </div>

        <div id="verification-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mentor Verification Approvals Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider flex items-center gap-1.5 select-none pl-1">
              <Award className="w-4 h-4 text-primary" /> 
              <span>Pending Mentor Verifications</span>
            </h3>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <Card variant="glass" className="p-8 text-center bg-slate-50/10 border-slate-150 dark:border-slate-850 rounded-xl">
                  <p className="text-xs text-slate-500 italic">No pending mentor applications.</p>
                </Card>
              ) : (
                applications.map((app) => (
                  <Card key={app.id} variant="glass" className="p-4 space-y-3 border-slate-150 dark:border-slate-850/80 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 text-xs font-black">{app.fullName}</strong>
                        <span className="text-[10px] text-slate-500 block font-mono">@{app.username}</span>
                      </div>
                      
                      {app.status !== 'PENDING' ? (
                        <span className={cn(
                          "inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                          app.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-250" : "bg-rose-50 text-rose-700 border-rose-250"
                        )}>
                          {app.status}
                        </span>
                      ) : (
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleApprove(app.id, app.fullName)}
                            className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReject(app.id, app.fullName)}
                            className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 cursor-pointer"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-700 dark:text-slate-400 leading-relaxed font-semibold border-t border-slate-100/50 dark:border-slate-900/40 pt-2">
                      <p><strong>Credentials:</strong> {app.qualification} ({app.experience} yrs experience)</p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Announcements Manager Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider flex items-center gap-1.5 select-none pl-1">
              <Bell className="w-4 h-4 text-primary" /> 
              <span>Content &amp; Announcements</span>
            </h3>

            <Card variant="glass" className="p-4 space-y-4">
              <form onSubmit={handleAddAnnouncement} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Broadcast a new platform announcement..."
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100 font-semibold"
                  required
                />
                <Button type="submit" variant="emerald" size="sm" className="text-xs font-bold px-3">
                  Publish
                </Button>
              </form>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/20">
                    No announcements published yet.
                  </p>
                ) : (
                  announcements.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 flex items-center justify-between gap-3 text-[11px] font-semibold text-slate-750 dark:text-slate-350"
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="text-[9px] text-slate-400 font-mono shrink-0">{item.date}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

        </div>

        {/* Flagged Message Auditing Card */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider flex items-center gap-1.5 select-none pl-1">
            <ShieldAlert className="w-4 h-4 text-primary" /> 
            <span>Privacy-Preserved Flagged Conversations</span>
          </h3>

          <div className="space-y-3">
            {flaggedMessages.length === 0 ? (
              <Card variant="glass" className="p-8 text-center bg-slate-50/10 border-slate-150 dark:border-slate-850 rounded-xl">
                <p className="text-xs text-slate-500 italic">No compliance flags triggered.</p>
              </Card>
            ) : (
              flaggedMessages.map((msg) => (
                <Card key={msg.id} variant="dark" className="p-4 space-y-3 border-slate-150 dark:border-slate-850 shadow-xs relative">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850/60 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="rose" className="text-[9px] font-bold">FLAGGED</Badge>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-400">{msg.sender} ➔ {msg.receiver}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-rose-700 dark:text-rose-450 font-bold italic">{msg.flagReason}</span>
                      {msg.resolved ? (
                        <Badge variant="emerald">RESOLVED</Badge>
                      ) : (
                        <button
                          onClick={() => handleResolveFlag(msg.id)}
                          className="text-[10px] text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 font-bold underline cursor-pointer"
                        >
                          Dismiss / Resolve
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-serif italic text-slate-800 dark:text-slate-300 pl-4 border-l-2 border-rose-500/40 leading-relaxed">
                    "{msg.message}"
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
