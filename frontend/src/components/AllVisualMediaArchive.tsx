import type { CSSProperties } from 'react';
import { useState } from 'react';
import { genres } from '../data/genres';
import type { GenrePlaceholder } from '../data/genres';

function aspectStyle(photo: GenrePlaceholder): CSSProperties {
  if (photo.width != null && photo.height != null) {
    return { aspectRatio: `${photo.width} / ${photo.height}` };
  }
  return { aspectRatio: '4 / 5' };
}

export function AllVisualMediaArchive() {
  const [activeGenreId, setActiveGenreId] = useState(genres[0]!.id);
  const active = genres.find((g) => g.id === activeGenreId) ?? genres[0]!;

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

          {/* Right two-thirds: image grid only */}
          <div className="md:col-span-8 md:pt-2">
            <ul className="grid grid-cols-2 gap-2 sm:gap-3">
              {active.photos.map((photo) => (
                <li key={photo.id} className="min-w-0">
                  <figure className="space-y-2">
                    <div
                      className="group relative w-full overflow-hidden rounded-sm bg-neutral-900"
                      style={aspectStyle(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                    <figcaption className="text-[10px] font-normal uppercase tracking-widest text-white/45">
                      {photo.title}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
