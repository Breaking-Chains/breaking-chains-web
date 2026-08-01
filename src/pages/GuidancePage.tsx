import React, { useState, useEffect } from 'react';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { MyMenteesModal } from '../components/pmo/MyMenteesModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Award, Users, Clock } from 'lucide-react';
import { getVerifiedMentors, getMyMentorProfile } from '../services/mentorService';
import { formatApiErrorMessage } from '../services/apiClient';
import type { MentorProfile } from '../types/mentor';

interface GuidancePageProps {
  onOpenMenteesPage?: () => void;
}

export const GuidancePage: React.FC<GuidancePageProps> = ({ onOpenMenteesPage }) => {
  const [verifiedMentors, setVerifiedMentors] = useState<MentorProfile[]>([]);
  const [myProfile, setMyProfile] = useState<MentorProfile | null>(null);
  const [isBecomeMentorOpen, setIsBecomeMentorOpen] = useState(false);
  const [isMenteesModalOpen, setIsMenteesModalOpen] = useState(false);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    } else {
      setIsMenteesModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center animate-fade-in">
          {errorMsg}
        </div>
      )}
      {/* Verified Mentor Directory Section */}
      <Card variant="glass" className="p-4 space-y-3 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Verified Community Mentors</h3>
              <p className="text-[10px] text-slate-400">Islamic Spiritual Guides & Certified Recovery Coaches</p>
            </div>
          </div>

          {isApprovedMentor ? (
            <Button
              variant="emerald"
              size="sm"
              onClick={handleOpenMentees}
              className="flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-emerald-950/50"
            >
              <Users className="w-4 h-4" /> View My Mentees
            </Button>
          ) : isPendingMentor ? (
            <Badge variant="amber" className="flex items-center gap-1 py-1 px-2.5 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" /> Review Pending
            </Badge>
          ) : (
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsBecomeMentorOpen(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <Award className="w-4 h-4" /> Become a Mentor
            </Button>
          )}
        </div>

        {isLoadingMentors ? (
          <div className="text-center py-4 text-xs text-slate-500">Loading verified mentors...</div>
        ) : mentorList.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 text-center space-y-2">
            <Users className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
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
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-100">{mentor.fullName}</strong>
                    <Badge variant="emerald" className="text-[9px] py-0 px-1.5">VERIFIED</Badge>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{mentor.yearsOfExperience} yrs exp</span>
                </div>
                <p className="text-[11px] text-emerald-300 font-semibold">{mentor.specialization}</p>
                <p className="text-[10px] text-slate-400">{mentor.qualification} {mentor.organization ? `(${mentor.organization})` : ''}</p>
                <p className="text-[10px] text-slate-300 italic line-clamp-2">"{mentor.bio}"</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Mentorship Chat & Counsel Notes */}
      <MentorshipChat />

      <BecomeMentorModal
        isOpen={isBecomeMentorOpen}
        onClose={() => setIsBecomeMentorOpen(false)}
        onSuccess={loadMentors}
      />

      <MyMenteesModal
        isOpen={isMenteesModalOpen}
        onClose={() => setIsMenteesModalOpen(false)}
        mentorName={myProfile?.fullName || 'Verified Mentor'}
      />
    </div>
  );
};
