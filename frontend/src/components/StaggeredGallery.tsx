import type { Photo } from '../types';

interface StaggeredGalleryProps {
  photos: Photo[];
}

const LAYOUT = [
  'md:ml-0 md:mr-auto md:max-w-[min(42vw,520px)]',
  'md:ml-auto md:mr-[8%] md:max-w-[min(38vw,440px)] md:-translate-x-4',
  'md:ml-[12%] md:mr-auto md:max-w-[min(44vw,540px)] md:translate-x-6',
  'md:ml-auto md:mr-0 md:max-w-[min(36vw,420px)]',
  'md:ml-[6%] md:mr-auto md:max-w-[min(40vw,500px)] md:-translate-x-2',
  'md:ml-auto md:mr-[14%] md:max-w-[min(41vw,480px)]',
] as const;

export function StaggeredGallery({ photos }: StaggeredGalleryProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-16 md:px-8 md:pb-40 md:pt-24">
      {photos.map((photo, i) => {
        const layout = LAYOUT[i % LAYOUT.length];
        const marginT =
          i === 0 ? 'mt-0' : i % 3 === 1 ? 'mt-20 md:mt-32' : 'mt-16 md:mt-24';
        return (
          <article
            key={photo.id}
            className={`${marginT} ${layout} w-full max-w-lg md:w-auto`}
          >
            <h2 className="mb-3 text-[10px] font-normal uppercase tracking-widest text-white/55">
              {photo.title}
            </h2>
            <div className="overflow-hidden rounded-sm shadow-lg shadow-black/40">
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
