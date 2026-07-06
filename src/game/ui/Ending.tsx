"use client";

import { useEffect, useState } from "react";
import { useGame } from "../state";

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}分${String(s % 60).padStart(2, "0")}秒`;
}

const EPILOGUE = [
  "ドアの向こうは、まぶしいくらいの朝だった。",
  "冷たい空気。遠くで鳴る、本物の鳥の声。",
  "「革命」は、まだ僕を待っている。",
  "でも今日は、外を歩いてみようと思う。",
];

export default function Ending() {
  const { state, dispatch } = useGame();
  const elapsed =
    state.startedAt && state.finishedAt ? state.finishedAt - state.startedAt : 0;

  const [phase, setPhase] = useState<"white" | "epilogue">("white");
  const [line, setLine] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("epilogue"), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "epilogue") return;
    if (line >= EPILOGUE.length) return;
    const t = setTimeout(() => setLine((l) => l + 1), 1200);
    return () => clearTimeout(t);
  }, [phase, line]);

  if (phase === "white") {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center"
        style={{ background: "#fdfcff", animation: "whiteout 1.4s ease" }}
      >
        <p className="text-2xl font-bold tracking-widest text-neutral-400">
          ドアが、開いた。
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 30%, rgba(255,209,102,0.18), transparent 70%)",
        }}
      />
      <div className="max-w-lg space-y-4">
        {EPILOGUE.slice(0, line).map((l, i) => (
          <p key={i} className="anim-fade text-lg leading-relaxed text-text sm:text-xl">
            {l}
          </p>
        ))}
      </div>

      {line >= EPILOGUE.length && (
        <div className="anim-fade mt-12">
          <p className="text-sm tracking-[0.5em] text-neon2">CONGRATULATIONS</p>
          <h2 className="mt-2 text-5xl font-black" style={{ color: "var(--gold)" }}>
            脱出成功
          </h2>
          <p className="mt-4 text-sm text-muted">クリアタイム：{fmt(elapsed)}</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="mt-8 rounded-full border px-8 py-3 text-base font-semibold transition hover:scale-105 active:scale-95"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
}
