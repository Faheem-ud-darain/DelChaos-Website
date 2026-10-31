import { BatteryFullIcon, BellSimpleIcon, CardsIcon, CellSignalFullIcon, ChatsIcon, UserCircleIcon, WifiHighIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { PEOPLE } from '../../data/people';
import { useSequence } from '../../hooks/useSequence';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { LogoMark } from '../ui/Logo';
import { ClickHint } from './ClickHint';

// The phone app: the request stack the real app uses. The top card is answered and slides away, the next comes forward,
// and a push notification arrives, on a loop while it is on screen.
const REQUESTS = [
  { p: PEOPLE.hira, dates: 'Nov 10 to Nov 11', days: '2 days', kind: 'Normal leave', why: 'Family event' },
  { p: PEOPLE.marcus, dates: 'Nov 18 to Nov 20', days: '3 days', kind: 'Urgent leave', why: 'Travel at short notice' },
  { p: PEOPLE.priya, dates: 'Dec 2 to Dec 4', days: '3 days', kind: 'Parental leave', why: 'Baby due' },
] as const;
const TABS = [{ icon: CardsIcon, label: 'Requests' }, { icon: ChatsIcon, label: 'Chat' }, { icon: BellSimpleIcon, label: 'Alerts' }, { icon: UserCircleIcon, label: 'Me' }];

export function PhoneApp({ className = '' }: { className?: string }) {
  const { ref, step } = useSequence(REQUESTS.length, 3600);
  const top = REQUESTS[step];
  const behind = [REQUESTS[(step + 1) % 3], REQUESTS[(step + 2) % 3]];
  return (
    <div ref={ref} className={`w-[300px] rounded-[2.9rem] bg-device p-2.5 shadow-[0_40px_70px_-28px_color-mix(in_srgb,var(--device)_90%,transparent)] ${className}`}>
      <div data-app className="relative flex h-[610px] flex-col overflow-hidden rounded-[2.4rem] bg-surface text-fg">
        <div className="flex items-center justify-between px-7 pb-2 pt-4 text-[13px] font-semibold">
          <span>9:41</span>
          <span className="flex items-center gap-1"><CellSignalFullIcon size={15} weight="fill" /><WifiHighIcon size={15} weight="bold" /><BatteryFullIcon size={19} weight="fill" /></span>
        </div>
        <AnimatePresence>
          {step === 1 && (
            <motion.div initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -90, opacity: 0 }} transition={{ type: 'spring', stiffness: 230, damping: 24 }} className="absolute inset-x-3 top-3 z-20 flex items-start gap-3 rounded-2xl bg-surface-2 p-3.5 shadow-[0_12px_24px_-10px_color-mix(in_srgb,var(--device)_70%,transparent)]">
              <LogoMark size={30} />
              <p className="text-[13px] leading-snug"><span className="flex justify-between font-semibold">DelChaos<span className="font-normal text-muted">now</span></span>Leave approved<br /><span className="text-muted">{REQUESTS[0].p.name}, Nov 10 to Nov 11</span></p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="px-5 pt-3">
          <h3 className="text-[30px] font-semibold tracking-tight">Requests</h3>
          <div className="mt-4 flex gap-1 rounded-lg bg-surface-2 p-1 text-[13px] font-semibold">
            <span className="flex-1 rounded-md bg-surface py-1.5 text-center shadow-[0_1px_2px_color-mix(in_srgb,var(--fg)_14%,transparent)]">Waiting 3</span>
            <span className="flex-1 py-1.5 text-center text-muted">Answered</span>
          </div>
          <div className="mt-6">
            {[...behind].reverse().map((r, i) => (
              <div key={r.p.name} aria-hidden="true" style={{ marginInline: (2 - i) * 11 }} className="-mb-3 truncate rounded-t-xl border border-b-0 border-line bg-bg px-3 pb-4 pt-2 text-xs font-semibold text-muted">{r.p.name}, {r.kind.toLowerCase()}</div>
            ))}
            <div className="relative z-[1]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={step} initial={{ y: -28, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 170, opacity: 0, rotate: 4 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={top.p.name} size={44} />
                    <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-semibold">{top.p.name}</p><p className="text-xs text-muted">{top.p.team}</p></div>
                    <Badge>{top.kind.split(' ')[0]}</Badge>
                  </div>
                  <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[13px]">
                    <div className="flex justify-between"><dt className="text-muted">Dates</dt><dd className="font-semibold">{top.dates}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Length</dt><dd className="font-semibold">{top.days}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Reason</dt><dd className="font-semibold">{top.why}</dd></div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[13px] font-semibold">
                    <span className="rounded-lg border border-line py-2.5 text-center text-muted">Reject</span>
                    <ClickHint delay={1.6} className="w-full [&>span]:w-full"><span className="rounded-lg bg-accent py-2.5 text-center text-accent-fg">Approve</span></ClickHint>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="mt-auto flex justify-around border-t border-line px-2 pb-6 pt-3 text-muted">
          {TABS.map((tab, i) => <span key={tab.label} className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${i === 0 ? 'text-fg' : ''}`}><tab.icon size={22} weight={i === 0 ? 'fill' : 'regular'} />{tab.label}</span>)}
        </div>
      </div>
    </div>
  );
}
