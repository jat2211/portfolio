import { useScroll, useTransform, useSpring, motion } from 'framer-motion';

const WHITE = '#FFFFFF';
const RED_BLACK = 'radial-gradient(ellipse at center, #8B0000 0%, #1a0000 50%, #000000 100%)';
const BLACK = '#000000';

export function ScrollBackground({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const background = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    [WHITE, RED_BLACK, RED_BLACK, BLACK]
  );
  const smoothBackground = useSpring(background, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-full">
      <motion.div
        className="fixed inset-0 -z-[1]"
        style={{
          background: smoothBackground,
          willChange: 'background',
        }}
        aria-hidden
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
