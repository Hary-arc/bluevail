import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AuroraSky from '../effects/AuroraSky';

const stats = [
  { number: '15+', label: 'Years of Practice' },
  { number: '2,400+', label: 'Patients Served' },
  { number: '98%', label: 'Satisfaction Rate' },
];

interface HeroSectionProps {
  loaded: boolean;
}

export default function HeroSection({ loaded }: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const animRan = useRef(false);

  useEffect(() => {
    if (!loaded || animRan.current) return;
    animRan.current = true;

    const tl = gsap.timeline();
    tl.fromTo('.hero-overline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
      .fromTo('.hero-headline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5)
      .fromTo('.hero-subline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7)
      .fromTo('.hero-ctas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
      .fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.2)
      .fromTo('.hero-stat-item', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, 1.3);
  }, [loaded]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AuroraSky />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-[clamp(1.5rem,5vw,4rem)] max-w-[1400px] mx-auto pointer-events-none">
        <div className="max-w-[600px]">
          {/* Overline */}
          <div className="hero-overline opacity-0 flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(245,243,238,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] uppercase">
              PARK CITY, UTAH
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline opacity-0 font-display text-[clamp(3rem,8vw,6.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#F5F3EE] text-shadow-hero">
            <span className="block">Elevated</span>
            <span className="block">Dental Care</span>
          </h1>

          {/* Subline */}
          <p className="hero-subline opacity-0 font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] font-light leading-[1.65] tracking-[0.01em] text-[rgba(245,243,238,0.7)] max-w-[480px] mt-6">
            Where mountain serenity meets clinical precision. Experience dentistry reimagined through a lens of calm, comfort, and uncompromising expertise.
          </p>

          {/* CTAs */}
          <div className="hero-ctas opacity-0 flex flex-wrap gap-4 mt-10 pointer-events-auto">
            <button
              onClick={() => scrollTo('#contact')}
              className="font-body text-[0.875rem] font-medium tracking-[0.06em] bg-[#000E28] text-[#F5F3EE] px-8 py-3.5 rounded-sm hover:bg-[#00173F] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Schedule Visit
            </button>
            <button
              onClick={() => scrollTo('#gallery')}
              className="font-body text-[0.875rem] font-medium tracking-[0.06em] bg-transparent text-[#F5F3EE] px-8 py-3.5 rounded-sm border border-[rgba(245,243,238,0.12)] hover:bg-[rgba(245,243,238,0.08)] transition-all duration-300"
            >
              Tour the Clinic
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hero-stats opacity-0 absolute bottom-0 left-0 right-0 z-10 bg-[rgba(0,14,40,0.6)] backdrop-blur-[8px] border-t border-[rgba(245,243,238,0.12)]">
        <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 max-w-[1400px] mx-auto flex justify-around md:justify-start md:gap-24">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat-item opacity-0 text-center md:text-left">
              <div className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1] tracking-[-0.02em] text-[#F5F3EE]">
                {stat.number}
              </div>
              <div className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[rgba(245,243,238,0.45)]">
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
}
