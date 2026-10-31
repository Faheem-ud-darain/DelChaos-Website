import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Lays something out at one fixed size and scales the whole thing to the width it is given, so a product screen keeps its
 * proportions and its text stays crisp at any page width, instead of wrapping and squeezing like a responsive page.
 */
export function ScaleToFit({ width, height, children, className = '' }: { width: number; height: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={ref} className={`w-full overflow-hidden ${className}`} style={{ height: height * scale }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}
