import React, { useState } from 'react';
import { ShieldCheck, Flame, AlertCircle, Heart, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { LogStatus, PMOTriggerTag } from '../../types/log';
import { triggerConfetti } from '../../utils/confetti';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLog: (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => Promise<void> | void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmitLog,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<LogStatus | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<PMOTriggerTag>('LATE_NIGHT_SOLITUDE');
  const [notes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postSlipSubmitted, setPostSlipSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectStatus = (status: LogStatus) => {
    setSelectedStatus(status);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmitLog(selectedStatus, selectedTrigger, notes);

      if (selectedStatus === 'CLEAN' || selectedStatus === 'URGE_RESISTED') {
        triggerConfetti();
      }

      if (selectedStatus === 'SLIP_UP') {
        setPostSlipSubmitted(true);
      } else {
        onClose();
        setSelectedStatus(null);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save check-in log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerOptions: { id: PMOTriggerTag; label: string }[] = [
    { id: 'LATE_NIGHT_SOLITUDE', label: '🌙 Late Night Solitude' },
    { id: 'STRESS_ANXIETY', label: '⚡ Stress & Anxiety' },
    { id: 'BOREDOM_IDLENESS', label: '🛋️ Boredom & Idleness' },
    { id: 'SOCIAL_MEDIA_SCROLLING', label: '📱 Social Media Peeking' },
    { id: 'FATIGUE_EXHAUSTION', label: '😴 Exhaustion' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily PMO Check-In (Muhasabah)">
      {!postSlipSubmitted ? (
        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium text-center animate-fade-in">
              {errorMsg}
            </div>
          )}
          <p className="text-xs text-slate-700 dark:text-slate-400 font-semibold">
            Select your status for today. Honest reflection (*Muhasabah*) is key to recovery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <button
              onClick={() => handleSelectStatus('CLEAN')}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                selectedStatus === 'CLEAN'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                selectedStatus === 'CLEAN'
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Clean & Guarded</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 leading-tight">Purity maintained all day</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('URGE_RESISTED')}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                selectedStatus === 'URGE_RESISTED'
                  ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                selectedStatus === 'URGE_RESISTED'
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Resisted Urge</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 leading-tight">Fought urge & won</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('PEEKED_EDGED')}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                selectedStatus === 'PEEKED_EDGED'
                  ? 'bg-orange-50/60 dark:bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                selectedStatus === 'PEEKED_EDGED'
                  ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-650 dark:text-orange-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Peeked / Edged</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 leading-tight">Visual stumble, no full slip</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('SLIP_UP')}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                selectedStatus === 'SLIP_UP'
                  ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                selectedStatus === 'SLIP_UP'
                  ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Slip-Up (Relapse)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 leading-tight">Full relapse occurred</p>
              </div>
            </button>
          </div>

          {(selectedStatus === 'PEEKED_EDGED' || selectedStatus === 'SLIP_UP' || selectedStatus === 'URGE_RESISTED') && (
            <div className="space-y-2.5 pt-3 border-t border-slate-150 dark:border-slate-800/80">
              <label className="block text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Primary Trigger Context</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {triggerOptions.map((trig) => (
                  <button
                    key={trig.id}
                    onClick={() => setSelectedTrigger(trig.id)}
                    className={`px-3 py-2.5 text-xs rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      selectedTrigger === trig.id
                        ? 'bg-emerald-50/60 dark:bg-slate-800 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-450 hover:border-slate-450'
                    }`}
                  >
                    {trig.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            variant={selectedStatus === 'SLIP_UP' ? 'danger' : 'emerald'}
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedStatus}
            isLoading={isSubmitting}
            className="w-full mt-3 rounded-xl shadow-md shadow-emerald-500/5 dark:shadow-emerald-950/10"
          >
            Confirm & Save Log
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center py-2 animate-fade-in">
          <Card variant="alert" className="p-5 space-y-3 border-amber-500/20 dark:border-amber-500/40">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-250 dark:border-amber-400/40 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-300">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-rose-950 dark:text-white uppercase tracking-wider">Do not despair of Allah's Mercy</h3>
            <p className="text-sm text-rose-900/90 dark:text-rose-100/90 leading-relaxed font-serif italic">
              "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'"
              <span className="block font-sans not-italic text-[10px] text-amber-600 dark:text-amber-450 mt-1.5 font-bold">
                — Surah Az-Zumar (39:53)
              </span>
            </p>
          </Card>

          <Card variant="dark" className="p-4 text-left space-y-2.5">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Immediate Post-Slip Tawbah Action Steps:
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4 font-medium">
              <li>Make Wudu with cold water to wash away visual traces.</li>
              <li>Pray 2 Raka'at <strong>Salat al-Tawbah</strong> (Prayer of Repentance).</li>
              <li>Give <strong>$1–$5 Sadaqah</strong> (Charity erases bad deeds: <em>Al-Hasanat yudhibna al-sayyi'at</em>).</li>
              <li>Beware of the <strong>48-Hour Chaser Effect</strong> (Heightened cravings ahead).</li>
            </ul>
          </Card>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => {
              setPostSlipSubmitted(false);
              setSelectedStatus(null);
              onClose();
            }}
            className="w-full"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> I Re-Commit to My Clean Chain
          </Button>
        </div>
      )}
    </Modal>
  );
};
