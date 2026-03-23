import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!finePointer) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setActive(true);
    };

    const onLeave = () => setActive(false);

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [finePointer]);

  useEffect(() => {
    if (!finePointer || !active) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = prev;
    };
  }, [finePointer, active]);

  if (!finePointer || !active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100] h-2 w-2 rounded-full bg-white"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    />
  );
}
