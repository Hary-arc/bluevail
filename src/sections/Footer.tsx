import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Clinic: ['Services', 'Technology', 'Team', 'Careers'],
  Patients: ['New Patients', 'Financing', 'Insurance', 'Forms'],
  Resources: ['Blog', 'FAQ', 'Privacy Policy', 'Accessibility'],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const cols = footer.querySelectorAll('.footer-col');
    gsap.fromTo(cols, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
    });
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#000E28] border-t border-[rgba(245,243,238,0.12)] py-16 px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Row 1: Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h4 className="font-body text-[0.8125rem] font-medium tracking-[0.08em] text-[#F5F3EE] mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <span className="font-body text-[0.8125rem] text-[rgba(245,243,238,0.7)] hover:text-[#F5F3EE] transition-colors duration-300 cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect Column */}
          <div className="footer-col">
            <h4 className="font-body text-[0.8125rem] font-medium tracking-[0.08em] text-[#F5F3EE] mb-4">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              {/* Instagram */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="hover:stroke-[#F5F3EE] transition-colors cursor-pointer">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="rgba(245,243,238,0.45)" stroke="none" />
              </svg>
              {/* Facebook */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="hover:stroke-[#F5F3EE] transition-colors cursor-pointer">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              {/* LinkedIn */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.45)" strokeWidth="1.5" className="hover:stroke-[#F5F3EE] transition-colors cursor-pointer">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-[rgba(245,243,238,0.05)] border border-[rgba(245,243,238,0.12)] rounded-sm px-3 py-2 font-body text-[0.75rem] text-[#F5F3EE] placeholder:text-[rgba(245,243,238,0.45)] focus:border-[#FFF7E0] focus:outline-none"
              />
              <button className="bg-[#C4A265] text-[#000E28] font-body text-[0.75rem] font-medium px-4 py-2 rounded-sm hover:bg-[#FFF7E0] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Map */}
        <div className="mt-12 rounded overflow-hidden border border-[rgba(245,243,238,0.12)] opacity-70" style={{ filter: 'grayscale(60%) hue-rotate(200deg)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.5!2d-111.5!3d40.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM5JzAwLjAiTiAxMTHCsDMwJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BlueVail Dental Location"
          />
        </div>

        {/* Row 3: Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)]">
            &copy; 2025 BlueVail Dental. All rights reserved.
          </span>
          <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)]">
            Elevated care in the mountains
          </span>
        </div>
      </div>
    </footer>
  );
}
