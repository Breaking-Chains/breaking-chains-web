import React from 'react';
import { BookOpen, Brain, LineChart, HeartHandshake, Lock, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col arabesque-pattern antialiased w-full selection:bg-emerald-500/30">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 bg-surface/80 backdrop-blur-md shadow-sm z-50">
        <div className="flex justify-between items-center max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-base">
          <div className="flex items-center gap-4">
            <a 
              className="text-headline-md font-headline-md text-primary dark:text-primary-fixed-dim" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Breaking Chains
            </a>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a 
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" 
              href="#pillars"
            >
              Features
            </a>
            <a 
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" 
              href="#privacy"
            >
              Privacy
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer transition-transform active:scale-95 hidden md:block outline-none"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-on-primary-fixed-variant transition-colors duration-200 cursor-pointer transition-transform active:scale-95 outline-none"
            >
              Join
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full max-w-[1280px] mx-auto">
        {/* Hero Section */}
        <section className="relative w-full min-h-[80vh] flex items-center justify-center py-xl px-margin-mobile md:px-margin-desktop mt-lg">
          <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden mx-margin-mobile md:mx-margin-desktop soft-shadow-level-1">
            <img 
              alt="A serene landscape at sunrise, symbolizing hope, clarity, and a new beginning. Soft pastel colors, peaceful atmosphere, high resolution." 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOSghMzINkFG63DI06CWtphhi4SJ3tYLmFd-_v0o7bFpxPeOEpKu7to7ZYLSoD4_Ix4dqZtGnuVY2vNt2pUC6X83xcbFDmTNZhruFiMTjqsuZtP-bbNxPw__X8diMv4Scdh5r3p1hN2HfMh-8a7Jotht_fFi65QObqcq_s87Ok3b69z6jnqx7L6NAF4Ijz9hnwOEleWijyyNF3mNfOQo0gDPa8JeWnlFxmngtBBti9tltTfPYfYcga"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/50 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-md pt-xl backdrop-blur-md bg-surface/80 p-8 rounded-3xl">
            <span className="text-primary mb-sm">
              <Sparkles className="w-16 h-16" />
            </span>
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface">
              Heal. Rise. Reconnect.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-sm">
              A modern, professional path to recovery rooted in spiritual guidance and behavioral science. Find clarity, discipline, and hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-lg justify-center w-full sm:w-auto">
              <button 
                onClick={onGetStarted}
                className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-on-primary-fixed-variant transition-colors duration-200 shadow-md cursor-pointer transition-transform active:scale-95 outline-none"
              >
                Start Your Journey
              </button>
              <a 
                href="#pillars"
                className="border border-secondary text-secondary hover:bg-secondary/5 font-label-md text-label-md px-8 py-3 rounded-full transition-colors duration-200 flex items-center justify-center"
              >
                Our Approach
              </a>
            </div>
          </div>
        </section>

        {/* Core Pillars Section (Bento Grid) */}
        <section id="pillars" className="py-xl px-margin-mobile md:px-margin-desktop w-full mt-xl">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              A Holistic Path to Recovery
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
              Our approach integrates timeless spiritual wisdom with modern therapeutic practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            
            {/* Pillar 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow-level-1 border border-secondary/5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                <BookOpen className="w-[120px] h-[120px] text-primary" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-manrope text-headline-md text-on-surface">Qur'an &amp; Sunnah</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Spiritual guidance, accountability, repentance, and self-discipline based on Islamic teachings.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow-level-1 border border-secondary/5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                <Brain className="w-[120px] h-[120px] text-primary" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-manrope text-headline-md text-on-surface">Psychology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Deep understanding of addiction, triggers, and the journey to mental wellness.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow-level-1 border border-secondary/5 flex flex-col gap-4 relative overflow-hidden group lg:col-span-2">
              <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                <LineChart className="w-[120px] h-[120px] text-primary" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="font-manrope text-headline-md text-on-surface">Behavioral Science</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Practical tools for building healthier habits and breaking harmful patterns through structured, scientifically-backed methodologies.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow-level-1 border border-secondary/5 flex flex-col gap-4 relative overflow-hidden group lg:col-span-4 mt-sm bg-gradient-to-r from-surface-container-lowest to-surface-container-low">
              <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex-1 max-w-2xl text-left">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="font-manrope text-headline-md text-on-surface mb-2">Accountability &amp; Support</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Personal guidance from trusted mentors who understand your path. You are never alone on this journey towards clarity and peace.
                  </p>
                </div>
                <div className="hidden md:flex flex-shrink-0">
                  {/* abstract illustration representation */}
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Privacy & Trust Section */}
        <section id="privacy" className="py-xl px-margin-mobile md:px-margin-desktop w-full mb-xl">
          <div className="bg-surface-container-highest rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-secondary mb-4">
              <Lock className="w-10 h-10" />
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              A Safe &amp; Confidential Space
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Your journey is deeply personal. We prioritize your privacy and confidentiality above all else, ensuring a secure environment where you can focus entirely on healing and growth without fear of judgment.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-lg bg-surface-container-low dark:bg-surface-container-lowest border-t border-surface-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto px-margin-desktop gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-headline-sm font-headline-sm text-primary mb-2 font-bold font-manrope">
              Breaking Chains
            </span>
            <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim">
              © 2024 Breaking Chains. A Digital Sanctuary for Recovery.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <a 
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>
            <a 
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a 
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Contact Support
            </a>
            <a 
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              About Us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
