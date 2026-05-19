import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  {
    src: '/images/clinic-gallery-1.jpg',
    alt: 'Dental instruments on a sterile tray',
    title: 'Precision',
  },
  {
    src: '/images/clinic-gallery-2.jpg',
    alt: 'Modern lighting from patient chair view',
    title: 'Atmosphere',
  },
  {
    src: '/images/clinic-gallery-3.jpg',
    alt: 'Digital dental operatory',
    title: 'Technology',
  },
  {
    src: '/images/clinic-gallery-4.jpg',
    alt: 'Mountain view from clinic windows',
    title: 'Calm',
  },
  {
    src: '/images/clinic-gallery-5.jpg',
    alt: 'CAD/CAM dental craftsmanship',
    title: 'Craftsmanship',
  },
  {
    src: '/images/clinic-gallery-6.jpg',
    alt: 'Private consultation suite',
    title: 'Care',
  },
  {
    src: '/images/clinic-interior-main.jpg',
    alt: 'Mountain view from clinic windows',
    title: 'Place',
  }
];

interface GalleryCardProps {
  img: {
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  index: number;
  setItemRef: (
    el: HTMLDivElement | null,
    index: number
  ) => void;
}

function GalleryCard({
  img,
  className = '',
  index,
  setItemRef,
}: GalleryCardProps) {
  return (
    <div
      ref={(el) => setItemRef(el, index)}
      className={`
        group
        relative
        overflow-hidden
        rounded-[1.4rem]
        bg-[#0B1120]
        ${className}
      `}
    >
      {/* Image */}
      <div
        className="
          gallery-image
          absolute
          inset-0
          bg-cover
          bg-center
          scale-[1.02]
          group-hover:scale-[1.03]
          transition-transform
          duration-700
        "
        style={{
          backgroundImage: `url(${img.src})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/18 group-hover:bg-black/10 transition-all duration-700" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Border */}
      <div className="absolute inset-0 rounded-[1.4rem] ring-1 ring-white/10 group-hover:ring-cyan-200/25 transition-all duration-700" />

      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-300/5 transition-opacity duration-700" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 z-10 p-7 md:p-9">
        <div className="w-10 h-px bg-white/40 mb-4" />

        <h3 className="text-white text-[clamp(1.5rem,2vw,2.5rem)] leading-none tracking-[-0.04em] font-light">
          {img.title}
        </h3>

        <p className="mt-3 text-white/55 text-sm leading-relaxed max-w-[280px]">
          {img.alt}
        </p>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = (
    el: HTMLDivElement | null,
    index: number
  ) => {
    const refs = [...itemRefs.current];
    refs[index] = el;
    itemRefs.current = refs;
  };

  useEffect(() => {
    itemRefs.current.forEach((item, i) => {
      if (!item) return;

      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 70,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: i * 0.04,
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          },
        }
      );

      const image = item.querySelector('.gallery-image');

      if (image) {
        gsap.to(image, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#020817]"
    >
      {/* Ambient Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-cyan-400/10 blur-[180px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pt-[8rem]">

        <div className="flex items-center gap-3 mb-7">
          <span className="w-8 h-px bg-white/25" />

          <span className="uppercase tracking-[0.25em] text-[0.72rem] text-white/45 font-mono">
            THE EXPERIENCE
          </span>
        </div>

        <div className="max-w-[850px]">
          <h2 className="text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.06em] text-white font-light">
            Editorial Spaces.
            <br />
            Human-Centered Care.
          </h2>

          <p className="mt-8 max-w-[620px] text-white/55 text-lg leading-relaxed">
            Every room is intentionally designed to feel calm,
            elevated, and quietly luxurious.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-[5rem]">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Hero */}
          <GalleryCard
            img={galleryImages[0]}
            index={0}
            setItemRef={setItemRef}
            className="md:col-span-8 md:row-span-2 h-[640px]"
          />

          {/* Right Top */}
          <GalleryCard
            img={galleryImages[1]}
            index={1}
            setItemRef={setItemRef}
            className="md:col-span-4 h-[308px]"
          />

          {/* Right Bottom */}
          <GalleryCard
            img={galleryImages[2]}
            index={2}
            setItemRef={setItemRef}
            className="md:col-span-4 h-[308px]"
          />

          {/* Wide Bottom */}
          <GalleryCard
            img={galleryImages[3]}
            index={3}
            setItemRef={setItemRef}
            className="md:col-span-12 h-[320px]"
          />
          {/* <GalleryCard
            img={galleryImages[7]}
            index={7}
            setItemRef={setItemRef}
            className="md:col-span-4 h-[308px]"
          /> */}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <GalleryCard
            img={galleryImages[4]}
            index={4}
            setItemRef={setItemRef}
            className="h-[420px]"
          />

          <GalleryCard
            img={galleryImages[5]}
            index={5}
            setItemRef={setItemRef}
            className="h-[420px]"
          />
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020817] to-transparent pointer-events-none" />
    </section>
  );
}