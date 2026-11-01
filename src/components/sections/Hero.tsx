import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { contactHref, SITE } from '../../site';
import { DesktopShowcase } from '../app/DesktopShowcase';
import { LaserBackdrop } from '../three/LaserBackdrop';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { TextRotate } from '../ui/TextRotate';

// The word that ends the headline. It always comes back to the brand word.
const CHAOS = ['chaos.', 'errors.', 'delays.', 'drama.'];

export function Hero() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  // The product window stays dark until the beam reaches it (see .hero-window in index.css). If the light never arrives, it comes on anyway.
  const [lit, setLit] = useState(false);
  const light = useCallback(() => setLit(true), []);
  useEffect(() => {
    const timer = window.setTimeout(light, 5000);
    return () => window.clearTimeout(timer);
  }, [light]);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // 0 at the top of the page, 1 once the product window has risen over the copy (about 60% of a screen of scrolling).
  const progress = useTransform(scrollY, y => Math.min(1, Math.max(0, y / (0.6 * (typeof window === 'undefined' ? 800 : window.innerHeight)))));
  const scale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1, 0.9]);
  const opacity = useTransform(progress, [0, 0.85], reduce ? [1, 1] : [1, 0]);
  // The light sinks back a little further than the copy, so the window reads as coming forward.
  const bgOpacity = useTransform(progress, [0, 1], reduce ? [1, 1] : [1, 0]);
  const blur = useTransform(progress, v => (reduce ? 'none' : `blur(${v * 6}px)`));
  return (
    <section id="top" className="relative overflow-clip">
      <div className="pointer-events-none absolute inset-0">
        <motion.div style={{ opacity: bgOpacity }} className="sticky top-0 h-screen">
          <LaserBackdrop surfaceRef={surfaceRef} onLit={light} className="absolute inset-0" />
        </motion.div>
      </div>
      <Container className="sticky top-0 z-0 pt-16 text-center md:pt-24">
        <motion.div style={{ scale, opacity, filter: blur }} className="origin-top">
        <div className="mb-6 flex justify-center"><Badge tone="accent">HR software you own</Badge></div>
        <h1 className="mx-auto max-w-[16ch] text-balance text-6xl font-semibold leading-[0.96] tracking-[-0.035em] sm:text-7xl lg:text-[6rem]">
          Run your people without the <TextRotate texts={CHAOS} className="text-accent-strong" />
        </h1>
        <p className="mx-auto mt-7 max-w-[44ch] text-lg leading-relaxed text-muted md:text-xl">
          HR software for attendance, payroll, leave, onboarding and chat, in one system your whole team actually uses.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={contactHref} size="lg">{SITE.contactLabel}</Button>
          <Button href="#features" size="lg" variant="secondary">See what it does</Button>
        </div>
        </motion.div>
      </Container>
      <Container className="relative z-10 mt-6 pb-24 md:mt-8 md:pb-32">
        <DesktopShowcase surfaceRef={surfaceRef} lit={lit} />
      </Container>
    </section>
  );
}
