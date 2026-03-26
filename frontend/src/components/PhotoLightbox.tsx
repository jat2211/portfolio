import type { Photo } from '../types';
import { fallbackUrl, toSrcSet } from '../lib/imageSources';
import { useRedLight } from '../hooks/useRedLight';
import { ExifOverlay } from './ExifOverlay';
import { SafelightImage } from './SafelightImage';

const CHROME_BTN =
  'rounded bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 darkroom:bg-red-950/80 darkroom:text-red-100 darkroom:hover:bg-red-900/90 darkroom:focus-visible:ring-red-400/70';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const { enabled: safelightOn, toggle } = useRedLight();

  const imageChrome = safelightOn
    ? 'max-h-[92vh] w-auto max-w-[96vw] object-contain grayscale mix-blend-multiply shadow-2xl shadow-black/60'
    : 'max-h-[92vh] w-auto max-w-[96vw] rounded-sm object-contain shadow-2xl shadow-black/60';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8 darkroom:bg-[#140000]/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} preview`}
      onClick={onClose}
    >
      <button
        type="button"
        className={`absolute right-4 top-4 ${CHROME_BTN}`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close fullscreen preview"
      >
        Close
      </button>
      <div className="relative inline-block max-h-[92vh] max-w-[96vw]">
        <div
          className={`relative isolate overflow-hidden rounded-sm ${
            safelightOn ? 'bg-[#3d0606]' : 'bg-neutral-950'
          }`}
        >
          <SafelightImage
            src={fallbackUrl(photo)}
            srcSet={toSrcSet(photo.jpg)}
            sizes="96vw"
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            className={imageChrome}
            onClick={(event) => event.stopPropagation()}
            decoding="async"
          />
        </div>
        <ExifOverlay
          exif={photo.exif}
          className="absolute bottom-2 left-2 max-w-[min(96vw-1rem,42rem)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 flex justify-end px-4 sm:px-6 bottom-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          className={`pointer-events-auto ${CHROME_BTN}`}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-pressed={safelightOn}
          aria-label={
            safelightOn ? 'Turn off safelight mode' : 'Turn on safelight mode'
          }
        >
          {safelightOn ? 'Safelight on' : 'Safelight'}
        </button>
      </div>
    </div>
  );
}
