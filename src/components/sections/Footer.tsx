import { contactHref, NAV_LINKS, SITE, whatsappHref } from '../../site';
import { Container } from '../ui/Container';
import { LOGO, WORDMARK } from '../ui/logoPaths';

const YEAR = new Date().getFullYear();

const PRODUCT = ['Attendance', 'Payroll', 'Leave', 'Onboarding', 'Chat and tickets'] as const;

const Label = ({ children }: { children: string }) => <p className="mb-5 font-mono text-xs tracking-wide text-muted">{children}</p>;

/** The closing wall: three short columns, then the logo at full width on a wash of the accent. */
export function Footer() {
  const g = LOGO.full;
  return (
    <footer className="relative overflow-clip border-t border-line bg-bg">
      <Container className="relative z-10 grid gap-12 pt-14 sm:grid-cols-2 md:grid-cols-4 md:pt-20">
        <div>
          <Label>Explore</Label>
          <nav aria-label="Footer" className="flex flex-col gap-2.5 text-[15px]">
            {NAV_LINKS.map(link => <a key={link.href} href={link.href} className="w-fit transition hover:text-accent-strong">{link.label}</a>)}
          </nav>
        </div>
        <div>
          <Label>Product</Label>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {PRODUCT.map(item => <li key={item}><a href="#features" className="transition hover:text-accent-strong">{item}</a></li>)}
          </ul>
        </div>
        <div className="sm:col-span-2">
          <Label>Contact</Label>
          <div className="flex flex-col gap-2.5 text-[15px]">
            <a href={contactHref} className="w-fit transition hover:text-accent-strong">{SITE.contactEmail}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-fit transition hover:text-accent-strong">{SITE.whatsappDisplay} <span className="text-muted">(WhatsApp only)</span></a>
          </div>
          <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted">
            {SITE.tagline} DelChaos is sold as a complete product with its full source code.
          </p>
        </div>
      </Container>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(60%_90%_at_50%_100%,color-mix(in_oklab,var(--accent)_55%,transparent),transparent_70%)] blur-2xl" />

      <Container className="relative z-10 mt-14 md:mt-24">
        <svg viewBox={WORDMARK.viewBox} role="img" aria-label={SITE.name} className="block h-auto w-full">
          <path className="fill-fg" fillRule="evenodd" d={g.d} />
          <path className="fill-fg" d={g.c} />
          <circle className="fill-accent-strong" cx={g.head.cx} cy={g.head.cy} r={g.head.r} />
          <path className="fill-accent-strong" fillRule="evenodd" d={g.body} />
          <path className="fill-fg" transform={WORDMARK.transform} d={WORDMARK.d} />
        </svg>
      </Container>

      <Container className="relative z-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 text-xs text-muted">
        <a href="#top" className="transition hover:text-fg">Back to top</a>
        <p>&copy; {YEAR} {SITE.name}</p>
      </Container>
    </footer>
  );
}
