import { useEffect, useState } from 'react';
import { Metaballs } from '@paper-design/shaders-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WHITE = '#FFFFFF';
const BLACK = '#000000';

/** Light / dark ball tints that stay readable across the white → black background crossfade */
const COLORS_FROM = ['#e8e4df', '#d4cfc7', '#c4b8a8', '#a89888', '#8a7d72'];
const COLORS_TO = ['#2a2624', '#3d3834', '#2e2a28', '#1a1816', '#0f0e0d'];

/** Progress through scrub range: ramp in → hold dark → ramp out before folders */
const RAMP_IN_END = 0.22;
const HOLD_END = 0.7;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep01(x: number) {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
}

function ramp01(x: number, start: number, end: number) {
  if (x <= start) return 0;
  if (x >= end) return 1;
  return smoothstep01((x - start) / (end - start));
}

function parseHex(hex: string) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lerpHex(a: string, b: string, t: number) {
  const A = parseHex(a);
  const B = parseHex(b);
  const u = clamp01(t);
  const r = Math.round(A.r + (B.r - A.r) * u);
  const g = Math.round(A.g + (B.g - A.g) * u);
  const bl = Math.round(A.b + (B.b - A.b) * u);
  return `#${[r, g, bl]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;
}

function paletteAt(blackOpacity: number) {
  const t = clamp01(blackOpacity);
  return COLORS_FROM.map((from, i) => {
    const to = COLORS_TO[Math.min(i, COLORS_TO.length - 1)] ?? BLACK;
    return lerpHex(from, to, t);
  });
}

function blackOpacityFromProgress(p: number) {
  const pp = clamp01(p);
  if (pp <= RAMP_IN_END) {
    return ramp01(pp / RAMP_IN_END, 0.08, 0.92);
  }
  if (pp <= HOLD_END) {
    return 1;
  }
  const u = (pp - HOLD_END) / (1 - HOLD_END);
  return 1 - ramp01(u, 0.08, 0.92);
}

export function ScrollBackground({ children }: { children: React.ReactNode }) {
  const [colorBack, setColorBack] = useState(WHITE);
  const [colors, setColors] = useState(() => paletteAt(0));

  useEffect(() => {
    const darkPhaseEl = document.getElementById('scroll-dark-phase');
    const foldersEl = document.getElementById('folders');
    if (!darkPhaseEl || !foldersEl) return;

    const pending = { colorBack: WHITE, colors: paletteAt(0) };
    let rafId: number | null = null;
    const flush = () => {
      setColorBack(pending.colorBack);
      setColors([...pending.colors]);
    };

    const scheduleFlush = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        flush();
      });
    };

    const applyFromBlackOpacity = (blackOpacity: number) => {
      const o = clamp01(blackOpacity);
      pending.colorBack = lerpHex(WHITE, BLACK, o);
      pending.colors = paletteAt(o);
      scheduleFlush();
    };

    const easeScroll = gsap.parseEase('power1.inOut');

    const apply = (progress: number) => {
      const pp = clamp01(easeScroll(progress));
      applyFromBlackOpacity(blackOpacityFromProgress(pp));
    };

    const st = ScrollTrigger.create({
      trigger: darkPhaseEl,
      start: 'top bottom',
      endTrigger: foldersEl,
      end: 'top top',
      scrub: true,
      onUpdate: (self) => apply(self.progress),
    });

    apply(st.progress);

    return () => {
      st.kill();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  return (
    <div className="relative min-h-full" style={{ isolation: 'isolate' }}>
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <Metaballs
          className="absolute inset-0 h-full w-full"
          width="100%"
          height="100%"
          fit="cover"
          colorBack={colorBack}
          colors={colors}
          count={12}
          size={0.78}
          speed={reducedMotion ? 0 : 0.5}
          frame={0}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
