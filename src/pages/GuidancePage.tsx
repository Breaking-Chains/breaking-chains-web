import React, { useState, useEffect } from 'react';
import { MentorshipChat } from '../components/pmo/MentorshipChat';
import { BecomeMentorModal } from '../components/pmo/BecomeMentorModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Award, Users } from 'lucide-react';
import { getVerifiedMentors } from '../services/mentorService';
import type { MentorProfile } from '../types/mentor';

export const GuidancePage: React.FC = () => {
  const [verifiedMentors, setVerifiedMentors] = useState<MentorProfile[]>([]);
  const [isBecomeMentorOpen, setIsBecomeMentorOpen] = useState(false);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);

  const loadMentors = () => {
    setIsLoadingMentors(true);
    getVerifiedMentors()
      .then(setVerifiedMentors)
      .catch(() => setVerifiedMentors([]))
      .finally(() => setIsLoadingMentors(false));
  };

  useEffect(() => {
    loadMentors();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
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
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setIsBecomeMentorOpen(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Award className="w-4 h-4" /> Become a Mentor
          </Button>
        </div>

        {isLoadingMentors ? (
          <div className="text-center py-4 text-xs text-slate-500">Loading verified mentors...</div>
        ) : verifiedMentors.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 text-center space-y-2">
            <Users className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No verified mentors listed yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBecomeMentorOpen(true)}
            >
              Be the first to register as a mentor!
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {verifiedMentors.map((mentor) => (
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
    </div>
  );
};
