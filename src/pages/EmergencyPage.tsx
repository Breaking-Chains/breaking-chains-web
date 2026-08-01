import React from 'react';
import { AlertTriangle, Shield, Droplets, Wind, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface EmergencyPageProps {
  onTriggerSosModal: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onTriggerSosModal }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Card variant="alert" className="p-5 text-center space-y-3 border-rose-500/50">
        <div className="w-14 h-14 rounded-full bg-rose-900/60 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-300 animate-bounce">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">PMO URGE EMERGENCY TOOLKIT</h2>
          <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
            Urges are temporary neurochemical spikes. They reach a peak and fade within 2 to 5 minutes.
          </p>
        </div>

        <Button variant="sos" size="lg" onClick={onTriggerSosModal} className="w-full text-base py-4">
          <Zap className="w-5 h-5 mr-2" /> Launch 4-Step Urge Interrupter
        </Button>
      </Card>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Immediate Circuit Breakers
        </h3>

        <Card variant="dark" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <Shield className="w-4 h-4" /> 1. The Physical Break Rule
          </div>
          <p className="text-xs text-slate-300">
            Never stay in bed or behind a closed door with a screen while experiencing an urge. Stand up immediately.
          </p>
        </Card>

        <Card variant="dark" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
            <Droplets className="w-4 h-4" /> 2. Hydrotherapy Wudu Reset
          </div>
          <p className="text-xs text-slate-300">
            Cold water on your face and arms activates the dive reflex, slowing heart rate and resetting emotional arousal.
          </p>
        </Card>

        <Card variant="dark" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Wind className="w-4 h-4" /> 3. 60-Second Box Breathing
          </div>
          <p className="text-xs text-slate-300">
            Inhale 4s, hold 4s, exhale 4s, hold 4s. Re-engages the prefrontal cortex for self-mastery.
          </p>
        </Card>
      </div>
    </div>
  );
};
