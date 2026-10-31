import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect } from 'react';

/** A number that counts up to its value, so a figure arriving on screen reads as live. */
export function CountUp({ to, prefix = '', suffix = '', decimals = 0, duration = 1.1 }: { to: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
  const value = useMotionValue(0);
  const text = useTransform(value, v => `${prefix}${v.toFixed(decimals)}${suffix}`);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { value.set(to); return; }
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [to, duration, reduce, value]);
  return <motion.span>{text}</motion.span>;
}
