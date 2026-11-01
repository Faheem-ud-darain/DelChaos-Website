import { useEffect, useState } from 'react';

const panes = () => Array.from(document.querySelectorAll<HTMLElement>('[data-stack-target]'));

/** Where each layer would sit if nothing were stuck: the layers before it, stacked, below the top of <main>. */
function naturalTops() {
  const list = panes();
  const base = list[0]?.parentElement?.offsetTop ?? 0;
  let y = base;
  return list.map(el => { const top = y; y += el.offsetHeight; return { id: el.dataset.stackTarget!, top }; });
}

/** Stuck layers do not move when asked to scroll into view, so jump links go to the computed natural position instead. */
export function useStackAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const id = link.getAttribute('href')!.slice(1);
      const hit = naturalTops().find(p => p.id === id);
      if (!hit) return;
      event.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: hit.top, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

/** The layer being read: the last one whose natural top has passed the middle of the screen. For the nav's highlight. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.45;
      const current = naturalTops().filter(p => p.top <= line).pop();
      setActive(current && ids.includes(current.id) ? current.id : null);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ids]);
  return active;
}
