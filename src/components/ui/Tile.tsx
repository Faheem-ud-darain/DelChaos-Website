import type { ReactNode } from 'react';

type Tone = 'plain' | 'accent';

// Cells of the feature grid. They differ in background, not just in text, so the grid has rhythm.
const TONES: Record<Tone, string> = {
  plain: 'border-line bg-surface',
  accent: 'border-transparent bg-accent text-accent-fg',
};

export function Tile({ tone = 'plain', title, children, className = '', body }: { tone?: Tone; title: string; body?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border p-6 md:p-8 ${TONES[tone]} ${className}`}>
      <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight">{title}</h3>
      {body && <p className={`mt-2 max-w-[48ch] leading-relaxed ${tone === 'accent' ? 'text-accent-fg/75' : 'text-muted'}`}>{body}</p>}
      {children && <div className="mt-6 flex-1">{children}</div>}
    </div>
  );
}
