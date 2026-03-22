import type { CSSProperties } from 'react';
import type { Photo } from '../types';

interface StaggeredGalleryProps {
  photos: Photo[];
}

/** md+: 12-column explicit placement per tile. Mobile stacks via col-span-full. */
const BAND1_PLACEMENT = [
  'md:col-start-1 md:col-span-8 md:row-start-1 md:row-span-2 md:translate-y-3',
  'md:col-start-9 md:col-span-4 md:row-start-1 md:row-span-1 md:-translate-x-1',
  'md:col-start-9 md:col-span-4 md:row-start-2 md:row-span-1',
  'md:col-start-1 md:col-span-5 md:row-start-3 md:row-span-1 md:-translate-y-2',
  'md:col-start-6 md:col-span-7 md:row-start-3 md:row-span-1 md:translate-x-2',
] as const;

/** Second band: wide top, tall right, middle row split, full-width footer. */
const BAND2_PLACEMENT = [
  'md:col-start-1 md:col-span-8 md:row-start-1 md:row-span-1 md:translate-x-1',
  'md:col-start-9 md:col-span-4 md:row-start-1 md:row-span-2 md:-translate-y-2',
  'md:col-start-1 md:col-span-5 md:row-start-2 md:row-span-1',
  'md:col-start-6 md:col-span-3 md:row-start-2 md:row-span-1 md:translate-y-4',
  'md:col-start-1 md:col-span-12 md:row-start-3 md:row-span-1',
] as const;

/** Third band: large left stack, narrow right stack, wide closing strip. */
const BAND3_PLACEMENT = [
  'md:col-start-1 md:col-span-8 md:row-start-1 md:row-span-2 md:translate-y-2',
  'md:col-start-9 md:col-span-4 md:row-start-1 md:row-span-1',
  'md:col-start-9 md:col-span-4 md:row-start-2 md:row-span-1 md:-translate-x-1',
  'md:col-start-1 md:col-span-12 md:row-start-3 md:row-span-1 md:-translate-y-3',
] as const;

const BAND_SLICES = [
  { len: BAND1_PLACEMENT.length, placement: BAND1_PLACEMENT },
  { len: BAND2_PLACEMENT.length, placement: BAND2_PLACEMENT },
  { len: BAND3_PLACEMENT.length, placement: BAND3_PLACEMENT },
] as const;

function aspectStyle(photo: Photo): CSSProperties {
  if (photo.width != null && photo.height != null) {
    return { aspectRatio: `${photo.width} / ${photo.height}` };
  }
  return { aspectRatio: '4 / 5' };
}

function splitIntoBands(photos: Photo[]) {
  const bands: { photos: Photo[]; placement: readonly string[] }[] = [];
  let offset = 0;
  for (const { len, placement } of BAND_SLICES) {
    const slice = photos.slice(offset, offset + len);
    if (slice.length === 0) break;
    bands.push({ photos: slice, placement });
    offset += len;
  }
  if (offset < photos.length) {
    const rest = photos.slice(offset);
    bands.push({
      photos: rest,
      placement: BAND3_PLACEMENT,
    });
  }
  return bands;
}

export function StaggeredGallery({ photos }: StaggeredGalleryProps) {
  const bands = splitIntoBands(photos);

  return (
    <div className="mx-auto max-w-[min(90rem,calc(100%-2rem))] px-5 pb-32 pt-16 md:px-8 md:pb-40 md:pt-24">
      <div className="flex flex-col gap-20 md:gap-28 lg:gap-36">
        {bands.map((band, bandIdx) => (
          <div
            key={bandIdx}
            className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6 md:gap-y-8 md:auto-rows-[minmax(14rem,auto)]"
          >
            {/* Band {bandIdx + 1}: 12-col mosaic on md+; explicit col/row spans per tile */}
            {band.photos.map((photo, i) => {
              const placement = band.placement[i % band.placement.length] ?? '';
              return (
                <article
                  key={photo.id}
                  className={`col-span-full ${placement} w-full`}
                >
                  <h2 className="mb-3 text-[10px] font-normal uppercase tracking-widest text-white/55">
                    {photo.title}
                  </h2>
                  <div
                    className="relative w-full overflow-hidden rounded-sm shadow-lg shadow-black/40"
                    style={aspectStyle(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
