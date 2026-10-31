import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'delchaos-theme';

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

/** The page theme. It lives on <html data-theme> (set before paint by public/theme-init.js); this hook reads it and flips it. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  const toggle = useCallback(() => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* private mode: the choice just is not remembered */ }
  }, []);
  return { theme, toggle };
}
