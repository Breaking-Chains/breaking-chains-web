import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, BookOpen, Wind, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: (durationSeconds: number) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCounter, setBreathCounter] = useState<number>(4);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Reset steps on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsBreathingActive(false);
      setTimerSeconds(60);
      setStartTime(Date.now());
    }
  }, [isOpen]);

  const handleFinishSos = () => {
    const elapsedSeconds = Math.max(10, Math.floor((Date.now() - startTime) / 1000));
    onClose(elapsedSeconds);
  };

  // Box Breathing Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 4 && isBreathingActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isBreathingActive, timerSeconds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 overflow-y-auto animate-fade-in">
      {/* Top Warning Bar */}
      <div className="flex items-center justify-between border-b border-rose-900/40 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-200">URGE INTERRUPTER ACTIVATED</h2>
            <p className="text-[11px] text-slate-400">Step {step} of 4 • De-escalating limbic urge</p>
          </div>
        </div>

        <button
          onClick={handleFinishSos}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          Exit SOS
        </button>
      </div>

      {/* Main Interactive Step Card */}
      <div className="my-auto max-w-sm mx-auto w-full py-4 space-y-4">
        {step === 1 && (
          <Card variant="alert" className="space-y-4 text-center p-6 border-rose-500/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-900/60 border-2 border-rose-500/60 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🛑
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">STEP 1: PHYSICAL CIRCUIT BREAK</h3>
              <p className="text-sm text-rose-100 font-medium leading-relaxed">
                Stand up right now. Put your smartphone or laptop on the table and leave the room or bed immediately.
              </p>
            </div>
            <Button
              variant="sos"
              size="lg"
              onClick={() => setStep(2)}
              className="mt-4 shadow-rose-900/50"
            >
              I Have Stood Up & Left <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card variant="emerald" className="space-y-4 text-center p-6 border-teal-500/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-teal-950 border-2 border-teal-400 flex items-center justify-center mx-auto text-teal-300">
              <Droplets className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">STEP 2: HYDROTHERAPY & WUDU</h3>
              <p className="text-sm text-teal-100 font-medium leading-relaxed">
                Go to the sink. Splash cold water over your face, hands, and arms (Perform Wudu). Cold water triggers the mammalian dive reflex to instantly lower your heart rate.
              </p>
            </div>
            <Button
              variant="emerald"
              size="lg"
              onClick={() => setStep(3)}
              className="mt-4"
            >
              Wudu / Cold Splash Done <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}

        {step === 3 && (
          <Card variant="gold" className="space-y-4 text-center p-6 border-amber-500/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-amber-100">STEP 3: GUARDING THE GAZE</h3>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 text-amber-200 text-xs italic font-serif leading-relaxed">
                "Tell the believing men to lower their gaze and guard their private parts. That is purer for them. Indeed, Allah is Acquainted with what they do."
                <span className="block font-sans font-bold text-[10px] mt-2 not-italic text-amber-400">
                  — Surah An-Nur (24:30)
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-medium">
                The visual trigger has passed. You are in control of your eyes and soul.
              </p>
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setStep(4);
                setIsBreathingActive(true);
              }}
              className="mt-4"
            >
              Start 60s Box Breathing <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}

        {step === 4 && (
          <Card variant="dark" className="space-y-4 text-center p-6 border-emerald-600/40 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto">
              <Wind className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">STEP 4: SOMATIC URGE SURFING</h3>
              <p className="text-xs text-slate-400">Urges peak like waves and subside in under 60 seconds.</p>
            </div>

            <div className="relative w-36 h-36 mx-auto rounded-full bg-slate-900 border-4 border-emerald-500/50 flex flex-col items-center justify-center shadow-lg shadow-emerald-950/60 animate-pulse-glow">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {breathPhase}
              </span>
              <span className="text-4xl font-extrabold text-white font-mono">{breathCounter}s</span>
              <span className="text-[10px] text-slate-400 mt-1">Remaining: {timerSeconds}s</span>
            </div>

            {timerSeconds === 0 ? (
              <Button
                variant="emerald"
                size="lg"
                onClick={handleFinishSos}
                className="w-full mt-4"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Urge Successfully Resisted!
              </Button>
            ) : (
              <p className="text-xs text-emerald-300 font-medium animate-pulse">
                Keep breathing deeply... You are reclaiming your heart.
              </p>
            )}
          </Card>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-500 pb-2">
        Breaking Chains PMO Urge Interrupter • Confidential & Offline Ready
      </p>
    </div>
  );
};
