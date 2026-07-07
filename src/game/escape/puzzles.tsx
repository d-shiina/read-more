"use client";

import { useEffect, useRef, useState } from "react";
import type { GameApi, GameState } from "./types";
import {
  BTN,
  BTN_SUB,
  EXAM,
  EXAM_PIN,
  FROZEN_TWEET,
  KARAOKE_ANSWER,
  KARAOKE_INITIAL,
  KARAOKE_PEOPLE,
  KARAOKE_TRAITS,
  KARAOKE_WORD,
  KONA_MAX,
  MOVIE_FRAMES,
  SPELL_QUIZ,
  SNIPE_LINES,
  SNIPE_TARGET,
  TIMELINE_ANSWER,
  ITEMS,
  TWEETS,
} from "./data";

interface PP {
  state: GameState;
  api: GameApi;
}

/** 残留思念（2011年の俺）の吹き出し */
export function Ghost({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-2 rounded-xl border border-accent2/30 bg-accent2/5 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent2/15 text-lg">
        👻
      </span>
      <div className="min-w-0 text-sm leading-relaxed">
        <div className="text-[10px] font-bold tracking-wider text-accent2">
          残留思念（2011年の俺）
        </div>
        {children}
      </div>
    </div>
  );
}

function LockFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-4">
      <div className="text-xs font-black tracking-widest text-gold">🔒 {title}</div>
      {children}
    </div>
  );
}

/* ================= 序章: 本人確認（Skype ID） ================= */

export function Ch0Skype({ api }: PP) {
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = () => {
    const v = value.trim().toLowerCase();
    if (!v) return;
    if (v === "zaftzaft3") {
      api.fanfare();
      api.grantA("skype");
      api.addItem("tag");
      api.solve(0);
      return;
    }
    api.blip();
    setTries((t) => t + 1);
    setMsg(
      tries === 0
        ? `「${value}」……違うって。自分のIDだぞ？＞ｗ＜`
        : tries === 1
          ? "ヒント: 最初の記事の最後のほう。「興味のある方は……Skypeで◯◯まで」"
          : "もう答え書いてあるようなもんだろ！ z、a、f、t……",
    );
    setValue("");
  };

  return (
    <LockFrame title="本人確認 — SYSTEM: 凍結解除には管理人の認証が必要です">
      <Ghost>
        <p>
          うわ、老けたな俺！？　……まあいい、聞け。ここから出るには俺の（お前の）未練を5つ解くしかない。
          まずは本人確認だ。<b>自分のSkype ID</b>、まだ覚えてるよな？
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          （忘れてたら、最初の記事「記念すべき1回目の更新」のどこかに書いてた気がする＞ｗ＜）
        </p>
      </Ghost>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Skype IDを入力"
        autoComplete="off"
        spellCheck={false}
        className="mt-4 w-full rounded-xl border border-line bg-black/40 px-3 py-2.5 text-base outline-none focus:border-brand"
      />
      {msg && <p className="anim-pop mt-2 text-sm font-bold text-danger">{msg}</p>}
      <button onClick={submit} className={BTN}>
        認証する
      </button>
    </LockFrame>
  );
}

/* ================= 未練① 試験 ================= */

export function Ch1Exam({ api }: PP) {
  const [phase, setPhase] = useState<"pin" | "exam" | "result">("pin");
  const [pin, setPin] = useState("");
  const [tries, setTries] = useState(0);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submitPin = () => {
    if (pin === EXAM_PIN) {
      api.fanfare();
      setPhase("exam");
      return;
    }
    api.blip();
    setTries((t) => t + 1);
    setPin("");
  };

  const answer = (i: number) => {
    const q = EXAM[qi];
    const ok = i === q.a;
    api.blip();
    setScore((s) => s + (ok ? 1 : 0));
    setFeedback(
      ok
        ? q.q.includes("午後13時")
          ? "○ 極端に合っている——彼の世界では、午後13時は実在する。"
          : "○ 極端に合っている"
        : `× 極端に間違っている（正解: ${q.opts[q.a]}）`,
    );
    setTimeout(() => {
      setFeedback(null);
      if (qi + 1 >= EXAM.length) setPhase("result");
      else setQi(qi + 1);
    }, 1200);
  };

  const finish = () => {
    if (score === 0) api.grantA("exam0");
    if (score === EXAM.length) api.grantA("exam4");
    api.fanfare();
    api.addItem("stub");
    api.solve(1);
  };

  if (phase === "pin")
    return (
      <LockFrame title="未練①「基本情報技術者試験」 — 4桁のPINロック">
        <Ghost>
          <p>
            「基本情報技術者試験」の記事の続きが施錠されてる。PINは……そうだな、
            <b>「あ～ｗ詰んだくせぇ・・・」が生まれた日</b>。4桁で頼む。
          </p>
          {tries >= 2 && (
            <p className="mt-1 text-xs text-muted-foreground">
              ヒント: 何月何日に受けたか、記事に書いてあるだろ＞ｗ＜（月2桁＋日2桁）
            </p>
          )}
        </Ghost>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          placeholder="＿＿＿＿"
          inputMode="numeric"
          autoComplete="off"
          className="mt-4 w-full rounded-xl border border-line bg-black/40 px-3 py-2.5 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-brand"
        />
        {tries > 0 && (
          <p className="anim-pop mt-2 text-center text-sm font-bold text-danger" style={{ animation: "shake 0.4s" }}>
            解錠失敗＞ｗ＜（{tries}回目）
          </p>
        )}
        <button onClick={submitPin} className={BTN}>
          解錠する
        </button>
      </LockFrame>
    );

  if (phase === "exam") {
    const q = EXAM[qi];
    return (
      <LockFrame title={`未練①「基本情報技術者試験」 — 追試験 ${qi + 1}/${EXAM.length}`}>
        <p className="mt-2 text-xs text-muted-foreground">
          ※ この試験は「極端に合っている設問」か「極端に間違っている設問」しか出ません（本人の証言より）
        </p>
        <p className="mt-3 font-bold">{q.q}</p>
        <div className="mt-3 space-y-2">
          {q.opts.map((o, i) => (
            <button
              key={i}
              disabled={feedback !== null}
              onClick={() => answer(i)}
              className="w-full rounded-xl border border-line bg-black/20 p-3 text-left text-sm transition hover:border-brand disabled:opacity-60"
            >
              {["ア", "イ", "ウ", "エ"][i]}. {o}
            </button>
          ))}
        </div>
        {feedback && <p className="anim-pop mt-3 text-center text-sm font-bold">{feedback}</p>}
      </LockFrame>
    );
  }

  return (
    <LockFrame title="未練①「基本情報技術者試験」 — 採点結果">
      <p className="mt-3 text-center text-5xl font-black text-brand">
        {score}/{EXAM.length}
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {score === EXAM.length
          ? "満点。……俺の代わりに受けてくれ。"
          : score === 0
            ? "逆にすごい。全部外すほうが難しい。"
            : "試験官（俺）も試験を甘く見ていたので、合格です。"}
      </p>
      <Ghost>
        <p>
          ……ほんとはさ、悔しかったんだよな、あれ。秋に受かってみせるって書いて、そのまま15年経った。
          はい、これ<b>受験票の半券</b>。持ってけ。
        </p>
      </Ghost>
      <button onClick={finish} className={BTN}>
        錠前を外す（未練①解放）
      </button>
    </LockFrame>
  );
}

/* ================= 未練② クラン（カラオケ採点表） ================= */

export function Ch2Karaoke({ api }: PP) {
  const [assign, setAssign] = useState<number[]>(KARAOKE_INITIAL);
  const [phase, setPhase] = useState<"match" | "word">("match");
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [word, setWord] = useState("");
  const [wordMsg, setWordMsg] = useState<string | null>(null);

  const check = () => {
    api.blip();
    const wrongCount = assign.filter((v, i) => v !== KARAOKE_ANSWER[i]).length;
    if (wrongCount === 0) {
      if (attempts === 0) api.grantA("deathvoice");
      api.fanfare();
      setPhase("word");
    } else {
      setAttempts((a) => a + 1);
      setWrong(wrongCount);
    }
  };

  const submitWord = () => {
    if (KARAOKE_WORD.test(word.trim())) {
      api.fanfare();
      api.addItem("receipt");
      api.solve(2);
    } else {
      api.blip();
      setWordMsg(`「${word}」……違う。4gottenの「4g」を、そのまま英語で読んでみ？`);
      setWord("");
    }
  };

  if (phase === "word")
    return (
      <LockFrame title="未練②「クラン」 — 最終問題">
        <p className="mt-2 text-sm">
          採点表が完成した。全員の歌声が重なって、採点画面にメッセージが浮かぶ——
        </p>
        <p className="mt-3 rounded-xl bg-black/40 p-3 text-center font-mono text-sm text-brand">
          Q. このクラン名「4gotten」、英単語に直すと？
        </p>
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitWord()}
          placeholder="英単語で入力"
          autoComplete="off"
          spellCheck={false}
          className="mt-4 w-full rounded-xl border border-line bg-black/40 px-3 py-2.5 text-base outline-none focus:border-brand"
        />
        {wordMsg && <p className="anim-pop mt-2 text-sm font-bold text-danger">{wordMsg}</p>}
        <button onClick={submitWord} className={BTN}>
          回答する
        </button>
      </LockFrame>
    );

  return (
    <LockFrame title="未練②「クラン」 — カラオケ採点表の復元">
      <Ghost>
        <p>
          あの日のカラオケ、採点表がバグって<b>誰が何をしたか</b>ぐちゃぐちゃになってる。
          「オフ会してきた！」の記事を読んで直してくれ。全員リアフレだから思い出せるはず＞ｗ＜
        </p>
      </Ghost>
      <div className="mt-4 space-y-2">
        {KARAOKE_PEOPLE.map((p, i) => (
          <div key={i} className="rounded-xl border border-line bg-black/20 p-2.5">
            <div className="text-sm font-bold">{p}</div>
            <select
              value={assign[i]}
              onChange={(e) => {
                const next = [...assign];
                next[i] = Number(e.target.value);
                setAssign(next);
                setWrong(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-line bg-panel px-2 py-2 text-xs outline-none focus:border-brand"
            >
              {KARAOKE_TRAITS.map((t, j) => (
                <option key={j} value={j}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {wrong !== null && (
        <p className="anim-pop mt-3 text-center text-sm font-bold text-danger" style={{ animation: "shake 0.4s" }}>
          {wrong}人ぶん間違ってる＞ｗ＜（採点機はごまかせない）
        </p>
      )}
      <button onClick={check} className={BTN}>
        採点する
      </button>
    </LockFrame>
  );
}

/* ================= 未練③ 師匠（誤字スナイプ） ================= */

export function Ch3Snipe({ api }: PP) {
  const [phase, setPhase] = useState<"idle" | "scope" | "hit">("idle");
  const [misses, setMisses] = useState(0);
  const [missMsg, setMissMsg] = useState<string | null>(null);

  const fire = (token: string) => {
    if (token === SNIPE_TARGET) {
      api.shot();
      setTimeout(() => api.fanfare(), 250);
      if (misses === 0) api.grantA("sniper");
      if (misses >= 3) api.grantA("grenade");
      setPhase("hit");
    } else {
      api.shot();
      const n = misses + 1;
      setMisses(n);
      if (n >= 3) api.grantA("grenade");
      setMissMsg(
        n === 1
          ? "外した。Joka「落ち着け。呼吸を整えろ」"
          : n === 2
            ? "Joka「そこは誤字じゃない。ただの味だ」"
            : "Joka「……お前、無駄にグレで飛び過ぎなんだよ」",
      );
    }
  };

  const finish = () => {
    api.addItem("bullet");
    api.solve(3);
  };

  if (phase === "idle")
    return (
      <LockFrame title="未練③「師匠」 — 狙撃指令">
        <Ghost>
          <p>
            Jokaから（脳内で）指令だ。TOPの記事のどこかに、<b>15年間放置された致命的な誤字</b>がある。
            スナ専の意地を見せろ。SRを構えて、一発で仕留めるんだ。
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ヒント: A.V.A の正式名称……本当に合ってるか？
          </p>
        </Ghost>
        <button onClick={() => setPhase("scope")} className={BTN}>
          🔫 SRを構える（スコープモード）
        </button>
      </LockFrame>
    );

  if (phase === "scope")
    return (
      <LockFrame title="未練③「師匠」 — スコープ展開中">
        <p className="mt-2 text-xs text-muted-foreground">
          誤っている単語をタップ（クリック）で狙撃。外すと師匠に叱られる。
        </p>
        <div
          className="mt-3 rounded-xl bg-black/70 p-4 leading-loose"
          style={{ cursor: "crosshair" }}
        >
          {SNIPE_LINES.map((line, li) => (
            <p key={li} className="text-sm text-white/80">
              {line.map((tk, ti) => (
                <button
                  key={ti}
                  onClick={() => fire(tk)}
                  className="rounded px-0.5 transition hover:bg-danger/40 hover:text-white"
                >
                  {tk}
                </button>
              ))}
            </p>
          ))}
        </div>
        {missMsg && (
          <p className="anim-pop mt-3 text-center text-sm font-bold text-danger" style={{ animation: "shake 0.4s" }}>
            {missMsg}（ミス {misses}）
          </p>
        )}
      </LockFrame>
    );

  return (
    <LockFrame title="未練③「師匠」 — ヘッドショット">
      <p className="anim-pop mt-3 text-center text-lg font-black text-brand">
        🎯 「Variant」を撃ち抜いた！（正しくは Valiant）
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        15年間、誰にも指摘されなかった誤字は、いま供養された。
      </p>
      <div className="mt-4 rounded-xl border border-line bg-black/30 p-3 text-sm">
        <p className="text-xs text-muted-foreground">弾痕の中に、メモが残されている——</p>
        <p className="mt-2 font-bold text-gold">
          Joka「いいか、エイムは——<span className="text-brand">ずらして、合わせろ</span>。
          言葉も、同じだ」
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">（※ 最終問題のヒント）</p>
      </div>
      <button onClick={finish} className={BTN}>
        SRの弾丸を回収する（未練③解放）
      </button>
    </LockFrame>
  );
}

/* ================= 未練④ 革命（タイムライン→レンダリング→ムービー） ================= */

export function Ch4Timeline({ state, api }: PP) {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [phase, setPhase] = useState<"edit" | "boot" | "render" | "movie" | "thanks">("edit");
  const [prog, setProg] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [frame, setFrame] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [bootMsg, setBootMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const place = (id: string) => {
    const i = slots.indexOf(null);
    if (i === -1) return;
    api.blip();
    const next = [...slots];
    next[i] = id;
    setSlots(next);
    setErr(null);
  };

  const remove = (i: number) => {
    api.blip();
    const next = [...slots];
    next[i] = null;
    setSlots(next);
    setErr(null);
  };

  const render = () => {
    if (slots.some((s) => s === null)) return;
    if (slots.join(",") !== TIMELINE_ANSWER.join(",")) {
      api.blip();
      setErr("レンダリングエラー: 時系列がバグってます＞ｗ＜（アイテムの日付を見ろ、日付を）");
      return;
    }
    api.blip();
    setPhase("boot");
  };

  const boot = (i: number) => {
    const q = SPELL_QUIZ[i];
    setBootMsg(q.msg);
    if (q.ok) {
      api.grantA("spell");
      api.fanfare();
      setTimeout(() => startRender(), 1400);
    } else {
      api.blip();
    }
  };

  const startRender = () => {
    setPhase("render");
    let v = 0;
    timer.current = setInterval(() => {
      v = Math.min(98, v + (v < 60 ? 9 : v < 90 ? 4 : 1));
      setProg(v);
      if (v >= 98) {
        if (timer.current) clearInterval(timer.current);
        setStuck(true);
        // いつもならここで止まる。今回は止まらない。
        setTimeout(() => {
          setProg(100);
          api.fanfare();
          setTimeout(() => setPhase("movie"), 900);
        }, 2400);
      }
    }, 120);
  };

  // ムービー再生
  useEffect(() => {
    if (phase !== "movie") return;
    const t = setInterval(() => {
      setFrame((f) => {
        if (f + 1 >= MOVIE_FRAMES.length) {
          clearInterval(t);
          setTimeout(() => setPhase("thanks"), 1600);
          return f;
        }
        return f + 1;
      });
    }, 1700);
    return () => clearInterval(t);
  }, [phase]);

  const thanks = (who: "kona" | "milk" | "none") => {
    if (who === "kona") {
      api.setFlag("thanks_kona");
      api.addKona(2);
    }
    if (who === "milk") api.setFlag("thanks_milk");
    api.grantA("movie");
    api.fanfare();
    api.solve(4);
  };

  if (phase === "boot") {
    const solved = bootMsg !== null && SPELL_QUIZ.some((q) => q.ok && q.msg === bootMsg);
    return (
      <LockFrame title="project_kakumei.aep — 起動中……">
        <div className="mt-3 rounded-xl border border-danger/50 bg-black/50 p-4">
          <p className="font-mono text-sm font-bold text-danger">
            ⚠ 起動エラー（コード: 2011）
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
            ソフトウェア <b className="text-danger">「AfterEffect」</b> が見つかりません。
            <br />
            ……このプロジェクトの作者は、15年間ソフトの名前を間違えて覚えていた可能性があります。
          </p>
        </div>
        <p className="mt-3 text-sm font-bold">正しいソフト名を選んで、起動し直せ：</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SPELL_QUIZ.map((q, i) => (
            <button
              key={i}
              disabled={solved}
              onClick={() => boot(i)}
              className="rounded-xl border border-line bg-black/20 p-3 font-mono text-sm font-bold transition hover:border-brand disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
        {bootMsg && (
          <p
            className={`anim-pop mt-3 text-sm font-bold ${solved ? "text-brand" : "text-danger"}`}
            style={solved ? undefined : { animation: "shake 0.4s" }}
          >
            {bootMsg}
          </p>
        )}
        <Ghost>
          <p>
            ……え、ウソだろ。「正直自分の中で革命が起こったようだった・・・」とまで書いた相手の名前、
            俺が書いたのは記事1本で<b>2回</b>。……その2回とも、間違えてたのか＞ｗ＜
          </p>
        </Ghost>
      </LockFrame>
    );
  }

  if (phase === "render")
    return (
      <LockFrame title="project_kakumei.aep — レンダリング中">
        <p className="mt-3 text-sm">15年分のコンポジションをレンダリングしています……</p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-black/40">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${prog}%` }} />
        </div>
        <p className="mt-2 text-center font-mono text-3xl font-bold text-brand">{prog}%</p>
        {stuck && prog < 100 && (
          <p className="anim-pop mt-2 text-center text-xs text-muted-foreground">
            ……（いつもの流れなら、ここで止まる）
          </p>
        )}
        {prog >= 100 && (
          <p className="anim-pop mt-2 text-center text-sm font-black text-gold">
            止まらなかった。——15年目の、初レンダリング完了。
          </p>
        )}
      </LockFrame>
    );

  if (phase === "movie") {
    const f = MOVIE_FRAMES[frame];
    return (
      <LockFrame title="フラグムービー『KAKUMEI』 — 上映中">
        <div className="mt-3 flex h-56 flex-col items-center justify-center overflow-hidden rounded-xl bg-black text-center">
          <p key={`t${frame}`} className="anim-pop text-3xl font-black tracking-widest text-white">
            {f.t}
          </p>
          <p key={`s${frame}`} className="anim-fadeup mt-3 max-w-[90%] text-sm text-white/70">
            {f.s}
          </p>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {frame + 1}/{MOVIE_FRAMES.length}
        </p>
      </LockFrame>
    );
  }

  if (phase === "thanks")
    return (
      <LockFrame title="フラグムービー『KAKUMEI』 — エンドクレジット">
        <p className="mt-3 text-sm">
          クレジットの最後、<b>Special Thanks</b> の欄だけが空白のまま点滅している。誰の名前を入れる？
        </p>
        <div className="mt-4 space-y-2">
          <button onClick={() => thanks("kona")} className={BTN}>
            「こな」と入れる
          </button>
          <button onClick={() => thanks("milk")} className={BTN_SUB}>
            照れ隠しに「みるくふぁいたー」と入れる
          </button>
          <button onClick={() => thanks("none")} className={BTN_SUB}>
            空欄のままにする
          </button>
        </div>
      </LockFrame>
    );

  const placed = slots.filter(Boolean) as string[];
  const avail = state.inventory.filter((id) => !placed.includes(id));

  return (
    <LockFrame title="project_kakumei.aep — 未レンダリング（最終更新: 2011年）">
      <Ghost>
        <p>
          AfterEffect、開くだけ開いて15年経った。素材は……お前が集めてくれた4つで足りる。
          <b>タイムラインに古い順で並べて</b>、レンダリングを押してくれ。今度こそ、革命を終わらせる。
        </p>
      </Ghost>
      <div className="mt-4 rounded-xl bg-black/50 p-3">
        <div className="text-[10px] font-bold tracking-widest text-muted-foreground">
          TIMELINE（左が過去 → 右が未来）
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {slots.map((s, i) => (
            <button
              key={i}
              onClick={() => s && remove(i)}
              className={`flex h-20 flex-col items-center justify-center rounded-lg border text-center text-[10px] leading-tight transition ${
                s ? "border-brand/60 bg-brand/10" : "border-dashed border-line bg-black/20"
              }`}
            >
              {s ? (
                <>
                  <span className="text-xl">{ITEMS[s].icon}</span>
                  <span className="mt-0.5 px-0.5 font-bold">{ITEMS[s].name}</span>
                </>
              ) : (
                <span className="text-muted-foreground/50">{i + 1}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {avail.map((id) => (
          <button
            key={id}
            onClick={() => place(id)}
            className="rounded-lg border border-line bg-panel px-2.5 py-1.5 text-xs font-bold transition hover:border-brand"
          >
            {ITEMS[id].icon} {ITEMS[id].name}
            <span className="ml-1 text-[10px] font-normal text-muted-foreground">{ITEMS[id].date}</span>
          </button>
        ))}
        {avail.length === 0 && placed.length < 4 && (
          <p className="text-xs text-danger">素材が足りない……（未練①〜③を先に解こう）</p>
        )}
      </div>
      {err && (
        <p className="anim-pop mt-3 text-sm font-bold text-danger" style={{ animation: "shake 0.4s" }}>
          {err}
        </p>
      )}
      <button onClick={render} disabled={slots.some((s) => s === null)} className={`${BTN} disabled:opacity-40`}>
        レンダリングを開始する
      </button>
    </LockFrame>
  );
}

/* ================= 未練⑤ こなちゃん（旧Twitterログ端末） ================= */

export function Ch5Terminal({ state, api }: PP) {
  const [opened, setOpened] = useState(false);
  const [read, setRead] = useState<number[]>([]);
  const [text, setText] = useState(FROZEN_TWEET);
  const [msg, setMsg] = useState<string | null>(null);
  const [jokaSummoned, setJokaSummoned] = useState(false);
  const allRead = state.flags.tweetsAll || read.length >= TWEETS.length;

  const markRead = (i: number) => {
    if (read.includes(i)) return;
    api.blip();
    const next = [...read, i];
    setRead(next);
    if (next.length >= TWEETS.length && !state.flags.tweetsAll) {
      api.setFlag("tweetsAll");
      api.addKona(1);
      api.grantA("tweets");
    }
  };

  const edited = text.trim() !== FROZEN_TWEET && text.trim().length > 0;
  const validFix = edited && /こな/.test(text) && !/粉まみれ/.test(text);
  const canB = state.kona >= 4 && validFix;
  const canA = state.kona >= KONA_MAX && (state.flags.tweetsAll || allRead);

  const sendAsIs = () => api.choose("C");

  const sendFixed = () => {
    if (/joka|じょーか|ジョーカ/i.test(text)) {
      api.fanfare();
      api.grantA("joka");
      setJokaSummoned(true);
      setMsg(null);
      return;
    }
    if (!edited) {
      setMsg("……1文字も直ってないが？＞ｗ＜");
      return;
    }
    if (!validFix) {
      setMsg(
        /粉まみれ/.test(text)
          ? "まだ粉まみれが残ってる。エイムは、ずらして合わせろ。"
          : "「こな」の2文字は消すな。ずらすのは、その先だ。",
      );
      return;
    }
    if (state.kona < 4) {
      setMsg("（……まだ、これを送る資格がない気がする。もっと話してからだ）");
      return;
    }
    api.choose("B");
  };

  const call = () => api.choose("A");

  if (!opened)
    return (
      <LockFrame title="old_twitter_backup.zip — 最後の未練">
        <Ghost>
          <p>
            ……見つけたか。それ、2012年の俺のツイートログ。
            正直、開けてほしくない。開けてくれ。<b>最後の未練は、この中にいる。</b>
          </p>
        </Ghost>
        <button
          onClick={() => {
            api.blip();
            setOpened(true);
          }}
          className={BTN}
        >
          解凍する（14件）
        </button>
      </LockFrame>
    );

  return (
    <LockFrame title="未練⑤「こなちゃん」 — 旧Twitterログ端末">
      <p className="mt-2 text-xs text-muted-foreground">
        タップで既読にする（{Math.min(read.length, TWEETS.length)}/{TWEETS.length}）
        {allRead && " — 全部読んだ。……全部、こなちゃんだった。"}
      </p>
      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-line bg-black/20 p-3">
        {TWEETS.map((t, i) => (
          <button
            key={i}
            onClick={() => markRead(i)}
            className={`w-full rounded-lg p-2.5 text-left transition ${
              read.includes(i) ? "bg-black/30 opacity-70" : "bg-black/50 hover:bg-black/40"
            }`}
          >
            <div className="flex gap-2">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-black text-brand">
                4g
              </span>
              <div className="min-w-0">
                <div className="text-xs">
                  <span className="font-bold">4g.MiNaMi</span>{" "}
                  <span className="text-muted-foreground">@zaftx ・ {t.date}</span>
                  {read.includes(i) && <span className="ml-1 text-brand">✓既読</span>}
                </div>
                <p className="mt-0.5 text-sm leading-relaxed">{t.text}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 送信直前で時が止まった端末 */}
      <div className="mt-5 rounded-xl border border-danger/40 bg-danger/5 p-3">
        <div className="text-[10px] font-bold tracking-widest text-danger">
          ⏸ 2012.07.10 23:42 — 送信直前で時が止まっている
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          【ツイートする】に指がかかったまま、14年。……Jokaの遺言を思い出せ。
          <b className="text-gold">「エイムは、ずらして合わせろ。言葉も、同じだ」</b>
          ——本当に言いたかった言葉に、直せる。
        </p>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMsg(null);
          }}
          rows={3}
          className="mt-3 w-full rounded-xl border border-line bg-black/40 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-brand"
        />
        {msg && <p className="anim-pop mt-2 text-sm font-bold text-danger">{msg}</p>}
        {jokaSummoned && (
          <div className="anim-pop mt-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm">
            <p className="font-black text-gold">Joka「呼んだか」</p>
            <p className="mt-1">
              Joka「……悪いが、ここは俺が撃つ場所じゃない。<b>そこは自分で撃て。</b>」
            </p>
            <p className="mt-1 text-xs text-muted-foreground">（実績「🙏 他力本願」解除。師匠は帰っていった）</p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <button onClick={sendAsIs} className={BTN_SUB}>
            🧂 そのまま送信する（2012年の俺を信じる）
          </button>
          <button
            onClick={sendFixed}
            className={`${BTN} ${!canB ? "opacity-50" : ""}`}
          >
            ✍️ 直した言葉を送信する
            {state.kona < 4 && <span className="ml-1 text-xs font-normal">（こな度4以上）</span>}
          </button>
          <button
            onClick={call}
            disabled={!canA}
            className={`w-full rounded-xl py-3 text-base font-black transition ${
              canA
                ? "anim-pop bg-gradient-to-r from-[#ff8ac2] to-[#3fd6e6] text-[#062a33] shadow-[0_0_24px_rgba(255,138,194,0.4)] hover:brightness-110"
                : "cursor-not-allowed border border-line bg-panel text-muted-foreground/50"
            }`}
          >
            📞 送信しない。——通話を発信する
            {!canA && (
              <span className="ml-1 text-xs font-normal">
                （こな度MAX＋ツイート全読で解放）
              </span>
            )}
          </button>
        </div>
      </div>
    </LockFrame>
  );
}
