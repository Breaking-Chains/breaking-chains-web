import React from 'react';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Lock, Database, UserCheck, EyeOff, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Privacy Shield Top Header */}
      <Card variant="emerald" className="p-6 text-center space-y-4 relative overflow-hidden">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary dark:text-emerald-450 border border-primary/20 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-manrope text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Verified Privacy Shield
          </h2>
          <p className="font-label-sm text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">
            Your Recovery, Fully Secured
          </p>
        </div>
        <div className="max-w-md mx-auto text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
          The Recovery Path is built on a foundation of absolute privacy and confidentiality. Your personal struggle, check-ins, and data are confidential and protected under strict data isolation standards.
        </div>
      </Card>

      {/* Core Privacy Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pillar 1: Local-First Security */}
        <Card variant="glass" className="p-5 flex gap-3 text-left">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-primary shrink-0 h-10 w-10 flex items-center justify-center border border-outline-variant/40">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Local-First Database
            </h3>
            <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
              Your logs and reflections reside locally on your device. We do not store plain text recovery journals on general cloud databases.
            </p>
          </div>
        </Card>

        {/* Pillar 2: Private Counsel Chat */}
        <Card variant="glass" className="p-5 flex gap-3 text-left">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-primary shrink-0 h-10 w-10 flex items-center justify-center border border-outline-variant/40">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Private Counsel Chat
            </h3>
            <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
              All Direct Counsel chats and Nasiha conversations with your assigned mentor are strictly confidential. No third parties can access or audit your chat.
            </p>
          </div>
        </Card>

        {/* Pillar 3: Zero-Knowledge Analytics */}
        <Card variant="glass" className="p-5 flex gap-3 text-left">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-primary shrink-0 h-10 w-10 flex items-center justify-center border border-outline-variant/40">
            <EyeOff className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Anonymized Barakah Metrics
            </h3>
            <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
              Behavioral analytics and Sadaqah potentials are computed on-device. No telemetry regarding triggers is linked to your public identity.
            </p>
          </div>
        </Card>

        {/* Pillar 4: Professional Boundaries */}
        <Card variant="glass" className="p-5 flex gap-3 text-left">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-primary shrink-0 h-10 w-10 flex items-center justify-center border border-outline-variant/40">
            <UserCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Mentor Opt-in Controls
            </h3>
            <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
              You choose when to request a mentor, and what metrics they are allowed to monitor (such as check-in consistency, without detailed trigger notes).
            </p>
          </div>
        </Card>
      </div>

      {/* System Policy Statement */}
      <Card variant="dark" className="p-5 flex gap-3.5 items-start text-left border border-outline-variant">
        <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-905 dark:text-slate-205 uppercase tracking-widest">
            Privacy Policy & Access Auditing
          </h4>
          <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
            Breaking Chains platform conforms to strict privacy standards for sensitive behavioral data. All storage architectures are designed for secure access isolation. If you terminate a mentorship connection, all shared logs are permanently purged from the mentor's view.
          </p>
        </div>
      </Card>
    </div>
  );
};
