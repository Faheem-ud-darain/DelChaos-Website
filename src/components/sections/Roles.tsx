import { CheckCircleIcon, CrownIcon, UserCircleIcon, UsersIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Section } from '../ui/Container';
import { Reveal } from '../ui/ScrollEffects';
import { SectionHeading } from '../ui/SectionHeading';
import { Tabs, type TabItem } from '../ui/Tabs';

type Role = 'admin' | 'hr' | 'lead' | 'employee';

const ROLE_TABS: TabItem<Role>[] = [
  { value: 'admin', label: 'Admin', icon: <CrownIcon size={22} aria-hidden="true" /> },
  { value: 'hr', label: 'HR', icon: <UsersThreeIcon size={22} aria-hidden="true" /> },
  { value: 'lead', label: 'Team lead', icon: <UsersIcon size={22} aria-hidden="true" /> },
  { value: 'employee', label: 'Employee', icon: <UserCircleIcon size={22} aria-hidden="true" /> },
];

const CAN: Record<Role, { title: string; points: string[] }> = {
  admin: { title: 'The final say, with the full picture', points: ['Gives final approval on leave', 'Sees every team, chat and payroll record', 'Marks salaries as paid after sending the money', 'Controls tracking, warehouses and notices', 'Reads every report in one place'] },
  hr: { title: 'The people work, done in one place', points: ['Onboards people and reviews their documents', 'Approves leave and answers date change requests', 'Prepares payroll and checks anything unusual', 'Manages teams, tasks and announcements', 'Answers support tickets'] },
  lead: { title: 'Just enough control to lead a team', points: ['Sees their team and its tasks', 'Assigns work and follows it to done', 'Reads and posts in team chat', 'Can lead more than one team', 'Raises tickets on the team\'s behalf'] },
  employee: { title: 'Everything they need, nothing they do not', points: ['Starts and ends shifts from a desktop', 'Requests leave and asks to change dates', 'Sees pay with the reason for every deduction', 'Chats with the team and files tickets', 'Uses the same app on iPhone and Android'] },
};

export function Roles() {
  const [role, setRole] = useState<Role>('admin');
  const can = CAN[role];
  return (
    <Section id="roles">
      <SectionHeading title="One system, four views.">Everyone sees what their job needs and nothing more.</SectionHeading>
      <div className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <Reveal from="left"><Tabs items={ROLE_TABS} value={role} onChange={setRole} label="Role" idPrefix="role" /></Reveal>
        <Reveal from="right" delay={0.1} className="min-w-0">
        <div id="role-panel" role="tabpanel" aria-labelledby={`role-${role}`} className="min-h-[360px] rounded-2xl border border-line bg-surface p-7 md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{can.title}</h3>
              <ul className="mt-8 space-y-4">
                {can.points.map((point, i) => (
                  <motion.li key={point} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }} className="flex items-start gap-3 text-lg leading-snug">
                    <CheckCircleIcon size={24} weight="fill" className="mt-0.5 shrink-0 text-accent-strong" aria-hidden="true" />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
        </Reveal>
      </div>
    </Section>
  );
}
