import { lazy, Suspense, useEffect, useState, type RefObject } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { ErrorBoundary } from '../ui/ErrorBoundary';

// WebGL is a separate download that starts once the page is idle, so it never delays the first paint.
const LaserFlow = lazy(() => import('./LaserFlow'));

// One beam each side of the headline, so the text stays clear and the window is lit across its whole width.
const BEAMS = [{ position: 0.18, seed: 7 }, { position: 0.82, seed: 3 }] as const;

/**
 * The hero's light: two lime beams that drop from the top of the screen, either side of the headline, and splash over the product window. The glow under it is plain CSS,
 * so the page already has its light on phones, data-saver connections and reduced motion, where the shader is never fetched.
 */
export function LaserBackdrop({ surfaceRef, onLit, beams = BEAMS, enabled = true, className = '' }: { surfaceRef: RefObject<HTMLElement | null>; onLit?: () => void; beams?: readonly { position: number; seed: number }[]; enabled?: boolean; className?: string }) {
  const { theme } = useTheme();
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saver || !matchMedia('(min-width: 768px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) { onLit?.(); return; }
    const ready = () => (window.requestIdleCallback ? window.requestIdleCallback(() => setOn(true), { timeout: 2500 }) : window.setTimeout(() => setOn(true), 1200));
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
    return () => window.removeEventListener('load', ready);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  // The beam reaches the window about a second after it mounts; that is when the window switches on.
  useEffect(() => {
    if (!on) return;
    const timer = window.setTimeout(() => onLit?.(), 1000);
    return () => window.clearTimeout(timer);
  }, [on, onLit]);
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(50%_55%_at_50%_0%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_75%)]" />
      <ErrorBoundary>
        <Suspense fallback={null}>
          {on && beams.map(beam => (
            <div key={beam.position} className="absolute inset-0">
            <LaserFlow
              surfaceRef={surfaceRef}
              theme={theme}
              color={theme === 'dark' ? '#c4ee3f' : '#8fb312'}
              beamPosition={beam.position}
              seed={beam.seed}
              intensity={1.3}
              beamWidth={1.2}
              flare={0.9}
              fog={0.12}
              dust={1.2}
              speed={1}
              spread={0.8}
              spill={0.2}
              dpr={1.5}
              mouseInteraction={false}
            />
            </div>
          ))}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
