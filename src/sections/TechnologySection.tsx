import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: 'scan', name: '3D CBCT Imaging', desc: 'Full-arch scans in 20 seconds with 90% less radiation' },
  { icon: 'digital', name: 'Digital Impressions', desc: 'Intraoral scanning replaces messy traditional molds' },
  { icon: 'crown', name: 'CAD/CAM Same-Day Crowns', desc: 'Design, mill, and place in a single visit' },
  { icon: 'laser', name: 'Laser Dentistry', desc: 'Minimally invasive soft-tissue procedures with faster healing' },
];

function TechIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    scan: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="12" cy="12" r="5" />
        <path d="M2 9H5M19 9H22M2 15H5M19 15H22" />
      </svg>
    ),
    digital: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M8 21H16M12 17V21" />
        <circle cx="10" cy="10" r="2" />
        <path d="M14 8L16 10L14 12" />
      </svg>
    ),
    crown: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 18L5 8L9 12L12 6L15 12L19 8L21 18H3Z" />
        <circle cx="12" cy="4" r="2" />
      </svg>
    ),
    laser: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 9H9L12 2Z" />
        <line x1="12" y1="9" x2="12" y2="16" />
        <circle cx="12" cy="19" r="3" />
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });

    tl.fromTo('.tech-left > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.tech-feature', { opacity: 0, x: 20, y: 30 }, { opacity: 1, x: 0, y: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out' }, 0.2);

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="technology" className="bg-[#F5F3EE] py-[8rem] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16">
        {/* Left Column */}
        <div className="tech-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(0,14,40,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(0,14,40,0.45)] uppercase">
              OUR TECHNOLOGY
            </span>
          </div>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#000E28]">
            Precision Through Innovation
          </h2>

          <p className="font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] font-light leading-[1.65] tracking-[0.01em] text-[#000E28] mt-6">
            We invest in technology that makes your visit faster, more comfortable, and clinically superior. Our digital workflow means fewer appointments, more accurate results, and treatments that are truly tailored to your anatomy.
          </p>

          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 font-body text-[0.9375rem] font-medium text-[#000E28] border-b border-[rgba(0,14,40,0.12)] pb-1 hover:gap-3 transition-all inline-flex items-center gap-2 group"
          >
            Explore Our Technology
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </button>
        </div>

        {/* Right Column - 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.name} className="tech-feature">
              <div className="w-12 h-12 rounded-full border border-[rgba(0,14,40,0.12)] flex items-center justify-center text-[#000E28]">
                <TechIcon type={feature.icon} />
              </div>
              <h4 className="font-body text-[0.9375rem] font-medium text-[#000E28] mt-4">
                {feature.name}
              </h4>
              <p className="font-body text-[0.8125rem] font-normal leading-[1.5] text-[rgba(0,14,40,0.45)] mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
