import React from 'react';
import { Shield, EyeOff, Lock, User, RefreshCw, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, isDemoSession, logout } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5 space-y-4 border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Privacy & Stealth Settings (Satr)
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
          </div>
          <div className="space-y-2 pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Sync Local Chain with Backend
            </Button>
            <Button variant="danger" size="sm" onClick={logout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Revoke Token & Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
