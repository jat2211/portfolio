import { genrePublicImages } from './publicMediaManifest';

export interface GenrePlaceholder {
  id: string;
  url: string;
  title: string;
  width?: number;
  height?: number;
  jpg?: { url: string; width: number }[];
  webp?: { url: string; width: number }[];
  avif?: { url: string; width: number }[];
}

export interface Genre {
  id: string;
  label: string;
  photos: GenrePlaceholder[];
}

const GENRE_DEFS: { id: string; label: string }[] = [
  { id: 'bw', label: 'Black and white' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'street', label: 'Street' },
];

export const genres: Genre[] = GENRE_DEFS.map(({ id, label }) => {
  const images = genrePublicImages[id] ?? [];
  return {
    id,
    label,
    photos: images.map((image, i) => ({
      id: `${id}-${i}`,
      url: image.jpg[image.jpg.length - 1]?.url ?? '',
      title: `Work ${String(i + 1).padStart(2, '0')}`,
      width: image.width,
      height: image.height,
      jpg: [...image.jpg],
      webp: [...image.webp],
      avif: [...image.avif],
    })),
  };
});
