import { useState, type ImgHTMLAttributes } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useRedLight } from '../hooks/useRedLight';

function DevelopPhaseImg({
  className = '',
  onLoad,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [revealed, setRevealed] = useState(false);
  return (
    <img
      {...props}
      className={`${className} ${
        revealed
          ? 'opacity-100 brightness-100 transition-[opacity,filter] duration-[2.2s] ease-out'
          : 'opacity-[0.14] brightness-[1.75]'
      }`.trim()}
      onLoad={(e) => {
        setRevealed(true);
        onLoad?.(e);
      }}
    />
  );
}

/**
 * When safelight is on, images slowly "develop" from bright/washed to full (unless reduced motion).
 */
export function SafelightImage({
  className = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const { enabled } = useRedLight();
  const reducedMotion = useReducedMotion();
  const animate = enabled && !reducedMotion;

  if (!animate) {
    return <img {...props} className={className} />;
  }

  return <DevelopPhaseImg {...props} className={className} />;
}
