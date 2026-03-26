import type { Photo } from '../types';
import { fallbackUrl, toSrcSet } from '../lib/imageSources';
import { useRedLight } from '../hooks/useRedLight';
import { ExifOverlay } from './ExifOverlay';
import { SafelightImage } from './SafelightImage';

const TEXT_LINK =
  'text-xs font-medium uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70';

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
          className={`pointer-events-auto ${TEXT_LINK} text-white/90 hover:text-white darkroom:text-red-200 darkroom:hover:text-red-50 darkroom:focus-visible:outline-red-400/80`}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-pressed={safelightOn}
          aria-label={
            safelightOn ? 'Safelight is on, turn off' : 'Safelight is off, turn on'
          }
        >
          {safelightOn ? 'Safelight on' : 'Safelight off'}
        </button>
      </div>
    </div>
  );
}
