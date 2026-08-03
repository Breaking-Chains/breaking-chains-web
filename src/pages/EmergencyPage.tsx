import React from 'react';
import { AlertTriangle, Shield, Droplets, Wind, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface EmergencyPageProps {
  onTriggerSosModal: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onTriggerSosModal }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card variant="alert" className="p-6 text-center space-y-4 border-rose-500/30 dark:border-rose-500/50 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/60 border-2 border-rose-300 dark:border-rose-500 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-300 animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-rose-950 dark:text-white">PMO URGE EMERGENCY TOOLKIT</h2>
          <p className="text-sm text-rose-900/90 dark:text-rose-100/90 leading-relaxed">
            Urges are temporary neurochemical spikes. They reach a peak and fade within 2 to 5 minutes.
          </p>
        </div>

        <Button variant="sos" size="lg" onClick={onTriggerSosModal} className="max-w-md mx-auto text-base py-4">
          <Zap className="w-5 h-5 mr-2" /> Launch 4-Step Urge Interrupter
        </Button>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Immediate Physical & Psychological Circuit Breakers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="dark" className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Shield className="w-5 h-5" /> 1. Physical Break Rule
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Never stay in bed or behind a closed door with a screen while experiencing an urge. Stand up immediately.
            </p>
          </Card>

          <Card variant="dark" className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <Droplets className="w-5 h-5" /> 2. Hydrotherapy Wudu Reset
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cold water on your face and arms activates the dive reflex, slowing heart rate and resetting emotional arousal.
            </p>
          </Card>

          <Card variant="dark" className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Wind className="w-5 h-5" /> 3. 60-Second Box Breathing
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Inhale 4s, hold 4s, exhale 4s, hold 4s. Re-engages the prefrontal cortex for self-mastery.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
