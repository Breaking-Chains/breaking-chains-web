import React, { useState, useEffect } from 'react';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Award, Users, Clock, Link as LinkIcon, Sparkles } from 'lucide-react';
import { getVerifiedMentors, getMyMentorProfile } from '../services/mentorService';
import { formatApiErrorMessage } from '../services/apiClient';
import type { MentorProfile } from '../types/mentor';
import type { MentorshipChatMessage } from '../types/partner';

interface GuidancePageProps {
  onOpenMenteesPage?: () => void;
}

export const GuidancePage: React.FC<GuidancePageProps> = ({ onOpenMenteesPage }) => {
  const [verifiedMentors, setVerifiedMentors] = useState<MentorProfile[]>([]);
  const [myProfile, setMyProfile] = useState<MentorProfile | null>(null);
  const [isBecomeMentorOpen, setIsBecomeMentorOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [connectSuccessMsg, setConnectSuccessMsg] = useState<string | null>(null);

  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<MentorshipChatMessage[]>([
    {
      id: 'msg-1',
      partnershipId: 'p-1',
      senderId: 'mentor-1',
      senderFullName: 'Shaykh Ahmad',
      senderUsername: 'shaykh_ahmad',
      messageContent: 'Assalamu alaikum! Remember to guard your gaze and keep up your daily Muhasabah check-ins.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const loadMentors = async () => {
    setIsLoadingMentors(true);
    setErrorMsg(null);
    try {
      const [mentors, profile] = await Promise.all([
        getVerifiedMentors(),
        getMyMentorProfile().catch(() => null),
      ]);
      setVerifiedMentors(Array.isArray(mentors) ? mentors : []);
      setMyProfile(profile);
    } catch (err: unknown) {
      setVerifiedMentors([]);
      setErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsLoadingMentors(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const mentorList = Array.isArray(verifiedMentors) ? verifiedMentors : [];
  const isApprovedMentor = myProfile?.status === 'APPROVED' || myProfile?.isVerified === true;
  const isPendingMentor = myProfile?.status === 'PENDING';

  const handleOpenMentees = () => {
    if (onOpenMenteesPage) {
      onOpenMenteesPage();
    }
  };

  const handleConnectMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    setConnectSuccessMsg(`Successfully connected to mentor with code ${inviteCodeInput.trim()}!`);
    setInviteCodeInput('');
    setTimeout(() => {
      setConnectSuccessMsg(null);
      setIsConnectModalOpen(false);
    }, 2000);
  };

  const handleSendMessage = (text: string) => {
    const newMsg: MentorshipChatMessage = {
      id: `msg-${Date.now()}`,
      partnershipId: 'p-1',
      senderId: 'me',
      senderFullName: myProfile?.fullName || 'You',
      senderUsername: myProfile?.username || 'user',
      messageContent: text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Verified Mentor Directory Section */}
      <Card variant="glass" className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold select-none">✵</span>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Community Mentors
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Spiritual Guides & Recovery Coaches</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {!isApprovedMentor && (
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 cursor-pointer rounded-xl font-medium"
              >
                <LinkIcon className="w-3.5 h-3.5" /> Connect via Code
              </Button>
            )}

            {isApprovedMentor ? (
              <Button
                variant="emerald"
                size="sm"
                onClick={handleOpenMentees}
                className="flex items-center gap-1.5 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/5 dark:shadow-emerald-950/20"
              >
                <Users className="w-4 h-4" /> View My Mentees
              </Button>
            ) : isPendingMentor ? (
              <Badge variant="amber" className="flex items-center gap-1 py-1 px-2.5 text-xs font-semibold rounded-xl">
                <Clock className="w-3.5 h-3.5" /> Review Pending
              </Badge>
            ) : (
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setIsBecomeMentorOpen(true)}
                className="flex items-center gap-1.5 text-xs rounded-xl font-medium"
              >
                <Award className="w-4 h-4" /> Become a Mentor
              </Button>
            )}
          </div>
        </div>

        {isLoadingMentors ? (
          <div className="text-center py-4 text-xs text-slate-500">Loading verified mentors...</div>
        ) : mentorList.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 text-center space-y-2">
            <Users className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isApprovedMentor
                ? 'You are a verified mentor! No other mentors registered yet.'
                : 'No verified mentors listed yet.'}
            </p>
            {isApprovedMentor ? (
              <Button
                variant="emerald"
                size="sm"
                onClick={handleOpenMentees}
              >
                View My Mentees Roster Page
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBecomeMentorOpen(true)}
              >
                Be the first to register as a mentor!
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {mentorList.map((mentor) => (
              <div
                key={mentor.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 space-y-2 text-xs shadow-xs hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 dark:text-slate-100 text-xs font-black">{mentor.fullName}</strong>
                    <span className="text-[8px] tracking-wider font-semibold py-0.5 px-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                      VERIFIED
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 dark:text-slate-450 font-mono font-medium">{mentor.yearsOfExperience} yrs exp</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">{mentor.specialization}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{mentor.qualification} {mentor.organization ? `(${mentor.organization})` : ''}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic font-serif leading-relaxed border-t border-slate-50 dark:border-slate-800/40 pt-1.5 line-clamp-2">"{mentor.bio}"</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Mentorship Chat & Counsel Notes */}
      <MentorshipChat
        partnerName={isApprovedMentor ? 'Recoveree Student Roster' : 'Shaykh Ahmad (Spiritual Mentor)'}
        inviteCode="MENTOR-BC-7890"
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />

      <BecomeMentorModal
        isOpen={isBecomeMentorOpen}
        onClose={() => setIsBecomeMentorOpen(false)}
        onSuccess={loadMentors}
      />

      {/* Connect to Mentor Modal */}
      <Modal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} title="Connect with a Mentor">
        <form onSubmit={handleConnectMentor} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Enter the unique <strong>Invite Code</strong> provided by your assigned spiritual mentor or recovery coach.
          </p>

          {connectSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-55/60 dark:bg-emerald-950/80 border border-emerald-250 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {connectSuccessMsg}
            </div>
          )}

          <Input
            label="Mentor Invite Code"
            placeholder="e.g. MENTOR-BC-7890"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
            required
          />

          <Button type="submit" variant="emerald" size="lg" className="w-full text-xs">
            Connect & Start Guidance
          </Button>
        </form>
      </Modal>
    </div>
  );
};
