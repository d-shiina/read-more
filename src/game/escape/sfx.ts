"use client";

import { useCallback, useRef, useState } from "react";

/** WebAudio生成の効果音（アセットゼロ）。旧作から移植＋DM着信音・銃声を追加 */
export function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const tone = useCallback(
    (freq: number, at: number, dur = 0.09, gain = 0.04, type: OscillatorType = "square") => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime + at);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + at);
      o.stop(ctx.currentTime + at + dur + 0.02);
    },
    [],
  );

  const ensure = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) ctxRef.current = new AC();
      }
      ctxRef.current?.resume();
    } catch {}
  }, []);

  const blip = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(660, 0);
    } catch {}
  }, [muted, ensure, tone]);

  const fanfare = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(523, 0, 0.1);
      tone(659, 0.1, 0.1);
      tone(784, 0.2, 0.16, 0.05);
    } catch {}
  }, [muted, ensure, tone]);

  /** DM着信音 */
  const ping = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(880, 0, 0.07, 0.035, "sine");
      tone(1175, 0.08, 0.12, 0.035, "sine");
    } catch {}
  }, [muted, ensure, tone]);

  /** SRの銃声（それっぽい低音） */
  const shot = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(140, 0, 0.12, 0.06, "sawtooth");
      tone(70, 0.02, 0.18, 0.05, "square");
    } catch {}
  }, [muted, ensure, tone]);

  return { muted, setMuted, blip, fanfare, ping, shot };
}
