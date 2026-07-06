"use client";

import { useGame } from "../store";
import { ARCHIVE, SLICE_ARTICLE_ID } from "../blog";

export default function BlogSidebar() {
  const { state, isSolved } = useGame();
  const counter = String(114514 + state.solved.length).padStart(6, "0");

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border bg-frame p-4">
      {/* プロフィール */}
      <section className="rounded-xl border border-border bg-panel p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-xl">
            🎮
          </div>
          <div>
            <div className="font-bold">zaftx</div>
            <div className="text-[11px] text-muted-foreground">4g.MiNaMi / さかやん</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          A.V.A のクラン「4gotten」でスナ専。日本語に難があるのは仕様です＞ｗ＜
        </p>
      </section>

      {/* アクセスカウンター */}
      <section className="rounded-xl border border-border bg-panel p-3 text-center">
        <div className="mb-1 text-[10px] text-muted-foreground">アクセスカウンター</div>
        <div className="inline-flex gap-0.5">
          {counter.split("").map((d, i) => (
            <span
              key={i}
              className="rounded bg-black px-1.5 py-1 font-mono text-base text-green-400"
              style={{ textShadow: "0 0 6px #22c55e" }}
            >
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* アーカイブ */}
      <section>
        <h2 className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">
          ARCHIVE ／ 記事一覧
        </h2>
        <ul className="flex flex-col gap-1">
          {ARCHIVE.map((a) => {
            const reachable = a.id === SLICE_ARTICLE_ID;
            const solved = isSolved(a.id);
            return (
              <li key={a.id}>
                <div
                  className={[
                    "rounded-lg border px-3 py-2 text-xs",
                    reachable
                      ? "border-brand bg-brand/10 text-foreground"
                      : "border-border/60 text-muted-foreground/70",
                  ].join(" ")}
                >
                  <div className="text-[10px] text-muted-foreground">{a.date}</div>
                  <div className="truncate">
                    {solved ? "✓ " : reachable ? "📖 " : "🔒 "}
                    {reachable || solved ? a.title : "？？？"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-auto rounded-lg border border-border bg-panel px-3 py-2 text-center text-xs">
        解いた記事{" "}
        <span style={{ color: state.solved.length > 0 ? "var(--gold)" : "var(--brand)" }}>
          {state.solved.length}/{ARCHIVE.length}
        </span>
      </div>
    </aside>
  );
}
