import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Section } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

const STEPS = [
  { title: 'Add your people', body: 'Invite employees. The onboarding wizard gathers their details, documents, bank or wallet and policy sign-off.' },
  { title: 'Set your rules', body: 'Choose shift hours, absence limits, leave types and how new joiners are paid. The rules live in code you own, so they change when you do.' },
  { title: 'Run the month', body: 'Attendance and leave flow into payroll. HR checks it, Admin sends the money and marks it paid.' },
] as const;

// A line that fills as you read down the three steps: scroll position is the meaning here (how far through the month you are).
export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <Section id="how" className="bg-surface-2/50">
      <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
        <SectionHeading title="From first hire to payday." className="lg:sticky lg:top-28 lg:self-start" />
        <ol ref={ref} className="relative space-y-16 pl-10 md:pl-14">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-line" />
          <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : fill, transformOrigin: 'top' }} className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-accent-strong" />
          {STEPS.map(step => (
            <li key={step.title} className="relative">
              <span aria-hidden="true" className="absolute -left-10 top-2 h-4 w-4 rounded-full border-2 border-accent-strong bg-bg md:-left-14" />
              <h3 className="text-2xl font-semibold tracking-tight md:text-4xl">{step.title}</h3>
              <p className="mt-3 max-w-[48ch] text-lg leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
