import type { ReactNode } from 'react';

/** A "screen" for showing a piece of the product inside a card: it takes the app's own palette (light on the light page, lifted charcoal on the dark page) and is lifted by one soft offset shadow (no outline). */
export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div data-app className={`rounded-xl bg-surface p-4 text-fg shadow-[0_18px_36px_-14px_color-mix(in_srgb,var(--device)_80%,transparent)] md:p-5 ${className}`}>
      {children}
    </div>
  );
}
