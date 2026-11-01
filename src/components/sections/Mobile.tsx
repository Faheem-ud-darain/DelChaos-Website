import { BellRingingIcon, CardsIcon, DesktopIcon, MoonIcon } from '@phosphor-icons/react';
import { useInView } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PhoneApp } from '../app/PhoneApp';
import { LaserBackdrop } from '../three/LaserBackdrop';
import { Section } from '../ui/Container';
import { Parallax } from '../ui/Parallax';
import { Reveal, ScrollIn } from '../ui/ScrollEffects';
import { SectionHeading } from '../ui/SectionHeading';

const POINTS = [
  { icon: CardsIcon, text: 'Approve requests by swiping through a stack of cards.' },
  { icon: BellRingingIcon, text: 'Push notifications for leave, tickets and notices.' },
  { icon: MoonIcon, text: 'Light and dark mode that follow the phone.' },
  { icon: DesktopIcon, text: 'Shifts start on a desktop, so time is recorded where the work happens.' },
] as const;

// One beam, straight down the middle of the phone, so the light falls the same distance to either side.
const PHONE_BEAM = [{ position: 0.5, seed: 5 }] as const;

export function Mobile() {
  const column = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const seen = useInView(column, { amount: 0.35, once: true });
  // Like the hero's product window, the phone stays dark until the beam reaches it (see .hero-window in index.css).
  const [lit, setLit] = useState(false);
  const light = useCallback(() => setLit(true), []);
  useEffect(() => {
    if (!seen) return;
    const timer = window.setTimeout(light, 5000);
    return () => window.clearTimeout(timer);
  }, [seen, light]);
  return (
    <Section className="relative overflow-clip">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div ref={column} className="relative">
          <LaserBackdrop surfaceRef={surface} beams={PHONE_BEAM} enabled={seen} onLit={light} className="absolute -inset-x-[45%] -top-40 bottom-0" />
          <Parallax range={[50, -50]} className="relative flex justify-center">
            <ScrollIn rotateY={-38} scale={0.82}>
              <div ref={surface} data-lit={lit} className="hero-window rounded-[2.9rem]"><PhoneApp /></div>
            </ScrollIn>
          </Parallax>
        </div>
        <div>
          <SectionHeading title="The same app in every pocket.">The web app, an iPhone app and an Android app, all built for a phone screen first.</SectionHeading>
          <ul className="mt-10 space-y-5">
            {POINTS.map((point, i) => (
              <li key={point.text}><Reveal from="right" delay={i * 0.08} className="flex items-start gap-4 text-lg leading-snug">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent-strong"><point.icon size={22} aria-hidden="true" /></span>
                <span className="pt-1.5">{point.text}</span>
              </Reveal></li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
