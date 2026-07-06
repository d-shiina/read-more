"use client";

import { useGame } from "../state";

export default function Title() {
  const { dispatch } = useGame();
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(180,107,255,0.22), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-30" style={scanlines} />

      <div className="relative z-10 flex flex-col items-center">
      <p className="mb-3 text-sm tracking-[0.4em] text-neon2">ESCAPE GAME</p>
      <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
        <span style={{ color: "var(--neon)", textShadow: "0 0 24px rgba(180,107,255,0.7)" }}>
          革命
        </span>
        <span className="text-text">からの脱出</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        オンラインゲーム「革命 -REVOLUTION-」に、何日も溺れていた。
        <br />
        ふと顔を上げると、部屋のドアには見慣れないロック。
        <br />
        思想の檻から、朝の光の下へ —— 脱出せよ。
      </p>

      <button
        onClick={() => dispatch({ type: "START" })}
        className="mt-10 rounded-full px-10 py-3 text-lg font-bold text-black transition hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(90deg,var(--neon2),var(--neon))" }}
      >
        ゲームを始める
      </button>

      <p className="mt-8 text-xs text-muted/60">
        クリック（タップ）で部屋を調べ、アイテムを集めて謎を解こう。
      </p>
      </div>
    </div>
  );
}

const scanlines: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
};
