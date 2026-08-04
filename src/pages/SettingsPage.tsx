import React from 'react';
import { User as UserIcon, RefreshCw, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, isDemoSession, logout } = useAuth();
  const role = user?.role || 'USER';

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
          </div>
          <div className="space-y-2 pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Sync progress with cloud
            </Button>
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
