import type { Photo } from '../types';
import { featuredGalleryUrls, heroUrls } from './publicMediaManifest';

const FALLBACK_HERO = 'https://picsum.photos/seed/hero-fallback/1920/1080';

function photosFromUrls(urls: string[], idPrefix: string): Photo[] {
  return urls.map((url, i) => ({
    id: `${idPrefix}-${i}`,
    url,
    title: `Work ${String(i + 1).padStart(2, '0')}`,
  }));
}

const primaryHeroUrl = heroUrls[0] ?? featuredGalleryUrls[0] ?? FALLBACK_HERO;

const mosaicUrls =
  heroUrls.length > 0 ? featuredGalleryUrls : featuredGalleryUrls.slice(1);

export const featuredPhoto: Photo = {
  id: 'hero',
  url: primaryHeroUrl,
  title: 'Featured',
};

export const galleryPhotos = photosFromUrls(mosaicUrls, 'featured');
