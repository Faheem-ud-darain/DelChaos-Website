import type { ReactNode } from 'react';

/** A section's title and one supporting line, stacked. The heading carries its own weight: there is no label above it. */
export function SectionHeading({ title, children, className = '' }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl">{title}</h2>
      {children && <p className="mt-4 max-w-[60ch] text-base md:mt-5 md:text-lg leading-relaxed text-muted">{children}</p>}
    </div>
  );
}
