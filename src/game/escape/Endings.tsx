"use client";

import { useEffect, useState } from "react";
import type { Ending, GameApi, GameState } from "./types";
import { ACH_DEFS, BTN, BTN_SUB, KONA_FACES, KONA_MAX } from "./data";

/* ================= エンディングの台本 ================= */

interface Step {
  who: "sys" | "k" | "m";
  text: string;
  time?: string;
}

const SCRIPT_C: Step[] = [
  { who: "sys", text: "【ツイートする】——押した。" },
  { who: "sys", text: "2012年から止まっていた時間が、動き出す。" },
  { who: "sys", text: "……既読がついた。" },
  { who: "sys", text: "…………" },
  { who: "sys", text: "返事は、ない。" },
  { who: "m", text: "（知ってた。……知ってたよ）" },
  { who: "sys", text: "集計：2012年上半期、「こなちゃん」を含むツイート22件。デートの報告、0件。数字は嘘をつかない。" },
];

const SCRIPT_B: Step[] = [
  { who: "sys", text: "直した言葉を、送信した。" },
  { who: "sys", text: "14年遅れのツイートが、タイムラインに流れていく。" },
  { who: "sys", text: "——DM着信。" },
  { who: "k", text: "……届いたよ。14年かかったね、ばか" },
  { who: "k", text: "でも、うれしい。……ありがと" },
  { who: "m", text: "（届いた。……届いたんだ）" },
  { who: "sys", text: "ブログの凍結が、解除された。" },
];

const SCRIPT_A: Step[] = [
  { who: "sys", text: "発信中……", time: "23:47" },
  { who: "sys", text: "……ワンコール。ツーコール。" },
  { who: "k", text: "……もしもし？" },
  { who: "m", text: "……もしもし。『TSこいやぁああああ』って言ったら、来てくれる気がして" },
  { who: "k", text: "ふふ、なにそれ。……来たよ。14年ぶりに" },
  { who: "sys", text: "ニコ動の話。マイクラの鯖の話。AVAの話。プリンの話。", time: "00:31" },
  { who: "k", text: "あの頃さ、毎日TS誘ってくれたじゃん。……あれ、けっこう、うれしかったんだよ" },
  { who: "m", text: "……あのダジャレ、送るのに3時間かかったの、知ってた？" },
  { who: "k", text: "知ってる。既読つけたまま返せなくて、私も3時間スマホ握ってた" },
  { who: "sys", text: "話題はとっくに尽きた。なのに、どちらも切ろうとしない。", time: "02:58" },
  { who: "m", text: "こなちゃん？" },
  { who: "k", text: "……すぅ……すぅ……" },
  { who: "m", text: "……おやすみ。切らないでおくね" },
  { who: "sys", text: "通話時間 4:51:22 —— 継続中" },
];

const SCRIPTS: Record<Ending, Step[]> = { A: SCRIPT_A, B: SCRIPT_B, C: SCRIPT_C };

/** エピローグに生える15年ぶりの新規記事 */
function EpilogueArticle({ ending }: { ending: Ending }) {
  if (ending === "C")
    return (
      <div className="anim-fadeup mt-4 rounded-2xl border border-line bg-black/40 p-4 text-sm">
        <div className="text-[11px] text-muted-foreground">SYSTEM ｜ 2026年07月07日</div>
        <div className="mt-1 font-bold text-muted-foreground">【お知らせ】本ブログは凍結されました</div>
        <p className="mt-2 text-xs text-muted-foreground">
          「4g.MiNaMiの気まぐれ日記」は予定通りアーカイブ凍結されました。……歴史は、繰り返した。
        </p>
        <p className="mt-2 text-xs text-gold">
          💡 こな度と実績を引き継いで2周目に挑めます。今度は、ずらして合わせろ。
        </p>
      </div>
    );
  if (ending === "B")
    return (
      <div className="anim-fadeup mt-4 rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm">
        <div className="text-[11px] text-muted-foreground">2026年07月07日 ｜ #雑談</div>
        <div className="mt-1 font-bold">お久しぶりです！（15年ぶり2回目）</div>
        <p className="mt-2 text-sm leading-relaxed">
          みなさんお久しぶり！ブログ、また書いていこうと思います。
          14年前の言葉、直して送ったら——ちゃんと返事が来ました＞ｗ＜
        </p>
        <p className="mt-2 font-bold text-brand">続きは、続きを読むからどうぞ！</p>
      </div>
    );
  return (
    <div className="anim-fadeup mt-4 rounded-2xl border border-[#ff8ac2]/50 bg-[#ff8ac2]/5 p-4 text-sm">
      <div className="text-[11px] text-muted-foreground">2026年07月08日 ｜ #ご報告</div>
      <div className="mt-1 font-bold">【ご報告】寝落ちもしもしについて</div>
      <p className="mt-2 text-sm leading-relaxed">
        14年ぶりに通話したら、朝までコースでした。途中から返事が寝息だったのは内緒です＞ｗ＜
        フラグムービーも完成したし、マイクラの鯖も立てたし、次はオフ会かな！（2人で）
      </p>
      <p className="mt-2 font-bold text-[#ff8ac2]">続きは、二人で読むからどうぞ！＞ｗ＜</p>
    </div>
  );
}

/* ================= エンディングシーン（オーバーレイ） ================= */

export function EndingScene({
  ending,
  api,
  onEscape,
}: {
  ending: Ending;
  api: GameApi;
  onEscape: () => void;
}) {
  const steps = SCRIPTS[ending];
  const [idx, setIdx] = useState(0);
  const done = idx >= steps.length - 1;
  const isCall = ending === "A";

  const advance = () => {
    if (!done) {
      api.blip();
      setIdx((i) => i + 1);
    }
  };

  const shown = steps.slice(0, idx + 1);
  const lastTime = [...shown].reverse().find((s) => s.time)?.time;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 px-4 py-8 backdrop-blur">
      {/* buttonのネストを避けるため外側はdiv+onClick */}
      <div
        onClick={advance}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && advance()}
        className="mx-auto w-full max-w-md cursor-pointer text-left"
      >
        <div
          className={`rounded-3xl border p-5 ${
            isCall ? "border-[#ff8ac2]/40 bg-[#12080e]" : "border-line bg-panel"
          }`}
        >
          {isCall && (
            <div className="mb-4 flex items-center gap-3 border-b border-line/50 pb-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#ff8ac2]/20 text-2xl">
                🍮
              </span>
              <div>
                <div className="font-bold">こな</div>
                <div className="text-xs text-[#ff8ac2]">
                  📞 通話中 {lastTime && `｜ ${lastTime}`}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {shown.map((s, i) => (
              <div key={i} className={i === idx ? "anim-fadeup" : ""}>
                {s.who === "sys" ? (
                  <p className="text-center text-xs tracking-wider text-muted-foreground">
                    {s.time && <span className="mr-2 font-mono text-gold">{s.time}</span>}
                    {s.text}
                  </p>
                ) : s.who === "k" ? (
                  <div className="flex gap-2">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ff8ac2]/20 text-xs">
                      🍮
                    </span>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-panel2 px-3 py-2 text-sm">
                      {s.text}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand/20 px-3 py-2 text-sm">
                      {s.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!done && (
            <p className="mt-5 animate-pulse text-center text-[11px] text-muted-foreground">
              ▼ タップで進む
            </p>
          )}

          {done && (
            <>
              <EpilogueArticle ending={ending} />
              <p className="mt-5 text-center text-xs text-muted-foreground">
                ——ブログのTOPに、15年間存在しなかったボタンが現れた。
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  api.fanfare();
                  onEscape();
                }}
                className={`${BTN} anim-pop`}
              >
                続きを読む →（脱出する）
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= リザルト ================= */

const END_LABEL: Record<Ending, string> = {
  A: "💤 ハッピーエンド「寝落ちもしもし」",
  B: "🚪 ノーマルエンド「14年越しの送信」",
  C: "🧂 バッドエンド「粉まみれ」",
};

export function Results({
  state,
  onNewGamePlus,
  onFullReset,
}: {
  state: GameState;
  onNewGamePlus: () => void;
  onFullReset: () => void;
}) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const ms = Date.now() - state.startedAt;
    const s = Math.max(1, Math.floor(ms / 1000));
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setElapsed(`${Math.floor(s / 60)}分${String(s % 60).padStart(2, "0")}秒`);
  }, [state.startedAt]);

  const endings = (["A", "B", "C"] as Ending[]).filter((e) => state.flags[`end_${e}`]);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 py-8">
      <p className="text-center text-xs tracking-widest text-accent2">read more: ESCAPE</p>
      <p className="mt-3 text-center text-4xl font-black tracking-widest">【脱出】</p>
      {state.ending && (
        <p className="anim-pop mt-3 text-center text-lg font-black text-brand">
          {END_LABEL[state.ending]}
        </p>
      )}
      {state.ending === "A" && (
        <p className="mt-2 text-center text-sm text-[#ff8ac2]">
          彼の15年の未練は、すべて解かれました。おめでとう。おやすみなさい。
        </p>
      )}
      {state.ending === "C" && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          脱出はした。……したが、何かを置いてきた。2周目で回収しよう。
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">かかった時間</span>
          <span className="font-mono font-bold">{elapsed}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-muted-foreground">周回</span>
          <span className="font-mono font-bold">{state.lap}周目</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-muted-foreground">こな度</span>
          <span className="font-mono font-bold">
            {state.kona}/{KONA_MAX} {KONA_FACES[Math.min(state.kona, KONA_MAX)]}
          </span>
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-muted-foreground">エンディング回収</span>
          <span className="font-mono font-bold">{endings.length}/3（{endings.join("・") || "—"}）</span>
        </div>

        <div className="mt-4 text-muted-foreground">
          実績 {state.ach.length}/{ACH_DEFS.length}
          {state.ach.length < ACH_DEFS.length && "（まだ隠れてる。周回へどうぞ）"}
        </div>
        <ul className="mt-1 space-y-0.5">
          {ACH_DEFS.map((a) => (
            <li key={a.id} className={state.ach.includes(a.id) ? "" : "opacity-40"}>
              {state.ach.includes(a.id) ? a.label : `？？？（ヒント: ${a.hint}）`}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onNewGamePlus} className={BTN}>
        2周目へ（こな度・実績を引き継ぐ）
      </button>
      <button onClick={onFullReset} className={BTN_SUB}>
        完全リセット（すべて消える）
      </button>

      <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
        続きは、{state.ending === "A" ? "二人で" : "また今度"}読むからどうぞ！＞ｗ＜
      </p>

      {/* 紙吹雪 */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute select-none text-lg font-black"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              color: i % 3 === 0 ? "#ff8ac2" : "#3fd6e6",
              animation: `fall ${3.2 + (i % 5) * 0.7}s linear ${(i % 7) * 0.5}s infinite`,
            }}
          >
            {state.ending === "A" ? (i % 2 === 0 ? "💗" : "＞ω＜") : "＞ｗ＜"}
          </span>
        ))}
      </div>
    </div>
  );
}
