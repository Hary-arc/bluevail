import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingOverlayProps {
  onComplete: () => void;
}

export default function LoadingOverlay({ onComplete }: LoadingOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Wait for images and basic setup
    const timer = setTimeout(() => {
      gsap.to('.loading-overlay', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="loading-overlay fixed inset-0 z-[200] bg-[#000E28] flex flex-col items-center justify-center">
      <span className="font-mono text-[0.8125rem] font-medium tracking-[0.15em] text-[#F5F3EE] animate-pulse">
        BLUEVAIL
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="h-full bg-[#C4A265] animate-loading-bar" />
      </div>
    </div>
  );
}
