import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Wraps a button and plays a cursor gliding to it and clicking: the cursor travels inside the wrapper, so it always lands on the
 * button wherever the layout puts it. `delay` is when the click happens, in seconds. Static under reduced motion.
 */
export function ClickHint({ children, delay = 1.6, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span className={`relative inline-flex ${className}`} animate={reduce ? undefined : { scale: [1, 1, 0.94, 1] }} transition={{ duration: 0.5, delay: delay + 0.55, times: [0, 0.2, 0.5, 1] }}>
      {children}
      {!reduce && (
        <motion.svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" className="pointer-events-none absolute left-1/2 top-1/2 z-10 drop-shadow-md" initial={{ x: 150, y: 120, opacity: 0 }} animate={{ x: [150, 6, 6, 6], y: [120, 8, 8, 8], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, delay, times: [0, 0.55, 0.85, 1], ease: 'easeInOut' }}>
          <path d="M5 3l14 7-6 2-2 6z" className="fill-fg stroke-surface" strokeWidth="1.5" strokeLinejoin="round" />
        </motion.svg>
      )}
    </motion.span>
  );
}
