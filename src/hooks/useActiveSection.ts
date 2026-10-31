import { useEffect, useState } from 'react';

/** Which section is under the top of the screen, for the nav's sliding highlight. Uses the browser's own observer, not scroll listeners. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const elements = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}
