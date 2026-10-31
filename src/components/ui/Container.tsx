import type { ReactNode } from 'react';

/** The page column: centred, capped, with side padding that never lets copy touch the edge. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 md:px-8 ${className}`}>{children}</div>;
}

/** A page section with the one vertical rhythm every section shares. */
export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`py-[clamp(72px,10vw,140px)] ${className}`}><Container>{children}</Container></section>;
}
