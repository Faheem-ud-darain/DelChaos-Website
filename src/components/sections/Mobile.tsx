import { BellRingingIcon, CardsIcon, DesktopIcon, MoonIcon } from '@phosphor-icons/react';
import { PhoneApp } from '../app/PhoneApp';
import { Section } from '../ui/Container';
import { Parallax } from '../ui/Parallax';
import { Reveal, ScrollIn } from '../ui/ScrollEffects';
import { TiltOnPointer } from '../ui/TiltOnPointer';
import { SectionHeading } from '../ui/SectionHeading';

const POINTS = [
  { icon: CardsIcon, text: 'Approve requests by swiping through a stack of cards.' },
  { icon: BellRingingIcon, text: 'Push notifications for leave, tickets and notices.' },
  { icon: MoonIcon, text: 'Light and dark mode that follow the phone.' },
  { icon: DesktopIcon, text: 'Shifts start on a desktop, so time is recorded where the work happens.' },
] as const;

export function Mobile() {
  return (
    <Section>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Parallax range={[50, -50]} className="flex justify-center"><ScrollIn rotateY={-38} scale={0.82}><TiltOnPointer degrees={7}><PhoneApp /></TiltOnPointer></ScrollIn></Parallax>
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
