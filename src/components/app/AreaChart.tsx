import { motion } from 'motion/react';

/** The weekly hours chart: the line draws left to right while the area under it fades in. */
export function AreaChart({ points, labels }: { points: number[]; labels: string[] }) {
  const w = 520, h = 190, pad = 14;
  const max = Math.max(...points) * 1.1;
  const xy = points.map((p, i) => [pad + (i / (points.length - 1)) * (w - pad * 2), h - pad - (p / max) * (h - pad * 2)] as const);
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const area = `${line} L${xy[xy.length - 1][0]},${h} L${xy[0][0]},${h} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="hours-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--accent-strong)', stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent-strong)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(t => <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} className="stroke-line" strokeDasharray="4 6" />)}
        <motion.path d={area} fill="url(#hours-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
        <motion.path d={line} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-strong" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
        {xy.map(([x, y], i) => <motion.circle key={i} cx={x} cy={y} r="4.5" className="fill-surface stroke-accent-strong" strokeWidth="2.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.16, type: 'spring', stiffness: 300, damping: 18 }} style={{ transformOrigin: `${x}px ${y}px` }} />)}
      </svg>
      <div className="mt-2 flex justify-between px-1 text-xs text-muted">{labels.map(label => <span key={label}>{label}</span>)}</div>
    </div>
  );
}
