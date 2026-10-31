import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { centreOf, useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const toLight = theme === 'dark';
  return (
    <button type="button" onClick={e => toggle(centreOf(e.currentTarget))} aria-label={toLight ? 'Switch to light mode' : 'Switch to dark mode'} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg active:scale-[0.96]">
      {toLight ? <SunIcon size={20} weight="regular" /> : <MoonIcon size={20} weight="regular" />}
    </button>
  );
}
