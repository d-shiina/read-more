"use client";

import { useEffect, useState } from "react";

/**
 * 右カラム（本来TOCがあった場所）を、黒歴史ブログ風サイドバーに再利用。
 * プロフィール／アクセスカウンター／集めた手がかり を表示。
 * ゆくゆくは カレンダー（日付メタ謎）や こなちゃんの最新コメント の置き場にする。
 */
export default function SidePanel() {
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("readmore.progress");
        setProgress(raw ? JSON.parse(raw) : []);
      } catch {
        setProgress([]);
      }
    };
    read();
    window.addEventListener("readmore:progress", read);
    return () => window.removeEventListener("readmore:progress", read);
  }, []);

  // アクセスカウンター（キリ番ネタの仕込み場所。今は演出のみ）
  const base = 114510;
  const counter = String(base + progress.length).padStart(6, "0");

  return (
    <div className="flex flex-col gap-5 text-sm">
      {/* プロフィール */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-fd-primary/15 text-xl">
            🎮
          </div>
          <div>
            <div className="font-semibold">zaftx</div>
            <div className="text-xs text-fd-muted-foreground">元・廃人 / 編集者見習い</div>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-fd-muted-foreground">
          フラグムービーに憧れて生きてきた。AfterEffects を知った日、世界が変わった。
        </p>
      </section>

      {/* アクセスカウンター */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-4 text-center">
        <div className="mb-1 text-xs text-fd-muted-foreground">アクセスカウンター</div>
        <div className="inline-flex gap-1">
          {counter.split("").map((d, i) => (
            <span
              key={i}
              className="rounded bg-black px-1.5 py-1 font-mono text-lg text-green-400"
              style={{ textShadow: "0 0 6px #22c55e" }}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-1 text-[10px] text-fd-muted-foreground">
          あなたは {counter} 人目の訪問者
        </div>
      </section>

      {/* 集めた手がかり */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-4">
        <div className="mb-2 text-xs font-semibold text-fd-muted-foreground">
          解いた話
        </div>
        {progress.length === 0 ? (
          <p className="text-xs text-fd-muted-foreground">まだ何も解いていない。</p>
        ) : (
          <ul className="space-y-1">
            {progress.map((c) => (
              <li key={c} className="text-xs">
                ✓ {c}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
