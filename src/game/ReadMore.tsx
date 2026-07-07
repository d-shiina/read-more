"use client";

/**
 * read more — 「続きは、続きを読むからどうぞ！」だけで作られたばかゲー。
 *
 * v2:
 * - 「続きを読む」を押すと、続きが“その場の下に”生える（記事が積み上がる。スライド遷移しない）
 * - 全ステージに「編注（2026年の本人）」＝未来の自分による全力セルフツッコミ
 * - 実績は全20個。素直に進めるだけでは5個前後しか取れない（寄り道・連打・監視・召喚で解除）
 * - 隠し：コナミコマンド／開発者コンソール
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ================= ステージのメタ（日付が15年進む＝実話） ================= */

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

const TOTAL = META.length;
const SAVE = "readmore.v3";

/* ================= 実績カタログ（多くは条件付き・取り逃し可） ================= */

interface AchDef {
  id: string;
  label: string;
  hint: string;
}

const ACH_DEFS: AchDef[] = [
  { id: "start", label: "📖 読者、爆誕", hint: "読み始める" },
  { id: "w10", label: "🐹 ＞ｗ＜を撫でて育てた", hint: "顔文字は撫でると育つらしい" },
  { id: "karaoke_all", label: "🎤 全員の末路を見届けた", hint: "カラオケは全員分聞いてやれ" },
  { id: "mash", label: "🌀 読み込み中に連打した", hint: "待てない人だけがもらえる" },
  { id: "dodge_chase", label: "🏃 逃げるボタンを追い詰めた", hint: "逃げるなら、追え" },
  { id: "dodge_wait", label: "🧘 待ちで勝った", hint: "逃げるボタンは、放っておくと寂しがる" },
  { id: "stare", label: "📑 タブのタイトルを2周読んだ", hint: "流れる文字は最後まで見届けろ" },
  { id: "tweets_all", label: "🐦 黒歴史を完掘した", hint: "「もっと見る」は押すためにある" },
  { id: "dig", label: "⛏ 掘るなと言われた場所を掘った", hint: "長い長い空白の途中に、何かある" },
  { id: "inf", label: "♾ ∞に5回挑んだ", hint: "∞が相手でも殴るのをやめるな" },
  { id: "sniper", label: "🎯 一発で本物を見抜いた", hint: "増量ボタン、ノーミスで" },
  { id: "shibakare", label: "🪖 しばかれた", hint: "偽ボタンを押すと、どうなる？" },
  { id: "kiriban", label: "🔢 キリ番を踏んだ", hint: "2011年のカウンターは、押せる" },
  { id: "no_movie", label: "🎞 製作されなかったムービーを探した", hint: "エンドロールの、あの一行" },
  { id: "joka", label: "🙏 Jokaさまを召喚した", hint: "誠意の欄に、師匠の名を" },
  { id: "kona_call", label: "💗 呼んでしまった", hint: "誠意の欄に、あの子の名を" },
  { id: "alive", label: "🪵 15年ぶりの生存報告を見た", hint: "読み進める" },
  { id: "end", label: "🏆 全部読んだ", hint: "最後まで" },
  { id: "konami", label: "🎮 裏技を見つけた", hint: "↑↑↓↓←→←→BA" },
  { id: "console", label: "🔍 開発者の声を聞いた", hint: "F12の先に呪文が置いてある" },
];

const ACH_LABEL: Record<string, string> = Object.fromEntries(
  ACH_DEFS.map((a) => [a.id, a.label]),
);

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

/* ================= 共有部品 ================= */

/** 未来の本人による全力セルフツッコミ */
function Roast({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-sm border-l-2 border-[#e0574a]/70 bg-[#e0574a]/10 px-2.5 py-1.5 text-[12.5px] leading-relaxed text-[#e8a9a1]">
      <span className="font-bold">📝 編注（2026年の本人）：</span>
      {children}
    </p>
  );
}

/** 読み終わったステージの畳み表示 */
function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

interface Api {
  advance: () => void;
  grantA: (id: string) => void;
}

interface SP {
  active: boolean;
  api: Api;
}

/* ================= 本体 ================= */

export default function ReadMore() {
  const [stage, setStage] = useState(0);
  const [reads, setReads] = useState(0);
  const [ach, setAch] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [konamiFx, setKonamiFx] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const { muted, setMuted, blip, fanfare } = useSfx();

  // セーブ復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const s = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (typeof s.stage === "number") setStage(Math.min(s.stage, TOTAL - 1));
        if (typeof s.reads === "number") setReads(s.reads);
        if (Array.isArray(s.ach)) setAch(s.ach.filter((x: unknown) => typeof x === "string"));
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
      localStorage.setItem(SAVE, JSON.stringify({ stage, reads, ach, startedAt }));
    } catch {}
  }, [stage, reads, ach, startedAt, loaded]);

  // 実績付与（refミラーで冪等）
  const achRef = useRef<string[]>([]);
  useEffect(() => {
    achRef.current = ach;
  }, [ach]);

  const grantA = useCallback(
    (id: string) => {
      if (achRef.current.includes(id) || !ACH_LABEL[id]) return;
      achRef.current = [...achRef.current, id];
      setAch(achRef.current);
      setToast(ACH_LABEL[id]);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2400);
      fanfare();
    },
    [fanfare],
  );

  /** 続きを読む → 続きが下に生える */
  const advance = useCallback(() => {
    blip();
    setReads((r) => r + 1);
    if (stage === 0) grantA("start");
    const next = Math.min(stage + 1, TOTAL - 1);
    if (next === TOTAL - 1) grantA("end");
    setStage(next);
  }, [blip, grantA, stage]);

  // 新しい続きへスクロール
  useEffect(() => {
    if (!loaded || stage === 0) return;
    const t = setTimeout(() => {
      articleRefs.current[stage]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [stage, loaded]);

  const reset = useCallback(() => {
    setStage(0);
    setReads(0);
    setAch([]);
    achRef.current = [];
    setStartedAt(Date.now());
    try {
      localStorage.removeItem(SAVE);
    } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  // 隠し①：コナミコマンド
  useEffect(() => {
    const SEQ = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === SEQ[pos] ? pos + 1 : k === SEQ[0] ? 1 : 0;
      if (pos >= SEQ.length) {
        pos = 0;
        grantA("konami");
        setKonamiFx(true);
        setTimeout(() => setKonamiFx(false), 2200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grantA]);

  // 隠し②：開発者コンソール
  useEffect(() => {
    try {
      console.log(
        "%c続きは、コンソールを読むからどうぞ！＞ｗ＜",
        "color:#3fd6e6;font-size:16px;font-weight:bold",
      );
      console.log("window.tsudzuki() を実行すると、いいことがあります。");
      (window as unknown as { tsudzuki?: () => string }).tsudzuki = () => {
        grantA("console");
        return "＞ｗ＜ 実績解除！　……こんな所まで読みに来るな。";
      };
    } catch {}
    return () => {
      try {
        delete (window as unknown as { tsudzuki?: () => string }).tsudzuki;
      } catch {}
    };
  }, [grantA]);

  const api: Api = { advance, grantA };

  return (
    <div
      className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 py-6"
      style={konamiFx ? { animation: "hueSpin 2.2s linear" } : undefined}
    >
      <style>{`@keyframes hueSpin { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }`}</style>

      {/* ヘッダ */}
      <header className="mb-4 flex items-end justify-between border-b border-line pb-3">
        <div>
          <div className="text-xs tracking-widest text-accent2">4g.MiNaMiの気まぐれ日記</div>
          <h1 className="mt-1 text-2xl font-black">
            <span className="text-brand">read</span> more
          </h1>
          <div className="mt-0.5 text-[10px] text-muted-foreground">— 更新頻度：約15年に1回 —</div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            実績 {ach.length}/{ACH_DEFS.length}
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

      {/* 記事スタック：続きは下に生える */}
      {Array.from({ length: stage + 1 }).map((_, i) => (
        <div key={i}>
          {i > 0 && (
            <div className="my-3 text-center text-xs tracking-widest text-muted-foreground/70">
              ▼ 続き
            </div>
          )}
          <article
            ref={(el) => {
              articleRefs.current[i] = el;
            }}
            className={`${i === stage ? "anim-fadeup" : ""} scroll-mt-4 rounded-lg border border-line bg-panel/70 p-5`}
          >
            <div className="text-xs text-muted-foreground">
              {META[i].date}
              {META[i].cat && <> ｜ カテゴリ: {META[i].cat}</>}
            </div>
            <h2 className="mt-1 text-lg font-bold">{META[i].title}</h2>
            <div className="mt-3 text-sm leading-relaxed">
              <StageBody index={i} active={i === stage} api={api} reads={reads} ach={ach} startedAt={startedAt} reset={reset} />
            </div>
          </article>
        </div>
      ))}

      {stage > 0 && stage < TOTAL - 1 && (
        <button onClick={reset} className="mt-4 self-center text-xs text-muted-foreground underline">
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

function StageBody({
  index,
  active,
  api,
  reads,
  ach,
  startedAt,
  reset,
}: {
  index: number;
  active: boolean;
  api: Api;
  reads: number;
  ach: string[];
  startedAt: number;
  reset: () => void;
}) {
  switch (index) {
    case 0:
      return <S0 active={active} api={api} />;
    case 1:
      return <S1 active={active} api={api} />;
    case 2:
      return <S2 active={active} api={api} />;
    case 3:
      return <S3Karaoke active={active} api={api} />;
    case 4:
      return <S4Face active={active} api={api} />;
    case 5:
      return <S5Loading active={active} api={api} />;
    case 6:
      return <S6Dodger active={active} api={api} />;
    case 7:
      return <S7Title active={active} api={api} />;
    case 8:
      return <S8Twitter active={active} api={api} />;
    case 9:
      return <S9Scroll active={active} api={api} />;
    case 10:
      return <S10Countdown active={active} api={api} />;
    case 11:
      return <S11Multiplied active={active} api={api} />;
    case 12:
      return <S12Retro active={active} api={api} />;
    case 13:
      return <S13FakeEnd active={active} api={api} />;
    case 14:
      return <S14Kona active={active} api={api} />;
    case 15:
      return <S15Type active={active} api={api} />;
    case 16:
      return <S16Shibaku active={active} api={api} />;
    default:
      return <S17Ending reads={reads} ach={ach} startedAt={startedAt} reset={reset} />;
  }
}

/* --- 0: 本物の記事（革命の回） --- */
function S0({ active, api }: SP) {
  return (
    <>
      <p>
        最近なぜブログを開設したのか分からないくらい、更新していなかった。急に更新意欲が湧いてきたので、更新しました＞ｗ＜
      </p>
      <p className="mt-2">
        最近フラグムービーに憧れるようになってきた。いいアイディアを動画に取り込んだり、遊びのある字幕などを作るのには、AfterEffectを使うことを初めて知った。
      </p>
      <p className="mt-2 font-bold">正直自分の中で革命が起こったようだった・・・</p>
      <Roast>
        正式名称は「After Effects」。革命を起こす相手の名前くらい正確に覚えろ。
        なお続報（2026年）：革命はまだ起こっていません。
      </Roast>
      <p className="mt-3 font-bold">続きは、続きを読むからどうぞ！</p>
      {active && (
        <button onClick={api.advance} className={BTN}>
          続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 1: まさかの再帰 --- */
function S1({ active, api }: SP) {
  return (
    <>
      <p>どうも、さかやんです＞ｗ＜　昨日の続き、書きます。</p>
      <p className="mt-2 font-bold">続きは、続きを読むからどうぞ！</p>
      <Roast>続きを書くと宣言した直後に続きを読ませるな。永久機関か。</Roast>
      {active && (
        <button onClick={api.advance} className={BTN}>
          続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 2: 自覚なし --- */
function S2({ active, api }: SP) {
  return (
    <>
      <p>え？</p>
      <p className="mt-2">いや、その、だから——</p>
      <p className="mt-2 font-bold">続きは、続きを読むからどうぞ！</p>
      <Roast>本人も何が続きなのか分からなくなっている。読者はもっと分かっていない。</Roast>
      {active && (
        <button onClick={api.advance} className={BTN}>
          ほんとうに続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 3: オフ会カラオケ（実話） --- */
const KARAOKE = [
  { who: "楓", note: "熱唱", result: "テンション異常。即日、クラン専属DeathVoice担当に任命される。" },
  { who: "きいたりもん", note: "ハッチポッチステーション", result: "選曲の意図は誰にも分からなかったが、なぜかチームワークは向上した。" },
  { who: "フィッツ", note: "控えめに参加", result: "二人のテンションに飲まれて終始おとなしめ。CWの時は声出していこうな。" },
  { who: "hellfox", note: "加藤ミリヤ推し", result: "Gongの時だけ謎に覚醒。歌い終えるとバイクに跨って帰っていった。" },
  { who: "私", note: "・・・///", result: "（本人による記録はここで途切れている）" },
];

function S3Karaoke({ active, api }: SP) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const all = revealed.length >= KARAOKE.length;

  useEffect(() => {
    if (active && all) api.grantA("karaoke_all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, active]);

  if (!active) {
    return (
      <>
        <Note>4gottenのメンツ全員リアフレでカラオケ→サイゼ。詳細は上記の通り供養済み。</Note>
        <Roast>持ち曲が「ハッチポッチステーション」の男とクランを組んでいる自覚を持て。</Roast>
      </>
    );
  }

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

      {revealed.includes(4) && (
        <Roast>「・・・///」で誤魔化すな。何を歌った。ここだけ15年経っても非公開なの、逆に気になるんだが。</Roast>
      )}

      {revealed.length >= 1 && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            その後サイゼでペペロンチーノ。AVAの話のはずが、なぜかカスタムロボの話で盛り上がる。
          </p>
          <button onClick={api.advance} className={`${BTN} anim-pop`}>
            続きを読む →
          </button>
        </>
      )}
    </>
  );
}

/* --- 4: 本文が顔文字だけ（撫でると育つ） --- */
function S4Face({ active, api }: SP) {
  const [pets, setPets] = useState(0);
  const grown = pets >= 10;

  const pet = () => {
    const n = pets + 1;
    setPets(n);
    if (n >= 10) api.grantA("w10");
  };

  if (!active) {
    return (
      <>
        <p className="py-3 text-center text-4xl font-black">＞ｗ＜</p>
        <Roast>本文が顔文字1個。この顔文字、当時の彼は句読点の代わりに使っていました。</Roast>
      </>
    );
  }

  return (
    <>
      <button
        onClick={pet}
        aria-label="顔文字を撫でる"
        className="mx-auto block cursor-pointer select-none py-6 text-center font-black transition-transform"
        style={{
          fontSize: `${3 + Math.min(pets, 10) * 0.35}rem`,
          transform: pets % 2 === 1 ? "rotate(-4deg)" : "rotate(3deg)",
        }}
      >
        {grown ? "＞ω＜" : "＞ｗ＜"}
      </button>
      {pets > 0 && pets < 10 && (
        <p className="text-center text-xs text-muted-foreground">
          {pets < 4 ? "……なんか大きくなってない？" : pets < 8 ? "育ってる。確実に育ってる。" : "もう少しで何かが起こりそう。"}
        </p>
      )}
      {grown && <p className="anim-pop text-center text-sm font-bold text-brand">進化した。（なにに？）</p>}
      <Roast>本文が顔文字1個。それに対して読者ができることが「撫でる」しかないの、双方どうかしている。</Roast>
      <button onClick={api.advance} className={BTN}>
        続きを読む →
      </button>
    </>
  );
}

/* --- 5: 偽ローディング（連打で実績） --- */
function S5Loading({ active, api }: SP) {
  const [phase, setPhase] = useState<"idle" | "loading" | "failed">("idle");
  const [prog, setProg] = useState(0);
  const [mashes, setMashes] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const start = () => {
    setPhase("loading");
    let v = 0;
    timer.current = setInterval(() => {
      v = Math.min(98, v + (v < 60 ? 13 : v < 90 ? 5 : 1));
      setProg(v);
      if (v >= 98) {
        if (timer.current) clearInterval(timer.current);
        setTimeout(() => setPhase("failed"), 1100);
      }
    }, 140);
  };

  const mash = () => {
    if (phase !== "loading") return;
    const n = mashes + 1;
    setMashes(n);
    if (n >= 5) api.grantA("mash");
  };

  if (!active) {
    return (
      <>
        <Note>（読み込みは失敗しました。最初から何も無かったので。）</Note>
        <Roast>98%で止まるのは、基本情報の自己採点と同じ。</Roast>
      </>
    );
  }

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
      <button onClick={mash} className="block w-full cursor-pointer text-left" aria-label="読み込みを急かす">
        <p>続きを読み込んでいます……</p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-black/40">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${prog}%` }} />
        </div>
        <p className="mt-2 text-center font-mono text-2xl font-bold text-brand">{prog}%</p>
        {mashes > 0 && (
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {mashes < 5 ? "連打しても速くなりません" : "連打しても速くなりません（彼のPCと同じ）"}
          </p>
        )}
      </button>
    );

  return (
    <>
      <p className="font-bold text-danger">読み込みに失敗しました＞ｗ＜（うそ）</p>
      <p className="mt-2 text-muted-foreground">最初からそんなものは無い。</p>
      <Roast>「年内にお届けします」→ 大晦日23:59に読み込み失敗。仕事納めまで彼らしい。</Roast>
      <button onClick={api.advance} className={BTN}>
        もう一回押して！ →
      </button>
    </>
  );
}

/* --- 6: 逃げるボタン（追うか、待つか） --- */
const DODGE_POS = [
  { left: "8%", top: "8%" },
  { left: "55%", top: "58%" },
  { left: "18%", top: "62%" },
];

function S6Dodger({ active, api }: SP) {
  const [dodges, setDodges] = useState(0);
  const [lonely, setLonely] = useState(false);
  const gaveUp = dodges >= 3 || lonely;

  // 12秒放置するとボタンが寂しくなる（待ち攻略）
  useEffect(() => {
    if (!active || dodges >= 3) return;
    const t = setTimeout(() => setLonely(true), 12000);
    return () => clearTimeout(t);
  }, [active, dodges]);

  const dodge = () => {
    if (!gaveUp) setDodges((d) => d + 1);
  };

  const win = () => {
    if (!gaveUp) return;
    api.grantA(lonely && dodges < 3 ? "dodge_wait" : "dodge_chase");
    api.advance();
  };

  if (!active) {
    return (
      <>
        <Note>※ ボタンは観念しました。</Note>
        <Roast>ボタンにすら逃げられる男。</Roast>
      </>
    );
  }

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
          onClick={win}
          className="absolute rounded-md bg-brand px-5 py-2.5 text-sm font-black text-[#062a33] transition-all duration-150"
          style={gaveUp ? { left: "50%", top: "50%", transform: "translate(-50%,-50%)" } : DODGE_POS[dodges % 3]}
        >
          {gaveUp
            ? lonely && dodges < 3
              ? "……追ってくれないの？ もういい、押して →"
              : "もう逃げないから押して →"
            : "続きを読む →"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {!gaveUp && dodges === 0 && "（どうぞ！）"}
        {!gaveUp && dodges === 1 && "あｗ　ごめんｗ"}
        {!gaveUp && dodges === 2 && "めすみるく「いじわるすんなｗ」"}
        {gaveUp && (lonely && dodges < 3 ? "待ちの勝利。" : "……追い詰められた。")}
      </p>
    </>
  );
}

/* --- 7: タブのタイトルに続きを書く（2周読むと実績） --- */
const TITLE_TEXT = "続きは、続きを読むからどうぞ！＞ｗ＜　";

function S7Title({ active, api }: SP) {
  const [offset, setOffset] = useState(0);
  const mountedAt = useRef(0); // activeになった時刻はeffectで記録する

  useEffect(() => {
    if (!active) return;
    mountedAt.current = Date.now();
    const prev = document.title;
    const t = setInterval(() => setOffset((o) => (o + 1) % TITLE_TEXT.length), 250);
    return () => {
      clearInterval(t);
      document.title = prev;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    document.title = TITLE_TEXT.slice(offset) + TITLE_TEXT.slice(0, offset);
  }, [offset, active]);

  const done = () => {
    if (Date.now() - mountedAt.current >= 8000) api.grantA("stare");
    api.advance();
  };

  if (!active) {
    return (
      <>
        <Note>（タイトルは元に戻しました。ご迷惑をおかけしました。）</Note>
        <Roast>「新しい表現に挑戦」の結果がタブ汚染。表現の敗北。</Roast>
      </>
    );
  }

  return (
    <>
      <p>画像とか、動画とかを取り入れたほうがいいのかな？</p>
      <p className="mt-2">と思ったので、新しい表現に挑戦してみました。</p>
      <p className="mt-2 font-bold">続きは、このタブのタイトル（↑）に書いておきました！</p>
      <p className="mt-2 text-xs text-muted-foreground">※ ブラウザのタブを見てください。流れてます。</p>
      <button onClick={done} className={BTN}>
        タイトル、見た（戻して） →
      </button>
    </>
  );
}

/* --- 8: 黒歴史Twitter発掘（全ツイートに編注つき） --- */
const TWEETS_MAIN = [
  {
    date: "2012.02.17",
    text: "こなちゃんおかえりー私はまだ学校にいるー＞ｗ＜後1時間くらいで家にいると思うー！今日は過疎るのかな？ｗ",
    roast: "相手の帰宅に対して自分の現在地と帰宅予定を返すな。聞かれてない。",
  },
  {
    date: "2012.02.22",
    text: "こなちゃんTSこいやぁああああ⌒*( ◖◡◗✰)*ﾟ⌒",
    roast: "TS＝TeamSpeak（通話ソフト）。「話したい」の最大火力表現。素直に言え。",
  },
  {
    date: "2012.03.11",
    text: "暇ーこなちゃんTSはよ！",
    roast: "2週間後、まだ呼んでいる。",
  },
];
const TWEETS_MORE = [
  {
    date: "2012.02.26",
    text: "やっと睡魔が襲ってきた⌒*( ◖◡◗✰)*ﾟ⌒こなちゃんちゃんと起きれたのだろうか？",
    roast: "自分の就寝報告と相手の起床の心配を1ツイートに圧縮。効率だけはいい。",
  },
  {
    date: "2012.03.12",
    text: "二度寝とか甘えー、こなちゃんマイクラの鯖立ててからいってくれたらうれしい！",
    roast: "ブログを12年放置する男が「甘え」を語るな。",
  },
  {
    date: "2012.05.13",
    text: "いつの間にかこなちゃん帰ってきとるやん(゜∀。)",
    roast: "オンライン状態を監視していないと出ないセリフ。",
  },
  {
    date: "2012.06.27",
    text: "とりあえず8で作ることにした＞ｗ＜こなちゃんとか別の所で作ってるみたいやけど、みんな8おいで！",
    roast: "こなちゃんは別のサーバーで作っている。この時点でいろいろ察するべきだった。",
  },
  {
    date: "2012.07.10",
    text: "こなだけに、粉まみれってか！九州と味違ったりしたー？⌒*( ◖◡◗✰)*ﾟ⌒",
    roast: "【警告】このダジャレは2012年に実際に送信されています。既読がついた事実だけで胸が痛い。",
  },
];

function S8Twitter({ active, api }: SP) {
  const [more, setMore] = useState(false);

  const expand = () => {
    setMore(true);
    api.grantA("tweets_all");
  };

  if (!active) {
    return (
      <>
        <Note>（発掘された黒歴史ツイート8件は、丁重に供養されました。）</Note>
        <Roast>
          集計：2012年上半期、「こなちゃん」を含むツイート22件。デートの報告、0件。以上です。
        </Roast>
      </>
    );
  }

  return (
    <>
      <p>掘り起こしてしまった。当時の彼の、旧Twitter（現X）のログ。</p>
      <p className="mt-1 text-xs text-muted-foreground">※ ここから先、しばらく「こなちゃん」しか言ってません。</p>

      <div className="mt-4 space-y-2 rounded-md border border-line bg-black/20 p-3">
        {TWEETS_MAIN.map((t, i) => (
          <Tweet key={i} {...t} />
        ))}
        {more && TWEETS_MORE.map((t, i) => <Tweet key={`m${i}`} {...t} anim />)}
      </div>

      {!more ? (
        <>
          <button onClick={expand} className={BTN_SUB}>
            もっと見る（あと5件）
          </button>
          <button onClick={api.advance} className={BTN}>
            見なかったことにして続きを読む →
          </button>
        </>
      ) : (
        <>
          <Roast>
            集計：2012年上半期、「こなちゃん」を含むツイート22件。デートの報告、0件。数字は嘘をつかない。
          </Roast>
          <button onClick={api.advance} className={BTN}>
            続きを読む →
          </button>
        </>
      )}
    </>
  );
}

function Tweet({ date, text, roast, anim }: { date: string; text: string; roast: string; anim?: boolean }) {
  return (
    <div className={`rounded-md bg-black/20 p-2.5 ${anim ? "anim-fadeup" : ""}`}>
      <div className="flex gap-2">
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
      <p className="mt-1.5 border-t border-line/50 pt-1.5 text-[11.5px] text-[#e8a9a1]">📝 {roast}</p>
    </div>
  );
}

/* --- 9: スクロール地獄（途中に埋蔵物） --- */
function S9Scroll({ active, api }: SP) {
  const [dug, setDug] = useState(false);

  if (!active) {
    return (
      <>
        <Note>（2,200pxの空白は撤去されました。彼の更新履歴の実物大レプリカでした。）</Note>
      </>
    );
  }

  return (
    <>
      <p className="font-bold">続きはこの下にあります↓（本当）</p>
      <div className="relative mt-4 h-[2200px] rounded-md border border-dashed border-line bg-black/10">
        <Marker top="6%" text="↓ こっち" />
        <Marker top="22%" text="まだだよ" />
        <Marker top="40%" text="＞ｗ＜" />
        <div className="absolute inset-x-0 text-center" style={{ top: "56%" }}>
          {!dug ? (
            <button
              onClick={() => {
                setDug(true);
                api.grantA("dig");
              }}
              className="text-xs text-muted-foreground/60 underline decoration-dotted"
            >
              ※ここを掘るな
            </button>
          ) : (
            <span className="anim-pop text-sm font-bold text-gold">＞ω＜（埋蔵物）</span>
          )}
        </div>
        <Marker top="70%" text="この空白、彼の更新頻度と同じ密度です" />
        <Marker top="88%" text="あとちょっと！" />
        <div className="absolute inset-x-4 bottom-4">
          <p className="mb-2 text-center text-sm font-bold">ようこそ、最下層へ。</p>
          <button onClick={api.advance} className={BTN}>
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

/* --- 10: カウントダウン詐欺（∞に挑める） --- */
function S10Countdown({ active, api }: SP) {
  const [n, setN] = useState(3);
  const [hits, setHits] = useState(0);
  const infinite = n <= 0;
  const beaten = hits >= 5;

  const hit = () => {
    const h = hits + 1;
    setHits(h);
    if (h >= 5) api.grantA("inf");
  };

  if (!active) {
    return (
      <>
        <Note>本当の続きまで：3 → 2 → 1 → ∞（諸説あり）</Note>
        <Roast>GTX 780 Ti は買った。作った動画は0本。GPUは今日も平和です。</Roast>
      </>
    );
  }

  return (
    <>
      <p>NewPCになったので続きを読むのも爆速になりました！（i7-4790K / GTX 780 Ti）</p>
      <p className="mt-3 text-center text-sm text-muted-foreground">本当の続きまで、あと</p>
      <p
        className="my-2 text-center text-6xl font-black text-brand"
        style={infinite && !beaten ? { animation: "shake 0.4s" } : undefined}
      >
        {infinite ? (beaten ? "♾" : "∞") : n}
      </p>
      {infinite ? (
        <>
          <p className="text-center text-sm text-muted-foreground">
            {beaten ? "（根負けした顔をしている）" : "回ｗｗｗｗ"}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={hit}
              className="flex-1 rounded-md border border-line bg-panel py-2.5 text-sm font-bold transition hover:border-danger"
            >
              {beaten ? "勝った" : `まだ押す（${hits}/5）`}
            </button>
            <button onClick={api.advance} className="flex-[2] rounded-md bg-brand py-2.5 text-sm font-black text-[#062a33]">
              ウソウソ、次で本当 →
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => setN((v) => v - 1)} className={BTN}>
          続きを読む →
        </button>
      )}
    </>
  );
}

/* --- 11: ボタン増殖（ノーミスなら狙撃手） --- */
function S11Multiplied({ active, api }: SP) {
  const [dead, setDead] = useState<number[]>([]);
  const [scold, setScold] = useState(false);
  const REAL = 7;

  const miss = (i: number) => {
    setDead((d) => (d.includes(i) ? d : [...d, i]));
    setScold(true);
    api.grantA("shibakare");
    setTimeout(() => setScold(false), 900);
  };

  const win = () => {
    if (dead.length === 0) api.grantA("sniper");
    api.advance();
  };

  if (!active) {
    return (
      <>
        <Note>本物は最初から1つだけでした。（当たり前だろ）</Note>
      </>
    );
  }

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
              onClick={() => (isReal ? win() : miss(i))}
              className={`rounded-md py-2.5 text-xs font-bold transition ${
                isDead ? "bg-black/30 text-muted-foreground/50" : "bg-brand/90 text-[#062a33] hover:brightness-110"
              }`}
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

/* --- 12: 2011年のデザイン（キリ番が踏める） --- */
function S12Retro({ active, api }: SP) {
  const [kiriban, setKiriban] = useState(false);
  const counter = kiriban ? "114515" : "114514";

  if (!active) {
    return (
      <>
        <Note>（あの頃のデザインは、返却されました。）</Note>
        <Roast>「Sorry, Japanese only.」——安心しろ、日本人も読んでいない。</Roast>
      </>
    );
  }

  return (
    <div
      className="rounded-sm bg-[#ffffff] p-4 text-[#333333]"
      style={{ fontFamily: "'MS PGothic', 'Hiragino Kaku Gothic ProN', sans-serif" }}
    >
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
        <button
          onClick={() => {
            if (!kiriban) {
              setKiriban(true);
              api.grantA("kiriban");
            }
          }}
          className="flex gap-px"
          aria-label="アクセスカウンター"
        >
          {counter.split("").map((d, i) => (
            <span key={i} className="bg-black px-1 font-mono text-sm text-[#33ff66]">
              {d}
            </span>
          ))}
        </button>
        {kiriban && <span className="anim-pop text-xs font-bold text-[#c00]">キリ番おめでとう！（自作自演）</span>}
      </div>
      <p className="mt-3 text-sm font-bold">続きは、続きを読むからどうぞ！</p>
      {/* あえてスタイルなしの素のボタン */}
      <button onClick={api.advance} className="mt-3">
        続きを読む
      </button>
    </div>
  );
}

/* --- 13: 偽の最終回（エンドロールに秘密） --- */
const CREDITS_TOP = [
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
];

function S13FakeEnd({ active, api }: SP) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setShowBtn(true), 4200);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) {
    return (
      <>
        <Note>完（未遂）</Note>
        <Roast>主演・脚本・制作・スナイパーが同一人物。文化祭の一人芝居でももう少し配役がある。</Roast>
      </>
    );
  }

  return (
    <>
      <p>長らくのご愛読、ありがとうございました。</p>
      <div className="relative mt-4 h-64 overflow-hidden rounded-md bg-black">
        <div
          className="absolute inset-x-0 text-center text-sm leading-7 text-white/85"
          style={{ animation: "creditsUp 9s linear infinite" }}
        >
          {CREDITS_TOP.map((c, i) => (
            <div key={i} className={i === 0 ? "text-xl font-black" : ""}>
              {c || " "}
            </div>
          ))}
          <button
            onClick={() => api.grantA("no_movie")}
            className="mx-auto block text-white/85 underline decoration-dotted underline-offset-2 hover:text-gold"
          >
            フラグムービーは製作されませんでした
          </button>
        </div>
      </div>
      {showBtn ? (
        <button onClick={api.advance} className={`${BTN} anim-pop`}>
          ……の続きは、続きを読むからどうぞ！ →
        </button>
      ) : (
        <p className="mt-4 text-center text-xs text-muted-foreground">（感動の余韻）</p>
      )}
    </>
  );
}

/* --- 14: めすみるく、12年ぶりのコメント --- */
const KONA_COMMENTS = [
  "まだやってるのｗ？",
  "『ブログは３日に一回は更新してこ！』って言ったの、12年前なんだけど。",
  "……でも、ちょっとうれしい。また今度一緒になんかやろやー。",
];

function S14Kona({ active, api }: SP) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active || shown >= KONA_COMMENTS.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [active, shown]);

  const list = active ? KONA_COMMENTS.slice(0, shown) : KONA_COMMENTS;

  return (
    <>
      <p className="text-xs text-muted-foreground">コメント一覧 ({KONA_COMMENTS.length})</p>
      <div className="mt-2 space-y-2">
        {list.map((c, i) => (
          <div key={i} className={`${active ? "anim-fadeup" : ""} rounded-md border border-line bg-black/20 p-3`}>
            <div className="text-xs font-bold text-[#cf8fb0]">
              {i + 1}. めすみるく{" "}
              <span className="font-normal text-muted-foreground">(2023年11月11日 11:1{i})</span>
            </div>
            <p className="mt-1 text-sm">{c}</p>
          </div>
        ))}
      </div>
      {active && shown >= KONA_COMMENTS.length && (
        <button onClick={api.advance} className={`${BTN} anim-pop`}>
          「うん」と返事して続きを読む →
        </button>
      )}
      {!active && <Roast>12年放置したブログに、まだ見に来てくれる人がいる。読者ガチャSSRを引いた自覚を持て。</Roast>}
    </>
  );
}

/* --- 15: 誠意（入力）。隠しワードが2つ --- */
function S15Type({ active, api }: SP) {
  const [value, setValue] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);

  const submit = () => {
    const v = value.trim();
    if (!v) {
      setReply("何か書いて！＞ｗ＜");
      return;
    }
    if (/joka|じょーか|ジョーカ/i.test(v)) {
      setReply("Jokaさまぁあああああああああ……ｗ　最近何してるんだろうな、あの人。");
      api.grantA("joka");
      setPassed(true);
    } else if (/こな|みるく/.test(v)) {
      setReply("……呼んだ？（照）");
      api.grantA("kona_call");
      setPassed(true);
    } else if (/つづき|続き/.test(v)) {
      setReply("よくできました！えらい！");
      setPassed(true);
    } else {
      setReply(`「${v}」……だいたい合ってる！＞ｗ＜`);
      setPassed(true);
    }
    setValue("");
  };

  if (!active) {
    return (
      <>
        <Note>誠意は受理されました。（判定はガバガバでした）</Note>
        <Roast>誠意の判定がガバガバなの、彼の人生プランと同じ。</Roast>
      </>
    );
  }

  return (
    <>
      <p>そんなに続きが読みたいなら、誠意を見せてください。</p>
      <p className="mt-2 font-bold">下に「つづき」と入力してください。</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="ここに誠意を入力"
        autoComplete="off"
        spellCheck={false}
        className="mt-4 w-full rounded-md border border-line bg-black/40 px-3 py-2.5 text-base outline-none focus:border-brand"
      />
      {reply && <p className="anim-pop mt-2 text-sm font-bold">{reply}</p>}
      <div className="mt-2 flex gap-2">
        <button onClick={submit} className="flex-1 rounded-md border border-line bg-panel py-2.5 text-sm font-bold transition hover:border-brand">
          誠意を送信
        </button>
        {passed && (
          <button onClick={api.advance} className="flex-[2] rounded-md bg-brand py-2.5 text-sm font-black text-[#062a33]">
            続きを読む →
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground/70">
        ※ 何回でも送れます。誰かの名前を書くと、何かが起こるかも。
      </p>
    </>
  );
}

/* --- 16: 実在の15年ぶりの更新 --- */
function S16Shibaku({ active, api }: SP) {
  const [opened, setOpened] = useState(false);

  if (!active) {
    return (
      <>
        <Note>（本文なし）</Note>
        <Roast>15年ぶりの生存報告が、恫喝。</Roast>
      </>
    );
  }

  return (
    <>
      <p className="text-muted-foreground">※ これは実在する、彼の15年ぶりの更新です。</p>
      {!opened ? (
        <button onClick={() => setOpened(true)} className={BTN}>
          本文を読む →
        </button>
      ) : (
        <>
          <p className="anim-pop mt-4 rounded-md border border-dashed border-line bg-black/20 p-6 text-center text-muted-foreground">
            （本文なし）
          </p>
          <Roast>15年ぶりの生存報告が、恫喝。しかも本文なし。逆にどうやって投稿したんだ。</Roast>
          <button
            onClick={() => {
              api.grantA("alive");
              api.advance();
            }}
            className={BTN}
          >
            じゃあ続きを読む →
          </button>
        </>
      )}
    </>
  );
}

/* --- 17: エンディング（ここだけ本気） --- */
function S17Ending({
  reads,
  ach,
  startedAt,
  reset,
}: {
  reads: number;
  ach: string[];
  startedAt: number;
  reset: () => void;
}) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const ms = Date.now() - startedAt;
    const s = Math.max(1, Math.floor(ms / 1000));
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setElapsed(`${Math.floor(s / 60)}分${String(s % 60).padStart(2, "0")}秒`);
  }, [startedAt]);

  return (
    <>
      <div className="space-y-3">
        <p>——散々バカにしてきたけど、最後だけ本当のことを書く。</p>
        <p>「続きは、続きを読むからどうぞ！」って、あの頃の俺は毎回書いてた。</p>
        <p>フラグムービーは、まだ作ってない。AfterEffectも、「革命だ」って言ったまま止まってる。</p>
        <p>基本情報も落ちたし、ブログも12年くらい書いてない。こなちゃんへの想いは、ダジャレになって散った。</p>
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
        <div className="mt-3 text-muted-foreground">
          実績 {ach.length}/{ACH_DEFS.length}
          {ach.length < ACH_DEFS.length && "（まだ隠れてる。2周目へどうぞ）"}
        </div>
        <ul className="mt-1 space-y-0.5">
          {ACH_DEFS.map((a) => (
            <li key={a.id} className={ach.includes(a.id) ? "" : "opacity-40"}>
              {ach.includes(a.id) ? a.label : `？？？（ヒント: ${a.hint}）`}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={reset} className={BTN_SUB}>
        はじめから読み直す（実績は消えます）
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
