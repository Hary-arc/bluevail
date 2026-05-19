import FluidLogo from '../effects/FluidLogo';

export default function FluidLogoSection() {
  return (
    <section className="bg-[#000E28] relative" style={{ height: '50vh' }}>
      <FluidLogo />
      {/* Interaction hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C4A265] animate-pulse-dot" />
          <span className="font-mono-caption text-[0.6875rem] tracking-[0.12em] text-[rgba(245,243,238,0.45)]">
            Tap to interact
          </span>
        </div>
      </div>
      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(245,243,238,0.12)]" />
    </section>
  );
}
