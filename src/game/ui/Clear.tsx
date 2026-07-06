"use client";

import { useGame } from "../store";
import { Button } from "@/components/ui/button";

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}分${String(s % 60).padStart(2, "0")}秒`;
}

export default function Clear() {
  const { state, dispatch } = useGame();
  const elapsed =
    state.finishedAt && state.startedAt ? state.finishedAt - state.startedAt : 0;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 35%, rgba(180,107,255,0.22), transparent 70%)",
        }}
      />
      <div className="relative z-10 anim-fadeup">
        <p className="text-sm tracking-[0.5em] text-accent2">CHAPTER 1 CLEAR</p>
        <h2 className="mt-3 text-5xl font-black text-brand">つづく</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          こなちゃんの最初の謎を解いた。
          <br />
          ——この続きに、本物のブログ連携や、思い出の日付の謎、
          <br />
          そして「革命」の結末が待っている（予定）。
        </p>
        <p className="mt-4 text-xs text-muted-foreground">プレイ時間：{fmt(elapsed)}</p>

        <Button
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-8 rounded-full bg-brand px-8 text-white hover:bg-brand/90"
        >
          もう一度あそぶ
        </Button>
      </div>
    </div>
  );
}
