import { motion, useReducedMotion } from 'framer-motion';
import { Music } from './Music';
import type { Photo } from '../types';
import { fallbackUrl, toSrcSet } from '../lib/imageSources';
import { SafelightImage } from './SafelightImage';

interface HeroProps {
  photo: Photo;
  /** When provided, renders a looping background video instead of the photo. */
  videoUrl?: string;
}

export function Hero({ photo, videoUrl }: HeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative h-full min-h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0 isolate darkroom:bg-[#3d0606]">
        {videoUrl ? (
          <video
            className="absolute inset-0 h-full w-full object-cover grayscale darkroom:mix-blend-multiply"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <picture>
            {photo.avif?.length ? (
              <source type="image/avif" srcSet={toSrcSet(photo.avif)} sizes="100vw" />
            ) : null}
            {photo.webp?.length ? (
              <source type="image/webp" srcSet={toSrcSet(photo.webp)} sizes="100vw" />
            ) : null}
            <SafelightImage
              src={fallbackUrl(photo)}
              srcSet={toSrcSet(photo.jpg)}
              sizes="100vw"
              width={photo.width}
              height={photo.height}
              alt={photo.title}
              className="absolute inset-0 h-full w-full object-cover grayscale darkroom:mix-blend-multiply"
              decoding="async"
              fetchPriority="high"
              loading="eager"
            />
          </picture>
        )}
      </div>
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
        <p className="text-6xl font-black leading-none tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] darkroom:text-red-100 darkroom:drop-shadow-[0_2px_24px_rgba(80,0,0,0.55)] sm:text-7xl md:text-[10.5rem]">
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
        <Music />
      </motion.div>
    </div>
  );
}
