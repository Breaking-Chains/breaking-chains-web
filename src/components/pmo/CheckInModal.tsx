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
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center animate-fade-in">
              {errorMsg}
            </div>
          )}
          <p className="text-xs text-slate-300">
            Select your status for today. Honest reflection (*Muhasabah*) is key to recovery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleSelectStatus('CLEAN')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                selectedStatus === 'CLEAN'
                  ? 'bg-emerald-950/90 border-emerald-500 ring-2 ring-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Clean & Guarded</h4>
                <p className="text-[11px] text-slate-400">Purity maintained all day</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('URGE_RESISTED')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                selectedStatus === 'URGE_RESISTED'
                  ? 'bg-amber-950/90 border-amber-500 ring-2 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Resisted Urge</h4>
                <p className="text-[11px] text-slate-400">Fought urge & won</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('PEEKED_EDGED')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                selectedStatus === 'PEEKED_EDGED'
                  ? 'bg-orange-950/90 border-orange-500 ring-2 ring-orange-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-orange-600/20 text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Peeked / Edged</h4>
                <p className="text-[11px] text-slate-400">Visual stumble, no full slip</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectStatus('SLIP_UP')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                selectedStatus === 'SLIP_UP'
                  ? 'bg-rose-950/90 border-rose-500 ring-2 ring-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Slip-Up (Relapse)</h4>
                <p className="text-[11px] text-slate-400">Full relapse occurred</p>
              </div>
            </button>
          </div>

          {(selectedStatus === 'PEEKED_EDGED' || selectedStatus === 'SLIP_UP' || selectedStatus === 'URGE_RESISTED') && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">Primary Trigger Context</label>
              <div className="grid grid-cols-1 gap-2">
                {triggerOptions.map((trig) => (
                  <button
                    key={trig.id}
                    onClick={() => setSelectedTrigger(trig.id)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left transition-all ${
                      selectedTrigger === trig.id
                        ? 'bg-slate-800 border-emerald-500/60 text-emerald-300 font-semibold'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
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
            className="w-full mt-2"
          >
            Confirm & Save Log
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center py-2 animate-fade-in">
          <Card variant="alert" className="p-5 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">DO NOT DESPAIR OF ALLAH'S MERCY</h3>
            <p className="text-xs text-rose-100/90 leading-relaxed font-serif italic">
              "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'"
              <span className="block font-sans not-italic text-[10px] text-amber-400 mt-1 font-bold">
                — Surah Az-Zumar (39:53)
              </span>
            </p>
          </Card>

          <Card variant="dark" className="p-4 text-left space-y-2 border-emerald-900/40">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Immediate Post-Slip Tawbah Action Steps:
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
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
