import React, { useState, useEffect } from 'react';
import { Shield, EyeOff, Lock, User, RefreshCw, LogOut, Award, CheckCircle, Clock } from 'lucide-react';
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
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5 space-y-4 border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Privacy & Stealth Settings
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Mask Tab Title</h4>
                  <p className="text-[10px] text-slate-400">Shows "Calculator & Notes" in browser tab</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Biometric / PIN Lock</h4>
                  <p className="text-[10px] text-slate-400">Locks screen when switching browser tabs</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
            </div>
          </div>
        </Card>

        <Card variant="dark" className="p-5 space-y-4 border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Controlled Access Profile
            </h3>
          </div>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p><strong>Authenticated User:</strong> {user?.fullName || 'Guest Recoverer'}</p>
            <p><strong>Email:</strong> {user?.email || 'guest@example.com'}</p>
            <p><strong>Session Mode:</strong> {isDemoSession ? 'Offline Demo Session' : 'JWT Authenticated (Spring Boot)'}</p>
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
                <span className="text-slate-400">Standard User</span>
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
              <RefreshCw className="w-4 h-4 mr-2" /> Sync Local Chain with Backend
            </Button>
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Revoke Token & Sign Out
            </Button>
          </div>
        </Card>
      </div>

      {/* Admin / Dev Review Panel */}
      <Card variant="glass" className="p-5 space-y-4 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
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
              <p className="text-xs text-slate-400 italic">No mentor applications registered yet.</p>
            ) : (
              allApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-100 text-sm">{app.fullName}</strong>
                      <span className="text-slate-500">(@{app.username})</span>
                      {app.status === 'APPROVED' && <Badge variant="emerald">APPROVED</Badge>}
                      {app.status === 'PENDING' && <Badge variant="amber">PENDING</Badge>}
                      {app.status === 'REJECTED' && <Badge variant="rose">REJECTED</Badge>}
                    </div>
                    <p className="text-slate-300">
                      <strong>Qualification:</strong> {app.qualification} ({app.yearsOfExperience} yrs exp)
                    </p>
                    <p className="text-slate-400">
                      <strong>Specialization:</strong> {app.specialization} {app.organization ? `| ${app.organization}` : ''}
                    </p>
                    <p className="text-slate-400 italic">"{app.bio}"</p>
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
