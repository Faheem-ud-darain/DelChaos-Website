import { motion } from 'motion/react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { contactHref, NAV_LINKS, SITE } from '../../site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';

const IDS = NAV_LINKS.map(link => link.href.slice(1));

export function Nav() {
  const active = useActiveSection(IDS);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => {
            const on = active === link.href.slice(1);
            return (
              <a key={link.href} href={link.href} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${on ? 'text-fg' : 'text-muted hover:text-fg'}`}>
                {on && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-surface-2" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href={contactHref}>{SITE.contactLabel}</Button>
        </div>
      </Container>
    </header>
  );
}
