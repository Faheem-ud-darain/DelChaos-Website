import type { ReactNode } from 'react';

type Tone = 'neutral' | 'ok' | 'warn' | 'bad' | 'accent';

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-muted',
  ok: 'bg-ok/15 text-ok',
  warn: 'bg-warn/15 text-warn',
  bad: 'bg-bad/15 text-bad',
  accent: 'bg-accent text-accent-fg',
};

/** A small status label, used inside the product previews. */
export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>{children}</span>;
}
