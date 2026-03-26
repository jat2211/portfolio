import { useId } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Subtle full-viewport film grain when safelight mode is on.
 */
export function DarkroomGrain({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion();
  const rawId = useId();
  const filterId = `darkroom-grain-${rawId.replace(/:/g, '')}`;

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]">
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="gray"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${filterId})`}
          className={
            reducedMotion ? '' : 'animate-darkroom-grain-shift origin-center'
          }
        />
      </svg>
    </div>
  );
}
