import { type MotionValue } from 'motion/react';
import { useEffect, useRef, type RefObject } from 'react';

const PITCH = 44; // space between points once they are in order, in CSS pixels

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);

type Dot = { sx: number; sy: number; gx: number; gy: number; delay: number; r: number };

/**
 * One field of points that changes state. At the top of the section every point lies where it fell, across the whole screen. As `order`
 * rises each of the same points travels to its place on one even grid and turns from grey to lime, sweeping left to right. Nothing is
 * added or removed: the scatter and the grid are the same points. It is drawn straight to a canvas from the scroll value.
 */
export function PointField({ order, avoid, avoidLate, className = '' }: { order: MotionValue<number>; avoid?: RefObject<HTMLElement | null>[]; avoidLate?: RefObject<HTMLElement | null>[]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let keep: { l: number; t: number; r: number; b: number; late: boolean }[] = [];
    const FEATHER = 70;
    const build = () => {
      const cols = Math.max(4, Math.round(w / PITCH));
      const rows = Math.max(4, Math.round(h / PITCH));
      const r = rng(41);
      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gx = (col + 0.5) / cols;
          const gy = (row + 0.5) / rows;
          dots.push({ sx: r(), sy: r(), gx, gy, delay: gx * 0.38 + r() * 0.1, r: 1.5 + r() * 2 });
        }
      }
    };
    const draw = () => {
      const t = order.get();
      const style = getComputedStyle(document.documentElement);
      const grey = style.getPropertyValue('--fg').trim() || '#fafafa';
      const lime = style.getPropertyValue('--accent-strong').trim() || '#c4ee3f';
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const p = ease(clamp((t - d.delay) / 0.45));
        const x = (d.sx + (d.gx - d.sx) * p) * w;
        const y = (d.sy + (d.gy - d.sy) * p) * h;
        let clear = 1;
        for (const k of keep) {
          const dx = Math.max(k.l - x, 0, x - k.r);
          const dy = Math.max(k.t - y, 0, y - k.b);
          const near = clamp(Math.hypot(dx, dy) / FEATHER);
          // "Late" areas (the finished list) only clear as the points arrive; earlier they hold nothing.
          const strength = k.late ? 0.15 * ease(clamp((t - 0.3) / 0.5)) : 1;
          clear = Math.min(clear, 1 - (1 - near) * strength);
        }
        if (clear === 0) continue;
        const size = d.r + (2.4 - d.r) * p;
        ctx.globalAlpha = 0.55 * (1 - p) * clear;
        ctx.fillStyle = grey;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        if (p > 0.02) {
          ctx.globalAlpha = 0.75 * p * clear;
          ctx.fillStyle = lime;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      build();
      const a = canvas.getBoundingClientRect();
      keep = [];
      const add = (refs: RefObject<HTMLElement | null>[] | undefined, late: boolean) => {
        for (const ref of refs ?? []) {
          const b = ref.current?.getBoundingClientRect();
          if (b) keep.push({ l: b.left - a.left - 12, t: b.top - a.top - 12, r: b.right - a.left + 12, b: b.bottom - a.top + 12, late });
        }
      };
      add(avoid, false);
      add(avoidLate, true);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const stop = order.on('change', draw);
    return () => { observer.disconnect(); stop(); };
  }, [order, avoid, avoidLate]);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
