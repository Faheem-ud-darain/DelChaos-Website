import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Props = { texts: string[]; interval?: number; stagger?: number; className?: string };

/** One word that swaps for the next, a letter at a time: the old word slides up and out, the new one rises in. Pauses off screen; still for reduced motion. Screen readers get the current word. */
export function TextRotate({ texts, interval = 2600, stagger = 0.03, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % texts.length), interval);
    return () => window.clearInterval(timer);
  }, [visible, reduce, texts.length, interval]);
  const text = texts[index];
  return (
    <span ref={ref} className={`inline-grid overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom ${className}`}>
      <span className="sr-only">{text}</span>
      {texts.map(t => <span key={t} aria-hidden="true" className="invisible col-start-1 row-start-1 select-none">{t}</span>)}
      <AnimatePresence mode="wait" initial={false}>
        <span key={text} aria-hidden="true" className="col-start-1 row-start-1 inline-flex justify-self-start">
          {Array.from(text).map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, delay: i * stagger }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      </AnimatePresence>
    </span>
  );
}
