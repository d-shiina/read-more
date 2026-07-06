"use client";

import { useGame } from "../store";
import Inventory from "./Inventory";

const LOCATIONS = [
  { id: "room", name: "深夜の自室", unlocked: true },
  { id: "blog", name: "？？？（黒歴史ブログ）", unlocked: false },
  { id: "memory", name: "？？？", unlocked: false },
];

/** 左サイドバー：場所移動 ＋ アイテム（参考サイトの構成） */
export default function Sidebar() {
  const { state, say } = useGame();
  const found = [
    state.flags.gotUsb,
    state.flags.posterSeen,
    state.flags.windowSeen,
    state.flags.solvedFrag,
  ].filter(Boolean).length;

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-5 border-r border-border bg-frame p-4">
      <div>
        <div className="text-lg font-black tracking-widest text-brand">read more</div>
        <div className="text-[11px] text-muted-foreground">謎解きゲーム</div>
      </div>

      {/* 場所移動 */}
      <section>
        <h2 className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">
          MAP ／ 場所
        </h2>
        <ul className="flex flex-col gap-1.5">
          {LOCATIONS.map((loc) => {
            const active = state.scene === loc.id;
            return (
              <li key={loc.id}>
                <button
                  disabled={!loc.unlocked}
                  onClick={() =>
                    loc.unlocked
                      ? undefined
                      : say([{ text: "……ここにはまだ行けない。今できることを先に。" }])
                  }
                  className={[
                    "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                    active
                      ? "border-brand bg-brand/15 text-foreground"
                      : loc.unlocked
                        ? "border-border bg-panel text-foreground hover:border-brand"
                        : "cursor-not-allowed border-border/60 bg-transparent text-muted-foreground/70",
                  ].join(" ")}
                >
                  {loc.unlocked ? "📍" : "🔒"} {loc.name}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* アイテム */}
      <section>
        <h2 className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">
          ITEMS ／ 持ち物
        </h2>
        <Inventory />
      </section>

      {/* 進行 */}
      <div className="mt-auto rounded-lg border border-border bg-panel px-3 py-2 text-center text-xs">
        調べた{" "}
        <span style={{ color: state.flags.solvedFrag ? "var(--gold)" : "var(--brand)" }}>
          {found}/4
        </span>
      </div>
    </aside>
  );
}
