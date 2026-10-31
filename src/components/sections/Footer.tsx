import { NAV_LINKS, SITE } from '../../site';
import { Container } from '../ui/Container';
import { Logo } from '../ui/Logo';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {NAV_LINKS.map(link => <a key={link.href} href={link.href} className="transition hover:text-fg">{link.label}</a>)}
        </nav>
        <p className="text-sm text-muted">&copy; {YEAR} {SITE.name}. All rights reserved.</p>
      </Container>
    </footer>
  );
}
