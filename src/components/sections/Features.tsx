import type { ComponentType } from 'react';
import { AnnouncementPreview } from '../previews/AnnouncementPreview';
import { AttendancePreview } from '../previews/AttendancePreview';
import { ChatPreview } from '../previews/ChatPreview';
import { LeavePreview } from '../previews/LeavePreview';
import { OnboardingPreview } from '../previews/OnboardingPreview';
import { PayslipPreview } from '../previews/PayslipPreview';
import { Section } from '../ui/Container';
import { Reveal } from '../ui/ScrollEffects';
import { Screen } from '../ui/Screen';
import { SectionHeading } from '../ui/SectionHeading';
import { Tile } from '../ui/Tile';

// Each cell names one feature, says what it does, and shows it working.
// Cells fill a 6-column grid on a desktop (4+2, 3+3, 4+2) and stack to one column on a phone.
type Cell = { title: string; body: string; Preview: ComponentType; span: string; accent?: boolean };

const CELLS: Cell[] = [
  { title: 'Attendance that checks itself', body: 'Employees start shifts from their desktop, on-site staff check in by location, and no-shows are found automatically with the reason recorded.', Preview: AttendancePreview, span: 'md:col-span-4' },
  { title: 'Leave without the back and forth', body: 'Request, approve and move dates in the app. Clashing requests are caught before they are sent.', Preview: LeavePreview, span: 'md:col-span-2' },
  { title: 'Payroll you can explain', body: 'Pay is built from attendance and leave. Every deduction shows its day and reason, and pay never drops below zero.', Preview: PayslipPreview, span: 'md:col-span-3', accent: true },
  { title: 'Onboarding that finishes itself', body: 'A guided wizard collects documents, bank or wallet details and policy sign-off. HR reviews and approves.', Preview: OnboardingPreview, span: 'md:col-span-3' },
  { title: 'Chat, tickets and an assistant', body: 'Team chats, direct messages and support tickets, plus Del, an assistant that drafts replies for you to check.', Preview: ChatPreview, span: 'md:col-span-4' },
  { title: 'Notices people cannot miss', body: 'Mark an announcement important and everyone it targets must acknowledge it.', Preview: AnnouncementPreview, span: 'md:col-span-2', accent: true },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading title="Everything a growing team needs, in one system." />
      <div className="mt-14 grid gap-5 md:grid-cols-6">
        {CELLS.map(({ title, body, Preview, span, accent }, i) => (
          <Reveal key={title} from={i % 2 ? 'right' : 'left'} className={span}>
            <Tile tone={accent ? 'accent' : 'plain'} className="h-full" title={title} body={body}>
              <Screen><Preview /></Screen>
            </Tile>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
