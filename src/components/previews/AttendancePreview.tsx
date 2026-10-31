import { AnimatePresence, motion } from 'motion/react';
import { PEOPLE } from '../../data/people';
import { useSequence } from '../../hooks/useSequence';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

// Attendance, live: hours fill in and the last person starts their shift partway through the loop.
const ROWS = [
  { name: PEOPLE.amna.name, hours: 78 },
  { name: PEOPLE.jonas.name, hours: 54 },
  { name: PEOPLE.priya.name, hours: 0, leave: true },
] as const;

export function AttendancePreview() {
  const { ref, step } = useSequence(5, 1500);
  const started = step >= 2;
  return (
    <div ref={ref}>
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted">
        <span>Today</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(started)} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} className="text-fg">{started ? '4 on shift' : '3 on shift'}</motion.span>
        </AnimatePresence>
      </div>
      <ul className="space-y-2">
        {ROWS.map(row => (
          <li key={row.name} className="flex items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-3">
            <Avatar name={row.name} />
            <span className="flex-1 truncate text-sm font-medium">{row.name}</span>
            <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-surface-2 sm:block"><motion.span className="block h-full rounded-full bg-accent-strong" initial={{ width: 0 }} animate={{ width: `${row.hours}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} /></span>
            <Badge tone={'leave' in row ? 'neutral' : 'ok'}>{'leave' in row ? 'On leave' : 'On shift'}</Badge>
          </li>
        ))}
        <motion.li animate={{ borderColor: started ? 'var(--accent-strong)' : 'var(--line)' }} className="flex items-center gap-3 rounded-2xl border bg-bg px-4 py-3">
          <Avatar name={PEOPLE.tomas.name} />
          <span className="flex-1 truncate text-sm font-medium">{PEOPLE.tomas.name}</span>
          <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-surface-2 sm:block"><motion.span className="block h-full rounded-full bg-accent-strong" animate={{ width: started ? '8%' : '0%' }} /></span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(started)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Badge tone={started ? 'ok' : 'warn'}>{started ? 'On shift' : 'Not started'}</Badge>
            </motion.span>
          </AnimatePresence>
        </motion.li>
      </ul>
    </div>
  );
}
