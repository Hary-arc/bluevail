import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    });

    tl.fromTo('.intro-left > *', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.intro-image', { opacity: 0, x: 30, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }, 0.2);

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-[#F5F3EE] py-[8rem] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left Column */}
        <div className="intro-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(0,14,40,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(0,14,40,0.45)] uppercase">
              OUR PHILOSOPHY
            </span>
          </div>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#000E28]">
            Dentistry should feel as refreshing as mountain air
          </h2>

          <p className="font-body text-[clamp(0.875rem,1.1vw,1.0625rem)] font-light leading-[1.65] tracking-[0.01em] text-[#000E28] mt-6">
            At BlueVail, we've reimagined the dental experience. Our practice sits at the intersection of advanced clinical technology and the natural serenity that defines Park City. Every detail — from our panoramic mountain views to our gentle, minimally invasive techniques — is designed to replace anxiety with calm, and routine care with genuine wellness.
          </p>

          <button
            onClick={() => document.querySelector('#team')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 font-body text-[0.9375rem] font-medium text-[#000E28] border-b border-[rgba(0,14,40,0.12)] pb-1 hover:gap-3 transition-all inline-flex items-center gap-2 group"
          >
            Meet Our Team
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </button>
        </div>

        {/* Right Column */}
        <div className="intro-image relative">
          <div className="border border-[rgba(0,14,40,0.12)] rounded overflow-hidden translate-x-4 translate-y-2">
            <img
              src="/images/dentist-portrait.jpg"
              alt="Dr. Rebecca Hale at BlueVail Dental"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
