import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';

interface ChaserEffectBannerProps {
  isActive: boolean;
  hoursRemaining?: number;
}

export const ChaserEffectBanner: React.FC<ChaserEffectBannerProps> = ({
  isActive,
  hoursRemaining = 36,
}) => {
  if (!isActive) return null;

  return (
    <Card variant="alert" className="p-4 border-rose-500/50 shadow-lg shadow-rose-950/40 animate-pulse-glow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-600/30 text-rose-400 shrink-0">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-200 tracking-tight flex items-center gap-1.5">
              48-HOUR CHASER EFFECT SHIELD ACTIVE
            </h4>
            <span className="text-[11px] font-mono text-rose-300 font-bold bg-rose-950 px-2 py-0.5 rounded-full border border-rose-500/40">
              {hoursRemaining}h left
            </span>
          </div>
          <p className="text-xs text-rose-100/90 leading-relaxed font-normal">
            A recent slip triggers intense chemical cravings in the brain for the next 48 hours. Keep your phone outside your bedroom and stay in social spaces.
          </p>
        </div>
      </div>
    </Card>
  );
};
