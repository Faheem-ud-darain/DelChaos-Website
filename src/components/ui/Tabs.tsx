import type { KeyboardEvent, ReactNode } from 'react';

export type TabItem<T extends string> = { value: T; label: string; icon?: ReactNode };

/** Vertical tab list with arrow-key movement (the same pattern as a native tab control). The panel is the caller's. */
export function Tabs<T extends string>({ items, value, onChange, label, idPrefix }: { items: TabItem<T>[]; value: T; onChange: (value: T) => void; label: string; idPrefix: string }) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex(t => t.value === value);
    const to = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % items.length : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i - 1 + items.length) % items.length : -1;
    if (to < 0) return;
    e.preventDefault();
    onChange(items[to].value);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[to]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map(item => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            id={`${idPrefix}-${item.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={`flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 text-left text-base font-semibold transition active:scale-[0.99] ${active ? 'border-accent-strong bg-surface text-fg' : 'border-transparent text-muted hover:text-fg'}`}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
