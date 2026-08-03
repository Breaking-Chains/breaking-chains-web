import React, { useState, useEffect } from 'react';
import { User, RefreshCw, LogOut, Award, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { getMyMentorProfile, getAllMentorApplications, updateMentorStatus } from '../services/mentorService';
import { formatApiErrorMessage } from '../services/apiClient';
import type { MentorProfile } from '../types/mentor';

export const SettingsPage: React.FC = () => {
  const { user, isDemoSession, logout } = useAuth();
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<MentorProfile | null>(null);
  const [allApplications, setAllApplications] = useState<MentorProfile[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProfiles = async () => {
    try {
      const profile = await getMyMentorProfile();
      setMyProfile(profile);
      if (showAdminPanel) {
        const apps = await getAllMentorApplications();
        setAllApplications(apps);
      }
    } catch (err: unknown) {
      console.warn('Failed to load profile settings:', err);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [showAdminPanel]);

  const handleStatusChange = async (profileId: string, status: 'APPROVED' | 'REJECTED') => {
    setErrorMsg(null);
    try {
      await updateMentorStatus(profileId, { status });
      await loadProfiles();
    } catch (err: unknown) {
      setErrorMsg(formatApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-250 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-6">
        <Card variant="dark" className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Account Profile
            </h3>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <p><strong>Logged in as:</strong> {user?.fullName || 'Guest Recoverer'}</p>
            <p><strong>Email:</strong> {user?.email || 'guest@example.com'}</p>
            <p><strong>Account Status:</strong> {isDemoSession ? 'Offline Demo Session' : 'Active Account Session'}</p>
            <p className="flex items-center gap-2">
              <strong>Mentor Role:</strong>
              {myProfile?.status === 'APPROVED' ? (
                <Badge variant="emerald" className="inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> VERIFIED MENTOR
                </Badge>
              ) : myProfile?.status === 'PENDING' ? (
                <Badge variant="amber" className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> PENDING REVIEW
                </Badge>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Standard User</span>
              )}
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsMentorModalOpen(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              {myProfile ? 'View / Manage Mentor Registration' : 'Register as Spiritual Mentor'}
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Sync progress with cloud
            </Button>
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>

      {/* Admin / Dev Review Panel */}
      <Card variant="glass" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Admin & Dev Control: Mentor Applications
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            {showAdminPanel ? 'Hide Applications' : 'Load All Applications'}
          </Button>
        </div>

        {showAdminPanel && (
          <div className="space-y-3 pt-2">
            {allApplications.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">No mentor applications registered yet.</p>
            ) : (
              allApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-slate-100 text-sm">{app.fullName}</strong>
                      <span className="text-slate-550 dark:text-slate-500">(@{app.username})</span>
                      {app.status === 'APPROVED' && <Badge variant="emerald">APPROVED</Badge>}
                      {app.status === 'PENDING' && <Badge variant="amber">PENDING</Badge>}
                      {app.status === 'REJECTED' && <Badge variant="rose">REJECTED</Badge>}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Qualification:</strong> {app.qualification} ({app.yearsOfExperience} yrs exp)
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Specialization:</strong> {app.specialization} {app.organization ? `| ${app.organization}` : ''}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{app.bio}"</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {app.status !== 'APPROVED' && (
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleStatusChange(app.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                    )}
                    {app.status !== 'REJECTED' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      <BecomeMentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
        onSuccess={loadProfiles}
      />
    </div>
  );
};
