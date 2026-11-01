import { LOGO } from './logoPaths';

/**
 * The mark: a person standing on d and c, the two letters sharing one stroke. The letters take the text colour and the
 * person takes the accent. Every part is its own element so it can move: the loop in index.css is chaos, then order.
 * `full` keeps the tie (48 px and up); the default is the heavier small cut. `animated` plays the loop.
 */
export function LogoMark({ size = 28, full = false, animated = false }: { size?: number; full?: boolean; animated?: boolean }) {
  const g = full ? LOGO.full : LOGO.small;
  return (
    <svg viewBox={g.viewBox} height={size} width={size} aria-hidden="true" className={animated ? 'dc-mark' : undefined} style={{ overflow: 'visible' }}>
      <path className="dc-d fill-fg" fillRule="evenodd" d={g.d} />
      <path className="dc-c fill-fg" d={g.c} />
      <g className="dc-person">
        <circle className="dc-head fill-accent-strong" cx={g.head.cx} cy={g.head.cy} r={g.head.r} />
        <path className="dc-body fill-accent-strong" fillRule="evenodd" d={g.body} />
      </g>
    </svg>
  );
}

export function Logo({ className = '', animated = true }: { className?: string; animated?: boolean }) {
  return (
    <a href="#top" className={`inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight ${className}`} aria-label="DelChaos home">
      <LogoMark size={34} animated={animated} />
      DelChaos
    </a>
  );
}
