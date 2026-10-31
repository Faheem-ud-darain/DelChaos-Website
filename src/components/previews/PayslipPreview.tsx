import { motion } from 'motion/react';
import { useSequence } from '../../hooks/useSequence';
import { CountUp } from '../ui/CountUp';

// A deduction is only fair if the person can see which day it was and why. The dated lines write themselves in, then replay.
const LINES = [
  { day: 'Thu, Oct 15', why: 'Worked 4h 36m of 8h', amount: '-$12.40' },
  { day: 'Fri, Oct 23', why: 'Worked 4h 0m of 8h', amount: '-$14.60' },
  { day: 'Thu, Oct 29', why: 'Worked 7h 9m of 8h', amount: '-$3.10' },
] as const;

export function PayslipPreview() {
  const { ref, step } = useSequence(2, 6500);
  return (
    <div ref={ref} className="space-y-3 text-sm">
      <div className="flex justify-between"><span className="text-muted">Monthly salary</span><span className="font-semibold">$640.00</span></div>
      <div className="rounded-2xl border border-line bg-bg p-4">
        <div className="flex justify-between font-semibold"><span>Short hours</span><span className="text-bad">-$30.10</span></div>
        <ul key={step} className="mt-3 space-y-2 border-t border-line pt-3">
          {LINES.map((line, i) => (
            <motion.li key={line.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.4 }} className="flex items-start justify-between gap-3">
              <span><span className="font-semibold">{line.day}</span><span className="text-muted"> · {line.why}</span></span>
              <span className="shrink-0 text-muted">{line.amount}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><span>Amount to pay</span><span key={step}><CountUp to={609.9} prefix="$" decimals={2} duration={1.5} /></span></div>
    </div>
  );
}
