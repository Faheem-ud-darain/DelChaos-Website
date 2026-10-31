import { Accordion, type AccordionItem } from '../ui/Accordion';
import { Section } from '../ui/Container';
import { ScrollIn } from '../ui/ScrollEffects';
import { SectionHeading } from '../ui/SectionHeading';

const FAQ: AccordionItem[] = [
  { question: 'Who is DelChaos for?', answer: 'Companies that run shift-based or distributed teams and want their own HR system instead of renting one. It suits a team from a few dozen people upwards.' },
  { question: 'Can we host it ourselves?', answer: 'Yes. You deploy the web app on your own hosting and run the database on your own server. Push notifications and Google sign-in use your own accounts.' },
  { question: 'Do we get the source code?', answer: 'Yes. DelChaos is sold as a complete product with its full source code, so your developers can change anything.' },
  { question: 'How does attendance work?', answer: 'Employees start and end shifts from a desktop. On-site staff can check in by location. Absences are found automatically and each one records its reason.' },
  { question: 'Which currencies and countries does payroll support?', answer: 'Pay is calculated in two regions today, in PKR and in USD, and the two are never mixed. More regions can be added in the code.' },
  { question: 'How do we get started?', answer: 'Send us a message. We will ask about your team and explain how a handover would work.' },
];

export function Faq() {
  return (
    <Section id="faq">
      <ScrollIn blur={14}><SectionHeading title="Questions people ask first." /></ScrollIn>
      <div className="mt-12 max-w-4xl"><Accordion items={FAQ} /></div>
    </Section>
  );
}
