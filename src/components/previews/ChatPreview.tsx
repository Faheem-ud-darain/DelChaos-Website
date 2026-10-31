import { SparkleIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { PEOPLE } from '../../data/people';
import { useSequence } from '../../hooks/useSequence';
import { Avatar } from '../ui/Avatar';

// A ticket thread: the question arrives, a reply is typed and sent, then the assistant offers to draft the next one.
const POP = { initial: { opacity: 0, y: 10, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } } as const;

export function ChatPreview() {
  const { ref, step } = useSequence(6, 1500);
  return (
    <div ref={ref} className="min-h-[170px] space-y-3 text-sm">
      <AnimatePresence initial={false}>
        {step >= 0 && (
          <motion.div key="q" {...POP} className="flex items-start gap-2">
            <Avatar name={PEOPLE.tomas.name} size={28} />
            <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-surface-2 px-4 py-2.5">My tracker shows disconnected after the update. Can someone check?</p>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="typing" {...POP} className="flex justify-end">
            <span className="flex gap-1 rounded-2xl rounded-tr-md bg-accent px-4 py-3" aria-label="Typing">
              {[0, 1, 2].map(i => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-accent-fg" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}
            </span>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div key="a" {...POP} className="flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-tr-md bg-accent px-4 py-2.5 text-accent-fg">Looking now. Please restart the app and tell me if it reconnects.</p>
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div key="del" {...POP} className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-xs font-semibold text-muted">
            <motion.span animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.25, 1] }} transition={{ duration: 0.9 }}><SparkleIcon size={14} weight="fill" className="text-accent-strong" aria-hidden="true" /></motion.span>
            Draft a reply with Del
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
