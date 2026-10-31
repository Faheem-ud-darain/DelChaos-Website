import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'delchaos-theme';
const DURATION = 550;

const root = () => document.documentElement;
const read = (): Theme => (root().dataset.theme === 'light' ? 'light' : 'dark');
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

function commit(next: Theme) {
  root().dataset.theme = next;
  try { localStorage.setItem(KEY, next); } catch { /* private mode: the choice just is not remembered */ }
}

/** Where the wipe starts and ends: the centre of the control that was pressed. */
export const centreOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

let active: ViewTransition | null = null;

/**
 * Going dark paints a circle out of the toggle over the page; going light pulls the dark page back into it (View Transitions API,
 * with the circle rules in index.css). Browsers without it, and people who ask for reduced motion, get the instant switch. A press
 * while a wipe is running ends it and switches at once, so quick presses never stack.
 */
function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  if (active) { active.skipTransition(); active = null; commit(next); return; }
  if (!origin || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { commit(next); return; }
  const toDark = next === 'dark';
  root().style.setProperty('--wipe-x', `${origin.x}px`);
  root().style.setProperty('--wipe-y', `${origin.y}px`);
  root().dataset.themeWipe = toDark ? 'grow' : 'shrink';
  const transition = document.startViewTransition(() => commit(next));
  active = transition;
  const reach = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  const circle = (r: number) => `circle(${r}px at ${origin.x}px ${origin.y}px)`;
  transition.ready
    .then(() => root().animate(
      { clipPath: toDark ? [circle(0), circle(reach)] : [circle(reach), circle(0)] },
      { duration: DURATION, easing: 'ease-in-out', fill: 'forwards', pseudoElement: toDark ? '::view-transition-new(root)' : '::view-transition-old(root)' },
    ))
    .catch(() => { /* transition skipped */ });
  transition.finished.catch(() => { /* skipped or interrupted */ }).finally(() => {
    if (active === transition) active = null;
    delete root().dataset.themeWipe;
    root().style.removeProperty('--wipe-x');
    root().style.removeProperty('--wipe-y');
  });
}

/** The page theme. It lives on <html data-theme> (set before paint by public/theme-init.js); this hook reads it and flips it, with the wipe when given the pressed control's centre. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  const toggle = useCallback((origin?: { x: number; y: number }) => switchTheme(read() === 'dark' ? 'light' : 'dark', origin), []);
  return { theme, toggle };
}
