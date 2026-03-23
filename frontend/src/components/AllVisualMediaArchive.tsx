import { useEffect, useState } from 'react';
import { genres } from '../data/genres';

export function AllVisualMediaArchive() {
  const [activeGenreId, setActiveGenreId] = useState(genres[0]!.id);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const active = genres.find((g) => g.id === activeGenreId) ?? genres[0]!;
  const selectedPhoto =
    active.photos.find((photo) => photo.id === selectedPhotoId) ?? null;

  const leftColumnPhotos = active.photos.filter((_, index) => index % 2 === 0);
  const rightColumnPhotos = active.photos.filter((_, index) => index % 2 === 1);

  useEffect(() => {
    setSelectedPhotoId(null);
  }, [activeGenreId]);

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
      id="all-visual-media"
      className="relative bg-black pb-24 pt-16 text-white md:pb-32 md:pt-20"
      aria-label="More work archive"
    >
      <div className="mx-auto max-w-[min(96rem,calc(100%-2rem))] px-4 md:px-6">
        <div className="flex flex-col gap-12 md:grid md:grid-cols-12 md:items-stretch md:gap-x-8 md:gap-y-10">
          {/* Left third: stretch row height so sticky rail pins for full archive scroll */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-[4.5rem] md:max-h-[calc(100dvh-4.5rem)] md:overflow-y-auto md:pr-2">
              {/* Header aligned with FeaturedWorkHeader */}
              <header className="mb-8 md:mb-10">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                  More work
                </h2>
              </header>

              <nav className="flex flex-row flex-wrap gap-3 md:flex-col md:gap-6" aria-label="Genre filters">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGenreId(g.id)}
                    className={`text-left text-xs tracking-widest transition-colors sm:text-sm ${
                      g.id === activeGenreId
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/85'
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
                      <figure className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoId(photo.id)}
                          className="group relative block w-full overflow-hidden rounded-sm bg-neutral-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                          aria-label={`Open ${photo.title} in fullscreen`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        </button>
                        <figcaption className="text-[10px] font-normal uppercase tracking-widest text-white/45">
                          {photo.title}
                        </figcaption>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPhoto.title} preview`}
          onClick={() => setSelectedPhotoId(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-white hover:bg-black/80"
            onClick={() => setSelectedPhotoId(null)}
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
    </section>
  );
}
