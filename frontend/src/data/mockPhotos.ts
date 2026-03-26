import type { Photo } from '../types';
import { featuredGallery, heroGallery } from './publicMediaManifest';

const FALLBACK_HERO = 'https://picsum.photos/seed/hero-fallback/1920/1080';

function bestJpgUrl(item: { jpg: readonly { url: string }[] }): string {
  return item.jpg[item.jpg.length - 1]?.url ?? FALLBACK_HERO;
}

function photosFromGalleryItems(
  items: readonly {
    width: number;
    height: number;
    jpg: readonly { url: string; width: number }[];
    webp: readonly { url: string; width: number }[];
    avif: readonly { url: string; width: number }[];
  }[],
  idPrefix: string,
): Photo[] {
  return items.map((item, i) => ({
    id: `${idPrefix}-${i}`,
    url: bestJpgUrl(item),
    title: `Work ${String(i + 1).padStart(2, '0')}`,
    width: item.width,
    height: item.height,
    jpg: [...item.jpg],
    webp: [...item.webp],
    avif: [...item.avif],
  }));
}

const primaryHeroItem =
  heroGallery[0] ?? featuredGallery[0] ?? null;
const primaryHeroUrl =
  primaryHeroItem != null ? bestJpgUrl(primaryHeroItem) : FALLBACK_HERO;

export const featuredPhoto: Photo = {
  id: 'hero',
  url: primaryHeroUrl,
  title: 'Featured',
  ...(primaryHeroItem != null
    ? {
        width: primaryHeroItem.width,
        height: primaryHeroItem.height,
        jpg: [...primaryHeroItem.jpg],
        webp: [...primaryHeroItem.webp],
        avif: [...primaryHeroItem.avif],
      }
    : {}),
};

const mosaicItems =
  heroGallery.length > 0 ? featuredGallery : featuredGallery.slice(1);

export const galleryPhotos = photosFromGalleryItems(mosaicItems, 'featured');
