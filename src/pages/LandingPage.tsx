import React from 'react';
import { Link2Off, ArrowRight, Sparkles, Lock, Flame, Award, History, HeartHandshake, Brain, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  // Generate a mock year-long recovery heatmap for the product preview (52 weeks x 7 days)
  const mockHeatmapCols = Array.from({ length: 48 });

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-inter selection:bg-emerald-500/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <Link2Off className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-sm font-manrope font-bold text-primary uppercase tracking-tight">
                Breaking Chains
              </h1>
              <p className="text-[9px] font-geist text-on-surface-variant uppercase tracking-wider font-bold">
                Recovery Platform
              </p>
            </div>
          </div>

          <button
            onClick={onGetStarted}
            className="font-inter text-xs font-semibold text-primary border border-outline-variant hover:bg-surface-container rounded-lg px-4 py-2 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-container-padding py-stack-lg space-y-stack-lg animate-fade-in">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-stack-md py-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary border border-outline-variant font-geist text-[10px] uppercase font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Spiritual Tazkiyah Meets Behavioral Science
          </div>
          
          <h2 className="font-manrope text-[40px] md:text-[56px] font-bold text-primary leading-tight tracking-tight">
            Break Free.<br />Reclaim Your Barakah.
          </h2>
          
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            A modern, privacy-focused PMO recovery platform bridging cognitive behavioral tracking with Islamic spiritual psychology. Take control, one reflection at a time.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-95 font-semibold text-sm rounded-lg px-8 py-3.5 shadow-md cursor-pointer transition-all hover:translate-y-[-1px]"
            >
              Start Your Recovery Journey
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-2"
            >
              Explore Features & Metrics
            </a>
          </div>
        </section>

        {/* Dashboard visual mockup preview */}
        <section className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 space-y-stack-md shadow-sm">
          <div className="border-b border-outline-variant pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-manrope font-bold text-lg text-primary">Interactive Dashboard Preview</h3>
              <p className="font-inter text-[11px] text-on-surface-variant font-medium">Visualize your recovery statistics at a glance</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-geist text-on-surface-variant font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ba1a1a]" /> Relapse
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary-fixed-dim" /> Sober
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f1f5f9]" /> Untracked
              </span>
            </div>
          </div>

          {/* Bento Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-background rounded-xl border border-outline-variant p-4 flex flex-col items-center justify-center">
              <Flame className="w-8 h-8 text-primary mb-1" />
              <span className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider">Current Streak</span>
              <span className="font-manrope font-bold text-2xl text-primary mt-1">42 Days</span>
            </div>
            
            <div className="bg-background rounded-xl border border-outline-variant p-4 flex flex-col items-center justify-center">
              <Award className="w-8 h-8 text-secondary mb-1" />
              <span className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider">Longest Streak</span>
              <span className="font-manrope font-bold text-2xl text-secondary mt-1">128 Days</span>
            </div>

            <div className="bg-background rounded-xl border border-outline-variant p-4 flex flex-col items-center justify-center">
              <History className="w-8 h-8 text-slate-500 mb-1" />
              <span className="font-geist text-[10px] text-on-surface-variant uppercase tracking-wider">Total Relapses</span>
              <span className="font-manrope font-bold text-2xl text-on-surface mt-1">3</span>
            </div>
          </div>

          {/* Year-long Heatmap Preview */}
          <div className="space-y-2">
            <span className="block font-geist text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
              Year-Long Recovery Heatmap Grid
            </span>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[640px] flex gap-1 pt-1 justify-between">
                {mockHeatmapCols.map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                      // Generate a realistic clean path with a few slips
                      let bgClass = 'bg-[#f1f5f9]'; // future / empty
                      if (colIndex < 35) {
                        const totalDays = colIndex * 7 + rowIndex;
                        if (totalDays === 12 || totalDays === 76 || totalDays === 180) {
                          bgClass = 'bg-[#ba1a1a]'; // slip up
                        } else if (totalDays % 11 === 0 || totalDays % 17 === 0) {
                          bgClass = 'bg-[#d1fae5]'; // lighter sober
                        } else {
                          bgClass = 'bg-secondary-fixed-dim'; // solid sober
                        }
                      }
                      return (
                        <div
                          key={rowIndex}
                          className={`w-2.5 h-2.5 rounded-[1.5px] ${bgClass}`}
                          title={`Week ${colIndex + 1}, Day ${rowIndex + 1}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid Section */}
        <section id="features" className="space-y-stack-md pt-4">
          <div className="text-center space-y-1">
            <h3 className="font-manrope font-bold text-2xl text-primary">Engineered for Healing</h3>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">
              Breaking Chains integrates key recovery features designed to strengthen your defenses and rebuild neural path ways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter pt-2">
            
            {/* Feature 1 */}
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-manrope font-bold text-base text-primary">Daily Muhasabah (Reflection)</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Log daily check-ins honestly. Track your emotional state, craving triggers (solitude, stress, exhaustion), and write personal reflections. Build a dynamic trigger map to bypass weak points.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-manrope font-bold text-base text-primary">Spiritual Tazkiyah Metrics</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Align your recovery with spiritual psychological milestones. Watch your soul transition through stages of self-control (Nafs al-Ammarah to Nafs al-Mutma'innah) and log gaze guarding milestones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-red-650">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-manrope font-bold text-base text-primary">1-Tap SOS Urge Interrupter</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                In moments of extreme vulnerability, tap the emergency circuit breaker. Instantly access cognitive reframing protocols, breathing timers, and accountability support before making a decision.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-manrope font-bold text-base text-primary">Confidential Counsel & Partners</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Connect securely with verified spiritual mentors and recovery guides. Share streak metrics or full journals anonymously with end-to-end encryption. No personal emails or identities exposed.
              </p>
            </div>

          </div>
        </section>

        {/* Call to Action Footer */}
        <section className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 text-center space-y-stack-md">
          <Lock className="w-10 h-10 text-primary mx-auto" />
          <div className="space-y-1">
            <h4 className="font-manrope font-bold text-lg text-primary uppercase tracking-tight">Privacy-First Guarantee</h4>
            <p className="text-on-surface-variant text-xs max-w-lg mx-auto leading-relaxed">
              We require zero identifying documents, phone numbers, or social media bindings. Your recovery path is fully anonymous, secure, and encrypted. Your confidentiality is our sacred trust.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-primary text-on-primary hover:opacity-95 font-semibold text-sm rounded-lg px-8 py-3.5 shadow-md cursor-pointer transition-all hover:translate-y-[-1px]"
          >
            Create Your Anonymous Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-outline-variant px-6 py-6 text-center text-[10px] text-on-surface-variant bg-surface-container-low">
        <p>© {new Date().getFullYear()} Breaking Chains Recovery. One day at a time. All data encrypted.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
