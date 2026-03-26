#!/usr/bin/env node
/**
 * Prints image metadata to stdout: Sharp (format/dimensions/embedded segments)
 * plus exifr full parse (EXIF, GPS, XMP, ICC, IPTC, JFIF, etc.).
 *
 * Usage:
 *   node scripts/dump-photo-metadata.mjs [path]
 *   path — file or directory (default: ../public, skips _optimized)
 *
 * Options:
 *   --one, -1       only the first image found
 *   --max N         only first N images
 *   --include-optimized   include public/_optimized when scanning a directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import exifr from 'exifr';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|tiff?|heic|heif)$/i;

function parseArgs(argv) {
  const rest = [];
  let includeOptimized = false;
  let one = false;
  let max = undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--include-optimized') includeOptimized = true;
    else if (a === '--one' || a === '-1') one = true;
    else if (a === '--max') {
      max = parseInt(argv[++i], 10);
      if (!Number.isFinite(max) || max < 1) max = 1;
    } else if (a === '--help' || a === '-h') {
      console.log(`Usage: node dump-photo-metadata.mjs [options] [path]

  path   Image file or directory (default: ../public)

  --one, -1              First image only
  --max N                First N images
  --include-optimized    Include _optimized/ when scanning
  --help, -h             This message
`);
      process.exit(0);
    } else rest.push(a);
  }

  const targetPath =
    rest[0] !== undefined
      ? path.resolve(rest[0])
      : path.resolve(__dirname, '../public');

  if (one) max = 1;

  return { targetPath, includeOptimized, max };
}

function walk(dir, includeOptimized, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) continue;
      if (!includeOptimized && e.name === '_optimized') continue;
      walk(full, includeOptimized, acc);
    } else if (e.isFile() && IMAGE_EXT.test(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function summarizeSharpMeta(m) {
  if (!m || typeof m !== 'object') return m;
  const out = { ...m };
  for (const key of ['exif', 'icc', 'iptc', 'xmp']) {
    const v = out[key];
    if (Buffer.isBuffer(v)) {
      out[key] = `<Buffer ${v.length} bytes>`;
    }
  }
  if (typeof out.xmpAsString === 'string' && out.xmpAsString.length > 400) {
    out.xmpAsString = `<string ${out.xmpAsString.length} chars; see exifr section for parsed XMP>`;
  }
  return out;
}

const jsonReplacer = (_, value) => {
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return `<Buffer ${value.length} bytes>`;
  if (value instanceof Uint8Array && !(value instanceof Buffer)) {
    return `<Uint8Array ${value.length} bytes>`;
  }
  return value;
};

async function dumpOne(absPath) {
  const rel = path.relative(process.cwd(), absPath) || absPath;
  console.log(`\n${'='.repeat(72)}\n${rel}\n${'='.repeat(72)}`);

  let sharpMeta;
  try {
    sharpMeta = summarizeSharpMeta(await sharp(absPath).metadata());
  } catch (e) {
    sharpMeta = { error: String(e?.message ?? e) };
  }

  let exifAll;
  try {
    const buf = fs.readFileSync(absPath);
    exifAll = await exifr.parse(buf, true);
    if (exifAll === undefined || exifAll === null) {
      exifAll = null;
    }
  } catch (e) {
    exifAll = { error: String(e?.message ?? e) };
  }

  console.log('\n--- sharp (container / pixel metadata; binary segments summarized) ---');
  console.log(JSON.stringify(sharpMeta, jsonReplacer, 2));

  console.log('\n--- exifr (parsed EXIF, XMP, ICC, IPTC, JFIF, …) ---');
  console.log(JSON.stringify(exifAll, jsonReplacer, 2));
}

async function main() {
  const { targetPath, includeOptimized, max } = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(targetPath)) {
    console.error('Path not found:', targetPath);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    await dumpOne(targetPath);
    return;
  }

  const files = walk(targetPath, includeOptimized).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }),
  );

  if (files.length === 0) {
    console.log('No image files found under', targetPath);
    return;
  }

  const limit = max !== undefined ? Math.min(max, files.length) : files.length;
  for (let i = 0; i < limit; i++) {
    await dumpOne(files[i]);
  }

  if (files.length > limit) {
    console.log(
      `\n… ${files.length - limit} more file(s). Use --max N or --one to limit; omit both for all.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
