import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import { Color, InstancedMesh, MathUtils, Object3D } from 'three';
import { useTheme } from '../../hooks/useTheme';

// A field of tiles that starts scattered and tilted, then snaps into a tidy grid: the product idea, in 3D.
// `settle` true = move to order, false = drift back to chaos. `drive` (0 to 1) overrides that and ties the order to something else, such as
// scroll position. `still` draws the ordered grid once and never animates.
const COLS = 16;
const ROWS = 9;
const COUNT = COLS * ROWS;
const GAP = 1.05;

type Tile = { from: [number, number, number]; spin: [number, number, number]; to: [number, number]; delay: number; hot: boolean };

function makeTiles(): Tile[] {
  // A fixed pseudo-random sequence, so every visit starts from the same scatter.
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return Array.from({ length: COUNT }, (_, i) => ({
    from: [(rand() - 0.5) * 26, (rand() - 0.5) * 16, (rand() - 0.2) * 9],
    spin: [(rand() - 0.5) * 6, (rand() - 0.5) * 6, (rand() - 0.5) * 6],
    to: [(i % COLS - (COLS - 1) / 2) * GAP, (Math.floor(i / COLS) - (ROWS - 1) / 2) * GAP],
    delay: rand() * 0.45,
    hot: rand() > 0.9,
  }));
}

function Tiles({ settle, still, drive }: { settle: boolean; still: boolean; drive?: MotionValue<number> }) {
  const mesh = useRef<InstancedMesh>(null);
  const progress = useRef(still ? 1 : 0);
  const dummy = useMemo(() => new Object3D(), []);
  const tiles = useMemo(() => makeTiles(), []);
  const { theme } = useTheme();

  const place = (time: number, pointerX: number, pointerY: number) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current;
    tiles.forEach((t, i) => {
      const k = MathUtils.clamp((p - t.delay * (1 - p * 0.4)) / (1 - t.delay), 0, 1);
      const e = 1 - Math.pow(1 - k, 3);
      const wave = Math.sin(time * 0.8 + i * 0.35) * 0.06 * e;
      dummy.position.set(MathUtils.lerp(t.from[0], t.to[0], e) + pointerX * 0.4 * e, MathUtils.lerp(t.from[1], t.to[1], e) + pointerY * 0.3 * e, MathUtils.lerp(t.from[2], wave, e));
      dummy.rotation.set(t.spin[0] * (1 - e), t.spin[1] * (1 - e), t.spin[2] * (1 - e));
      dummy.scale.setScalar(t.hot ? 0.9 : 0.82);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };

  // Colours come from the page's own CSS variables, so the scene follows the theme and holds no colour values of its own.
  const paint = useCallback((m: InstancedMesh | null) => {
    if (!m) return;
    const css = getComputedStyle(document.documentElement);
    const base = new Color(css.getPropertyValue('--line').trim());
    const hot = new Color(css.getPropertyValue('--accent').trim());
    tiles.forEach((t, i) => m.setColorAt(i, t.hot ? hot : base));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [tiles]);
  const setMesh = useCallback((m: InstancedMesh | null) => { mesh.current = m; paint(m); }, [paint]);
  useEffect(() => paint(mesh.current), [theme, paint]);

  useFrame(({ clock, pointer }, delta) => {
    if (still) { place(0, 0, 0); return; }
    progress.current = MathUtils.damp(progress.current, drive ? drive.get() : settle ? 1 : 0, drive ? 5 : 1.6, delta);
    place(clock.elapsedTime, pointer.x, pointer.y);
  });

  return (
    <instancedMesh
      ref={setMesh}
      args={[undefined, undefined, COUNT]}
      rotation={[-0.55, 0.2, 0]}
    >
      <boxGeometry args={[1, 1, 0.28]} />
      <meshStandardMaterial roughness={0.45} metalness={0.15} />
    </instancedMesh>
  );
}

export default function ChaosField({ settle, still, paused, drive }: { settle: boolean; still: boolean; paused: boolean; drive?: MotionValue<number> }) {
  return (
    <Canvas
      frameloop={paused ? 'never' : still ? 'demand' : 'always'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 15], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      <Tiles settle={settle} still={still} drive={drive} />
    </Canvas>
  );
}
