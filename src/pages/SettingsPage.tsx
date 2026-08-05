import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Copy, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { getMyMentorProfile } from '../services/mentorService';
import type { MentorProfile } from '../types/mentor';

export const SettingsPage: React.FC = () => {
  const { user, isDemoSession, logout } = useAuth();
  const role = user?.role || 'USER';

  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);

  useEffect(() => {
    if (role === 'MENTOR' && !isDemoSession) {
      getMyMentorProfile()
        .then((profile) => setMentorProfile(profile))
        .catch(() => {});
    }
  }, [role, isDemoSession]);

  const handleCopyInviteCode = () => {
    const code = isDemoSession ? 'MENTOR123' : (mentorProfile?.inviteCode || 'MENTOR-BC-7890');
    navigator.clipboard.writeText(code);
    setInviteCodeCopied(true);
    setTimeout(() => setInviteCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card variant="dark" className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Account Profile
            </h3>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <p><strong>Logged in as:</strong> {user?.fullName || 'Guest'}</p>
            <p><strong>Email:</strong> {user?.email || 'guest@example.com'}</p>
            <p><strong>Account Status:</strong> {isDemoSession ? 'Offline Demo Session' : 'Active Account Session'}</p>
            <p className="flex items-center gap-2">
              <strong>User Role:</strong>
              {role === 'ADMIN' ? (
                <Badge variant="rose">ADMINISTRATOR</Badge>
              ) : role === 'MENTOR' ? (
                <Badge variant="emerald">VERIFIED MENTOR</Badge>
              ) : (
                <Badge variant="slate">RECOVERER (USER)</Badge>
              )}
            </p>

            {role === 'MENTOR' && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                <span className="text-[10px] text-slate-700 dark:text-slate-500 block uppercase font-bold tracking-wider">My Shareable Invite Code:</span>
                <div className="flex items-center gap-2.5">
                  <code className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/20 block w-fit">
                    {isDemoSession ? 'MENTOR123' : (mentorProfile?.inviteCode || 'MENTOR-BC-7890')}
                  </code>
                  <button
                    onClick={handleCopyInviteCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-655 hover:text-slate-905 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer shadow-xs"
                  >
                    {inviteCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{inviteCodeCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2 pt-2">
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
