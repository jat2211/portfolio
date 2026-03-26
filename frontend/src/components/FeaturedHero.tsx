import { motion, useReducedMotion } from 'framer-motion';
import { HeroAmbientMusic } from './HeroAmbientMusic';
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
        className="pointer-events-none absolute bottom-0 left-0 px-8 pb-4 pt-4 sm:pb-5"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <p className="text-6xl font-black leading-none tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-7xl md:text-[10.5rem]">
          <span className="inline-block align-baseline">Visual</span>
          <br className="sm:hidden" />
          <span>Media</span>
        </p>
      </motion.div>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 }}
      >
        <HeroAmbientMusic />
      </motion.div>
    </div>
  );
}
