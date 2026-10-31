import { CheckIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useSequence } from '../../hooks/useSequence';
import { Badge } from '../ui/Badge';

// A must-read notice: it waits, the button is pressed, and it becomes "Read" so the sender can see it was acknowledged.
export function AnnouncementPreview() {
  const { ref, step } = useSequence(3, 2000);
  const read = step === 2;
  return (
    <motion.div ref={ref} animate={{ opacity: read ? 0.75 : 1 }} className="rounded-2xl border border-line bg-bg p-4">
      <motion.span animate={{ opacity: step === 0 ? [1, 0.5, 1] : 1 }} transition={{ duration: 1.4, repeat: step === 0 ? Infinity : 0 }} className="inline-block"><Badge tone="bad">Important</Badge></motion.span>
      <p className="mt-3 text-base font-semibold">Office closed this Friday</p>
      <p className="mt-1 text-sm text-muted">Shifts resume Monday at the usual time.</p>
      <motion.div animate={{ scale: step === 1 ? 0.94 : 1 }} transition={{ duration: 0.15 }} className={`mt-4 flex h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold ${read ? 'bg-accent text-accent-fg' : 'border border-line text-fg'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(read)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">
            {read ? <><CheckIcon size={16} weight="bold" aria-hidden="true" />Read</> : 'Mark as read'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
