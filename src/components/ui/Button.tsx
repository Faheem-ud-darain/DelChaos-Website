import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-95',
  secondary: 'border border-line bg-surface text-fg hover:bg-surface-2',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
};
const SIZES: Record<Size, string> = { md: 'h-10 px-5 text-sm', lg: 'h-12 px-7 text-base' };

const base = 'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition active:scale-[0.98] disabled:opacity-50';

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

/** The one button. Pass `href` and it renders a real link with the same look. */
export function Button(props: Common & ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement> | { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)) {
  const { variant = 'primary', size = 'md', className = '', children, ...rest } = props;
  const cls = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if ('href' in rest && rest.href !== undefined) return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  return <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
