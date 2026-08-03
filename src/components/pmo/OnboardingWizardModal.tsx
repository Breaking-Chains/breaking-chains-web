import React, { useState } from 'react';
import { Lock, HeartHandshake } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { PrivacyLevel } from '../../types/chain';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (data: {
    title: string;
    strategy: string;
    privacyLevel: PrivacyLevel;
    triggerTags: string[];
    intentStatement: string;
  }) => Promise<void>;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
}) => {
  const [title, setTitle] = useState('My Recovery Journey');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('LEVEL_2_FULL_COUNSEL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onCompleteOnboarding({
        title: title.trim() || 'My Recovery Journey',
        strategy: 'PMO_RECOVERY', // Defaults to PMO recovery
        privacyLevel,
        triggerTags: ['🌙 Late Night Solitude', '⚡ Stress & Anxiety'], // Default initial triggers
        intentStatement: 'I commit to seeking purity, self-mastery, and spiritual growth.', // Default intention statement
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create recovery chain. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Breaking Chains">
      <div className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          Let's set up your personal recovery track. All progress starts here. You can refine these settings at any time.
        </p>

        <div className="space-y-4">
          <Input
            label="Track Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Recovery Journey"
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Privacy & Confidentiality
            </label>
            <div className="space-y-2">
              {[
                {
                  level: 'LEVEL_2_FULL_COUNSEL' as PrivacyLevel,
                  title: 'Share with Mentor (Recommended)',
                  desc: 'Allows your future spiritual mentor to view your streak and check-in logs to guide you properly.',
                },
                {
                  level: 'LEVEL_0_PRIVATE' as PrivacyLevel,
                  title: 'Strictly Private',
                  desc: 'Your logs and streak statistics are confidential and visible only to you.',
                },
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setPrivacyLevel(item.level)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    privacyLevel === item.level
                      ? 'bg-slate-900/90 border-emerald-500 text-slate-100 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${privacyLevel === item.level ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="emerald"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-full text-xs font-bold flex items-center justify-center gap-2 mt-4"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Start My Journey</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
