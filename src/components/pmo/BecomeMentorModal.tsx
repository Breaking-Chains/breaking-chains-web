import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Award, CheckCircle, Clock, XCircle, Sparkles } from 'lucide-react';
import { registerMentor, getMyMentorProfile } from '../../services/mentorService';
import { formatApiErrorMessage } from '../../services/apiClient';
import type { MentorProfile } from '../../types/mentor';

interface BecomeMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BecomeMentorModal: React.FC<BecomeMentorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [existingProfile, setExistingProfile] = useState<MentorProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Spiritual Counsel (Tazkiyah)');
  const [yearsOfExperience, setYearsOfExperience] = useState(2);
  const [organization, setOrganization] = useState('');
  const [bio, setBio] = useState('');
  const [autoApprove, setAutoApprove] = useState(true); // Default to true for dev testing convenience

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingProfile(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      getMyMentorProfile()
        .then((profile) => {
          setExistingProfile(profile);
        })
        .finally(() => setIsLoadingProfile(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualification.trim() || !bio.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await registerMentor({
        qualification: qualification.trim(),
        specialization: specialization.trim(),
        yearsOfExperience: Number(yearsOfExperience),
        organization: organization.trim() || undefined,
        bio: bio.trim(),
        autoApprove,
      });

      setExistingProfile(response);
      setSuccessMsg(
        response.status === 'APPROVED'
          ? 'Congratulations! Your mentor status has been verified & approved!'
          : 'Application submitted successfully! Awaiting administrator approval.'
      );
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setErrorMsg(formatApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Become a Verified Mentor">
      <div className="space-y-4">
        {isLoadingProfile ? (
          <div className="flex items-center justify-center p-8 space-x-2 text-slate-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading profile...</span>
          </div>
        ) : existingProfile ? (
          <Card variant="glass" className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Application Status</h4>
              </div>
              {existingProfile.status === 'APPROVED' && (
                <Badge variant="emerald" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> VERIFIED MENTOR
                </Badge>
              )}
              {existingProfile.status === 'PENDING' && (
                <Badge variant="amber" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> PENDING REVIEW
                </Badge>
              )}
              {existingProfile.status === 'REJECTED' && (
                <Badge variant="rose" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> REJECTED
                </Badge>
              )}
            </div>

            <div className="text-xs space-y-1.5 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 leading-relaxed font-semibold">
              <p><span className="text-slate-700 dark:text-slate-400 font-semibold">Qualification:</span> <strong className="text-slate-900 dark:text-slate-100 font-black">{existingProfile.qualification}</strong></p>
              <p><span className="text-slate-700 dark:text-slate-400 font-semibold">Specialization:</span> <strong className="text-slate-900 dark:text-slate-100 font-black">{existingProfile.specialization}</strong></p>
              <p><span className="text-slate-700 dark:text-slate-400 font-semibold">Experience:</span> <strong className="text-slate-900 dark:text-slate-100 font-black">{existingProfile.yearsOfExperience} years</strong></p>
              {existingProfile.organization && (
                <p><span className="text-slate-700 dark:text-slate-400 font-semibold">Organization:</span> <strong className="text-slate-900 dark:text-slate-100 font-black">{existingProfile.organization}</strong></p>
              )}
              <p className="pt-1 text-slate-800 dark:text-slate-300 italic">"{existingProfile.bio}"</p>
            </div>

            {existingProfile.status === 'APPROVED' && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-950 dark:text-emerald-300 flex items-start gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>You are verified to leave Counsel Notes (*Nasiha*) and mentor struggling recoverers across the platform.</span>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={onClose} className="w-full">
              Close Window
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-950 dark:text-emerald-300 font-medium">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Register as a verified Spiritual Counselor or Recovery Mentor to support recoverers on their Tazkiyah journey.</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-55/60 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                {successMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Qualification / Background *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alimiyyah Degree, Certified Recovery Coach, Islamic Studies Scholar"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Specialization *</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Spiritual Counsel (Tazkiyah)">Spiritual Counsel (Tazkiyah & Heart Purity)</option>
                <option value="PMO Recovery Coaching">PMO & Addiction Recovery Coaching</option>
                <option value="Psychological & Mindset Support">Psychological & Mindset Support</option>
                <option value="General Discipline & Youth Mentorship">General Discipline & Youth Mentorship</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Organization (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Local Masjid, Youth Center"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio / Statement of Purpose *</label>
              <textarea
                rows={3}
                required
                placeholder="Briefly state your experience and how you plan to guide recoverers with sincere Nasiha..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none animate-none"
              />
            </div>

            {/* Dev Mode Toggle */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Skip Approval (Testing Mode)
                </span>
                <p className="text-[10px] text-amber-900/80 dark:text-amber-400/80">
                  Instantly approves your application for testing purposes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose} className="w-1/3">
                Cancel
              </Button>
              <Button variant="emerald" type="submit" isLoading={isSubmitting} className="w-2/3">
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
