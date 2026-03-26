import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import imageSize from 'image-size';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const outFile = path.resolve(__dirname, '../src/data/publicMediaManifest.ts');
const optimizedDir = path.resolve(publicDir, '_optimized');

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const HERO_WIDTHS = [640, 960, 1280, 1600, 1920];
const GALLERY_WIDTHS = [480, 720, 960, 1200];
const AVIF_QUALITY = 48;
const WEBP_QUALITY = 68;
const JPG_QUALITY = 76;
let avifEncodingEnabled = true;

const GENRE_IDS = ['bw', 'portraits', 'landscape', 'street'];

function listImageNames(relPosix) {
  const dir = path.join(publicDir, ...relPosix.split('/'));
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith('.'))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }),
    );
}

/**
 * @param {number[]} widths
 * @param {number} originalWidth
 * @returns {number[]}
 */
function cappedWidths(widths, originalWidth) {
  const filtered = widths.filter((w) => w <= originalWidth);
  if (filtered.length === 0) return [originalWidth];
  if (filtered[filtered.length - 1] !== originalWidth) filtered.push(originalWidth);
  return [...new Set(filtered)];
}

/**
 * @param {string} relPosix e.g. "gallery/bw"
 * @param {string} fileName
 * @param {number[]} targets
 * @returns {Promise<{ width: number; height: number; jpg: { url: string; width: number }[]; webp: { url: string; width: number }[]; avif: { url: string; width: number }[] }>}
 */
async function createPublicImage(relPosix, fileName, targets) {
  const abs = path.join(publicDir, ...relPosix.split('/'), fileName);
  const originalUrl = `/${path.posix.join(relPosix, encodeURI(fileName))}`;
  let width = 3;
  let height = 4;
  try {
    const dim = imageSize(fs.readFileSync(abs));
    if (dim.width != null && dim.height != null) {
      width = dim.width;
      height = dim.height;
    }
  } catch {
    /* keep fallback ratio */
  }

  const stem = path.parse(fileName).name;
  const safeStem = stem.replace(/[^a-zA-Z0-9_-]/g, '-');
  const relTargetDir = path.posix.join('_optimized', relPosix);
  const absTargetDir = path.join(optimizedDir, ...relPosix.split('/'));
  fs.mkdirSync(absTargetDir, { recursive: true });

  const widths = cappedWidths(targets, width);

  /** @type {{ url: string; width: number }[]} */
  const jpg = [];
  /** @type {{ url: string; width: number }[]} */
  const webp = [];
  /** @type {{ url: string; width: number }[]} */
  const avif = [];

  for (const targetWidth of widths) {
    const baseName = `${safeStem}-${targetWidth}`;
    const jpgFile = `${baseName}.jpg`;
    const webpFile = `${baseName}.webp`;
    const avifFile = `${baseName}.avif`;
    const absJpg = path.join(absTargetDir, jpgFile);
    const absWebp = path.join(absTargetDir, webpFile);
    const absAvif = path.join(absTargetDir, avifFile);

    if (!fs.existsSync(absJpg)) {
      try {
        await sharp(abs)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
          .toFile(absJpg);
      } catch {
        /* skip broken source encode for this width */
      }
    }
    if (!fs.existsSync(absWebp)) {
      try {
        await sharp(abs)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(absWebp);
      } catch {
        /* skip broken source encode for this width */
      }
    }
    if (avifEncodingEnabled && !fs.existsSync(absAvif)) {
      try {
        await sharp(abs)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .avif({ quality: AVIF_QUALITY })
          .toFile(absAvif);
      } catch {
        // Some local libvips builds cannot encode AVIF.
        avifEncodingEnabled = false;
      }
    }

    if (fs.existsSync(absJpg)) {
      jpg.push({
        url: `/${path.posix.join(relTargetDir, encodeURI(jpgFile))}`,
        width: targetWidth,
      });
    }
    if (fs.existsSync(absWebp)) {
      webp.push({
        url: `/${path.posix.join(relTargetDir, encodeURI(webpFile))}`,
        width: targetWidth,
      });
    }
    if (avifEncodingEnabled && fs.existsSync(absAvif)) {
      avif.push({
        url: `/${path.posix.join(relTargetDir, encodeURI(avifFile))}`,
        width: targetWidth,
      });
    }
  }

  if (jpg.length === 0) {
    jpg.push({ url: originalUrl, width });
  }

  return { width, height, jpg, webp, avif };
}

/**
 * @param {string} relPosix
 * @param {number[]} targets
 * @returns {Promise<{ width: number; height: number; jpg: { url: string; width: number }[]; webp: { url: string; width: number }[]; avif: { url: string; width: number }[] }[]>}
 */
async function buildGallery(relPosix, targets) {
  const names = listImageNames(relPosix);
  const out = [];
  for (const name of names) {
    out.push(await createPublicImage(relPosix, name, targets));
  }
  return out;
}

const heroGallery = await buildGallery('hero', HERO_WIDTHS);
const featuredGallery = await buildGallery('gallery/featured', GALLERY_WIDTHS);

/** @type {Record<string, { width: number; height: number; jpg: { url: string; width: number }[]; webp: { url: string; width: number }[]; avif: { url: string; width: number }[] }[]>} */
const genrePublicImages = Object.fromEntries(
  await Promise.all(
    GENRE_IDS.map(async (id) => [id, await buildGallery(`gallery/${id}`, GALLERY_WIDTHS)]),
  ),
);

const file = `/* eslint-disable */
// Auto-generated by scripts/generate-public-media-manifest.mjs — do not edit.

export interface PublicImageVariant {
  readonly url: string;
  readonly width: number;
}

export interface PublicImage {
  readonly width: number;
  readonly height: number;
  readonly jpg: PublicImageVariant[];
  readonly webp: PublicImageVariant[];
  readonly avif: PublicImageVariant[];
}

export const heroGallery: PublicImage[] = ${JSON.stringify(heroGallery, null, 2)};

export const featuredGallery: PublicImage[] = ${JSON.stringify(featuredGallery, null, 2)};

export const genrePublicImages: Record<string, PublicImage[]> = ${JSON.stringify(genrePublicImages, null, 2)};
`;

fs.writeFileSync(outFile, file, 'utf8');
console.log('Wrote', path.relative(path.resolve(__dirname, '..'), outFile));
