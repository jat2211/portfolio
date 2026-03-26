import type { ImageVariant, Photo } from '../types';

export function toSrcSet(variants: readonly ImageVariant[] | undefined): string {
  if (!variants || variants.length === 0) return '';
  return variants.map((v) => `${v.url} ${v.width}w`).join(', ');
}

export function fallbackUrl(photo: Pick<Photo, 'url' | 'jpg'>): string {
  return photo.jpg?.[photo.jpg.length - 1]?.url ?? photo.url;
}
