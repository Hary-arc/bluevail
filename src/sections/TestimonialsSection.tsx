import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "I've never felt so calm in a dental chair. The view of the mountains, the gentle approach, and the genuine care from Dr. Hale and her team turned what I dreaded into something I actually look forward to.",
    name: 'Sarah M.',
    treatment: 'Cosmetic Veneers',
  },
  {
    quote: "After years of avoiding the dentist, I found BlueVail. Their technology is remarkable — same-day crowns that fit perfectly, digital scans with no gagging. It's the future of dentistry, right here in Park City.",
    name: 'James R.',
    treatment: 'Restorative Treatment',
  },
  {
    quote: "My kids love coming here. The team has a gift for making children feel safe and even excited about their checkups. As a parent, that peace of mind is invaluable.",
    name: 'Elena T.',
    treatment: 'Family Dentistry',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });

    tl.fromTo('.testimonial-card', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
    })
    .fromTo('.testimonial-quote-mark', { scale: 0.8, opacity: 0 }, {
      scale: 1, opacity: 0.3, stagger: 0.15, duration: 0.6, ease: 'back.out(1.4)',
    }, 0.2);

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="bg-[#000E28] py-[8rem] px-[clamp(1.5rem,5vw,4rem)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(245,243,238,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] uppercase">
              PATIENT STORIES
            </span>
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#F5F3EE]">
            Words From Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card relative bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.12)] rounded p-8"
            >
              {/* Quote mark */}
              <span className="testimonial-quote-mark absolute top-4 left-6 font-display text-[3rem] text-[#FFF7E0] opacity-0 leading-none select-none">
                &ldquo;
              </span>

              <p className="font-body text-[1rem] font-light leading-[1.65] italic text-[rgba(245,243,238,0.7)] mt-8">
                {t.quote}
              </p>

              <div className="w-full h-px bg-[rgba(245,243,238,0.12)] my-6" />

              <div className="font-body text-[0.9375rem] font-medium text-[#F5F3EE]">
                {t.name}
              </div>
              <div className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)] mt-1">
                {t.treatment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
