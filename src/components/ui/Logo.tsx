// The mark: four squares, three in a tidy grid and one still tilted. Chaos, resolved. Built from rectangles on purpose.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-accent" />
      <rect x="6" y="6" width="9" height="9" rx="2.5" className="fill-accent-fg" />
      <rect x="17" y="6" width="9" height="9" rx="2.5" className="fill-accent-fg" />
      <rect x="6" y="17" width="9" height="9" rx="2.5" className="fill-accent-fg" />
      <rect x="17.5" y="17.5" width="9" height="9" rx="2.5" transform="rotate(14 22 22)" className="fill-accent-fg" />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight ${className}`} aria-label="DelChaos home">
      <LogoMark />
      DelChaos
    </a>
  );
}
