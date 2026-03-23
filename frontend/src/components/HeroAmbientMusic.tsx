import { useCallback, useEffect, useRef, useState } from 'react';

const FADE_IN_S = 2.8;
const FADE_OUT_S = 1.4;

function getAudioContext(): AudioContext {
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  return new Ctor();
}

export function HeroAmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const oscsRef = useRef<OscillatorNode[]>([]);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teardown = useCallback(() => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    for (const o of oscsRef.current) {
      try {
        o.stop();
        o.disconnect();
      } catch {
        /* already stopped */
      }
    }
    oscsRef.current = [];
    masterRef.current?.disconnect();
    masterRef.current = null;
    const ctx = ctxRef.current;
    ctxRef.current = null;
    void ctx?.close();
  }, []);

  const stop = useCallback(() => {
    if (fadeOutTimerRef.current) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) {
      setPlaying(false);
      return;
    }
    const t = ctx.currentTime;
    const nowGain = Math.max(master.gain.value, 0.0001);
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(nowGain, t);
    master.gain.exponentialRampToValueAtTime(0.0001, t + FADE_OUT_S);
    fadeOutTimerRef.current = setTimeout(() => {
      fadeOutTimerRef.current = null;
      teardown();
      setPlaying(false);
    }, FADE_OUT_S * 1000 + 80);
  }, [teardown]);

  const start = useCallback(async () => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    if (ctxRef.current) return;
    const ctx = getAudioContext();
    ctxRef.current = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    masterRef.current = master;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 720;
    filter.Q.value = 0.6;
    filter.connect(master);

    const freqs = [196, 246.94, 293.66];
    const oscs: OscillatorNode[] = [];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.055;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      oscs.push(osc);
    }
    oscsRef.current = oscs;

    const t = ctx.currentTime;
    master.gain.exponentialRampToValueAtTime(0.18, t + FADE_IN_S);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else void start();
  }, [playing, start, stop]);

  useEffect(() => () => teardown(), [teardown]);

  return (
    <div className="pointer-events-auto absolute bottom-0 right-0 px-6 pb-8 pt-4 sm:pb-10">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="group flex items-center gap-3 rounded-none border border-white bg-transparent px-4 py-2.5 text-left text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] sm:text-sm">
          {playing ? 'Pause Music' : 'Start Music'}
        </span>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-white bg-transparent transition-opacity group-hover:opacity-90"
          aria-hidden
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="2" width="3.5" height="10" rx="0.5" />
              <rect x="8.5" y="2" width="3.5" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="translate-x-[1px]"
            >
              <path d="M3 2.5 12 7 3 11.5V2.5Z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
