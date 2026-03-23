import { useEffect, useState } from 'react';
import type { Photo } from '../types';

interface FeaturedMediaProps {
  photos: Photo[];
}

/**
 * Featured work gallery: below `md`, a single column in source order; from `md` up,
 * three equal flex columns (like the archive image rows) with photos distributed by index % 3.
 * Images use `w-full` / `h-auto` so height follows the original aspect ratio.
 */

/** Vertical stack of tiles; `flex-1` only when the ul is a child of a horizontal flex row (md+). */
const COLUMN_UL_IN_ROW_CLASS =
  'flex min-w-0 flex-1 list-none flex-col gap-2 p-0 sm:gap-3';

const STACK_UL_CLASS =
  'flex w-full min-w-0 list-none flex-col gap-2 p-0 sm:gap-3';

function GalleryItem({
  photo,
  onSelect,
}: {
  photo: Photo;
  onSelect: (photo: Photo) => void;
}) {
  return (
    <li className="min-w-0">
      <article>
        <h2 className="mb-3 text-[10px] font-normal uppercase tracking-widest text-white/55">
          {photo.title}
        </h2>
        <button
          type="button"
          onClick={() => onSelect(photo)}
          className="group relative block w-full overflow-hidden rounded-sm bg-neutral-900 shadow-lg shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label={`Open ${photo.title} in fullscreen`}
        >
          <img
            src={photo.url}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full max-w-full grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:grayscale-0"
          />
        </button>
      </article>
    </li>
  );
}

export function FeaturedMedia({ photos }: FeaturedMediaProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const columnPhotos = [0, 1, 2].map((k) =>
    photos.filter((_, index) => index % 3 === k),
  );

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  return (
    <div className="w-full px-2 pb-32 pt-16 sm:px-3 md:px-4 md:pb-40 md:pt-24 lg:px-5">
      {/* Single column, original order (mobile) */}
      <ul className={`${STACK_UL_CLASS} md:hidden`}>
        {photos.map((photo) => (
          <GalleryItem
            key={photo.id}
            photo={photo}
            onSelect={setSelectedPhoto}
          />
        ))}
      </ul>

      {/* Three equal columns (md+) */}
      <div className="hidden gap-2 sm:gap-3 md:flex">
        {columnPhotos.map((column, columnIndex) => (
          <ul key={columnIndex} className={COLUMN_UL_IN_ROW_CLASS}>
            {column.map((photo) => (
              <GalleryItem
                key={photo.id}
                photo={photo}
                onSelect={setSelectedPhoto}
              />
            ))}
          </ul>
        ))}
      </div>

      {selectedPhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPhoto.title} preview`}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-white hover:bg-black/80"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close fullscreen preview"
          >
            Close
          </button>
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.title}
            width={selectedPhoto.width}
            height={selectedPhoto.height}
            className="max-h-[92vh] w-auto max-w-[96vw] rounded-sm object-contain shadow-2xl shadow-black/60"
            onClick={(event) => event.stopPropagation()}
            decoding="async"
          />
        </div>
      ) : null}
    </div>
  );
}
