import { CheckCircleIcon } from '@phosphor-icons/react';
import { Section } from '../ui/Container';
import { Reveal, ScrollIn, ScrubText } from '../ui/ScrollEffects';
import { SectionHeading } from '../ui/SectionHeading';

const YOU_GET = [
  'Full source code for the web app and the iPhone and Android apps',
  'The database structure and server hooks',
  'The desktop and Chromebook shift tracker',
  'A walkthrough for push notifications and Google sign-in',
  'A handover session with the team that built it',
] as const;

const STAYS_YOURS = [
  'Your own servers and database',
  'Your own Cloudflare, Google and OneSignal accounts',
  'Your own domain, name and branding',
  'Your own release and update schedule',
] as const;

function List({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={item}><Reveal from="left" delay={i * 0.07} className="flex items-start gap-3 leading-snug">
            <CheckCircleIcon size={22} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden="true" />
            {item}
          </Reveal></li>
        ))}
      </ul>
    </div>
  );
}

export function Ownership() {
  return (
    <Section id="ownership">
      <SectionHeading title={<ScrubText text="Buy it once. Own all of it." />}>DelChaos is sold as a complete product. The software, the data and the deployment are yours to run and to change.</SectionHeading>
      <ScrollIn scale={0.93} className="mt-14">
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-line bg-surface p-5 sm:p-8 md:grid-cols-2 md:gap-16 md:p-12">
        <List title="What you get" items={YOU_GET} />
        <List title="What stays yours" items={STAYS_YOURS} />
      </div>
      </ScrollIn>
    </Section>
  );
}
