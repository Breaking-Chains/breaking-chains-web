import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  LineChart, 
  HeartHandshake, 
  Lock, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Flame, 
  ArrowRight,
  Shield
} from 'lucide-react';
import contentData from '../data/landingContent.json';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  BookOpen,
  Brain,
  LineChart,
  HeartHandshake,
  Lock,
  Sparkles,
  Shield,
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const { hero, science, process, features, privacy, faqs, footer } = contentData;

  return (
    <div className="landing-container arabesque-pattern">
      {/* Top Header Navbar */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <div className="landing-brand">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Breaking <span className="landing-brand-highlight">Chains</span>
            </a>
          </div>
          <nav className="landing-nav-menu">
            <a className="landing-nav-link" href="#science">Why Us</a>
            <a className="landing-nav-link" href="#process">Our Process</a>
            <a className="landing-nav-link" href="#features">Features</a>
            <a className="landing-nav-link" href="#privacy">Privacy</a>
            <a className="landing-nav-link" href="#faq">FAQ</a>
          </nav>
          <div className="landing-nav-actions">
            <button onClick={onGetStarted} className="landing-btn-login">
              Login
            </button>
            <button onClick={onGetStarted} className="landing-btn-join">
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero-section">
          <div className="landing-hero-content">
            <span className="landing-hero-badge">
              <Sparkles className="w-3.5 h-3.5" />
              {hero.badge}
            </span>
            <h1 className="landing-hero-title">
              {hero.title.split('. ')[0]}.<br />
              <span className="landing-hero-title-highlight">{hero.title.split('. ')[1]}</span>
            </h1>
            <p className="landing-hero-subtitle">
              {hero.subtitle}
            </p>
            <div className="landing-hero-ctas">
              <button onClick={onGetStarted} className="landing-btn-primary">
                {hero.ctaStart}
              </button>
              <a href="#process" className="landing-btn-secondary">
                {hero.ctaExplore}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-hero-glow-1"></div>
            <div className="landing-hero-glow-2"></div>
            
            {/* Interactive Dashboard Mockups Teaser */}
            <div className="landing-mockup-container">
              <div className="landing-mockup-header">
                <div className="landing-mockup-dots">
                  <span className="landing-mockup-dot landing-mockup-dot-red"></span>
                  <span className="landing-mockup-dot landing-mockup-dot-yellow"></span>
                  <span className="landing-mockup-dot landing-mockup-dot-green"></span>
                </div>
                <span className="landing-mockup-title">Your Progress Sanctuary</span>
              </div>

              {/* Streak Widget */}
              <div className="landing-widget-streak">
                <div className="landing-widget-streak-icon">
                  <Flame className="w-6 h-6 text-orange-500 fill-orange-100" />
                </div>
                <div className="landing-widget-streak-info">
                  <div className="landing-widget-streak-label">Current Streak</div>
                  <div className="landing-widget-streak-value">45 Days Clean</div>
                </div>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">🔥 Active</span>
              </div>

              {/* Clean Ratio Widget */}
              <div className="landing-widget-ratio">
                <div className="landing-widget-ratio-header">
                  <div className="landing-widget-ratio-label">Recovery Consistency</div>
                  <div className="landing-widget-ratio-value">98.2%</div>
                </div>
                <div className="landing-widget-ratio-bar-bg">
                  <div className="landing-widget-ratio-bar-fill" style={{ width: '98.2%' }}></div>
                </div>
              </div>

              {/* Checkin Status Widget */}
              <div className="landing-widget-checkin">
                <span className="landing-widget-checkin-status"></span>
                <div className="landing-widget-checkin-info">
                  <div className="landing-widget-checkin-label">Daily Muhasabah</div>
                  <div className="landing-widget-checkin-value">Check-in Complete for Today</div>
                </div>
                <span className="text-xs font-medium text-slate-400">9:30 PM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Science Section */}
        <section id="science" className="landing-science-section">
          <div className="landing-section-header">
            <h2 className="landing-section-title">{science.title}</h2>
            <p className="landing-section-subtitle">{science.subtitle}</p>
          </div>
          
          <div className="landing-science-grid">
            {science.cards.map((card, index) => {
              const IconComp = IconMap[card.icon] || Brain;
              return (
                <div key={index} className="landing-science-card group">
                  <div className="landing-science-icon-box">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="landing-science-card-title">{card.title}</h3>
                  <p className="landing-science-card-desc">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process Section (The 4-Phase Timeline) */}
        <section id="process" className="landing-process-section">
          <div className="landing-section-header">
            <h2 className="landing-section-title">{process.title}</h2>
            <p className="landing-section-subtitle">{process.subtitle}</p>
          </div>

          <div className="landing-process-timeline">
            {process.phases.map((phase, index) => (
              <div key={index} className="landing-process-card group">
                <div className="landing-process-badge-container">
                  <span className="landing-process-badge">{phase.number}</span>
                  <span className="landing-process-timeline-badge">{phase.timeline}</span>
                </div>
                <h3 className="landing-process-card-title">{phase.title}</h3>
                <p className="landing-process-card-goal"><strong>Goal:</strong> {phase.goal}</p>
                <ul className="landing-process-card-actions">
                  {phase.actions.map((act, aIdx) => (
                    <li key={aIdx} className="landing-process-card-action-item">
                      <Check className="landing-process-check-icon" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section id="features" className="landing-features-section">
          <div className="landing-section-header">
            <h2 className="landing-section-title">{features.title}</h2>
            <p className="landing-section-subtitle">{features.subtitle}</p>
          </div>

          <div className="landing-features-grid">
            
            {/* Card 1: Visual Streak Chain (span-1) */}
            <div className="landing-feature-card">
              <div className="flex flex-col gap-3">
                <div className="landing-feature-icon-wrapper">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="landing-feature-title">{features.items[0].title}</h3>
                <p className="landing-feature-desc">{features.items[0].description}</p>
              </div>
              <div className="landing-bento-streak-preview">
                <div className="landing-bento-streak-row">
                  <div className="landing-bento-streak-dots">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <span key={i} className="landing-bento-streak-dot-active">✓</span>
                    ))}
                    <span className="landing-bento-streak-dot-inactive">7</span>
                  </div>
                  <span className="landing-bento-streak-badge">🔥 6d</span>
                </div>
              </div>
            </div>

            {/* Card 2: Anonymous Mentorship (span-2) */}
            <div className="landing-feature-card landing-feature-card-span-2">
              <div className="landing-feature-layout-flex">
                <div className="landing-feature-layout-info">
                  <div className="landing-feature-icon-wrapper">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="landing-feature-title">{features.items[1].title}</h3>
                  <p className="landing-feature-desc">{features.items[1].description}</p>
                </div>
                <div className="landing-bento-chat-preview">
                  <div className="landing-bento-chat-box">
                    <div className="landing-bento-chat-msg-mentor">
                      Assalamu Alaikum. How is your Mujahadah going today?
                    </div>
                    <div className="landing-bento-chat-msg-user">
                      Wa Alaikum Assalam. Solitude is a test, but staying strong.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Daily Muhasabah / Check-Ins (span-2) */}
            <div className="landing-feature-card landing-feature-card-span-2">
              <div className="landing-feature-layout-flex">
                <div className="landing-feature-layout-info">
                  <div className="landing-feature-icon-wrapper">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="landing-feature-title">{features.items[2].title}</h3>
                  <p className="landing-feature-desc">{features.items[2].description}</p>
                </div>
                <div className="landing-bento-tags-preview">
                  <div className="landing-bento-tags-box">
                    <span className="landing-bento-tag-item landing-bento-tag-danger">🌙 Solitude</span>
                    <span className="landing-bento-tag-item landing-bento-tag-warning">⚡ Stress</span>
                    <span className="landing-bento-tag-item landing-bento-tag-info">📱 Social Media</span>
                    <span className="landing-bento-tag-item landing-bento-tag-inactive">📖 Quran Routine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Guidance & Wisdom Library (span-1) */}
            <div className="landing-feature-card">
              <div className="flex flex-col gap-3">
                <div className="landing-feature-icon-wrapper">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="landing-feature-title">{features.items[3].title}</h3>
                <p className="landing-feature-desc">{features.items[3].description}</p>
              </div>
              <div className="landing-bento-library-preview">
                <div className="landing-bento-library-box">
                  <div className="landing-bento-library-header">
                    <span>Purification of Soul</span>
                    <span className="landing-bento-library-badge">4/5 read</span>
                  </div>
                  <div className="landing-bento-library-progress-bg">
                    <div className="landing-bento-library-progress-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="landing-privacy-section">
          <div className="landing-privacy-card">
            <div className="landing-privacy-glow"></div>
            <div className="landing-privacy-icon-box">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="landing-privacy-title">{privacy.title}</h2>
            <p className="landing-privacy-subtitle">{privacy.subtitle}</p>
            
            <div className="landing-privacy-points-grid">
              {privacy.points.map((pt, index) => (
                <div key={index} className="landing-privacy-point">
                  <Check className="landing-privacy-point-icon" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="landing-faq-section">
          <div className="landing-section-header">
            <h2 className="landing-section-title">{faqs.title}</h2>
            <p className="landing-section-subtitle">{faqs.subtitle}</p>
          </div>

          <div className="landing-faq-list">
            {faqs.items.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`landing-faq-item ${isOpen ? 'landing-faq-item-active' : ''}`}
                >
                  <button 
                    onClick={() => toggleFaq(index)} 
                    className="landing-faq-question-btn"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className="landing-faq-icon" />
                  </button>
                  {isOpen && (
                    <div className="landing-faq-answer-panel">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-branding">
            <span className="landing-footer-brand-title">{footer.brandName}</span>
            <p className="landing-footer-tagline">{footer.tagline}</p>
            <p className="landing-footer-copyright">{footer.copyright}</p>
          </div>
          <nav className="landing-footer-nav">
            {footer.links.map((link, index) => (
              <a 
                key={index} 
                className="landing-footer-link" 
                href={link.href}
                onClick={(e) => link.href === '#' && e.preventDefault()}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
