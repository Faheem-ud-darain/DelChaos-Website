import { CheckIcon, CopyIcon, WhatsappLogoIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { contactHref, SITE, whatsappHref } from '../../site';
import { Backdrop3D } from '../three/Backdrop3D';
import { Button } from '../ui/Button';
import { Section } from '../ui/Container';
import { ScrollIn } from '../ui/ScrollEffects';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(SITE.contactEmail).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  };
  return (
    <Section id="contact">
      <ScrollIn scale={0.88}>
      <div className="relative overflow-hidden rounded-2xl border border-accent-strong bg-surface px-7 py-14 md:px-16 md:py-20">
        <Backdrop3D mode="still" className="absolute inset-0 opacity-60 [mask-image:linear-gradient(to_right,transparent_25%,black_90%)]" />
        <h2 className="relative max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Talk to us about owning DelChaos.</h2>
        <p className="relative mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">Tell us about your team and we will reply with how a handover would work.</p>
        <div className="relative mt-9 flex flex-wrap items-center gap-3">
          <Button href={contactHref} size="lg">{SITE.contactLabel}</Button>
          <Button href={whatsappHref} size="lg" variant="secondary">
            <WhatsappLogoIcon size={18} weight="fill" aria-hidden="true" />
            WhatsApp {SITE.whatsappDisplay}
          </Button>
          <Button size="lg" variant="secondary" onClick={copy} aria-live="polite">
            {copied ? <CheckIcon size={18} weight="bold" aria-hidden="true" /> : <CopyIcon size={18} aria-hidden="true" />}
            {copied ? 'Copied' : SITE.contactEmail}
          </Button>
        </div>
      </div>
      </ScrollIn>
    </Section>
  );
}
