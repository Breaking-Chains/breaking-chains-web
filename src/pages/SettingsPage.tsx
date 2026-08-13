import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Copy, Check, ShieldAlert, KeyRound, Sliders } from 'lucide-react';
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

  // Recoveree: SOS Preference States
  const [sosDuration, setSosDuration] = useState<number>(30); // minutes
  const [autoNotifyMentor, setAutoNotifyMentor] = useState<boolean>(true);
  const [spiritualReminders, setSpiritualReminders] = useState<boolean>(true);

  // Mentor: Specific Preference States
  const [menteeCapacity, setMenteeCapacity] = useState<number>(10);
  const [acceptConnections, setAcceptConnections] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [weeklySummary, setWeeklySummary] = useState<boolean>(true);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    'Assalamu alaikum! Welcome to our counseling session. Feel free to log your reflections.'
  );

  // Cryptographic Security Preference States
  const [biometricLock, setBiometricLock] = useState<boolean>(false);

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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Account Profile Card (1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          <Card variant="glass" className="p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-5 text-center flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider text-left">
                Account Profile
              </h3>
            </div>

            {/* Profile Avatar Block */}
            <div className="relative pt-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 dark:from-emerald-955/40 dark:to-teal-955/40 border border-emerald-500/20 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg shadow-inner select-none animate-fade-in">
                {user?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
            </div>

            {/* Info Table */}
            <div className="w-full text-xs text-left space-y-3.5 pt-2">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-semibold">Logged in as</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{user?.fullName || 'Guest'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-semibold">Email</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{user?.email || 'guest@example.com'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-semibold">Session Status</span>
                <span className="font-bold text-slate-700 dark:text-emerald-400 text-xs">
                  {isDemoSession ? 'Offline Demo' : 'Active Secure'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-semibold">User Role</span>
                {role === 'ADMIN' ? (
                  <Badge variant="rose">ADMIN</Badge>
                ) : role === 'MENTOR' ? (
                  <Badge variant="emerald">VERIFIED MENTOR</Badge>
                ) : (
                  <Badge variant="slate">RECOVERER</Badge>
                )}
              </div>

              {role === 'MENTOR' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                  <span className="text-[9px] text-slate-400 dark:text-slate-505 block uppercase font-black tracking-widest">Shareable Invite Code</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono font-black text-amber-705 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-955/20 px-3 py-2 rounded-xl border border-amber-500/20 block w-full text-center uppercase tracking-wider">
                      {isDemoSession ? 'MENTOR123' : (mentorProfile?.inviteCode || 'MENTOR-BC-7890')}
                    </code>
                    <button
                      onClick={handleCopyInviteCode}
                      className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer shadow-3xs transition-colors shrink-0"
                      title="Copy invite code"
                    >
                      {inviteCodeCopied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Button 
                variant="danger" 
                size="lg" 
                onClick={logout} 
                className="w-full flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-wider py-3 rounded-xl cursor-pointer hover:bg-rose-700 transition-colors shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings Config Panels (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {role === 'MENTOR' ? (
            /* MENTOR Specific Settings Preferences */
            <Card variant="glass" className="p-6 md:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6 text-left">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Mentorship & Capacity Settings
                </h3>
              </div>

              <div className="space-y-6">
                {/* Mentee Capacity Limit Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs font-black text-slate-800 dark:text-slate-100 block">
                        Maximum Mentee Capacity
                      </label>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Set the maximum number of active recoverees you can support.
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                      {menteeCapacity} Mentees
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={menteeCapacity}
                    onChange={(e) => setMenteeCapacity(Number(e.target.value))}
                    className="w-full h-1 bg-slate-205 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                  />
                </div>

                {/* Toggles */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100/60 dark:border-slate-800/40">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150 block">Accept Connection Requests</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                        Enable recoverees to connect with you using your shareable invite code.
                      </span>
                    </div>
                    <button
                      onClick={() => setAcceptConnections(!acceptConnections)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        acceptConnections ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        acceptConnections ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100/60 dark:border-slate-800/40">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150 block">Urgent Distress Notifications</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                        Receive instant notifications when a mentee triggers their SOS panic mode.
                      </span>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        emailAlerts ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        emailAlerts ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150 block">Weekly Progress Summary</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                        Receive weekly email summary reports detailing all active wudu logs and streaks.
                      </span>
                    </div>
                    <button
                      onClick={() => setWeeklySummary(!weeklySummary)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        weeklySummary ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        weeklySummary ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Default welcome message setup */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-2">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-150 block">
                    Welcome Greeting Message
                  </label>
                  <span className="text-[10px] text-slate-455 dark:text-slate-500 block leading-normal font-medium">
                    This message will automatically be sent to new recoverees upon successful connection.
                  </span>
                  <textarea
                    rows={3}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-808 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-505 font-medium transition-all resize-none"
                  />
                </div>
              </div>
            </Card>
          ) : role === 'ADMIN' ? (
            /* ADMIN Specific Security & Policy Panel */
            <Card variant="glass" className="p-6 md:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6 text-left">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  System Security & Policy Logs
                </h3>
              </div>

              <div className="space-y-4 text-xs font-medium text-slate-650 dark:text-slate-400">
                <p className="leading-relaxed">
                  As a platform administrator, you operate under strict privacy compliance rules. Security logs, audit controls, and policy overrides are logged automatically.
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-900/60 space-y-2.5 text-[10px]">
                  <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-900/40">
                    <span>Compliance Checks</span>
                    <Badge variant="emerald">Active</Badge>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-500 leading-relaxed font-bold">
                    <li>Zero-Knowledge Recoveree isolation checks: <span className="font-black text-slate-800 dark:text-slate-200">ENFORCED</span></li>
                    <li>Advisor Onboarding Audit Trail logs: <span className="font-black text-slate-800 dark:text-slate-200">ENABLED</span></li>
                    <li>Announcements override signature checks: <span className="font-black text-slate-800 dark:text-slate-200">ACTIVE</span></li>
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            /* USER Specific Settings Preferences (SOS Circuit Breaker) */
            <Card variant="glass" className="p-6 md:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6 text-left">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  SOS & Urge Circuit Breakers
                </h3>
              </div>

              <div className="space-y-6">
                {/* Reset Sliders */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs font-black text-slate-800 dark:text-slate-105 block">
                        Emergency Resets Timer
                      </label>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Duration of active circuit breaker lockouts when panic mode is triggered.
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                      {sosDuration} Min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={sosDuration}
                    onChange={(e) => setSosDuration(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                  />
                </div>

                {/* Toggle Switches */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100/60 dark:border-slate-800/40">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150 block">Auto-notify Mentor</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                        Automatically alert your active counsel guide if you hit the SOS panic button.
                      </span>
                    </div>
                    <button
                      onClick={() => setAutoNotifyMentor(!autoNotifyMentor)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        autoNotifyMentor ? 'bg-emerald-600 dark:bg-emerald-550' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        autoNotifyMentor ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100/60 dark:border-slate-800/40">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150 block">Spiritual Reminders</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                        Deliver Quranic reflections and wudu reminders when counseling timers run out.
                      </span>
                    </div>
                    <button
                      onClick={() => setSpiritualReminders(!spiritualReminders)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        spiritualReminders ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        spiritualReminders ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Local Security & Biometrics */}
          {role !== 'ADMIN' && (
            <Card variant="glass" className="p-6 md:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Local Security & Biometrics
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-155 block">Biometric Lockscreen</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal font-medium">
                      Prompt local FaceID / Fingerprint lock checks when loading the app page from background suspension.
                    </span>
                  </div>
                  <button
                    onClick={() => setBiometricLock(!biometricLock)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      biometricLock ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                    }`}
                  >
                    <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                      biometricLock ? 'translate-x-4.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};
