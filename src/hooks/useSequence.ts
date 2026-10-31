import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * A looping step counter for the animated previews. It only runs while the element is on screen (so nothing animates
 * out of sight) and, for people who prefer reduced motion, stays on the last step (the finished picture).
 * Attach `ref` to the preview's outer element; read `step` to decide what to show.
 */
export function useSequence<T extends HTMLElement = HTMLDivElement>(steps: number, ms: number) {
  const ref = useRef<T>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    const timer = window.setInterval(() => setStep(s => (s + 1) % steps), ms);
    return () => window.clearInterval(timer);
  }, [visible, reduce, steps, ms]);
  return { ref, step: reduce ? steps - 1 : step, visible };
}
