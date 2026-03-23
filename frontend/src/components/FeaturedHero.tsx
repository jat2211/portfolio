import { motion, useReducedMotion } from 'framer-motion';
import type { Photo } from '../types';

interface FeaturedHeroProps {
  photo: Photo;
}

export function FeaturedHero({ photo }: FeaturedHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative h-full min-h-[100dvh] w-full overflow-hidden">
      <img
        src={photo.url}
        alt={photo.title}
        className="absolute inset-0 h-full w-full object-cover grayscale"
        decoding="async"
        fetchPriority="high"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 px-6 pb-8 pt-4 sm:pb-10"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <p className="text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-9xl">
          Visual Media
        </p>
      </motion.div>
    </div>
  );
}
