import { genrePublicUrls } from './publicMediaManifest';

export interface GenrePlaceholder {
  id: string;
  url: string;
  title: string;
  width?: number;
  height?: number;
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
  const urls = genrePublicUrls[id] ?? [];
  return {
    id,
    label,
    photos: urls.map((url, i) => ({
      id: `${id}-${i}`,
      url,
      title: `Work ${String(i + 1).padStart(2, '0')}`,
    })),
  };
});
