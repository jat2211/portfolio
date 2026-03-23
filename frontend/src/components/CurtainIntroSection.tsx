import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep(x: number) {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
}

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Full-bleed white + L/R black curtains; plain VINO title/subtitle (no card or shadow).
 * Title eases from slightly below center to ~⅓ from viewport top (⅔ up from bottom).
 */
export function CurtainIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /** Larger divisor = curtains take more of the section’s scroll to open (slower). */
  const curtainProgress = useTransform(scrollYProgress, (p) =>
    reducedMotion ? 1 : smoothstep(p / 0.42),
  );

  const leftCurtainX = useTransform(curtainProgress, [0, 1], ['0%', '-100%']);
  const rightCurtainX = useTransform(curtainProgress, [0, 1], ['0%', '100%']);

  const textY = useTransform(scrollYProgress, (p) => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    /** From flex center: move up so block center sits ~33% from top → -0.17 * h */
    const endY = -Math.round(0.17 * h);
    if (reducedMotion) return endY;
    const t = smoothstep((p - 0.04) / 0.48);
    const startY = Math.round(0.07 * h);
    return startY * (1 - t) + endY * t;
  });

  /** Fade title block in sync with vertical move (same scroll window as textY). */
  const textOpacity = useTransform(scrollYProgress, (p) =>
    reducedMotion ? 1 : smoothstep((p - 0.12) / 0.24),
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[260vh] bg-black"
      aria-label="Introduction"
    >
      <div className="sticky top-0 isolate flex h-[100dvh] w-full overflow-x-hidden overflow-y-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-white text-black">
          <motion.div
            className="flex w-full max-w-5xl flex-col px-6"
            style={{ y: textY, opacity: textOpacity }}
          >
            <h2 className="text-center text-5xl font-black lowercase tracking-tight sm:text-7xl md:text-9xl">
              vino.mp4
            </h2>
            <p className="mt-2 max-w-xl self-start pl-6 text-center text-xs font-medium uppercase tracking-[0.4em] text-neutral-600 sm:pl-60 sm:text-sm uppercase">
              Visual media in NYC
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute left-0 top-0 z-10 h-full w-1/2 bg-black will-change-transform"
          style={{ x: leftCurtainX }}
          aria-hidden
        />
        <motion.div
          className="absolute right-0 top-0 z-10 h-full w-1/2 bg-black will-change-transform"
          style={{ x: rightCurtainX }}
          aria-hidden
        />
      </div>
    </section>
  );
}
