import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type ReactNode } from 'react';

type Box = { children: ReactNode; className?: string };

const WIPE = {
  left: { hidden: 'inset(0 100% 0 0 round 16px)', x: -48, y: 0 },
  right: { hidden: 'inset(0 0 0 100% round 16px)', x: 48, y: 0 },
  up: { hidden: 'inset(100% 0 0 0 round 16px)', x: 0, y: 48 },
} as const;

/** Wipes into view from one side the first time it is scrolled to. Visible straight away for reduced motion. The wrapper is the one watched: a fully clipped element never counts as on screen. */
export function Reveal({ children, className = '', from = 'up', delay = 0 }: Box & { from?: keyof typeof WIPE; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const { hidden, x, y } = WIPE[from];
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full"
        initial={false}
        animate={reduce || seen ? { clipPath: 'inset(0 0 0 0 round 16px)', x: 0, y: 0 } : { clipPath: hidden, x, y }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Tied to scroll, not time: grows, swings round or comes into focus as it arrives, and is settled by the time it is a third of the way up the screen. */
export function ScrollIn({ children, className = '', scale = 1, rotateY = 0, blur = 0 }: Box & { scale?: number; rotateY?: number; blur?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const done = (from: number, to: number): [number, number] => (reduce ? [to, to] : [from, to]);
  const s = useTransform(scrollYProgress, [0, 1], done(scale, 1));
  const r = useTransform(scrollYProgress, [0, 1], done(rotateY, 0));
  const b = useTransform(scrollYProgress, v => (blur && !reduce ? `blur(${(1 - v) * blur}px)` : 'none'));
  return <motion.div ref={ref} style={{ scale: s, rotateY: r, filter: b, transformPerspective: 1400 }} className={className}>{children}</motion.div>;
}

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** A sentence that lights up word by word as you scroll through it. Read in full by screen readers and shown in full for reduced motion. */
export function ScrubText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.4'] });
  if (reduce) return <>{text}</>;
  const words = text.split(' ');
  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
      </span>
    </span>
  );
}
