import { useEffect, useState } from 'react';
import type { Photo } from '../types';

interface StaggeredGalleryProps {
  photos: Photo[];
}

/**
 * Featured work: 12 bands (one image each). Edit `FEATURED_TILES` for placement.
 * - columnStart / columnSpan: 12-column grid on md+ (narrower spans = smaller tiles).
 * - Odd band indices (2nd, 4th, …) use negative margin + z-index to overlap the band above.
 * - nudgeX / nudgeY: optional md+ transform (visual only).
 */

/** 1–12 → full `md:col-start-*` (literal strings for Tailwind). */
const MD_COL_START: Record<number, string> = {
  1: 'md:col-start-1',
  2: 'md:col-start-2',
  3: 'md:col-start-3',
  4: 'md:col-start-4',
  5: 'md:col-start-5',
  6: 'md:col-start-6',
  7: 'md:col-start-7',
  8: 'md:col-start-8',
  9: 'md:col-start-9',
  10: 'md:col-start-10',
  11: 'md:col-start-11',
  12: 'md:col-start-12',
};

/** 1–12 → full `md:col-span-*`. */
const MD_COL_SPAN: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

/** 1–12 → full `md:row-start-*` (per-band row index). */
const MD_ROW_START: Record<number, string> = {
  1: 'md:row-start-1',
  2: 'md:row-start-2',
  3: 'md:row-start-3',
  4: 'md:row-start-4',
  5: 'md:row-start-5',
  6: 'md:row-start-6',
  7: 'md:row-start-7',
  8: 'md:row-start-8',
  9: 'md:row-start-9',
  10: 'md:row-start-10',
  11: 'md:row-start-11',
  12: 'md:row-start-12',
};

/** 1–6 → full `md:row-span-*`. */
const MD_ROW_SPAN: Record<number, string> = {
  1: 'md:row-span-1',
  2: 'md:row-span-2',
  3: 'md:row-span-3',
  4: 'md:row-span-4',
  5: 'md:row-span-5',
  6: 'md:row-span-6',
};

/**
 * Tailwind translate steps on md+ (0.25rem per unit). Add a map entry if you use a new step.
 * Negative Y nudges upward (overlap row above); positive Y nudges down (visual only).
 */
const MD_NUDGE_X: Record<number, string> = {
  [-4]: 'md:-translate-x-4',
  [-3]: 'md:-translate-x-3',
  [-2]: 'md:-translate-x-2',
  [-1]: 'md:-translate-x-1',
  1: 'md:translate-x-1',
  2: 'md:translate-x-2',
  3: 'md:translate-x-3',
  4: 'md:translate-x-4',
};

const MD_NUDGE_Y: Record<number, string> = {
  [-6]: 'md:-translate-y-6',
  [-5]: 'md:-translate-y-5',
  [-4]: 'md:-translate-y-4',
  [-3]: 'md:-translate-y-3',
  [-2]: 'md:-translate-y-2',
  [-1]: 'md:-translate-y-1',
  1: 'md:translate-y-1',
  2: 'md:translate-y-2',
  3: 'md:translate-y-3',
  4: 'md:translate-y-4',
  5: 'md:translate-y-5',
  6: 'md:translate-y-6',
};

interface FeaturedTilePlacement {
  /** Grid column start line, 1–12 (md+). */
  columnStart: number;
  /** Column span, 1–12 (md+). */
  columnSpan: number;
  /** Row start within this band’s grid, 1–12 (md+). */
  rowStart: number;
  /** Row span, 1–6 (md+). */
  rowSpan: number;
  /** Horizontal nudge in Tailwind steps (md+); omit or 0 for none. */
  nudgeX?: number;
  /** Vertical nudge in Tailwind steps (md+); omit or 0 for none. */
  nudgeY?: number;
}

function mdPlacementClasses(tile: FeaturedTilePlacement): string {
  const colStart = MD_COL_START[tile.columnStart];
  const colSpan = MD_COL_SPAN[tile.columnSpan];
  const rowStart = MD_ROW_START[tile.rowStart];
  const rowSpan = MD_ROW_SPAN[tile.rowSpan];
  if (!colStart || !colSpan || !rowStart || !rowSpan) {
    console.warn('[StaggeredGallery] Invalid grid placement', tile);
    return '';
  }
  const nudgeX =
    tile.nudgeX != null && tile.nudgeX !== 0
      ? (MD_NUDGE_X[tile.nudgeX] ?? '')
      : '';
  const nudgeY =
    tile.nudgeY != null && tile.nudgeY !== 0
      ? (MD_NUDGE_Y[tile.nudgeY] ?? '')
      : '';
  return [colStart, colSpan, rowStart, rowSpan, nudgeX, nudgeY]
    .filter(Boolean)
    .join(' ');
}

/**
 * Twelve bands × one tile each. Spans are narrower than full-bleed for a slightly smaller look;
 * column starts vary (including centered clusters) for placement diversity.
 */
const FEATURED_TILES: FeaturedTilePlacement[] = [
  { columnStart: 1, columnSpan: 5, rowStart: 1, rowSpan: 1, nudgeY: 0 },
  { columnStart: 8, columnSpan: 4, rowStart: 1, rowSpan: 1, nudgeY: -6 },
  { columnStart: 4, columnSpan: 5, rowStart: 1, rowSpan: 1, nudgeY: -5 },
  { columnStart: 8, columnSpan: 4, rowStart: 2, rowSpan: 1, nudgeY: 5},
  { columnStart: 3, columnSpan: 3, rowStart: 2, rowSpan: 1, nudgeY: 6 },
  { columnStart: 8, columnSpan: 3, rowStart: 1, rowSpan: 1, nudgeY: -6 },
  { columnStart: 5, columnSpan: 5, rowStart: 1, rowSpan: 1 },
  { columnStart: 2, columnSpan: 3, rowStart: 2, rowSpan: 1, nudgeY: 6 },
  { columnStart: 6, columnSpan: 5, rowStart: 1, rowSpan: 1, nudgeY: -6 },
  { columnStart: 3, columnSpan: 4, rowStart: 2, rowSpan: 1 },
  { columnStart: 6, columnSpan: 5, rowStart: 1, rowSpan: 1, nudgeY: 2 },
  { columnStart: 2, columnSpan: 3, rowStart: 1, rowSpan: 1, nudgeX: -1 },
];

/** One CSS grid per band (rows always restart at 1). */
const FEATURED_WORK_BANDS: FeaturedTilePlacement[][] =
  FEATURED_TILES.map((tile) => [tile]);

/** Extra photos after 12 cycle through these layouts in order. */
const FALLBACK_TILES = FEATURED_TILES;

type BandItem = { photo: Photo; placement: FeaturedTilePlacement };

function groupPhotosIntoBands(photos: Photo[]): BandItem[][] {
  const bands: BandItem[][] = [];
  let index = 0;

  for (const placements of FEATURED_WORK_BANDS) {
    const slice = photos.slice(index, index + placements.length);
    if (slice.length === 0) break;
    bands.push(
      slice.map((photo, i) => ({
        photo,
        placement: placements[i]!,
      })),
    );
    index += placements.length;
  }

  if (index < photos.length) {
    const rest = photos.slice(index);
    for (let i = 0; i < rest.length; i++) {
      bands.push([
        {
          photo: rest[i]!,
          placement: FALLBACK_TILES[i % FALLBACK_TILES.length]!,
        },
      ]);
    }
  }

  return bands;
}

/** Odd-index bands pull up so they overlap the previous image (pairwise 1–2, 3–4, …). */
function bandOverlapClass(bandIndex: number): string {
  const isPulledUp = bandIndex % 2 === 1;
  if (!isPulledUp) return 'relative z-0';
  return 'relative z-10 -mt-10 md:-mt-[5.5rem] lg:-mt-28';
}

export function StaggeredGallery({ photos }: StaggeredGalleryProps) {
  const bands = groupPhotosIntoBands(photos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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
      <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
        {bands.map((items, bandIndex) => (
          <div
            key={bandIndex}
            className={`grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-x-6 md:gap-y-8 md:auto-rows-auto ${bandOverlapClass(bandIndex)}`}
          >
            {items.map(({ photo, placement }) => (
              <article
                key={photo.id}
                className={`col-span-full ${mdPlacementClasses(placement)} w-full`}
              >
                <h2 className="mb-3 text-[10px] font-normal uppercase tracking-widest text-white/55">
                  {photo.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative block w-full overflow-hidden rounded-sm shadow-lg shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  aria-label={`Open ${photo.title} in fullscreen`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full max-w-full origin-center grayscale transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:grayscale-0"
                  />
                </button>
              </article>
            ))}
          </div>
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
