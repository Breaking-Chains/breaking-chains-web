import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Check, X, Bell, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllMentorApplications } from '../services/mentorService';

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

export const AdminDashboardPage: React.FC = () => {
  const { isDemoSession } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  useEffect(() => {
    if (isDemoSession) {
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
      const loadRealApplications = async () => {
        try {
          const apps = await getAllMentorApplications();
          const mapped = apps.map((app) => ({
            id: app.id,
            fullName: app.fullName,
            username: app.username,
            qualification: app.qualification,
            experience: app.yearsOfExperience,
            status: app.status,
          }));
          setApplications(mapped);
        } catch {
          // Ignore
        }
      };
      loadRealApplications();
    }
  }, [isDemoSession]);

  const handleApprove = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'APPROVED' } : app))
    );
  };

  const handleReject = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'REJECTED' } : app))
    );
  };

  const handleResolveFlag = (flagId: string) => {
    setFlaggedMessages((prev) =>
      prev.map((msg) => (msg.id === flagId ? { ...msg, resolved: true } : msg))
    );
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    setAnnouncements((prev) => [
      { id: `a-${Date.now()}`, title: newAnnouncementText.trim(), date: 'Just now' },
      ...prev,
    ]);
    setNewAnnouncementText('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Admin Panel Summary Card */}
      <Card variant="emerald" className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Breaking Chains Control Center
            </h2>
            <p className="text-[10px] text-slate-700 dark:text-emerald-250 font-medium">System settings, mentor audits & compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Total Platform Users</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">1,842</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Verified Mentor Count</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">42 Guides</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-center shadow-xs flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase tracking-wider font-bold">Weekly Check-in Engagement</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">94.8%</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentor Applications Approvals */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Pending Mentor Verifications
          </h3>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <Card variant="glass" className="p-6 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium italic">No pending applications.</p>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} variant="glass" className="p-4 space-y-3 border-slate-150 dark:border-slate-850/80 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 text-xs font-black">{app.fullName}</strong>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 block font-mono font-semibold">@{app.username}</span>
                    </div>
                    {app.status !== 'PENDING' ? (
                      <Badge variant={app.status === 'APPROVED' ? 'emerald' : 'rose'}>
                        {app.status}
                      </Badge>
                    ) : (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                          title="Approve Mentor"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-455 cursor-pointer"
                          title="Reject Application"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-400 leading-relaxed font-semibold">
                    <p><strong>Credentials:</strong> {app.qualification} ({app.experience} yrs experience)</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* System Announcements Content Manager */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Content & Announcements Manager
          </h3>

          <Card variant="glass" className="p-4 space-y-4">
            <form onSubmit={handleAddAnnouncement} className="flex gap-2">
              <input
                type="text"
                placeholder="Broadcast a new platform announcement..."
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100 shadow-xs"
              />
              <Button type="submit" variant="emerald" size="sm" className="text-xs font-bold px-3">
                Publish
              </Button>
            </form>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium italic text-center py-2">No announcements published.</p>
              ) : (
                announcements.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 flex items-center justify-between gap-3 text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                    <span className="truncate">{item.title}</span>
                    <span className="text-[9px] text-slate-500 font-mono italic shrink-0">{item.date}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Compliance / Flagged messages auditing */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-455" /> Privacy-Preserved Flagged Conversations
        </h3>

        <div className="space-y-3">
          {flaggedMessages.length === 0 ? (
            <Card variant="glass" className="p-6 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium italic">No compliance flags triggered.</p>
            </Card>
          ) : (
            flaggedMessages.map((msg) => (
              <Card key={msg.id} variant="dark" className="p-4 space-y-3 border-slate-150 dark:border-slate-800 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="rose" className="text-[9px] font-bold">FLAGGED</Badge>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-400">{msg.sender} ➔ {msg.receiver}</span>
                  </div>
                  <div className="flex items-center gap-2">
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
                <p className="text-xs font-serif italic text-slate-800 dark:text-slate-300 pl-4 border-l-2 border-rose-500/40">
                  "{msg.message}"
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
