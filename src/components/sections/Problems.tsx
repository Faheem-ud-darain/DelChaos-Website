import { CheckCircleIcon } from '@phosphor-icons/react';
import type { ComponentType, ReactNode } from 'react';
import { AnnouncementPreview } from '../previews/AnnouncementPreview';
import { AttendancePreview } from '../previews/AttendancePreview';
import { ChatPreview } from '../previews/ChatPreview';
import { LeavePreview } from '../previews/LeavePreview';
import { OnboardingPreview } from '../previews/OnboardingPreview';
import { PayslipPreview } from '../previews/PayslipPreview';
import { Section } from '../ui/Container';
import { Parallax } from '../ui/Parallax';
import { Reveal, ScrollIn, ScrubText } from '../ui/ScrollEffects';
import { Screen } from '../ui/Screen';
import { SectionHeading } from '../ui/SectionHeading';

// How each screen arrives, so no two problems enter the same way.
type Enter = 'wipe' | 'swing' | 'grow' | 'drift';

type Problem = { problem: string; fix: string; points: string[]; Preview: ComponentType; enter: Enter; lime?: boolean };

const PROBLEMS: Problem[] = [
  { problem: 'Nobody knows who actually showed up.', fix: 'Employees start shifts from their desktop, on-site staff check in by location, and no-shows are found automatically with the reason recorded.', points: ['A live table of who is on shift, late or on leave', 'No-shows found for you, each with its reason', 'Short shifts flow straight into payroll'], Preview: AttendancePreview, enter: 'wipe' },
  { problem: 'Leave requests get lost in chat.', fix: 'Request, approve and move dates in the app. Clashing requests are caught before they are sent.', points: ['One inbox to approve or reject', 'Date change requests answered in the same place', 'The employee is told the moment it is decided'], Preview: LeavePreview, enter: 'swing', lime: true },
  { problem: 'Payroll disputes eat your month.', fix: 'Pay is built from attendance and leave. Every deduction shows its day and reason, and pay never drops below zero.', points: ['Each deduction listed with its date and reason', 'Employees see the same breakdown HR sees', 'HR prepares it, Admin sends the money and marks it paid'], Preview: PayslipPreview, enter: 'grow' },
  { problem: 'New hires start with a pile of forms.', fix: 'A guided wizard collects documents, bank or wallet details and policy sign-off. HR reviews and approves.', points: ['Documents, payment details and policy sign-off in one flow', 'Progress shown as they go', 'HR reviews and approves in one place'], Preview: OnboardingPreview, enter: 'drift', lime: true },
  { problem: 'Questions are scattered across five apps.', fix: 'Team chats, direct messages and support tickets live together, plus Del, an assistant that drafts replies for you to check.', points: ['Team chats and direct messages', 'Support tickets next to the conversation', 'Del drafts replies, you decide what is sent'], Preview: ChatPreview, enter: 'wipe' },
  { problem: 'Important notices get ignored.', fix: 'Mark an announcement important and everyone it targets must acknowledge it.', points: ['Mark a notice important', 'Everyone it targets has to acknowledge it'], Preview: AnnouncementPreview, enter: 'swing', lime: true },
];

function Arrive({ enter, children }: { enter: Enter; children: ReactNode }) {
  if (enter === 'wipe') return <Reveal from="right">{children}</Reveal>;
  if (enter === 'swing') return <ScrollIn rotateY={24} scale={0.9}>{children}</ScrollIn>;
  if (enter === 'grow') return <ScrollIn scale={0.86}>{children}</ScrollIn>;
  return <Parallax range={[36, -36]}>{children}</Parallax>;
}

function Row({ item, index }: { item: Problem; index: number }) {
  const { problem, fix, points, Preview, enter, lime } = item;
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-20">
      <div className={index % 2 ? 'lg:order-2' : ''}>
        <h3 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl md:text-5xl">{index % 3 === 0 ? <ScrubText text={problem} /> : problem}</h3>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted"><span className="font-semibold text-fg">DelChaos: </span>{fix}</p>
        <ul className="mt-7 space-y-3">
          {points.map(point => (
            <li key={point} className="flex items-start gap-3 leading-snug">
              <CheckCircleIcon size={22} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <Arrive enter={enter}>
        <div className={`rounded-2xl border p-5 md:p-8 ${lime ? 'border-transparent bg-accent' : 'border-line bg-surface'}`}>
          <Screen><Preview /></Screen>
        </div>
      </Arrive>
    </div>
  );
}

// One big problem per row, then the feature that fixes it, shown working. Rows alternate sides down the page.
export function Problems() {
  return (
    <Section id="solutions">
      <SectionHeading title="Six problems every HR team lives with. Six fixes, built in." />
      <div className="mt-20 space-y-[clamp(80px,12vw,160px)]">
        {PROBLEMS.map((item, i) => <Row key={item.problem} item={item} index={i} />)}
      </div>
    </Section>
  );
}
