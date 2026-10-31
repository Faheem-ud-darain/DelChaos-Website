import { useInView, useReducedMotion, type MotionValue } from 'motion/react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';

// The 3D library is a separate download that starts after the page is up, so it never delays the first paint.
const ChaosField = lazy(() => import('./ChaosField'));

type Props = { className?: string } & ({ mode: 'load' } | { mode: 'still' } | { mode: 'drive'; drive: MotionValue<number> });

/**
 * The tile field as a page backdrop. 'load' sorts itself into order a moment after the page loads (the hero), 'drive' is sorted by
 * a scroll value the caller owns (the before and after section), and 'still' is the finished grid with no motion (the close).
 * It is created the first time it is on screen, kept after that, and paused whenever it is off screen.
 */
export function Backdrop3D(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 350);
    return () => window.clearTimeout(timer);
  }, []);
  if (visible && !started) setStarted(true);
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none ${props.className ?? ''}`}>
      <ErrorBoundary>
        <Suspense fallback={null}>
          {started && <ChaosField settle={loaded} still={!!reduce || props.mode === 'still'} paused={!visible} drive={props.mode === 'drive' ? props.drive : undefined} />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
