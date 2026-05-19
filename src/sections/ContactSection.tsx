import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });

    tl.fromTo('.contact-left > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.contact-form', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.2)
      .fromTo('.form-field', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0.4);

    return () => { tl.kill(); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section ref={sectionRef} id="contact" className="bg-[#000E28] py-[8rem] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-16">
        {/* Left Column */}
        <div className="contact-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(245,243,238,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] uppercase">
              VISIT US
            </span>
          </div>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#F5F3EE]">
            Begin Your Care
          </h2>

          <p className="font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] font-light leading-[1.65] tracking-[0.01em] text-[rgba(245,243,238,0.7)] mt-6">
            New patient consultations include a comprehensive exam, digital imaging, and a personalized treatment roadmap — complimentary and with no obligation.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="mt-1 flex-shrink-0">
                <path d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span className="font-body text-[0.9375rem] text-[rgba(245,243,238,0.7)]">
                2400 Sidewinder Drive, Suite 100<br />
                Park City, UT 84060
              </span>
            </div>

            <div className="flex items-center gap-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:4355550147" className="font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] text-[#C4A265] hover:underline">
                (435) 555-0147
              </a>
            </div>

            <div className="flex items-center gap-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span className="font-body text-[0.9375rem] text-[rgba(245,243,238,0.7)]">
                Mon–Thu: 8am–5pm<br />
                Fri: 8am–2pm
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="contact-form bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.12)] rounded-lg p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="1.5" className="mb-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12L11 15L16 9" />
              </svg>
              <h3 className="font-display text-[1.5rem] text-[#F5F3EE] mb-2">Thank You</h3>
              <p className="font-body text-[0.9375rem] text-[rgba(245,243,238,0.7)]">
                We've received your request and will confirm your appointment within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all"
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all"
                />
              </div>
              <div className="form-field">
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all"
                />
              </div>
              <div className="form-field">
                <input
                  type="date"
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all"
                />
              </div>
              <div className="form-field">
                <select
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-[#000E28]">Treatment Interest</option>
                  <option value="checkup" className="bg-[#000E28]">General Checkup</option>
                  <option value="cleaning" className="bg-[#000E28]">Cleaning</option>
                  <option value="cosmetic" className="bg-[#000E28]">Cosmetic</option>
                  <option value="implants" className="bg-[#000E28]">Implants</option>
                  <option value="orthodontics" className="bg-[#000E28]">Orthodontics</option>
                  <option value="emergency" className="bg-[#000E28]">Emergency</option>
                  <option value="other" className="bg-[#000E28]">Other</option>
                </select>
              </div>
              <div className="form-field">
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="w-full bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-4 py-3.5 font-body text-[0.9375rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none focus:ring-2 focus:ring-[rgba(196,162,101,0.15)] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="form-field w-full bg-[#C4A265] text-[#000E28] font-body text-[0.875rem] font-medium tracking-[0.06em] py-4 rounded-sm hover:bg-[#FFF7E0] hover:scale-[1.01] transition-all duration-300 disabled:opacity-70"
              >
                {submitting ? 'Sending...' : 'Request Appointment'}
              </button>
              <p className="form-field font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] text-center mt-4">
                We'll confirm your appointment within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
