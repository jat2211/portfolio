import { useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from 'framer-motion';
import { genres } from '../data/genres';
import type { GenrePlaceholder } from '../data/genres';

// "Hinge" animation tuning:
// - hinge is on the bottom edge (transformOrigin: bottom center)
// - the lower photo "closes" (rotates toward 0deg) and rises a bit while doing so
const CLOSED_Y = 600;
const CLOSED_ROTATE_X = -88;

const OPEN_Y = 0;
const OPEN_ROTATE_X = 0;

// Frame tuning (ease of changing sizes/colors)
const FRAME_BG = '#F2F0F0'; // off-white outer frame
const FRAME_BG_PADDING_PX = 128; // space around the photo within the frame
const FRAME_INNER_BG = '#171717'; // dark mat behind the image
const FRAME_SIZE_CSS = 'min(600px,60vw)'; // rotating square size (CSS string)

// Keep the hinge axis on the card bottom edge to avoid the "orbiting pivot"
// feeling from moving the origin below the card.
const HINGE_ORIGIN_Y_PERCENT = 100;

// Scroll timeline tuning.
// Delay the start so the hinge animation only begins when the content
// is lined up mid-screen, and add larger gaps between transitions.
const CARD1_OPEN_START = 0.22;
const CARD1_OPEN_END = 0.45;
const CARD2_OPEN_START = 0.68;
const CARD2_OPEN_END = 0.86;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Smoothstep easing (S-curve) that stays strictly scroll-driven.
function smoothstep(x: number) {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
}

export function FoldersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeGenreId, setActiveGenreId] = useState(genres[0].id);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const activeGenre = genres.find((g) => g.id === activeGenreId) ?? genres[0];

  function handleGenreClick(id: string) {
    if (id === activeGenreId) return;
    setActiveGenreId(id);
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[360vh] py-24"
      style={{ perspective: 1200 }}
    >
      <div className="sticky top-0 mx-auto flex h-screen max-w-6xl items-center gap-16 px-4">
        <aside className="flex w-32 flex-shrink-0 flex-col gap-6 rounded-sm bg-white/95 px-2 py-4">
          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleGenreClick(g.id)}
              className={`text-left text-[10px] tracking-widest transition-colors ${
                g.id === activeGenreId
                  ? 'text-black'
                  : 'text-black/60 hover:text-black/80'
              }`}
            >
              {g.label}
            </button>
          ))}
        </aside>

        <div
          className="relative flex flex-1 items-center justify-center"
          style={{ transformStyle: 'preserve-3d', perspective: 1200, minHeight: 280 }}
        >
          <PhotoStack photos={activeGenre.photos} scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

interface StackProps {
  photos: GenrePlaceholder[];
  scrollYProgress: import('framer-motion').MotionValue<number>;
}

function PhotoStack({ photos, scrollYProgress }: StackProps) {
  // Keep layering stable:
  // - photo0 is flat at all times
  // - photo1 hinges in, then stays flat on top
  // - later photo2 hinges in, then stays flat on top
  const [zIndices, setZIndices] = useState([20, 10, 10]);

  useMotionValueEvent(scrollYProgress, 'change', (s) => {
    if (s < CARD1_OPEN_START) setZIndices([30, 10, 10]);
    else if (s < CARD2_OPEN_START) setZIndices([10, 30, 10]);
    else setZIndices([10, 10, 30]);
  });

  // Photo 0 stays OPEN/flat the whole time (it gets covered but does not animate).
  const card0Y = OPEN_Y;
  const card0RX = OPEN_ROTATE_X;

  // Photo 1 hinges in (and ascends slightly) only during CARD1_OPEN_START..CARD1_OPEN_END.
  const card1Y = useTransform(scrollYProgress, (s: number) => {
    if (s <= CARD1_OPEN_START) return CLOSED_Y;
    if (s >= CARD1_OPEN_END) return OPEN_Y;
    const a = smoothstep((s - CARD1_OPEN_START) / (CARD1_OPEN_END - CARD1_OPEN_START));
    // No additional lift: hinge path is determined by rotation + pivot.
    return CLOSED_Y * (1 - a) + OPEN_Y * a;
  });
  const card1RX = useTransform(scrollYProgress, (s: number) => {
    if (s <= CARD1_OPEN_START) return CLOSED_ROTATE_X;
    if (s >= CARD1_OPEN_END) return OPEN_ROTATE_X;
    const a = smoothstep((s - CARD1_OPEN_START) / (CARD1_OPEN_END - CARD1_OPEN_START));
    return CLOSED_ROTATE_X * (1 - a) + OPEN_ROTATE_X * a;
  });

  // Photo 2 hinges in (and ascends slightly) only during CARD2_OPEN_START..CARD2_OPEN_END.
  const card2Y = useTransform(scrollYProgress, (s: number) => {
    if (s <= CARD2_OPEN_START) return CLOSED_Y;
    if (s >= CARD2_OPEN_END) return OPEN_Y;
    const a = smoothstep((s - CARD2_OPEN_START) / (CARD2_OPEN_END - CARD2_OPEN_START));
    // No additional lift: hinge path is determined by rotation + pivot.
    return CLOSED_Y * (1 - a) + OPEN_Y * a;
  });
  const card2RX = useTransform(scrollYProgress, (s: number) => {
    if (s <= CARD2_OPEN_START) return CLOSED_ROTATE_X;
    if (s >= CARD2_OPEN_END) return OPEN_ROTATE_X;
    const a = smoothstep((s - CARD2_OPEN_START) / (CARD2_OPEN_END - CARD2_OPEN_START));
    return CLOSED_ROTATE_X * (1 - a) + OPEN_ROTATE_X * a;
  });

  return (
    <div
      className="relative"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        height: FRAME_SIZE_CSS,
        width: FRAME_SIZE_CSS,
      }}
    >
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            y: i === 0 ? card0Y : i === 1 ? card1Y : card2Y,
            rotateX: i === 0 ? card0RX : i === 1 ? card1RX : card2RX,
            zIndex: zIndices[i],
            transformStyle: 'preserve-3d',
            // Pivot below the card bottom edge to get the hinge-path look.
            transformOrigin: `50% ${HINGE_ORIGIN_Y_PERCENT}%`,
          }}
        >
          <GenreCard photo={photo} />
        </motion.div>
      ))}
    </div>
  );
}

function GenreCard({ photo }: { photo: GenrePlaceholder }) {
  return (
    <div
      className="flex h-full w-full flex-shrink-0 items-center justify-center rounded-sm shadow-lg"
      style={{ backgroundColor: FRAME_BG, padding: FRAME_BG_PADDING_PX }}
    >
      {/* Photo is inset inside a square frame to handle non-square originals */}
      <div className="h-full w-full">
        <div
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm"
          style={{ backgroundColor: FRAME_INNER_BG }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
