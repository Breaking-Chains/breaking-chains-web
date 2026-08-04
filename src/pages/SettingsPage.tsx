import React, { useState, useEffect } from 'react';
import { User, RefreshCw, LogOut, Award, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { getMyMentorProfile } from '../services/mentorService';
import type { MentorProfile } from '../types/mentor';

export const SettingsPage: React.FC = () => {
  const { user, isDemoSession, logout } = useAuth();
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<MentorProfile | null>(null);
  const loadProfiles = async () => {
    try {
      const profile = await getMyMentorProfile();
      setMyProfile(profile);
    } catch (err: unknown) {
      console.warn('Failed to load profile settings:', err);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
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
            {user?.role === 'USER' && (
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setIsMentorModalOpen(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                {myProfile ? 'View / Manage Mentor Registration' : 'Register as Spiritual Mentor'}
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Sync progress with cloud
            </Button>
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>

      <BecomeMentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
        onSuccess={loadProfiles}
      />
    </div>
  );
};
