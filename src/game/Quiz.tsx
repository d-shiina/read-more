"use client";

/**
 * read more — 2窓謎解き。
 * ブラウザをもう1枚開き、原典（本人の実ブログ）を読みながら全10問を解く。
 * 答えはゲーム画面内に存在しない（例外＝ブラウザ仕掛け問題：隠しURL/ソース読み）。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { BLOG_URL, RIDDLES, matches, normalize } from "./riddles";

const SAVE = "readmore.quiz.v1";
const TOTAL = RIDDLES.length;

/* ================= 実績 ================= */

interface AchDef {
  id: string;
  label: string;
  hint: string;
}

const ACH_DEFS: AchDef[] = [
  { id: "start", label: "📖 原典を開いた者", hint: "第1問を解く" },
  { id: "all", label: "🏆 全問クリア", hint: "最後まで解く" },
  { id: "nohint", label: "🧠 ノーヒントクリア", hint: "ヒントを1回も見ずに全問" },
  { id: "perfect", label: "🎯 ノーミスクリア", hint: "1回も間違えずに全問" },
  { id: "speed", label: "⚡ 15分以内にクリア", hint: "急げ" },
  { id: "stubborn", label: "🪨 10回間違えても折れなかった", hint: "不屈" },
  { id: "saizeriya", label: "🍝 隠しページに到達した", hint: "第8問" },
  { id: "joka", label: "🙏 Jokaさまを召喚した", hint: "解答欄に、師匠の名を" },
  { id: "kona", label: "💗 呼んでしまった", hint: "解答欄に、あの子の名を" },
  { id: "konami", label: "🎮 裏技を見つけた", hint: "↑↑↓↓←→←→BA" },
  { id: "console", label: "🔍 開発者の声を聞いた", hint: "F12の先に呪文がある" },
  { id: "lap2", label: "🔁 2周目に突入した", hint: "クリア後、もう一度" },
];

const ACH_LABEL: Record<string, string> = Object.fromEntries(ACH_DEFS.map((a) => [a.id, a.label]));

const WRONGS = [
  "ちがう。原典を読め。",
  "それっぽいが、ちがう。",
  "＞ｗ＜（不正解）",
  "惜しいかどうかも原典を読まないと分からない。",
  "落ち着け。ヒントもある。",
];

const BTN =
  "rounded-md bg-brand px-5 py-2.5 text-sm font-black text-[#062a33] shadow-[0_0_14px_rgba(63,214,230,0.3)] transition hover:brightness-110 active:translate-y-px";

/* ================= 効果音 ================= */

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

  const good = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(523, 0, 0.1);
      tone(784, 0.1, 0.14, 0.05);
    } catch {}
  }, [muted, ensure, tone]);

  const bad = useCallback(() => {
    if (muted) return;
    try {
      ensure();
      tone(196, 0, 0.16, 0.05);
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

  return { muted, setMuted, good, bad, fanfare };
}

/* ================= 本体 ================= */

export default function Quiz() {
  const [idx, setIdx] = useState(0); // 現在の問題index（TOTALでクリア）
  const [wrong, setWrong] = useState(0);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [ach, setAch] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [konamiFx, setKonamiFx] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { muted, setMuted, good, bad, fanfare } = useSfx();

  const done = idx >= TOTAL;

  // 復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const s = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (typeof s.idx === "number") setIdx(Math.min(s.idx, TOTAL));
        if (typeof s.wrong === "number") setWrong(s.wrong);
        if (Array.isArray(s.hintIds)) setHintIds(s.hintIds);
        if (Array.isArray(s.ach)) setAch(s.ach.filter((x: unknown) => typeof x === "string"));
        setStartedAt(typeof s.startedAt === "number" ? s.startedAt : Date.now());
        if (typeof s.finishedAt === "number") setFinishedAt(s.finishedAt);
      } else {
        setStartedAt(Date.now());
      }
      setLoaded(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      setLoaded(true);
    }
  }, []);

  // 保存
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        SAVE,
        JSON.stringify({ idx, wrong, hintIds, ach, startedAt, finishedAt }),
      );
    } catch {}
  }, [idx, wrong, hintIds, ach, startedAt, finishedAt, loaded]);

  // 実績（refミラーで冪等）
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

  // 隠し①：コナミコマンド
  useEffect(() => {
    const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
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
      console.log("%c続きは、コンソールを読むからどうぞ！＞ｗ＜", "color:#3fd6e6;font-size:16px;font-weight:bold");
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

  const riddle = done ? null : RIDDLES[idx];

  const submit = () => {
    if (!riddle) return;
    const v = value.trim();
    if (!v) {
      setFeedback("何か書いて！＞ｗ＜");
      return;
    }
    // 隠しワード（不正解にカウントしない）
    if (/joka|じょーか|ジョーカ/i.test(v) && !matches(v, riddle.answers)) {
      grantA("joka");
      setFeedback("Jokaさまぁあああああああああ……ｗ（※答えではない）");
      setValue("");
      return;
    }
    if (/こな/.test(normalize(v)) && !matches(v, riddle.answers)) {
      grantA("kona");
      setFeedback("……呼んだ？（照）（※答えではない）");
      setValue("");
      return;
    }

    if (matches(v, riddle.answers)) {
      good();
      setFeedback(null);
      setValue("");
      if (riddle.no === 1) grantA("start");
      if (riddle.id === "hidden") grantA("saizeriya");
      const next = idx + 1;
      setIdx(next);
      if (next >= TOTAL) {
        const fin = Date.now();
        setFinishedAt(fin);
        grantA("all");
        if (hintIds.length === 0) grantA("nohint");
        if (wrong === 0) grantA("perfect");
        if (fin - startedAt <= 15 * 60 * 1000) grantA("speed");
      }
      window.scrollTo({ top: 0 });
    } else {
      bad();
      const w = wrong + 1;
      setWrong(w);
      if (w >= 10) grantA("stubborn");
      setFeedback(WRONGS[w % WRONGS.length]);
    }
  };

  const showHint = () => {
    if (!riddle || hintIds.includes(riddle.id)) return;
    setHintIds((h) => [...h, riddle.id]);
  };

  const reset = () => {
    if (done) grantA("lap2");
    setIdx(0);
    setWrong(0);
    setHintIds([]);
    setFinishedAt(null);
    setStartedAt(Date.now());
    setValue("");
    setFeedback(null);
    window.scrollTo({ top: 0 });
  };

  // 成績
  const score = Math.max(0, 100 - hintIds.length * 10 - wrong * 5);
  const rank =
    score >= 100 ? "瞳を知り尽した男" : score >= 85 ? "4g.MiNaMi" : score >= 70 ? "さかやん" : score >= 50 ? "SakayaN" : "ネカフェ勢";
  const elapsedMin = finishedAt ? Math.max(1, Math.round((finishedAt - startedAt) / 60000)) : 0;

  return (
    <div
      className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-4 py-6"
      style={konamiFx ? { animation: "hueSpin 2.2s linear" } : undefined}
    >
      <style>{`@keyframes hueSpin { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }`}</style>

      {/* 第9問のこたえ（ソース読み用。画面には出ない） */}
      <span
        aria-hidden
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: "<!-- 第9問のこたえ：かすたむろぼ -->" }}
      />

      {/* ヘッダ */}
      <header className="mb-4 border-b border-line pb-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs tracking-widest text-accent2">4g.MiNaMiの気まぐれ日記 ──攻略読本</div>
            <h1 className="mt-1 text-2xl font-black">
              <span className="text-brand">read</span> more
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              実績 {ach.length}/{ACH_DEFS.length}
            </span>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label="効果音の切り替え"
              className="rounded border border-line px-2 py-1 hover:border-brand"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-bold text-text">遊び方：</span>
            ブラウザをもう1枚開き、<span className="font-bold text-text">原典（本人のブログ）</span>を読みながら全{TOTAL}問を解け。答えは全部あっちにある。
          </p>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md border border-brand/60 px-3 py-2 text-xs font-bold text-brand transition hover:bg-brand/10"
          >
            原典を開く ↗
          </a>
        </div>
      </header>

      {/* 解答済みリスト（コンパクト） */}
      {idx > 0 && (
        <ul className="mb-4 space-y-1 text-xs text-muted-foreground">
          {RIDDLES.slice(0, Math.min(idx, TOTAL)).map((r) => (
            <li key={r.id}>
              ✓ 第{r.no}問 ── <span className="text-text">{r.answers[0]}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 問題 or クリア */}
      {!done && riddle ? (
        <article key={riddle.id} className="anim-fadeup rounded-lg border border-line bg-panel/70 p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-black text-brand">第{riddle.no}問</h2>
            <span className="text-xs text-muted-foreground">
              {riddle.no}/{TOTAL}
            </span>
          </div>
          <div className="mt-3 space-y-2 text-sm leading-relaxed">
            {riddle.q.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setFeedback(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={riddle.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 rounded-md border border-line bg-black/40 px-3 py-2.5 text-base outline-none focus:border-brand"
            />
            <button onClick={submit} className={BTN}>
              解答
            </button>
          </div>
          {feedback && (
            <p className="mt-2 text-sm font-bold text-danger" style={{ animation: "shake 0.4s" }}>
              {feedback}
            </p>
          )}

          <div className="mt-4 border-t border-line/60 pt-3">
            {hintIds.includes(riddle.id) ? (
              <p className="text-xs leading-relaxed text-gold">💡 {riddle.hint}</p>
            ) : (
              <button onClick={showHint} className="text-xs text-muted-foreground underline decoration-dotted">
                ヒントを見る（成績に響く）
              </button>
            )}
          </div>
        </article>
      ) : (
        <article className="anim-fadeup rounded-lg border border-line bg-panel/70 p-5">
          <p className="text-xs tracking-widest text-accent2">RESULT</p>
          <h2 className="mt-2 text-3xl font-black">全問クリア！</h2>

          <div className="mt-4 rounded-md border border-line bg-black/20 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">スコア</span>
              <span className="font-mono font-bold">{score} / 100</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">称号</span>
              <span className="font-bold text-gold">{rank}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">ミス / ヒント</span>
              <span className="font-mono">
                {wrong}回 / {hintIds.length}回
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">タイム</span>
              <span className="font-mono">約{elapsedMin}分</span>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-relaxed">
            <p>ここまで読んでくれて、ありがとう。</p>
            <p>フラグムービーはまだ作ってない。革命も、まだ起こってない。</p>
            <p>でも、あの頃のブログをこんなに真剣に読み返してくれる人がいるなら——書いた意味は、あった。</p>
            <p className="font-bold text-brand">続きは、また今度書くからどうぞ！＞ｗ＜</p>
          </div>

          <div className="mt-5 rounded-md border border-line bg-black/20 p-4 text-sm">
            <div className="text-muted-foreground">
              実績 {ach.length}/{ACH_DEFS.length}
              {ach.length < ACH_DEFS.length && "（まだ隠れてる）"}
            </div>
            <ul className="mt-1 space-y-0.5">
              {ACH_DEFS.map((a) => (
                <li key={a.id} className={ach.includes(a.id) ? "" : "opacity-40"}>
                  {ach.includes(a.id) ? a.label : `？？？（ヒント: ${a.hint}）`}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={reset} className="mt-4 w-full rounded-md border border-line bg-panel py-2.5 text-sm font-bold transition hover:border-brand">
            もう一周する（成績はリセット）
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
        </article>
      )}

      {!done && idx > 0 && (
        <button onClick={reset} className="mt-4 self-center text-xs text-muted-foreground underline">
          最初からやり直す
        </button>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-muted-foreground/60">
        ※ 公式攻略本は、本人のブログです。
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
