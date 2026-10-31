import { CheckIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { PEOPLE } from '../../data/people';
import { useSequence } from '../../hooks/useSequence';
import { Badge } from '../ui/Badge';

// Leave, answered: one request is approved, then a date change is moved to new days.
export function LeavePreview() {
  const { ref, step } = useSequence<HTMLUListElement>(3, 2200);
  const approved = step >= 1;
  const moved = step >= 2;
  return (
    <ul ref={ref} className="space-y-2">
      <li className="rounded-2xl border border-line bg-bg p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{PEOPLE.hira.name}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(approved)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.2 }}>
              {approved ? <Badge tone="ok"><CheckIcon size={12} weight="bold" className="mr-1" aria-hidden="true" />Approved</Badge> : <Badge>Normal leave</Badge>}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="mt-1 text-sm text-muted">Nov 10 to Nov 11</p>
      </li>
      <motion.li animate={{ borderColor: moved ? 'var(--accent-strong)' : 'var(--line)' }} className="rounded-2xl border bg-bg p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{PEOPLE.marcus.name}</span>
          <Badge tone={moved ? 'ok' : 'warn'}>{moved ? 'Dates moved' : 'Date change'}</Badge>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={String(moved)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.25 }} className="mt-1 text-sm text-muted">{moved ? 'Nov 20 to Nov 22' : 'Nov 18 to Nov 20'}</motion.p>
        </AnimatePresence>
      </motion.li>
    </ul>
  );
}
