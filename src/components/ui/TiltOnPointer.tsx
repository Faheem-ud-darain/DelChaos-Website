import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { ReactNode } from 'react';

/** Tilts its content a few degrees toward the pointer, so the product screens feel like objects you can lean on. Flat for touch and reduced motion. */
export function TiltOnPointer({ children, degrees = 5, className = '' }: { children: ReactNode; degrees?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-degrees, degrees]), spring);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [degrees, -degrees]), spring);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return;
        const box = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - box.left) / box.width - 0.5);
        y.set((e.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}
