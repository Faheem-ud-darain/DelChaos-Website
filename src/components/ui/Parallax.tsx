import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

type Props = { children: ReactNode; className?: string; range?: [number, number]; offset?: ['start end' | 'start start', 'end start'] };

/** Moves its content from range[0] to range[1] pixels (vertically) as it scrolls through the screen, so layers travel at different speeds. Still for reduced motion. */
export function Parallax({ children, className = '', range = [40, -40], offset = ['start end', 'end start'] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : range);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}
