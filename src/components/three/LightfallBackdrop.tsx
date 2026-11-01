import { lazy, Suspense, useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { ErrorBoundary } from '../ui/ErrorBoundary';

// WebGL is a separate download that starts once the card is on screen and the page is idle.
const Lightfall = lazy(() => import('./Lightfall'));

/**
 * Streaks of light falling through the closing card. The settings are the ones chosen for the site; only the colours follow the theme: lime
 * streaks on the card's own surface in dark mode, a deeper lime on white in light mode. Phones, data-saver connections and reduced motion
 * never fetch the shader and keep the soft CSS glow underneath.
 */
export function LightfallBackdrop({ enabled, className = '' }: { enabled: boolean; className?: string }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saver || !matchMedia('(min-width: 768px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.requestIdleCallback ? window.requestIdleCallback(() => setOn(true), { timeout: 2000 }) : window.setTimeout(() => setOn(true), 800);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(timer) : window.clearTimeout(timer));
  }, [enabled]);
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_85%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]" />
      <ErrorBoundary>
        <Suspense fallback={null}>
          {on && (
            <Lightfall
              colors={[dark ? '#c4ee3f' : '#8fb312']}
              backgroundColor={dark ? '#121212' : '#ffffff'}
              lightMode={!dark}
              speed={0.3}
              streakCount={2}
              streakWidth={0.8}
              streakLength={1}
              twinkle={0.3}
              backgroundGlow={0.1}
              headGlow={0.6}
              bloom={0.35}
              density={0.6}
              glow={1}
              depth={0.5}
              zoom={3}
              fade={0}
              lens={0.5}
              mouseInteraction
              mouseStrength={0.4}
              mouseRadius={0.45}
              holdToWarp
              intro
              className="absolute inset-0"
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
