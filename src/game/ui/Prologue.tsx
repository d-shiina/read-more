"use client";

import { useEffect, useState } from "react";
import { useGame } from "../state";

const LINES = [
  "――― プレイ時間、通算 812 時間。",
  "「革命」の世界で、僕は英雄だった。",
  "何万人もが、僕の名前を知っていた。",
  "画面の外の時間は、いつからか止まっていた。",
  "ふと、指が止まる。",
  "……ここは、どこだっけ。",
];

export default function Prologue() {
  const { dispatch } = useGame();
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= LINES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1100);
    return () => clearTimeout(t);
  }, [visible]);

  const done = visible >= LINES.length;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg space-y-4">
        {LINES.slice(0, visible).map((l, i) => (
          <p
            key={i}
            className="anim-fade text-lg leading-relaxed text-text sm:text-xl"
            style={{ opacity: i === visible - 1 ? 1 : 0.55 }}
          >
            {l}
          </p>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: "BEGIN_GAME" })}
        className="mt-12 rounded-full border px-8 py-3 text-base font-semibold transition hover:scale-105 active:scale-95"
        style={{
          borderColor: "var(--neon2)",
          color: "var(--neon2)",
          opacity: done ? 1 : 0.4,
          pointerEvents: done ? "auto" : "none",
        }}
      >
        目を覚ます →
      </button>

      {!done && (
        <button
          onClick={() => setVisible(LINES.length)}
          className="mt-6 text-xs text-muted/60 underline"
        >
          スキップ
        </button>
      )}
    </div>
  );
}
