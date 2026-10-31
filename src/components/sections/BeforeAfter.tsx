import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { Backdrop3D } from '../three/Backdrop3D';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

const WITHOUT = [
  'Attendance in a spreadsheet someone forgets to update',
  'Leave requests lost in a group chat',
  'Payroll worked out by hand every month',
  'Deductions nobody can explain',
  'Joining forms on paper or in email',
] as const;

const WITH = [
  'Shifts, locations and absences recorded as they happen',
  'Leave requested, approved and tracked in one place',
  'Payroll built from real attendance and leave',
  'Every deduction shown with its day and reason',
  'New hires finish onboarding inside the app',
] as const;

function Column({ title, items, good, opacity }: { title: string; items: readonly string[]; good?: boolean; opacity: MotionValue<number> | number }) {
  const Icon = good ? CheckIcon : XIcon;
  return (
    <motion.div style={{ opacity }} className={`rounded-2xl border bg-surface p-7 md:p-9 ${good ? 'border-accent-strong' : 'border-line'}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map(item => (
          <li key={item} className="flex items-start gap-3 leading-snug">
            <Icon size={20} weight="bold" className={`mt-0.5 shrink-0 ${good ? 'text-accent-strong' : 'text-muted'}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// The page's one scroll-driven moment: as the section scrolls, the tiles behind it sort themselves from scatter into a grid, and
// the "With" column comes forward as the "Without" column steps back. The motion is the argument, so it is tied to scroll.
export function BeforeAfter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const order = useTransform(scrollYProgress, [0.08, 0.7], [0, 1]);
  const without = useTransform(order, [0, 0.8], [1, 0.4]);
  const withOpacity = useTransform(order, [0.1, 0.8], [0.45, 1]);
  return (
    <section ref={ref} className={reduce ? 'py-[clamp(72px,10vw,140px)]' : 'relative h-[230vh]'}>
      <div className={reduce ? '' : 'sticky top-16 flex h-[calc(100dvh-4rem)] items-center overflow-hidden'}>
        <Backdrop3D mode={reduce ? 'still' : 'drive'} drive={order} className="absolute inset-0 opacity-90 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
        <Container className="relative">
          <SectionHeading title="Stop running HR across spreadsheets and chat groups." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Column title="Without DelChaos" items={WITHOUT} opacity={reduce ? 1 : without} />
            <Column title="With DelChaos" items={WITH} good opacity={reduce ? 1 : withOpacity} />
          </div>
        </Container>
      </div>
    </section>
  );
}
