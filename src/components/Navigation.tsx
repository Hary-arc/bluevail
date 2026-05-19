import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Technology', href: '#technology' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo('.nav-container', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 });
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`nav-container fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-400 ${
          scrolled
            ? 'bg-[#000E28]/90 backdrop-blur-[12px]'
            : 'bg-transparent'
        }`}
      >
        <div className="h-full flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] max-w-[1400px] mx-auto">
          {/* Wordmark */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L16 14H0L8 0Z" fill="#FFF7E0" />
              <path d="M8 4C10 4 11.5 5.5 11.5 7.5C11.5 9.5 10 11 8 11C6 11 4.5 9.5 4.5 7.5C4.5 5.5 6 4 8 4Z" fill="#000E28" />
            </svg>
            <span className="font-mono text-[0.8125rem] font-medium tracking-[0.15em] text-[#F5F3EE]">
              BLUEVAIL
            </span>
          </button>

          {/* Center nav - desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="font-body text-[0.8125rem] font-medium tracking-[0.08em] text-[rgba(245,243,238,0.7)] hover:text-[#F5F3EE] transition-colors duration-300 border-b border-transparent hover:border-[#FFF7E0] pb-0.5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo('#contact')}
              className="hidden sm:block font-body text-[0.875rem] font-medium tracking-[0.06em] bg-[#F5F3EE] text-[#000E28] px-6 py-2.5 rounded-sm hover:bg-[#FFF7E0] hover:scale-[1.02] transition-all duration-300"
            >
              Book Appointment
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-px bg-[#F5F3EE] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
              <span className={`w-5 h-px bg-[#F5F3EE] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#000E28] transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] text-[#F5F3EE] hover:text-[#FFF7E0] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="mt-4 font-body text-[0.875rem] font-medium tracking-[0.06em] bg-[#F5F3EE] text-[#000E28] px-8 py-3 rounded-sm"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
}
