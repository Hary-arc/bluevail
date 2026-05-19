interface SectionHeaderProps {
  overline: string;
  heading: string;
  light?: boolean;
  centered?: boolean;
}

export default function SectionHeader({ overline, heading, light = false, centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-4 mb-6 ${centered ? 'justify-center' : ''}`}>
        <span className={`w-6 h-px ${light ? 'bg-[rgba(245,243,238,0.45)]' : 'bg-[rgba(0,14,40,0.45)]'}`} />
        <span className={`font-mono-caption text-[0.6875rem] tracking-[0.12em] uppercase ${light ? 'text-[rgba(245,243,238,0.45)]' : 'text-[rgba(0,14,40,0.45)]'}`}>
          {overline}
        </span>
      </div>
      <h2 className={`font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] ${light ? 'text-[#F5F3EE]' : 'text-[#000E28]'}`}>
        {heading}
      </h2>
    </div>
  );
}
