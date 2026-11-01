import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type RefObject } from 'react';
import { DesktopApp } from './DesktopApp';

/** The desktop app under the hero. It starts tipped back and rises flat as it scrolls into place, */
export function DesktopShowcase({ surfaceRef, lit = true }: { surfaceRef?: RefObject<HTMLDivElement | null>; lit?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.94, 1]);
  return (
    <motion.div ref={ref} style={{ rotateX, scale, transformPerspective: 1600, transformOrigin: '50% 100%' }}>
      <div ref={surfaceRef} data-lit={lit} className="hero-window rounded-2xl"><DesktopApp /></div>
    </motion.div>
  );
}
