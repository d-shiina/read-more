"use client";

import { useEffect, useRef, useState } from "react";

/** 「続き」＝また続きを読むから、で無限にボケ続ける行たち（彼の口ぐせ入り） */
const CONTINUES = [
  "続きは、続きを読むからどうぞ！",
  "……え、まだ読むの？ 続きは続きを読むからどうぞ！",
  "その続きは、こっちの続きを読むからどうぞ！",
  "どうも、さかやんです＞ｗ＜ 続きは続きを読むからどうぞ！",
  "AVAの大会近いから手短に。続きは続きを読むから！",
  "みるくふぁいたーのブログ更新する詐欺にならんように…続きを読むから！( ｰ`дｰ´)ｷﾘｯ",
  "基本情報の勉強しなきゃ…でも続きは続きを読むからどうぞ！",
  "こな「まだ読んでるのｗ？」……続きは続きを読むからどうぞ！",
  "フラグムービー作りたい。作り方は、続きを読むからどうぞ！",
  "4gottenメンバー募集中！詳細は続きを読むからどうぞ！",
  "AfterEffect、これは革命だ。使い方は続きを読むからどうぞ！",
  "＞ｗ＜ 続きは続きを読むからどうぞ！",
  "Jokaさま、SRの立ち回り教えて…続きは続きを読むからどうぞ！",
  "熱中症には気おつけて。続きは続きを読むからどうぞ！",
  "お前らしばくぞｗ（続きを読む）",
  "本当の最終回。……の続きは、続きを読むからどうぞ！",
  "もう書くことないけど、続きは続きを読むからどうぞ！",
  "君はまだ続きを読んでいる。えらい。続きは続きを読むからどうぞ！",
  "( ◖◡◗✰) 続きは続きを読むからどうぞ！",
  "TPSは苦手。でもバズーカゲーｗｗｗ 続きは続きを読むからどうぞ！",
];

/** 解除される実績（回数 → 内容） */
const ACHIEVEMENTS: Record<number, string> = {
  1: "📖 読者、爆誕",
  5: "🔫 クラン「4gotten」入隊",
  10: "🎖 AVA 中尉4 に昇格",
  20: "🎬 フラグムービー…まだ作ってない",
  30: "📄 基本情報技術者試験、不合格",
  42: "🍝 サイゼでペペロンチーノ",
  50: "🔢 キリ番ゲット……じゃない",
  69: "＞ｗ＜",
  100: "💿 完成版・最終・本当の最終",
  150: "🎤 KeNSiN のDeathVoice",
  200: "👴 今のキミ、ここまで読んでくれてありがとう",
  300: "🏆 続きを読む、極めし者",
};

const REC_KEY = "readmore.baka.record";

function buttonLabel(n: number) {
  if (n === 0) return "続きを読む →";
  if (n >= 200) return "まだ続きを読む…？ →";
  if (n >= 100) return "続きを読む（本当）→";
  if (n >= 50) return "続きを読む（まだある）→";
  if (n >= 20) return "さらに続きを読む →";
  return "続きを読む →";
}

export default function BakaGame() {
  const [count, setCount] = useState(0);
  const [thread, setThread] = useState<string[]>([]);
  const [record, setRecord] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [pop, setPop] = useState(0);
  const threadRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      // localStorageから自己ベストを復元（初回のみ）
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecord(Number(localStorage.getItem(REC_KEY) || 0));
    } catch {}
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo(0, threadRef.current.scrollHeight);
  }, [thread]);

  const readMore = () => {
    const n = count + 1;
    setCount(n);
    setPop((p) => p + 1);
    setThread((t) => [...t.slice(-40), CONTINUES[(n - 1) % CONTINUES.length]]);
    if (n > record) {
      setRecord(n);
      try {
        localStorage.setItem(REC_KEY, String(n));
      } catch {}
    }
    if (ACHIEVEMENTS[n]) {
      setToast(ACHIEVEMENTS[n]);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2600);
    }
  };

  const reset = () => {
    setCount(0);
    setThread([]);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 py-6">
      {/* 偽ブログのヘッダ */}
      <header className="mb-4 border-b border-line pb-3">
        <div className="text-xs tracking-widest text-[color:var(--accent-2)]">4g.MiNaMiの気まぐれ日記</div>
        <h1 className="mt-1 text-2xl font-black">
          <span className="text-brand">read</span> more
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          — 続きは、続きを読むからどうぞ！ —
        </p>
      </header>

      {/* 記事本体 */}
      <article className="rounded-lg border border-line bg-panel/70 p-5">
        <div className="text-xs text-muted-foreground">2011年07月12日 01:49 ｜ カテゴリ: 雑談</div>
        <h2 className="mt-1 text-lg font-bold">ブログ更新続けれるかな！？</h2>
        <p className="mt-3 text-sm leading-relaxed">
          みなさんお久しぶりです＞ｗ＜ 今日は最近ハマってることを書いていこうかな( ´ﾟдﾟ｀)
          <br />
          <span className="text-muted-foreground">……前置きはこれくらいにして。</span>
        </p>

        {/* 続きスレッド（押すほど積み上がる） */}
        {thread.length > 0 && (
          <div
            ref={threadRef}
            className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-md border border-line bg-black/20 p-3"
          >
            {thread.map((line, i) => (
              <p key={i} className="anim-fadeup border-l-2 border-brand/40 pl-3 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* 続きを読むボタン */}
        <button
          key={pop}
          onClick={readMore}
          className="anim-pop mt-4 w-full rounded-md bg-brand py-3 text-base font-black text-[#062a33] shadow-[0_0_16px_rgba(63,214,230,0.3)] transition hover:brightness-110 active:translate-y-px"
        >
          {buttonLabel(count)}
        </button>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            続きを読んだ回数：<span className="font-mono text-base font-bold text-brand">{count}</span>
          </span>
          <span>自己ベスト：{Math.max(record, count)}</span>
        </div>
      </article>

      {count > 0 && (
        <button onClick={reset} className="mt-3 self-center text-xs text-muted-foreground underline">
          最初の記事に戻る（諦める）
        </button>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-muted-foreground/60">
        ※ このゲームに攻略はありません。続きは、続きを読むからどうぞ！
      </p>

      {/* 実績トースト */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <div className="anim-pop rounded-full border border-brand/50 bg-panel px-5 py-2 text-sm font-bold shadow-[0_0_20px_rgba(63,214,230,0.35)]">
            実績解除：{toast}
          </div>
        </div>
      )}
    </div>
  );
}
