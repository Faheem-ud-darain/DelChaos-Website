import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * One layer of the page stack. It sticks to the screen once its bottom edge is reached (immediately, if it fits
 * on one screen), so the next layer slides over it. A layer taller than the screen scrolls through its own
 * content first. `target` is the id of the section inside, used by the nav to jump here.
 */
export function StackPane({ children, layer, target, sticky = true }: { children: ReactNode; layer: number; target: string; sticky?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !sticky) return;
    const measure = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [sticky]);
  return (
    <div
      ref={ref}
      data-stack-target={target}
      style={{ zIndex: layer, top: sticky ? top : undefined }}
      className={`relative bg-bg shadow-[0_-30px_60px_-30px_rgb(0_0_0/0.45)] ${sticky ? 'sticky' : ''}`}
    >
      {children}
    </div>
  );
}
