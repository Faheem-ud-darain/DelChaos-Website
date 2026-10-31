import { CheckCircleIcon, CircleIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useSequence } from '../../hooks/useSequence';
import { Badge } from '../ui/Badge';

// Onboarding, finishing: each step ticks off in turn, the bar fills, and the last tick hands the new hire to HR.
const STEPS = ['Personal details', 'Documents', 'Bank or wallet', 'Policies signed'] as const;

export function OnboardingPreview() {
  const { ref, step } = useSequence(6, 1100);
  const done = Math.min(step, STEPS.length);
  return (
    <div ref={ref}>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-accent-strong" animate={{ width: `${(done / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} /></div>
      <ul className="mt-5 space-y-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-base">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(i < done)} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                {i < done ? <CheckCircleIcon size={22} weight="fill" className="text-accent-strong" aria-hidden="true" /> : <CircleIcon size={22} className="text-muted" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
            <span className={i < done ? 'font-medium' : 'text-muted'}>{label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 h-6">
        <AnimatePresence>{done === STEPS.length && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Badge tone="ok">Ready for HR review</Badge></motion.div>}</AnimatePresence>
      </div>
    </div>
  );
}
