import { BellIcon, CalendarCheckIcon, CheckIcon, ChatsIcon, ClockIcon, MagnifyingGlassIcon, UsersIcon, WalletIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { PEOPLE } from '../../data/people';
import { useSequence } from '../../hooks/useSequence';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { CountUp } from '../ui/CountUp';
import { LogoMark } from '../ui/Logo';
import { ScaleToFit } from '../ui/ScaleToFit';
import { AreaChart } from './AreaChart';
import { ClickHint } from './ClickHint';

// The desktop app: laid out at one fixed size and scaled to fit, with sample data. It walks through three screens by itself:
// a leave inbox where Approve is clicked, the live attendance table, and a payslip being checked before it is paid.
type View = 'leave' | 'attendance' | 'payroll';
const VIEWS: View[] = ['leave', 'attendance', 'payroll'];
const TITLES: Record<View, string> = { leave: 'Leave requests', attendance: 'Attendance today', payroll: 'October payroll' };
const NAV: { label: string; icon: ReactNode; view?: View }[] = [
  { label: 'Leave', icon: <CalendarCheckIcon size={20} />, view: 'leave' },
  { label: 'Attendance', icon: <ClockIcon size={20} />, view: 'attendance' },
  { label: 'Payroll', icon: <WalletIcon size={20} />, view: 'payroll' },
  { label: 'People', icon: <UsersIcon size={20} /> },
  { label: 'Chat', icon: <ChatsIcon size={20} /> },
];

function useAfter(ms: number) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => setDone(true), ms);
    return () => window.clearTimeout(timer);
  }, [ms, reduce]);
  return done;
}

function LeaveView() {
  const approved = useAfter(2700);
  const rows = [PEOPLE.hira, PEOPLE.marcus, PEOPLE.priya];
  return (
    <div className="grid grid-cols-[1fr_330px] gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-muted">Waiting for you</p>
        <ul className="space-y-3">
          {rows.map((person, i) => {
            const done = i === 0 && approved;
            return (
              <motion.li key={person.name} layout animate={{ borderColor: done ? 'var(--accent-strong)' : 'var(--line)' }} className="flex items-center gap-4 rounded-xl border bg-surface p-4">
                <Avatar name={person.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold">{person.name}</p>
                  <p className="text-sm text-muted">{i === 1 ? 'Date change · Nov 18 to Nov 20 moves to Nov 20 to Nov 22' : i === 0 ? 'Normal leave · Nov 10 to Nov 11 · 2 days' : 'Parental leave · Dec 2 to Dec 4 · 3 days'}</p>
                </div>
                {done ? (
                  <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Badge tone="ok"><CheckIcon size={13} weight="bold" className="mr-1" aria-hidden="true" />Approved, Hira told</Badge></motion.span>
                ) : (
                  <div className="flex gap-2">
                    <span className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted">Reject</span>
                    {i === 0 ? <ClickHint delay={1.7}><span className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg">Approve</span></ClickHint> : <span className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg">Approve</span>}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-xl border border-line p-5">
        <p className="text-sm font-semibold text-muted">Hours worked this week</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight"><CountUp to={212} suffix=" h" /></p>
        <p className="mb-5 text-sm text-muted">across 41 people</p>
        <AreaChart points={[31, 38, 36, 42, 40, 14, 11]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} />
      </div>
    </div>
  );
}

const TABLE = [
  { p: PEOPLE.amna, started: '8:02', hours: '6h 12m' },
  { p: PEOPLE.jonas, started: '8:47', hours: '5h 20m' },
  { p: PEOPLE.priya, started: '9:00', hours: '4h 58m' },
  { p: PEOPLE.hira, started: '', hours: 'On leave' },
] as const;

function AttendanceView() {
  const started = useAfter(1700);
  return (
    <div>
      <div className="mb-5 flex gap-2 text-sm font-semibold">
        {['All 41', 'On shift 38', 'Not started 2', 'On leave 1'].map((tab, i) => <span key={tab} className={`rounded-lg px-4 py-2 ${i === 0 ? 'bg-fg text-bg' : 'text-muted'}`}>{tab}</span>)}
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-surface-2 px-5 py-3 text-xs font-semibold text-muted"><span>Employee</span><span>Started</span><span>Today</span><span>Status</span></div>
        {[...TABLE, { p: PEOPLE.tomas, started: started ? '9:14' : '', hours: started ? '0h 02m' : 'Not yet' }].map(row => {
          const leave = row.hours === 'On leave';
          const late = row.p.name === PEOPLE.tomas.name;
          return (
            <motion.div key={row.p.name} animate={{ backgroundColor: late && started ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'transparent' }} transition={{ duration: 0.6 }} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-t border-line px-5 py-3.5 text-sm">
              <span className="flex items-center gap-3"><Avatar name={row.p.name} size={34} /><span><span className="block font-semibold">{row.p.name}</span><span className="text-xs text-muted">{row.p.team}</span></span></span>
              <span className="text-muted">{row.started || 'Not yet'}</span>
              <span>{row.hours}</span>
              <span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={leave ? 'l' : late && !started ? 'w' : 'o'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="inline-block">
                    <Badge tone={leave ? 'neutral' : late && !started ? 'warn' : 'ok'}>{leave ? 'On leave' : late && !started ? 'Not started' : 'On shift'}</Badge>
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const DEDUCTIONS = [
  { day: 'Thu, Oct 15', why: 'Worked 4h 36m of 8h', amount: '-$12.40' },
  { day: 'Fri, Oct 23', why: 'Worked 4h 0m of 8h', amount: '-$14.60' },
  { day: 'Thu, Oct 29', why: 'Worked 7h 9m of 8h', amount: '-$3.10' },
] as const;
const CHECKS = ['Attendance checked', 'Every deduction explained', 'Bank details on file'] as const;

function PayrollView() {
  const checked = useAfter(1500);
  return (
    <div className="grid grid-cols-[1fr_300px] gap-8">
      <div className="rounded-xl border border-line p-6">
        <div className="mb-5 flex items-center gap-3"><Avatar name={PEOPLE.tomas.name} size={44} /><div><p className="font-semibold">{PEOPLE.tomas.name}</p><p className="text-sm text-muted">{PEOPLE.tomas.team}</p></div></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Monthly salary</span><span className="font-semibold">$640.00</span></div>
        <div className="mt-4 flex justify-between text-sm font-semibold"><span>Short hours</span><span className="text-bad">-$30.10</span></div>
        <ul className="mt-3 space-y-2.5 border-t border-line pt-3 text-sm">
          {DEDUCTIONS.map((line, i) => (
            <motion.li key={line.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex justify-between">
              <span><span className="font-semibold">{line.day}</span><span className="text-muted"> · {line.why}</span></span><span className="text-muted">{line.amount}</span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-5 flex items-end justify-between border-t border-line pt-4"><span className="font-semibold">Amount to pay</span><span className="text-3xl font-semibold tracking-tight"><CountUp to={609.9} prefix="$" decimals={2} duration={1.6} /></span></div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-muted">Before it is paid</p>
        <ul className="space-y-3">
          {CHECKS.map((label, i) => {
            const done = checked;
            return (
              <motion.li key={label} initial={false} animate={{ opacity: done ? 1 : 0.5 }} transition={{ delay: i * 0.35 }} className="flex items-center gap-3 rounded-xl border border-line p-4 text-sm font-semibold">
                <motion.span animate={{ backgroundColor: done ? 'var(--accent)' : 'var(--surface-2)' }} transition={{ delay: i * 0.35 }} className="flex h-6 w-6 items-center justify-center rounded-full text-accent-fg"><CheckIcon size={14} weight="bold" aria-hidden="true" /></motion.span>
                {label}
              </motion.li>
            );
          })}
        </ul>
        <motion.div animate={{ opacity: checked ? 1 : 0.4 }} transition={{ delay: 1.2 }} className="mt-5 rounded-xl bg-fg py-3 text-center text-sm font-semibold text-bg">Send to Admin to pay</motion.div>
      </div>
    </div>
  );
}

export function DesktopApp() {
  const { ref, step } = useSequence(VIEWS.length, 7500);
  const view = VIEWS[step];
  return (
    <div ref={ref} data-app className="overflow-hidden rounded-xl bg-surface shadow-[0_40px_80px_-30px_color-mix(in_srgb,var(--device)_90%,transparent)]">
      <ScaleToFit width={1120} height={690}>
        <div className="flex h-full text-fg">
          <nav aria-hidden="true" className="flex w-[232px] flex-col border-r border-line bg-bg px-4 py-6">
            <div className="mb-8 flex items-center gap-3 px-2 text-lg font-semibold tracking-tight"><LogoMark size={30} />DelChaos</div>
            <div className="space-y-1">
              {NAV.map(item => (
                <span key={item.label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold ${item.view === view ? 'bg-surface text-fg shadow-[0_1px_2px_color-mix(in_srgb,var(--fg)_14%,transparent)]' : 'text-muted'}`}>{item.icon}{item.label}</span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-3 px-2"><Avatar name="Dana Okafor" size={36} /><span className="text-sm"><span className="block font-semibold">Dana Okafor</span><span className="text-muted">HR manager</span></span></div>
          </nav>
          <main className="flex-1 overflow-hidden bg-surface px-9 py-7">
            <div className="mb-7 flex items-center justify-between">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3 key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="text-[26px] font-semibold tracking-tight">{TITLES[view]}</motion.h3>
              </AnimatePresence>
              <div className="flex items-center gap-3 text-muted">
                <span className="flex w-60 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"><MagnifyingGlassIcon size={16} />Search people</span>
                <BellIcon size={22} />
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={view} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                {view === 'leave' ? <LeaveView /> : view === 'attendance' ? <AttendanceView /> : <PayrollView />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </ScaleToFit>
    </div>
  );
}
