import { useEffect, useRef } from 'react';

const TICK_INTERVAL_MS = 1250;
/** Stop ticks and release audio after this long (homage, not a loop forever). */
const AUDIO_DURATION_MS = 4000;

/**
 * Very quiet periodic tick while safelight is on (darkroom enlarger timer homage).
 * Skips entirely when `prefers-reduced-motion: reduce`. Pauses when tab is hidden.
 * Audio stops automatically after {@link AUDIO_DURATION_MS}.
 */
export function useDarkroomTick(active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const playTick = () => {
      if (document.hidden) return;

      let ctx = ctxRef.current;
      if (!ctx) {
        const w = window as Window & { webkitAudioContext?: typeof AudioContext };
        const Ctor = window.AudioContext ?? w.webkitAudioContext;
        ctx = new Ctor();
        ctxRef.current = ctx;
      }

      void ctx.resume().catch(() => {
        /* user may block; ignore */
      });

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.022, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    };

    const intervalId = setInterval(playTick, TICK_INTERVAL_MS);
    playTick();

    const stopAudio = () => {
      clearInterval(intervalId);
      const c = ctxRef.current;
      ctxRef.current = null;
      void c?.close();
    };

    const timeoutId = window.setTimeout(stopAudio, AUDIO_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
      stopAudio();
    };
  }, [active]);
}
