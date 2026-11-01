import { FAQ } from '../../data/faq';
import { Accordion } from '../ui/Accordion';
import { Section } from '../ui/Container';
import { ScrollIn } from '../ui/ScrollEffects';
import { SectionHeading } from '../ui/SectionHeading';


export function Faq() {
  return (
    <Section id="faq">
      <ScrollIn blur={14}><SectionHeading title="Questions people ask first." /></ScrollIn>
      <div className="mt-12 max-w-4xl"><Accordion items={FAQ} /></div>
    </Section>
  );
}
