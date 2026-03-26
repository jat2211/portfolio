import type { ExifData } from '../types';

function formatAperture(fNumber: number): string {
  const x = Math.round(fNumber * 10) / 10;
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(1).replace(/\.0$/, '');
}

/** Exposure time in seconds → e.g. `1/125`, `2s`, `0.4s`. */
function formatShutterSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '';
  if (sec >= 1) {
    const r = Math.round(sec * 10) / 10;
    return `${r}s`;
  }
  const inv = 1 / sec;
  const n = Math.round(inv);
  if (n > 0 && Math.abs(1 / n - sec) / sec < 0.02) {
    return `1/${n}`;
  }
  const trimmed = String(Math.round(sec * 1000) / 1000).replace(/\.?0+$/, '');
  return `${trimmed}s`;
}

function buildExifParts(exif: ExifData): string[] {
  const parts: string[] = [];
  if (typeof exif.iso === 'number' && Number.isFinite(exif.iso)) {
    parts.push(`ISO ${Math.round(exif.iso)}`);
  }
  if (typeof exif.aperture === 'number' && Number.isFinite(exif.aperture)) {
    parts.push(`f/${formatAperture(exif.aperture)}`);
  }
  if (typeof exif.exposureTimeSec === 'number' && Number.isFinite(exif.exposureTimeSec)) {
    const s = formatShutterSeconds(exif.exposureTimeSec);
    if (s) parts.push(s);
  }
  return parts;
}

interface ExifOverlayProps {
  exif?: ExifData | null;
  className?: string;
  /** Stronger contrast on hover (parent needs `group`). */
  emphasizeOnHover?: boolean;
}

export function ExifOverlay({
  exif,
  className = '',
  emphasizeOnHover = false,
}: ExifOverlayProps) {
  if (!exif) return null;
  const parts = buildExifParts(exif);
  if (parts.length === 0) return null;

  const base =
    'pointer-events-none select-none text-[10px] font-medium uppercase tracking-widest';
  const tone = emphasizeOnHover
    ? 'text-white/50 transition-colors duration-300 group-hover:text-white/85'
    : 'text-white/55';

  return (
    <div
      className={`${base} ${tone} ${className}`.trim()}
      aria-hidden
    >
      {parts.map((p, i) => (
        <span key={`${i}-${p}`}>
          {i > 0 ? <span className="text-white/35"> · </span> : null}
          {p}
        </span>
      ))}
    </div>
  );
}
