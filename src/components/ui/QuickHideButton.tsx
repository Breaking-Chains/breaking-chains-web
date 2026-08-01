import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, Calculator } from 'lucide-react';
import { Button } from './Button';

export const QuickHideButton: React.FC = () => {
  const [isStealthActive, setIsStealthActive] = useState(false);

  useEffect(() => {
    if (isStealthActive) {
      document.title = 'Calculator & Notes';
    } else {
      document.title = 'Breaking Chains | PMO Recovery';
    }
  }, [isStealthActive]);

  if (isStealthActive) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between font-mono text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <span className="flex items-center gap-2 font-bold text-slate-100">
            <Calculator className="w-5 h-5 text-slate-400" /> Quick Notes & Math
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsStealthActive(false)}
            className="text-xs"
          >
            <Eye className="w-4 h-4 mr-1" /> Return
          </Button>
        </div>

        <div className="space-y-4 my-auto max-w-sm mx-auto w-full text-center">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-right text-3xl text-emerald-400 font-mono shadow-inner">
            1,450.00
          </div>
          <div className="grid grid-cols-4 gap-3 text-lg font-bold">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(
              (btn) => (
                <button
                  key={btn}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-slate-200"
                >
                  {btn}
                </button>
              )
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          Stealth mode active. Tap Return to resume.
        </p>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsStealthActive(true)}
      title="Instant Quick Hide (Stealth Privacy)"
      className="text-xs border border-slate-800 hover:border-amber-500/50 text-amber-400/90"
    >
      <EyeOff className="w-4 h-4 mr-1 text-amber-400" />
      <span>Stealth</span>
    </Button>
  );
};
