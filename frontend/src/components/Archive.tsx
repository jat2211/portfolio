import { useEffect, useState } from 'react';
import { genres } from '../data/genres';
import { fallbackUrl, toSrcSet } from '../lib/imageSources';
import { ExifOverlay } from './ExifOverlay';
import { PhotoLightbox } from './PhotoLightbox';
import { SafelightImage } from './SafelightImage';

export function Archive() {
  const [activeGenreId, setActiveGenreId] = useState(genres[0]!.id);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const active = genres.find((g) => g.id === activeGenreId) ?? genres[0]!;
  const selectedPhoto =
    active.photos.find((photo) => photo.id === selectedPhotoId) ?? null;

  const leftColumnPhotos = active.photos.filter((_, index) => index % 2 === 0);
  const rightColumnPhotos = active.photos.filter((_, index) => index % 2 === 1);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhotoId(null);
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
    <section
      id="archive"
      className="relative bg-black pb-24 pt-16 text-white md:pb-32 md:pt-20 darkroom:bg-[#0a0000] darkroom:text-red-100"
      aria-label="More work archive"
    >
      <div className="mx-auto max-w-[min(96rem,calc(100%-2rem))] px-4 md:px-6">
        <div className="flex flex-col gap-12 md:grid md:grid-cols-12 md:items-stretch md:gap-x-8 md:gap-y-10">
          {/* Left third: stretch row height so sticky rail pins for full archive scroll */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-[4.5rem] md:max-h-[calc(100dvh-4.5rem)] md:overflow-y-auto md:pr-2">
              {/* Header aligned with GalleryHeader */}
              <header className="mb-8 md:mb-10">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl darkroom:text-red-50">
                  Media Archive
                </h2>
              </header>

              <nav className="flex flex-row flex-wrap gap-3 md:flex-col md:gap-6" aria-label="Genre filters">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedPhotoId(null);
                      setActiveGenreId(g.id);
                    }}
                    className={`text-left text-xs tracking-widest transition-colors sm:text-sm ${
                      g.id === activeGenreId
                        ? 'text-white darkroom:text-red-100'
                        : 'text-white/50 hover:text-white/85 darkroom:text-red-400/50 darkroom:hover:text-red-200/90'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right two-thirds: two independent columns (no shared row heights) */}
          <div className="md:col-span-8 md:pt-2">
            <div className="flex gap-2 sm:gap-3">
              {[leftColumnPhotos, rightColumnPhotos].map((columnPhotos, columnIndex) => (
                <ul
                  key={columnIndex}
                  className="flex min-w-0 flex-1 list-none flex-col gap-2 p-0 sm:gap-3"
                >
                  {columnPhotos.map((photo) => (
                    <li key={photo.id} className="min-w-0">
                      <figure>
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoId(photo.id)}
                          className="group relative block w-full overflow-hidden rounded-sm bg-neutral-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 darkroom:bg-red-950/90 darkroom:focus-visible:ring-red-400/60"
                          aria-label={`Open ${photo.title} in fullscreen`}
                        >
                          <div className="relative isolate overflow-hidden darkroom:bg-[#3d0606]">
                            <picture>
                              {photo.avif?.length ? (
                                <source
                                  type="image/avif"
                                  srcSet={toSrcSet(photo.avif)}
                                  sizes="(min-width: 768px) 50vw, 100vw"
                                />
                              ) : null}
                              {photo.webp?.length ? (
                                <source
                                  type="image/webp"
                                  srcSet={toSrcSet(photo.webp)}
                                  sizes="(min-width: 768px) 50vw, 100vw"
                                />
                              ) : null}
                              <SafelightImage
                                src={fallbackUrl(photo)}
                                srcSet={toSrcSet(photo.jpg)}
                                sizes="(min-width: 768px) 50vw, 100vw"
                                alt={photo.title}
                                width={photo.width}
                                height={photo.height}
                                loading="lazy"
                                decoding="async"
                                className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 darkroom:mix-blend-multiply darkroom:grayscale"
                              />
                            </picture>
                          </div>
                          <ExifOverlay
                            exif={photo.exif}
                            emphasizeOnHover
                            className="absolute bottom-2 left-2 z-10 max-w-[calc(100%-1rem)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
                          />
                        </button>
                      </figure>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedPhoto ? (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhotoId(null)}
        />
      ) : null}
    </section>
  );
}
