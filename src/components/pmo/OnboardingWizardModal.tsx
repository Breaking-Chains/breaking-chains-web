import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Lock, ArrowRight, ArrowLeft, HeartHandshake } from 'lucide-react';
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
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('PMO Recovery & Purity Chain');
  const [strategy, setStrategy] = useState('PMO_RECOVERY');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('LEVEL_0_PRIVATE');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([
    '🌙 Late Night Solitude',
    '⚡ Stress & Anxiety',
  ]);
  const [intentStatement, setIntentStatement] = useState(
    'I commit to seeking purity, self-mastery, and spiritual elevation for the sake of Allah.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTriggers = [
    '🌙 Late Night Solitude',
    '⚡ Stress & Anxiety',
    '🛋️ Boredom & Idleness',
    '📱 Social Media Peeking',
    '😴 Exhaustion & Fatigue',
  ];

  const toggleTrigger = (trig: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trig) ? prev.filter((t) => t !== trig) : [...prev, trig]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onCompleteOnboarding({
        title,
        strategy,
        privacyLevel,
        triggerTags: selectedTriggers,
        intentStatement,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to Breaking Chains">
      <div className="space-y-5">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-slate-100 font-bold' : 'text-slate-400'}>
              Strategy & Privacy
            </span>
          </div>

          <div className="h-0.5 w-10 bg-slate-800" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-slate-100 font-bold' : 'text-slate-400'}>
              Triggers & Niyyah
            </span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Strategy & Privacy Level */
          <div className="space-y-4 animate-fade-in">
            <Input
              label="Habit Chain Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PMO Recovery & Spiritual Purity"
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Recovery Strategy Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStrategy('PMO_RECOVERY')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    strategy === 'PMO_RECOVERY'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                  PMO Recovery & Tazkiyah
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('GENERAL_HABIT')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    strategy === 'GENERAL_HABIT'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-teal-400 mb-1" />
                  General Habit Mastery
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Confidentiality & Privacy Level (*Satr*)
              </label>
              <div className="space-y-2">
                {[
                  {
                    level: 'LEVEL_0_PRIVATE' as PrivacyLevel,
                    title: 'Level 0 — Strictly Private',
                    desc: 'Only you see your log statistics. 100% encrypted & confidential.',
                  },
                  {
                    level: 'LEVEL_1_STREAK_ONLY' as PrivacyLevel,
                    title: 'Level 1 — Streak Shared with Mentor',
                    desc: 'Your designated mentor sees your active streak length only.',
                  },
                  {
                    level: 'LEVEL_2_FULL_COUNSEL' as PrivacyLevel,
                    title: 'Level 2 — Full Spiritual Counsel',
                    desc: 'Mentor sees streak & check-in status to provide tailored Nasiha.',
                  },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setPrivacyLevel(item.level)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      privacyLevel === item.level
                        ? 'bg-slate-900/90 border-emerald-500 text-slate-100 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
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
              onClick={() => setStep(2)}
              className="w-full text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue to Triggers & Niyyah</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* Step 2: Triggers & Niyyah Intent */
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Your Primary Craving Triggers
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTriggers.map((trig) => {
                  const isSelected = selectedTriggers.includes(trig);
                  return (
                    <button
                      key={trig}
                      type="button"
                      onClick={() => toggleTrigger(trig)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {trig}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Spiritual Intent Statement (*Niyyah*)
              </label>
              <textarea
                value={intentStatement}
                onChange={(e) => setIntentStatement(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all leading-relaxed"
                placeholder="Write your personal commitment..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="subtle"
                size="lg"
                onClick={() => setStep(1)}
                className="text-xs font-semibold flex items-center justify-center gap-2 border-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                variant="emerald"
                size="lg"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="text-xs font-bold flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Initialize Chain</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
