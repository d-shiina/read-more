"use client";

/**
 * read more — 「続きは、続きを読むからどうぞ！」だけで作られたばかゲー。
 *
 * 仕組み：全18ステージ。1ステージ＝1つのボケ（毎回ちがう手口で裏切る）。
 * 記事の日付が 2011→2026 に勝手に進んでいく＝“続き”に15年かかった、
 * という彼のブログの実話がそのまま構造になっている。最後だけ少し本気。
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ================= ステージのメタ（日付が15年進む） ================= */

interface Meta {
  date: string;
  title: string;
  cat: string;
}

const META: Meta[] = [
  { date: "2011年07月12日 01:49", title: "ブログ更新続けれるかな！？", cat: "雑談" },
  { date: "2011年07月12日 23:59", title: "続き", cat: "雑談" },
  { date: "2011年07月13日 00:00", title: "続きの続き", cat: "雑談" },
  { date: "2011年07月18日 22:24", title: "オフ会してきた！", cat: "雑談" },
  { date: "2011年08月02日 06:40", title: "＞ｗ＜", cat: "雑談" },
  { date: "2011年12月31日 23:59", title: "続きを読み込み中", cat: "お知らせ" },
  { date: "2012年03月05日 03:30", title: "続きはこのボタンから！", cat: "雑談" },
  { date: "2012年03月06日 18:36", title: "新しい表現に挑戦してみた", cat: "ブログネタ考察" },
  { date: "2012年07月10日 21:00", title: "黒歴史Twitter発掘", cat: "掘り起こし" },
  { date: "2013年06月06日 06:06", title: "続きはこの下です", cat: "埋蔵" },
  { date: "2013年12月25日 00:00", title: "NewPCになったので続きも爆速です", cat: "お知らせ" },
  { date: "2014年04月01日 00:00", title: "続きを読むボタン増量キャンペーン", cat: "サービス" },
  { date: "2016年09月09日 09:09", title: "あの頃のデザインにしてみた", cat: "懐古" },
  { date: "2020年02月02日 02:22", title: "最終回", cat: "重大発表" },
  { date: "2023年11月11日 11:11", title: "コメントが来てた", cat: "交流" },
  { date: "2025年12月31日 23:59", title: "誠意を見せて", cat: "試練" },
  { date: "2026年04月15日 21:19", title: "お前らしばくぞｗ", cat: "" },
  { date: "2026年07月07日 07:07", title: "ここまで読んでくれた君へ", cat: "完" },
];

/** ステージ通過で解除される実績（index＝ステージ） */
const ACH: string[] = [
  "📖 読者、爆誕",
  "🔁 二度目の「続き」",
  "🎤 DeathVoiceを見た",
  "🤔 これ、そういうゲーム？",
  "＞ｗ＜",
  "🌀 読み込みに騙された",
  "🏃 ボタンに逃げられた",
  "📑 タブを汚された",
  "🐦 黒歴史を発掘された",
  "🕳 底まで行った",
  "♾ ∞を見た",
  "🎯 本物を見抜いた",
  "🕰 2011年に戻った",
  "🎬 完を見た（見てない）",
  "💬 めすみるくが来た",
  "✍ だいたい合ってた",
  "🪵 本文なし",
  "🏆 全部読んだ",
];

const TOTAL = META.length;
const SAVE = "readmore.v2";

const BTN =
  "mt-5 w-full rounded-md bg-brand py-3 text-base font-black text-[#062a33] shadow-[0_0_16px_rgba(63,214,230,0.3)] transition hover:brightness-110 active:translate-y-px";
const BTN_SUB =
  "mt-3 w-full rounded-md border border-line bg-panel py-2.5 text-sm font-bold text-text transition hover:border-brand";

/* ================= 効果音（WebAudio・アセット不要） ================= */

function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const tone = useCallback((freq: number, at: number, dur = 0.09, gain = 0.04) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime + at);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + at);
    o.stop(ctx.currentTime + at + dur + 0.02);
  }, []);

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

  return { muted, setMuted, blip, fanfare };
}

/* ================= 本体 ================= */

export default function ReadMore() {
  const [stage, setStage] = useState(0);
  const [reads, setReads] = useState(0);
  const [ach, setAch] = useState<number[]>([]);
  const [bonus, setBonus] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { muted, setMuted, blip, fanfare } = useSfx();

  // セーブデータ復元（初回のみ）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const s = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (typeof s.stage === "number") setStage(Math.min(s.stage, TOTAL - 1));
        if (typeof s.reads === "number") setReads(s.reads);
        if (Array.isArray(s.ach)) setAch(s.ach);
        if (Array.isArray(s.bonus)) setBonus(s.bonus);
        setStartedAt(typeof s.startedAt === "number" ? s.startedAt : Date.now());
      } else {
        setStartedAt(Date.now());
      }
      setLoaded(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      setLoaded(true);
    }
  }, []);

  // セーブ
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SAVE, JSON.stringify({ stage, reads, ach, bonus, startedAt }));
    } catch {}
  }, [stage, reads, ach, bonus, startedAt, loaded]);

  // ach の最新値をrefにミラー（updater内での副作用を避けるため）
  const achRef = useRef<number[]>([]);
  useEffect(() => {
    achRef.current = ach;
  }, [ach]);

  const grant = useCallback(
    (idx: number) => {
      if (achRef.current.includes(idx)) return;
      achRef.current = [...achRef.current, idx];
      setAch(achRef.current);
      setToast(ACH[idx]);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2400);
      fanfare();
    },
    [fanfare],
  );

  /** 「続きを読む」系のボタンで次のステージへ */
  const advance = useCallback(() => {
    blip();
    setReads((r) => r + 1);
    grant(stage);
    const next = Math.min(stage + 1, TOTAL - 1);
    if (next === TOTAL - 1) grant(TOTAL - 1);
    setStage(next);
    // ステージが変わったら上に戻す（スクロール地獄の後始末）
    window.scrollTo({ top: 0 });
  }, [blip, grant, stage]);

  const reset = useCallback(() => {
    setStage(0);
    setReads(0);
    setAch([]);
    setBonus([]);
    setStartedAt(Date.now());
    try {
      localStorage.removeItem(SAVE);
    } catch {}
  }, []);

  // 隠し実績（コナミコマンド・コンソール等）。stage実績とは別枠で管理。
  const bonusRef = useRef<string[]>([]);
  useEffect(() => {
    bonusRef.current = bonus;
  }, [bonus]);

  const grantBonus = useCallback(
    (id: string, label: string) => {
      if (bonusRef.current.includes(id)) return;
      bonusRef.current = [...bonusRef.current, id];
      setBonus(bonusRef.current);
      setToast(label);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2800);
      fanfare();
    },
    [fanfare],
  );

  // コナミコマンド：↑↑↓↓←→←→ba で隠し実績（どのステージからでも有効）
  useEffect(() => {
    const CODE = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      buf = buf.slice(-CODE.length);
      if (buf.length === CODE.length && buf.every((k, i) => k === CODE[i])) {
        grantBonus("konami", "🎮 裏技を見つけた（隠し実績）");
        buf = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grantBonus]);

  // 開発者コンソールを覗いた人へ。読むだけでなく、実際に叩いて初めて実績になる。
  useEffect(() => {
    console.log(
      "%c……あ、見てるでしょ。",
      "color:#3fd6e6;font-weight:bold;font-size:14px;",
    );
    console.log(
      "%cソースまで読んでくれてありがとう＞ｗ＜\n続きが見たければ、ここに tsudzuki() って打ってみて。",
      "color:#8b93a1;",
    );
    (window as unknown as { tsudzuki?: () => string }).tsudzuki = () => {
      grantBonus("console", "🔍 コンソールを覗いた（隠し実績）");
      return "続きは、続きを読むからどうぞ！＞ｗ＜";
    };
    return () => {
      delete (window as unknown as { tsudzuki?: () => string }).tsudzuki;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = META[stage];

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 py-6">
      {/* ヘッダ */}
      <header className="mb-4 flex items-end justify-between border-b border-line pb-3">
        <div>
          <div className="text-xs tracking-widest text-accent2">4g.MiNaMiの気まぐれ日記</div>
          <h1 className="mt-1 text-2xl font-black">
            <span className="text-brand">read</span> more
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            実績 {ach.length}/{TOTAL}
          </span>
          <span>読んだ回数 {reads}</span>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label="効果音の切り替え"
            className="rounded border border-line px-2 py-1 hover:border-brand"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      {/* 記事 */}
      <article key={stage} className="anim-fadeup rounded-lg border border-line bg-panel/70 p-5">
        <div className="text-xs text-muted-foreground">
          {meta.date}
          {meta.cat && <> ｜ カテゴリ: {meta.cat}</>}
        </div>
        <h2 className="mt-1 text-lg font-bold">{meta.title}</h2>
        <div className="mt-3 text-sm leading-relaxed">
          <Stage
            stage={stage}
            advance={advance}
            reset={reset}
            reads={reads}
            ach={ach}
            bonus={bonus}
            startedAt={startedAt}
          />
        </div>
      </article>

      {stage > 0 && stage < TOTAL - 1 && (
        <button onClick={reset} className="mt-3 self-center text-xs text-muted-foreground underline">
          最初から読み直す（諦める）
        </button>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-muted-foreground/60">
        ※ このゲームに攻略はありません。続きは、続きを読むからどうぞ！
      </p>

      {/* 実績トースト */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
          <div className="anim-pop rounded-full border border-brand/50 bg-panel px-5 py-2 text-sm font-bold shadow-[0_0_20px_rgba(63,214,230,0.35)]">
            実績解除：{toast}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= ステージ出し分け ================= */

interface StageProps {
  stage: number;
  advance: () => void;
  reset: () => void;
  reads: number;
  ach: number[];
  bonus: string[];
  startedAt: number;
}

function Stage(p: StageProps) {
  switch (p.stage) {
    case 0:
      return <S0 advance={p.advance} />;
    case 1:
      return <S1 advance={p.advance} />;
    case 2:
      return <S2 advance={p.advance} />;
    case 3:
      return <S3Karaoke advance={p.advance} />;
    case 4:
      return <S3 advance={p.advance} />;
    case 5:
      return <S4Loading advance={p.advance} />;
    case 6:
      return <S5Dodger advance={p.advance} />;
    case 7:
      return <S6Title advance={p.advance} />;
    case 8:
      return <S7Twitter advance={p.advance} />;
    case 9:
      return <S7Scroll advance={p.advance} />;
    case 10:
      return <S8Countdown advance={p.advance} />;
    case 11:
      return <S9Multiplied advance={p.advance} />;
    case 12:
      return <S10Retro advance={p.advance} />;
    case 13:
      return <S11FakeEnd advance={p.advance} />;
    case 14:
      return <S12Kona advance={p.advance} />;
    case 15:
      return <S13Type advance={p.advance} />;
    case 16:
      return <S14Shibaku advance={p.advance} />;
    default:
      return (
        <S15Ending
          reset={p.reset}
          reads={p.reads}
          ach={p.ach}
          bonus={p.bonus}
          startedAt={p.startedAt}
        />
      );
  }
}

type A = { advance: () => void };

/* --- 0: 本物の記事（2011-07-12） --- */
function S0({ advance }: A) {
  return (
    <>
      <p>
        最近なぜブログを開設したのか分からないくらい、更新していなかった。急に更新意欲が湧いてきたので、更新しました＞ｗ＜
      </p>
      <p className="mt-2">
        今日は、ネトゲの事ではなく最近興味が湧いてきたことを書いていこうかな( ´ﾟдﾟ｀)
      </p>
      <p className="mt-2 font-bold">続きは、続きを読むからどうぞ！</p>
      <button onClick={advance} className={BTN}>
        続きを読む →
      </button>
    </>
  );
}

/* --- 1: まさかの再帰 --- */
function S1({ advance }: A) {
  return (
    <>
      <p>どうも、さかやんです＞ｗ＜</p>
      <p className="mt-2 font-bold">続きは、続きを読むからどうぞ！</p>
      <button onClick={advance} className={BTN}>
        続きを読む →
      </button>
    </>
  );
}

/* --- 2: 自覚あり --- */
function S2({ advance }: A) {
  return (
    <>
      <p>え？</p>
      <p className="mt-2">いや、だから——</p>
      <p className="mt-2 font-bold">続きは、続きを読むからどうぞ！</p>
      <button onClick={advance} className={BTN}>
        ほんとうに続きを読む →
      </button>
    </>
  );
}

/* --- 3: オフ会カラオケの選曲リスト（実話・ニックネームのみ） --- */
const KARAOKE = [
  { who: "楓", note: "熱唱", result: "テンション異常。即日、クラン専属DeathVoice担当に任命される。" },
  { who: "きいたりもん", note: "ハッチポッチステーション", result: "選曲の意図は誰にも分からなかったが、なぜかチームワークは向上した。" },
  { who: "フィッツ", note: "控えめに参加", result: "二人のテンションに飲まれて終始おとなしめ。CWの時は声出していこうな。" },
  { who: "hellfox", note: "加藤ミリヤ推し", result: "Gongの時だけ謎に覚醒。歌い終えるとバイクに跨って帰っていった。" },
  { who: "私", note: "・・・///", result: "（本人による語りはここで途切れている）" },
];

function S3Karaoke({ advance }: A) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const done = revealed.length >= KARAOKE.length;

  return (
    <>
      <p>4gottenのメンツでカラオケに行ってきた！オフ会っていっても全員リアフレなんだけどねｗ</p>
      <p className="mt-1 text-xs text-muted-foreground">気になる人をタップして選曲結果を見る↓</p>

      <div className="mt-3 space-y-2">
        {KARAOKE.map((k, i) => {
          const open = revealed.includes(i);
          return (
            <button
              key={i}
              onClick={() => !open && setRevealed((r) => [...r, i])}
              className="w-full rounded-md border border-line bg-black/20 p-2.5 text-left transition hover:border-brand"
            >
              <div className="text-sm font-bold">
                {k.who} <span className="font-normal text-muted-foreground">－ {k.note}</span>
              </div>
              {open && <p className="anim-fadeup mt-1 text-sm text-muted-foreground">{k.result}</p>}
            </button>
          );
        })}
      </div>

      {done && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            その後サイゼでペペロンチーノ。AVAの話のはずが、なぜかカスタムロボの話で盛り上がる。
          </p>
          <button onClick={advance} className={`${BTN} anim-pop`}>
            続きを読む →
          </button>
        </>
      )}
    </>
  );
}

/* --- 4: 本文が顔文字だけ --- */
function S3({ advance }: A) {
  return (
    <>
      <p className="py-6 text-center text-5xl font-black">＞ｗ＜</p>
      <button onClick={advance} className={BTN}>
        続きを読む →
      </button>
    </>
  );
}

/* --- 4: 偽ローディング --- */
function S4Loading({ advance }: A) {
  const [phase, setPhase] = useState<"idle" | "loading" | "failed">("idle");
  const [prog, setProg] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const start = () => {
    setPhase("loading");
    let v = 0;
    timer.current = setInterval(() => {
      // 98%で止まるのが様式美
      v = Math.min(98, v + (v < 60 ? 13 : v < 90 ? 5 : 1));
      setProg(v);
      if (v >= 98) {
        if (timer.current) clearInterval(timer.current);
        setTimeout(() => setPhase("failed"), 1100);
      }
    }, 140);
  };

  if (phase === "idle")
    return (
      <>
        <p>今年も残りわずか。年内に続きをお届けします！</p>
        <button onClick={start} className={BTN}>
          続きを読む →
        </button>
      </>
    );

  if (phase === "loading")
    return (
      <>
        <p>続きを読み込んでいます……</p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-black/40">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${prog}%` }} />
        </div>
        <p className="mt-2 text-center font-mono text-2xl font-bold text-brand">{prog}%</p>
      </>
    );

  return (
    <>
      <p className="font-bold text-danger">読み込みに失敗しました＞ｗ＜（うそ）</p>
      <p className="mt-2 text-muted-foreground">最初からそんなものは無い。</p>
      <button onClick={advance} className={BTN}>
        もう一回押して！ →
      </button>
    </>
  );
}

/* --- 5: 逃げるボタン --- */
const DODGE_POS = [
  { left: "8%", top: "8%" },
  { left: "55%", top: "58%" },
  { left: "18%", top: "62%" },
];

function S5Dodger({ advance }: A) {
  const [dodges, setDodges] = useState(0);
  const gaveUp = dodges >= 3;

  const dodge = () => {
    if (!gaveUp) setDodges((d) => d + 1);
  };

  return (
    <>
      <p>いつも読んでくれてありがとう！お礼に、続きはこのボタンからどうぞ！</p>
      <div className="relative mt-4 h-44 rounded-md border border-dashed border-line bg-black/20">
        <button
          onMouseEnter={dodge}
          onTouchStart={(e) => {
            if (!gaveUp) {
              e.preventDefault();
              dodge();
            }
          }}
          onClick={() => gaveUp && advance()}
          className="absolute rounded-md bg-brand px-5 py-2.5 text-sm font-black text-[#062a33] transition-all duration-150"
          style={gaveUp ? { left: "50%", top: "50%", transform: "translate(-50%,-50%)" } : DODGE_POS[dodges % 3]}
        >
          {gaveUp ? "もう逃げないから押して →" : "続きを読む →"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {dodges === 0 && "（どうぞ！）"}
        {dodges === 1 && "あｗ　ごめんｗ"}
        {dodges === 2 && "めすみるく「いじわるすんなｗ」"}
        {dodges >= 3 && "……疲れた。"}
      </p>
    </>
  );
}

/* --- 6: タブのタイトルに続きを書く --- */
const TITLE_TEXT = "続きは、続きを読むからどうぞ！＞ｗ＜　";

function S6Title({ advance }: A) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prev = document.title;
    const t = setInterval(() => setOffset((o) => (o + 1) % TITLE_TEXT.length), 250);
    return () => {
      clearInterval(t);
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    document.title = TITLE_TEXT.slice(offset) + TITLE_TEXT.slice(0, offset);
  }, [offset]);

  return (
    <>
      <p>画像とか、動画とかを取り入れたほうがいいのかな？</p>
      <p className="mt-2">と思ったので、新しい表現に挑戦してみました。</p>
      <p className="mt-2 font-bold">続きは、このタブのタイトル（↑）に書いておきました！</p>
      <p className="mt-2 text-xs text-muted-foreground">※ ブラウザのタブを見てください。流れてます。</p>
      <button onClick={advance} className={BTN}>
        タイトル、見た（戻して） →
      </button>
    </>
  );
}

/* --- 7: 黒歴史Twitter発掘（実在ツイート、当時の彼のこな推し） --- */
const TWEETS_MAIN = [
  { date: "2012.02.17", text: "こなちゃんおかえりー私はまだ学校にいるー＞ｗ＜後1時間くらいで家にいると思うー！今日は過疎るのかな？ｗ" },
  { date: "2012.02.22", text: "こなちゃんTSこいやぁああああ⌒*( ◖◡◗✰)*ﾟ⌒" },
  { date: "2012.03.11", text: "暇ーこなちゃんTSはよ！" },
];
const TWEETS_MORE = [
  { date: "2012.02.26", text: "やっと睡魔が襲ってきた⌒*( ◖◡◗✰)*ﾟ⌒こなちゃんちゃんと起きれたのだろうか？" },
  { date: "2012.03.12", text: "二度寝とか甘えー、こなちゃんマイクラの鯖立ててからいってくれたらうれしい！" },
  { date: "2012.05.13", text: "いつの間にかこなちゃん帰ってきとるやん(゜∀。)" },
  { date: "2012.06.27", text: "とりあえず8で作ることにした＞ｗ＜こなちゃんとか別の所で作ってるみたいやけど、みんな8おいで！" },
  { date: "2012.07.10", text: "こなだけに、粉まみれってか！九州と味違ったりしたー？⌒*( ◖◡◗✰)*ﾟ⌒" },
];

function S7Twitter({ advance }: A) {
  const [more, setMore] = useState(false);

  return (
    <>
      <p>掘り起こしてしまった。当時の彼の、旧Twitter（現X）のログ。</p>
      <p className="mt-1 text-xs text-muted-foreground">※ ここから先、しばらく「こなちゃん」しか言ってません。</p>

      <div className="mt-4 space-y-2 rounded-md border border-line bg-black/20 p-3">
        {TWEETS_MAIN.map((t, i) => (
          <Tweet key={i} date={t.date} text={t.text} />
        ))}
        {more &&
          TWEETS_MORE.map((t, i) => (
            <Tweet key={`m${i}`} date={t.date} text={t.text} anim />
          ))}
      </div>

      {!more ? (
        <button onClick={() => setMore(true)} className={BTN_SUB}>
          もっと見る（あと5件）
        </button>
      ) : (
        <>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ……関連ツイート、まだまだ出てくる。編集済みでこれでも一部です。
          </p>
          <button onClick={advance} className={BTN}>
            続きを読む →
          </button>
        </>
      )}
    </>
  );
}

function Tweet({ date, text, anim }: { date: string; text: string; anim?: boolean }) {
  return (
    <div className={`flex gap-2 rounded-md bg-black/20 p-2.5 ${anim ? "anim-fadeup" : ""}`}>
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-black text-brand">
        4g
      </span>
      <div className="min-w-0">
        <div className="text-xs">
          <span className="font-bold">4g.MiNaMi</span>{" "}
          <span className="text-muted-foreground">@zaftx ・ {date}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* --- 8: スクロール地獄 --- */
function S7Scroll({ advance }: A) {
  return (
    <>
      <p className="font-bold">続きはこの下にあります↓（本当）</p>
      <div className="relative mt-4 h-[2200px] rounded-md border border-dashed border-line bg-black/10">
        <Marker top="6%" text="↓ こっち" />
        <Marker top="22%" text="まだだよ" />
        <Marker top="40%" text="＞ｗ＜" />
        <Marker top="55%" text="半分きたよ、えらい" />
        <Marker top="72%" text="この距離、彼の更新頻度と同じ" />
        <Marker top="88%" text="あとちょっと！" />
        <div className="absolute inset-x-4 bottom-4">
          <p className="mb-2 text-center text-sm font-bold">ようこそ、最下層へ。</p>
          <button onClick={advance} className={BTN}>
            続きを読む →
          </button>
        </div>
      </div>
    </>
  );
}

function Marker({ top, text }: { top: string; text: string }) {
  return (
    <div className="absolute inset-x-0 text-center text-sm text-muted-foreground" style={{ top }}>
      {text}
    </div>
  );
}

/* --- 8: カウントダウン詐欺 --- */
function S8Countdown({ advance }: A) {
  const [n, setN] = useState(3);
  const infinite = n <= 0;

  return (
    <>
      <p>NewPCになったので続きを読むのも爆速になりました！（i7-4790K / GTX 780 Ti）</p>
      <p className="mt-3 text-center text-sm text-muted-foreground">本当の続きまで、あと</p>
      <p
        className="my-2 text-center text-6xl font-black text-brand"
        style={infinite ? { animation: "shake 0.4s" } : undefined}
      >
        {infinite ? "∞" : n}
      </p>
      {infinite ? (
        <>
          <p className="text-center text-sm text-muted-foreground">回ｗｗｗｗ</p>
          <button onClick={advance} className={BTN}>
            ウソウソ、次で本当 →
          </button>
        </>
      ) : (
        <button onClick={() => setN((v) => v - 1)} className={BTN}>
          続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 9: ボタン増殖 --- */
function S9Multiplied({ advance }: A) {
  const [dead, setDead] = useState<number[]>([]);
  const [scold, setScold] = useState(false);
  const REAL = 7; // 「！」付きが本物

  const miss = (i: number) => {
    setDead((d) => (d.includes(i) ? d : [...d, i]));
    setScold(true);
    setTimeout(() => setScold(false), 900);
  };

  return (
    <>
      <p>日頃の感謝を込めて、続きを読むボタンを増量しました！（サービス）</p>
      <p className="mt-1 text-xs text-muted-foreground">めすみるく「本物には『！』が付いてる気がする」</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const isReal = i === REAL;
          const isDead = dead.includes(i);
          return (
            <button
              key={i}
              disabled={isDead}
              onClick={() => (isReal ? advance() : miss(i))}
              className={`rounded-md py-2.5 text-xs font-bold transition ${
                isDead
                  ? "bg-black/30 text-muted-foreground/50"
                  : "bg-brand/90 text-[#062a33] hover:brightness-110"
              }`}
              style={isDead ? undefined : { animation: undefined }}
            >
              {isDead ? "＞ｗ＜" : isReal ? "続きを読む！ →" : "続きを読む →"}
            </button>
          );
        })}
      </div>
      {scold && (
        <p className="mt-3 text-center text-sm font-black text-danger" style={{ animation: "shake 0.4s" }}>
          お前らしばくぞｗ
        </p>
      )}
    </>
  );
}

/* --- 10: 2011年のデザインに戻る --- */
function S10Retro({ advance }: A) {
  return (
    <div className="rounded-sm bg-[#ffffff] p-4 text-[#333333]" style={{ fontFamily: "'MS PGothic', 'Hiragino Kaku Gothic ProN', sans-serif" }}>
      <div className="overflow-hidden whitespace-nowrap border-b border-[#9db8d2] pb-1 text-sm text-[#1a4ba0]">
        <span className="inline-block" style={{ animation: "marqueeX 9s linear infinite" }}>
          ようこそ！あなたは114514人目の訪問者です！キリ番踏んだ人は報告よろしく＞ｗ＜　Sorry, Japanese only.
        </span>
      </div>
      <p className="mt-3 text-sm">懐かしくなったので、あの頃のデザインにしてみました。</p>
      <p className="mt-2 text-sm">
        <span className="text-[#1a4ba0] underline">■お知らせ</span>　相互リンク募集中です！
      </p>
      <div className="mt-3 flex items-center gap-1">
        <span className="text-xs">アクセスカウンター:</span>
        {"114514".split("").map((d, i) => (
          <span key={i} className="bg-black px-1 font-mono text-sm text-[#33ff66]">
            {d}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-bold">続きは、続きを読むからどうぞ！</p>
      {/* あえてスタイルなしの素のボタン */}
      <button onClick={advance} className="mt-3">
        続きを読む
      </button>
    </div>
  );
}

/* --- 11: 偽の最終回（スタッフロール） --- */
const CREDITS = [
  "―――― 完 ――――",
  "",
  "制作　SakayaN",
  "脚本　さかやん",
  "主演　4g.MiNaMi",
  "友情出演　みるくふぁいたー",
  "スナイパー　瞳を知り尽した男",
  "（※ここまで全部同一人物）",
  "",
  "特別出演　めすみるく",
  "協力　4gotten / Joka先生 / AfterEffect",
  "",
  "フラグムービーは製作されませんでした",
];

function S11FakeEnd({ advance }: A) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 4200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <p>長らくのご愛読、ありがとうございました。</p>
      <div className="relative mt-4 h-64 overflow-hidden rounded-md bg-black">
        <div
          className="absolute inset-x-0 text-center text-sm leading-7 text-white/85"
          style={{ animation: "creditsUp 9s linear infinite" }}
        >
          {CREDITS.map((c, i) => (
            <div key={i} className={i === 0 ? "text-xl font-black" : ""}>
              {c || " "}
            </div>
          ))}
        </div>
      </div>
      {showBtn ? (
        <button onClick={advance} className={`${BTN} anim-pop`}>
          ……の続きは、続きを読むからどうぞ！ →
        </button>
      ) : (
        <p className="mt-4 text-center text-xs text-muted-foreground">（感動の余韻）</p>
      )}
    </>
  );
}

/* --- 12: めすみるく、12年ぶりのコメント --- */
const KONA_COMMENTS = [
  "まだやってるのｗ？",
  "『ブログは３日に一回は更新してこ！』って言ったの、12年前なんだけど。",
  "……でも、ちょっとうれしい。また今度一緒になんかやろやー。",
];

function S12Kona({ advance }: A) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= KONA_COMMENTS.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <>
      <p className="text-xs text-muted-foreground">コメント一覧 ({KONA_COMMENTS.length})</p>
      <div className="mt-2 space-y-2">
        {KONA_COMMENTS.slice(0, shown).map((c, i) => (
          <div key={i} className="anim-fadeup rounded-md border border-line bg-black/20 p-3">
            <div className="text-xs font-bold text-[#cf8fb0]">
              {i + 1}. めすみるく <span className="font-normal text-muted-foreground">(2023年11月11日 11:1{i})</span>
            </div>
            <p className="mt-1 text-sm">{c}</p>
          </div>
        ))}
      </div>
      {shown >= KONA_COMMENTS.length && (
        <button onClick={advance} className={`${BTN} anim-pop`}>
          「うん」と返事して続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 13: 誠意（入力）。何を打っても大体合ってる --- */
function S13Type({ advance }: A) {
  const [value, setValue] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  const submit = () => {
    const v = value.trim();
    if (!v) {
      setReply("何か書いて！＞ｗ＜");
      return;
    }
    if (/joka|じょーか|ジョーカ/i.test(v)) {
      setReply("Jokaさまぁあああああああああ……ｗ　最近何してるんだろうな、あの人。");
    } else if (/こな|みるく/.test(v)) {
      setReply("……呼んだ？（照）");
    } else if (/つづき|続き/.test(v)) {
      setReply("よくできました！えらい！");
    } else {
      setReply(`「${v}」……だいたい合ってる！＞ｗ＜`);
    }
  };

  const done = reply !== null && reply !== "何か書いて！＞ｗ＜";

  return (
    <>
      <p>そんなに続きが読みたいなら、誠意を見せてください。</p>
      <p className="mt-2 font-bold">下に「つづき」と入力してください。</p>
      {!done ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="ここに誠意を入力"
            autoComplete="off"
            spellCheck={false}
            className="mt-4 w-full rounded-md border border-line bg-black/40 px-3 py-2.5 text-base outline-none focus:border-brand"
          />
          {reply && <p className="mt-2 text-sm text-danger">{reply}</p>}
          <button onClick={submit} className={BTN}>
            誠意を送信 →
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 text-center text-lg font-bold anim-pop">{reply}</p>
          <button onClick={advance} className={BTN}>
            続きを読む →
          </button>
        </>
      )}
    </>
  );
}

/* --- 14: 実在の最新記事（本文なし） --- */
function S14Shibaku({ advance }: A) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <p className="text-muted-foreground">※ これは実在する、彼の15年ぶりの更新です。</p>
      {!opened ? (
        <button onClick={() => setOpened(true)} className={BTN}>
          本文を読む →
        </button>
      ) : (
        <>
          <p className="mt-4 rounded-md border border-dashed border-line bg-black/20 p-6 text-center text-muted-foreground anim-pop">
            （本文なし）
          </p>
          <p className="mt-3 text-sm">……15年ぶりの更新が、これ？</p>
          <button onClick={advance} className={BTN}>
            じゃあ続きを読む →
          </button>
        </>
      )}
    </>
  );
}

/* --- 15: エンディング（ここだけ少し本気） --- */
const BONUS_LABEL: Record<string, string> = {
  konami: "🎮 裏技を見つけた（↑↑↓↓←→←→BA）",
  console: "🔍 コンソールで tsudzuki() を叩いた",
};

function S15Ending({
  reset,
  reads,
  ach,
  bonus,
  startedAt,
}: {
  reset: () => void;
  reads: number;
  ach: number[];
  bonus: string[];
  startedAt: number;
}) {
  const [elapsed, setElapsed] = useState<string>("");

  useEffect(() => {
    const ms = Date.now() - startedAt;
    const s = Math.max(1, Math.floor(ms / 1000));
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setElapsed(`${Math.floor(s / 60)}分${String(s % 60).padStart(2, "0")}秒`);
  }, [startedAt]);

  return (
    <>
      <div className="space-y-3">
        <p>「続きは、続きを読むからどうぞ！」って、あの頃の俺は毎回書いてた。</p>
        <p>フラグムービーは、まだ作ってない。AfterEffectも、「革命だ」って言ったまま止まってる。</p>
        <p>基本情報も落ちたし、ブログも12年くらい書いてない。</p>
        <p>でも、AVAも、4gottenのみんなも、カラオケも、サイゼのペペロンチーノも、ぜんぶ本当に楽しかった。</p>
        <p className="font-bold">だから、このブログの続きも、また今度ちゃんと書くよ。</p>
      </div>

      <p className="my-6 text-center text-4xl font-black tracking-widest">【完】</p>
      <p className="text-center font-bold text-brand">続きは、また今度書くからどうぞ！＞ｗ＜</p>

      {/* 成績 */}
      <div className="mt-6 rounded-md border border-line bg-black/20 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">読んだ回数</span>
          <span className="font-mono font-bold">{reads} 回</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-muted-foreground">かかった時間</span>
          <span className="font-mono font-bold">{elapsed}</span>
        </div>
        <div className="mt-3 text-muted-foreground">実績 {ach.length}/{ACH.length}</div>
        <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
          {ACH.map((a, i) => (
            <li key={i} className={ach.includes(i) ? "" : "opacity-30"}>
              {a}
            </li>
          ))}
        </ul>
      </div>

      {bonus.length > 0 && (
        <div className="mt-3 rounded-md border border-gold/40 bg-black/20 p-4 text-sm">
          <div className="text-gold">🕵 隠し実績 {bonus.length}/{Object.keys(BONUS_LABEL).length}</div>
          <ul className="mt-1 space-y-0.5">
            {bonus.map((b) => (
              <li key={b}>{BONUS_LABEL[b] ?? b}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={reset} className={BTN_SUB}>
        はじめから読み直す
      </button>

      {/* ＞ｗ＜ の紙吹雪 */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute select-none text-lg font-black text-brand/70"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              animation: `fall ${3.2 + (i % 5) * 0.7}s linear ${(i % 7) * 0.5}s infinite`,
            }}
          >
            ＞ｗ＜
          </span>
        ))}
      </div>
    </>
  );
}
