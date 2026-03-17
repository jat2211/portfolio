import { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import type { Photo } from '../types';

interface FoldersSectionProps {
  photos: Photo[];
}

export function FoldersSection({ photos }: FoldersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [24, 8, -8, -24]);
  const smoothRotateX = useSpring(rotateX, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] py-24"
      style={{ perspective: 1200 }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-12 text-[10px] tracking-widest text-white/70">
          FOLDERS
        </p>
        <motion.div
          className="grid will-change-transform grid-cols-2 gap-4 md:grid-cols-3"
          style={{
            rotateX: smoothRotateX,
            transformStyle: 'preserve-3d',
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-sm bg-neutral-900"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
