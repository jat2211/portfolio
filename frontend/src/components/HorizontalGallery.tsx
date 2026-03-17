import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '../types';

const CARD_WIDTH_VW = 230;
const SCROLL_DURATION_S = 60;

interface HorizontalGalleryProps {
  photos: Photo[];
}

export function HorizontalGallery({ photos }: HorizontalGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const duplicatedPhotos = [...photos, ...photos];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <motion.div
        className="flex h-full will-change-transform items-center gap-[0.002vw] pl-[.002vw]"
        style={{ width: 'max-content' }}
        animate={{ x: [0, '-30%'] }}
        transition={{
          repeat: Infinity,
          duration: SCROLL_DURATION_S,
          ease: 'linear',
        }}
      >
        {duplicatedPhotos.map((photo, i) => (
          <GalleryCard
            key={`${photo.id}-${i}`}
            photo={photo}
            onClick={() => setSelectedId(photo.id)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedId && (
          <EnlargeOverlay
            photo={photos.find((p) => p.id === selectedId)!}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

interface GalleryCardProps {
  photo: Photo;
  onClick: () => void;
}

function GalleryCard({ photo, onClick }: GalleryCardProps) {
  return (
    <motion.button
      type="button"
      className="relative flex-shrink-0 cursor-pointer will-change-transform"
      style={{
        width: `${CARD_WIDTH_VW}vw`,
        maxWidth: '225px',
        perspective: 1200,
        transformStyle: 'preserve-3d',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      onClick={onClick}
    >
      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden will-change-transform"
        style={{
          transformOrigin: 'left center',
          rotateY: '-45deg',
          skewY: '15deg',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.button>
  );
}

interface EnlargeOverlayProps {
  photo: Photo;
  onClose: () => void;
}

function EnlargeOverlay({ photo, onClose }: EnlargeOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      aria-modal
      role="dialog"
      aria-label="Enlarged image"
    >
      <motion.div
        className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center will-change-transform"
        initial={{ scale: 0.8, rotateY: 45 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.title}
          className="max-h-[90vh] w-auto max-w-[90vw] object-contain shadow-2xl"
        />
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-white/90">
          {photo.title}
        </p>
      </motion.div>
    </motion.div>
  );
}
