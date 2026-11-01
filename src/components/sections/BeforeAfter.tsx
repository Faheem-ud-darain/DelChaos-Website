import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, type RefObject } from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { PointField } from './PointField';

// Each point is one piece of work, said twice: how it is handled without DelChaos, and how it is handled with it. `scatter` is where the
// point first lies on the screen (as fractions of the stage) and how crooked it is.
const POINTS: { tag: string; without: string; with: string; scatter: { x: number; y: number; rot: number } }[] = [
  { tag: 'Attendance', without: 'Attendance in a spreadsheet someone forgets to update', with: 'Shifts, locations and absences recorded as they happen', scatter: { x: 0.36, y: 0.33, rot: -6 } },
  { tag: 'Leave', without: 'Leave requests lost in a group chat', with: 'Leave requested, approved and tracked in one place', scatter: { x: 0.03, y: 0.56, rot: 5 } },
  { tag: 'Payroll', without: 'Payroll worked out by hand every month', with: 'Payroll built from real attendance and leave', scatter: { x: 0.5, y: 0.74, rot: -4 } },
  { tag: 'Deductions', without: 'Deductions nobody can explain', with: 'Every deduction shown with its day and reason', scatter: { x: 0.6, y: 0.5, rot: 7 } },
  { tag: 'Onboarding', without: 'Joining forms on paper or in email', with: 'New hires finish onboarding inside the app', scatter: { x: 0.04, y: 0.87, rot: -5 } },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * One written point. Its row is laid out like a line in an index (the sentence, a label, a frosted bar behind), and the sentence is
 * then thrown to its scatter spot with a transform. As `order` rises the sentence travels home and straightens, its words change from the
 * problem to the fix, and the frosted row and label arrive around it. The finished list is real, aligned text.
 */
function Point({ item, index, order, stage }: { item: (typeof POINTS)[number]; index: number; order: MotionValue<number>; stage: RefObject<HTMLElement | null> }) {
  const row = useRef<HTMLLIElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  useEffect(() => {
    const li = row.current;
    const sentence = chip.current;
    const box = stage.current;
    if (!li || !sentence || !box) return;
    const measure = () => {
      const area = box.getBoundingClientRect();
      const home = li.getBoundingClientRect();
      // On a phone the chips scatter only a little sideways and stay below the caption, so none runs off the screen or covers the text.
      const small = area.width < 640;
      const sx = small ? 0.02 + (index % 2) * 0.07 : item.scatter.x;
      const sy = small ? 0.46 + (index / POINTS.length) * 0.5 : item.scatter.y;
      ox.set(sx * area.width - (home.left - area.left));
      oy.set(sy * area.height - (home.top - area.top + sentence.offsetTop));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [item.scatter.x, item.scatter.y, index, ox, oy, stage]);
  const p = useTransform(order, v => clamp((v - index * 0.06) / 0.45));
  const x = useTransform([ox, p], ([o, q]: number[]) => o * (1 - q));
  const y = useTransform([oy, p], ([o, q]: number[]) => o * (1 - q));
  const rotate = useTransform(p, v => item.scatter.rot * (1 - v));
  const was = useTransform(p, [0.1, 0.55], [1, 0]);
  const now = useTransform(p, [0.45, 0.9], [0, 1]);
  return (
    <li ref={row} className="relative">
      <motion.span aria-hidden="true" style={{ opacity: now }} className="absolute inset-0 rounded-2xl border border-fg/15 bg-fg/[0.06] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl" />
      <motion.span aria-hidden="true" style={{ opacity: now }} className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:block">{item.tag}</motion.span>
      <motion.div ref={chip} style={{ x, y, rotate }} className="relative flex w-fit max-w-[90%] items-start gap-2.5 rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug sm:gap-3 sm:px-5 sm:py-3.5 sm:text-lg md:max-w-[min(100%,46rem)] md:text-2xl">
        <motion.span aria-hidden="true" style={{ opacity: was }} className="absolute inset-0 rounded-2xl border border-fg/25 bg-fg/[0.09] shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_32px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl" />
        <span className="relative mt-0.5 h-5 w-5 shrink-0 sm:mt-1.5 md:mt-2">
          <motion.span style={{ opacity: was }} className="absolute inset-0 text-fg"><XIcon size={20} weight="bold" aria-hidden="true" /></motion.span>
          <motion.span style={{ opacity: now }} className="absolute inset-0 text-accent-strong"><CheckIcon size={20} weight="bold" aria-hidden="true" /></motion.span>
        </span>
        <span className="relative grid">
          <motion.span style={{ opacity: was }} className="col-start-1 row-start-1 font-medium text-fg">{item.without}</motion.span>
          <motion.span style={{ opacity: now }} className="col-start-1 row-start-1 font-medium tracking-[-0.01em] text-fg">{item.with}</motion.span>
        </span>
      </motion.div>
    </li>
  );
}

// The page's one scroll-driven moment. Without DelChaos, the work is everywhere: written points lie scattered across the screen over a
// field of loose dots. As the section scrolls, the dots sort into a grid and each written point travels into an aligned list and turns
// from the problem into its fix. The motion is the argument, so it is tied to scroll.
export function BeforeAfter() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const order = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const settled = useTransform(order, () => 1);
  const drive = reduce ? settled : order;
  const before = useTransform(drive, [0.3, 0.5], [1, 0]);
  const after = useTransform(drive, [0.5, 0.85], [0, 1]);
  return (
    <section ref={ref} className={reduce ? 'relative h-[100dvh] min-h-[760px]' : 'relative h-[280vh]'}>
      <div ref={stage} className={reduce ? 'relative h-full overflow-hidden' : 'sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden'}>
        <PointField order={drive} avoid={[header]} avoidLate={[list]} className="absolute inset-0" />
        <Container className="relative pt-[clamp(32px,6vh,72px)]">
          <div ref={header} className="w-fit max-w-full">
          <SectionHeading title="Stop running HR across spreadsheets and chat groups." />
          <div className="relative mt-4 min-h-[4.5rem] max-w-[52ch] text-base leading-relaxed sm:mt-5 sm:min-h-[3.5rem] sm:text-lg md:text-xl">
            <motion.p style={{ opacity: reduce ? 0 : before }} className="absolute inset-0 text-muted">
              <strong className="font-semibold text-fg">Without DelChaos</strong>, work is everywhere: a spreadsheet, a group chat, a paper form, someone&rsquo;s memory.
            </motion.p>
            <motion.p style={{ opacity: reduce ? 1 : after }} className="absolute inset-0 text-muted">
              <strong className="font-semibold text-accent-strong">With DelChaos</strong>, every piece of work has a place, and you can see all of it.
            </motion.p>
          </div>
          </div>
          <ul ref={list} className="relative mt-5 space-y-2 sm:mt-8 sm:space-y-3">
            {POINTS.map((item, i) => <Point key={item.with} item={item} index={i} order={drive} stage={stage} />)}
          </ul>
        </Container>
      </div>
    </section>
  );
}
