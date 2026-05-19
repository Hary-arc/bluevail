import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '../components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { num: '01', name: 'Preventive Care', desc: 'Comprehensive exams, professional cleanings, and proactive screenings that catch concerns before they become conditions.', icon: 'shield' },
  { num: '02', name: 'Restorative Dentistry', desc: 'Natural-looking crowns, bridges, and fillings crafted with precision materials that blend seamlessly with your smile.', icon: 'refresh' },
  { num: '03', name: 'Cosmetic Enhancement', desc: 'Veneers, whitening, and smile design guided by artistic vision and advanced digital imaging.', icon: 'sparkle' },
  { num: '04', name: 'Dental Implants', desc: 'Permanent, titanium-rooted tooth replacement with computerized surgical guidance for optimal placement.', icon: 'anchor' },
  { num: '05', name: 'Orthodontics', desc: 'Clear aligners and subtle braces that straighten with discretion, comfort, and predictable results.', icon: 'align' },
  { num: '06', name: 'Emergency Care', desc: 'Same-day urgent appointments for dental trauma, pain, or acute concerns. We reserve daily capacity for the unexpected.', icon: 'alert' },
];

function ServiceIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M20 4L6 10V19C6 27.5 12 34.5 20 37C28 34.5 34 27.5 34 19V10L20 4Z" />
        <path d="M14 20L18 24L26 16" />
      </svg>
    ),
    refresh: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M28 16C26.5 11 23 8 18 8C12 8 7 13 7 20C7 27 12 32 18 32C23 32 27 28 28 24" />
        <polyline points="22,16 28,16 28,10" />
      </svg>
    ),
    sparkle: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M20 4L23 16H35L25 23L28 35L20 28L12 35L15 23L5 16H17L20 4Z" />
      </svg>
    ),
    anchor: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <circle cx="20" cy="10" r="4" />
        <line x1="20" y1="14" x2="20" y2="36" />
        <line x1="12" y1="22" x2="28" y2="22" />
        <path d="M12 22C12 30 16 36 20 36C24 36 28 30 28 22" />
      </svg>
    ),
    align: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M8 10C8 10 12 8 20 8C28 8 32 10 32 10" />
        <path d="M8 20H32" />
        <path d="M8 30C8 30 12 32 20 32C28 32 32 30 32 30" />
      </svg>
    ),
    alert: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M20 6L34 34H6L20 6Z" />
        <line x1="20" y1="16" x2="20" y2="24" />
        <circle cx="20" cy="29" r="1" fill="#F5F3EE" />
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.service-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });

    tl.fromTo(cards, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="services" className="bg-[#000E28] py-[8rem] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader overline="WHAT WE OFFER" heading="Comprehensive Care, Elevated" light centered />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.num}
              className="service-card group bg-[rgba(245,243,238,0.04)] border border-[rgba(245,243,238,0.12)] rounded p-10 hover:bg-[rgba(245,243,238,0.07)] hover:border-[rgba(245,243,238,0.2)] hover:-translate-y-1 transition-all duration-400"
            >
              <span className="font-mono text-[0.75rem] text-[rgba(245,243,238,0.45)]">{service.num}</span>
              <div className="mt-4">
                <ServiceIcon type={service.icon} />
              </div>
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#F5F3EE] mt-4">
                {service.name}
              </h3>
              <p className="font-body text-[0.9375rem] font-light leading-[1.6] tracking-[0.01em] text-[rgba(245,243,238,0.7)] mt-3">
                {service.desc}
              </p>
              <span className="inline-flex items-center gap-2 mt-6 font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[#FFF7E0] group cursor-pointer">
                Learn more
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
