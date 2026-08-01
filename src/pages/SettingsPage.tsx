import React from 'react';
import { Shield, EyeOff, Lock, User, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Card variant="glass" className="p-4 space-y-3 border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Privacy & Stealth Settings (Satr)
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Mask Tab Title</h4>
                <p className="text-[10px] text-slate-400">Shows "Calculator & Notes" in browser tab</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Biometric / PIN Lock</h4>
                <p className="text-[10px] text-slate-400">Locks screen when switching browser tabs</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
          </div>
        </div>
      </Card>

      <Card variant="dark" className="p-4 space-y-3 border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Account Profile</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <p><strong>Username:</strong> alexsmith</p>
          <p><strong>Email:</strong> alex.smith@example.com</p>
          <p><strong>Backend API:</strong> Spring Boot 3 (`http://localhost:8080`)</p>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Local Chain with Backend
        </Button>
      </Card>
    </div>
  );
};
