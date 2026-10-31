import { contactHref, SITE } from '../../site';
import { DesktopShowcase } from '../app/DesktopShowcase';
import { Backdrop3D } from '../three/Backdrop3D';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Parallax } from '../ui/Parallax';
import { TextRotate } from '../ui/TextRotate';

// The word that ends the headline. It always comes back to the brand word.
const CHAOS = ['chaos.', 'errors.', 'delays.', 'drama.'];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <Parallax range={[0, 160]} offset={['start start', 'end start']} className="absolute inset-x-0 top-0 h-[880px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,transparent_22%,black_62%,transparent_92%)]">
        <Backdrop3D mode="load" className="h-full" />
      </Parallax>
      <Container className="relative pt-16 text-center md:pt-24">
        <Parallax range={[0, -70]} offset={['start start', 'end start']}>
        <h1 className="mx-auto max-w-[16ch] text-balance text-6xl font-semibold leading-[0.96] tracking-[-0.035em] sm:text-7xl lg:text-[6rem]">
          Run your people without the <TextRotate texts={CHAOS} className="text-accent-strong" />
        </h1>
        <p className="mx-auto mt-7 max-w-[44ch] text-lg leading-relaxed text-muted md:text-xl">
          Attendance, payroll, leave, onboarding and chat in one system your whole team actually uses.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={contactHref} size="lg">{SITE.contactLabel}</Button>
          <Button href="#features" size="lg" variant="secondary">See what it does</Button>
        </div>
        </Parallax>
      </Container>
      <Container className="relative mt-14 pb-24 md:mt-20 md:pb-32">
        <DesktopShowcase />
      </Container>
    </section>
  );
}
