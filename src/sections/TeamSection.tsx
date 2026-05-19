import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Dr. Rebecca Hale',
    title: 'Founder & Lead Dentist',
    credentials: 'DMD, Harvard School of Dental Medicine',
    bio: 'Fifteen years of clinical excellence with a focus on restorative and cosmetic dentistry.',
    image: '/images/team-hale.jpg',
  },
  {
    name: 'Dr. Marcus Chen',
    title: 'Associate Dentist',
    credentials: 'DDS, UCLA School of Dentistry',
    bio: 'Specialist in implantology and digital smile design with a gentle, patient-first approach.',
    image: '/images/team-chen.jpg',
  },
  {
    name: 'Dr. Sofia Alvarez',
    title: 'Orthodontic Specialist',
    credentials: 'DMD, MSD, University of Washington',
    bio: 'Board-certified orthodontist creating beautiful smiles with clear aligners and modern techniques.',
    image: '/images/team-alvarez.jpg',
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.team-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });

    cards.forEach((card, i) => {
      tl.fromTo(card, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      }, i * 0.2);

      const img = card.querySelector('.team-img');
      if (img) {
        tl.fromTo(img, { clipPath: 'inset(10% 0 10% 0)' }, {
          clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power3.inOut',
        }, i * 0.2 + 0.3);
      }
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} id="team" className="bg-[#F5F3EE] py-[8rem] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-6 h-px bg-[rgba(0,14,40,0.45)]" />
            <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(0,14,40,0.45)] uppercase">
              LEADERSHIP
            </span>
            <span className="w-6 h-px bg-[rgba(0,14,40,0.45)]" />
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#000E28]">
            Meet the Doctors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div className="overflow-hidden rounded">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-img w-full aspect-[3/4] object-cover"
                  loading="lazy"
                  style={{ filter: 'saturate(0.85) sepia(0.05)' }}
                />
              </div>
              <div className="pt-5">
                <h3 className="font-display text-[1.25rem] font-normal leading-[1.2] text-[#000E28]">
                  {member.name}
                </h3>
                <p className="font-mono-caption text-[0.75rem] tracking-[0.12em] text-[rgba(0,14,40,0.45)] mt-1">
                  {member.title}
                </p>
                <p className="font-mono-caption text-[0.75rem] tracking-[0.12em] text-[rgba(0,14,40,0.45)]">
                  {member.credentials}
                </p>
                <p className="font-body text-[0.875rem] font-light leading-[1.6] text-[#000E28] mt-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
