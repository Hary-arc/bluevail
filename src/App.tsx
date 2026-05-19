import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import LoadingOverlay from './components/LoadingOverlay';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import ServicesSection from './sections/ServicesSection';
import GallerySection from './sections/GallerySection';
import TechnologySection from './sections/TechnologySection';
import TestimonialsSection from './sections/TestimonialsSection';
import TeamSection from './sections/TeamSection';
import FluidLogoSection from './sections/FluidLogoSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<any>(null);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return;

    let lenis: any;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
        });
        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } catch (e) {
        console.warn('Lenis initialization failed:', e);
      }
    };

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, [loaded]);

  // Refresh ScrollTrigger after content loads
  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return (
    <>
      <LoadingOverlay onComplete={handleLoadComplete} />
      <Navigation />
      <main>
        <HeroSection loaded={loaded} />
        <IntroSection />
        <ServicesSection />
        <GallerySection />
        <TechnologySection />
        <TestimonialsSection />
        <TeamSection />
        <FluidLogoSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
