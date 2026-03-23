import type { Photo } from '../types';
import { featuredGallery, heroGallery } from './publicMediaManifest';

const FALLBACK_HERO = 'https://picsum.photos/seed/hero-fallback/1920/1080';

function photosFromGalleryItems(
  items: readonly { url: string; width: number; height: number }[],
  idPrefix: string,
): Photo[] {
  return items.map((item, i) => ({
    id: `${idPrefix}-${i}`,
    url: item.url,
    title: `Work ${String(i + 1).padStart(2, '0')}`,
    width: item.width,
    height: item.height,
  }));
}

const primaryHeroItem =
  heroGallery[0] ?? featuredGallery[0] ?? null;
const primaryHeroUrl = primaryHeroItem?.url ?? FALLBACK_HERO;

export const featuredPhoto: Photo = {
  id: 'hero',
  url: primaryHeroUrl,
  title: 'Featured',
  ...(primaryHeroItem != null
    ? { width: primaryHeroItem.width, height: primaryHeroItem.height }
    : {}),
};

const mosaicItems =
  heroGallery.length > 0 ? featuredGallery : featuredGallery.slice(1);

export const galleryPhotos = photosFromGalleryItems(mosaicItems, 'featured');
