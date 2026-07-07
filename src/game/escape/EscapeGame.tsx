"use client";

/**
 * read more: ESCAPE
 * —— 15年放置されたブログの中に閉じ込められた。管理人（お前）の未練を全部解かないと、出られない。
 *
 * 元ネタは blog-backup/README.md（彼のブログ全10記事＋2012年ツイート）。
 * 旧作「続きを読むばかゲー」は完全削除済み。git履歴の中で眠っている。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Ending, GameApi, GameState } from "./types";
import {
  ACH_DEFS,
  ACH_LABEL,
  dmLineCount,
  ITEMS,
  KONA_FACES,
  KONA_MAX,
  objectiveText,
  SEALS,
} from "./data";
import { useSfx } from "./sfx";
import BlogViewer from "./BlogViewer";
import DMWindow from "./DMWindow";
import { EndingScene, Results } from "./Endings";

const SAVE = "readmore.escape.v1";

/* ================= 導入 ================= */

const INTRO_STEPS: { text: string; sub?: string }[] = [
  {
    text: "【お知らせ】「4g.MiNaMiの気まぐれ日記」は、長期間更新がないためアーカイブ凍結されます。",
    sub: "凍結前に、続きは、続きを読むからどうぞ！",
  },
  {
    text: "（リンクを踏んだ瞬間、画面が歪んで——）",
    sub: "うわああああああ＞ｗ＜！？",
  },
  {
    text: "👻「よお。……いや、俺か。2011年の俺だ」",
    sub: "「ここは俺たち（お前）のブログの中。出るには、置き去りにした5つの未練を全部解くしかない」",
  },
  {
    text: "👻「大丈夫、続きは、続きを読むからどうぞ！」",
    sub: "「……あ、そのボタン、このブログにはまだ存在しないんだった＞ｗ＜」",
  },
];

function Intro({ onDone, blip }: { onDone: () => void; blip: () => void }) {
  const [i, setI] = useState(0);
  const last = i >= INTRO_STEPS.length - 1;
  const s = INTRO_STEPS[i];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4">
      <button
        onClick={() => {
          blip();
          if (last) onDone();
          else setI(i + 1);
        }}
        className="mx-auto w-full max-w-md rounded-3xl border border-line bg-panel p-6 text-left"
      >
        <p key={`t${i}`} className="anim-fadeup text-base font-bold leading-relaxed">
          {s.text}
        </p>
        {s.sub && (
          <p key={`s${i}`} className="anim-fadeup mt-3 text-sm text-muted-foreground">
            {s.sub}
          </p>
        )}
        <p className="mt-6 animate-pulse text-center text-[11px] text-muted-foreground">
          {last ? "▼ タップして、閉じ込められる" : "▼ タップで進む"}
        </p>
      </button>
    </div>
  );
}

/* ================= PC判定（lg以上で2カラム。DOM二重化を避けるためJSで分岐） ================= */

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setDesktop(mq.matches);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

/* ================= 持ち物・実績パネル（モバイルタブ／PCサイドバー共用） ================= */

function ItemsPanel({ inventory }: { inventory: string[] }) {
  return (
    <div className="anim-fadeup space-y-3">
      {inventory.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-4 text-center text-sm text-muted-foreground">
          まだ何も持っていない。未練を解くと、思い出が手に入る。
        </p>
      )}
      {inventory.map((id) => (
        <div key={id} className="rounded-2xl border border-line bg-panel/60 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ITEMS[id].icon}</span>
            <div>
              <div className="font-bold">{ITEMS[id].name}</div>
              <div className="text-[11px] text-gold">{ITEMS[id].date}</div>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{ITEMS[id].desc}</p>
        </div>
      ))}
      {inventory.length > 0 && (
        <p className="text-center text-[11px] text-muted-foreground/60">
          ※ この思い出たちは、未練④で素材になる気がする
        </p>
      )}
    </div>
  );
}

function AchPanel({ ach, collapsible }: { ach: string[]; collapsible?: boolean }) {
  const body = (
    <ul className="mt-2 space-y-1">
      {ACH_DEFS.map((a) => (
        <li key={a.id} className={ach.includes(a.id) ? "" : "opacity-40"}>
          {ach.includes(a.id) ? a.label : `？？？（ヒント: ${a.hint}）`}
        </li>
      ))}
    </ul>
  );
  if (collapsible)
    return (
      <details className="anim-fadeup rounded-2xl border border-line bg-panel/60 p-4 text-sm">
        <summary className="cursor-pointer font-bold text-muted-foreground">
          🏆 実績 {ach.length}/{ACH_DEFS.length}
        </summary>
        {body}
      </details>
    );
  return (
    <div className="anim-fadeup rounded-2xl border border-line bg-panel/60 p-4 text-sm">
      <div className="text-muted-foreground">
        実績 {ach.length}/{ACH_DEFS.length}
      </div>
      {body}
    </div>
  );
}

/* ================= 本体 ================= */

export default function EscapeGame() {
  const [chapter, setChapter] = useState(0);
  const [kona, setKona] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [ach, setAch] = useState<string[]>([]);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [lap, setLap] = useState(1);
  const [startedAt, setStartedAt] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [tab, setTab] = useState<"blog" | "dm" | "items" | "ach">("blog");
  const isDesktop = useIsDesktop();
  const [dmSeen, setDmSeen] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [konamiFx, setKonamiFx] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { muted, setMuted, blip, fanfare, ping, shot } = useSfx();

  /* ---------- セーブ復元 ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const s = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (typeof s.chapter === "number") setChapter(Math.min(s.chapter, 6));
        if (typeof s.kona === "number") setKona(Math.min(s.kona, KONA_MAX));
        if (Array.isArray(s.inventory)) setInventory(s.inventory.filter((x: unknown) => typeof x === "string"));
        if (s.flags && typeof s.flags === "object") setFlags(s.flags);
        if (Array.isArray(s.ach)) setAch(s.ach.filter((x: unknown) => typeof x === "string"));
        if (s.ending === "A" || s.ending === "B" || s.ending === "C") setEnding(s.ending);
        if (typeof s.lap === "number") setLap(s.lap);
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

  /* ---------- セーブ ---------- */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        SAVE,
        JSON.stringify({ chapter, kona, inventory, flags, ach, ending, lap, startedAt }),
      );
    } catch {}
  }, [chapter, kona, inventory, flags, ach, ending, lap, startedAt, loaded]);

  /* ---------- 実績（refミラーで冪等） ---------- */
  const achRef = useRef<string[]>([]);
  useEffect(() => {
    achRef.current = ach;
  }, [ach]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const grantA = useCallback(
    (id: string) => {
      if (achRef.current.includes(id) || !ACH_LABEL[id]) return;
      achRef.current = [...achRef.current, id];
      setAch(achRef.current);
      showToast(`実績解除：${ACH_LABEL[id]}`);
      fanfare();
    },
    [fanfare, showToast],
  );

  const konaRef = useRef(0);
  useEffect(() => {
    konaRef.current = kona;
  }, [kona]);

  const addKona = useCallback(
    (n: number) => {
      const next = Math.min(KONA_MAX, konaRef.current + n);
      konaRef.current = next;
      setKona(next);
      if (next >= KONA_MAX) grantA("konamax");
    },
    [grantA],
  );

  const setFlag = useCallback((key: string) => {
    setFlags((f) => (f[key] ? f : { ...f, [key]: true }));
  }, []);

  const addItem = useCallback((id: string) => {
    setInventory((inv) => (inv.includes(id) ? inv : [...inv, id]));
  }, []);

  const solve = useCallback(
    (n: number) => {
      setChapter((c) => {
        if (c !== n) return c;
        if (n >= 1) showToast(`🔓 未練${["", "①", "②", "③", "④", "⑤"][n]}が解けた！`);
        else showToast("🔓 本人確認完了。アーカイブが解凍されていく……");
        return c + 1;
      });
    },
    [showToast],
  );

  const choose = useCallback(
    (e: Ending) => {
      setEnding(e);
      setFlag(`end_${e}`);
      grantA(`end${e}`);
    },
    [grantA, setFlag],
  );

  const api: GameApi = { grantA, addKona, setFlag, addItem, solve, choose, blip, fanfare, ping, shot };

  const state: GameState = { chapter, kona, inventory, flags, ach, ending, lap, startedAt };

  /* ---------- DM未読バッジ ---------- */
  const dmCount = dmLineCount(chapter, flags);
  useEffect(() => {
    if (tab !== "dm") return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setDmSeen(dmCount);
  }, [tab, dmCount]);
  const dmUnread = dmCount > dmSeen;

  /* ---------- 隠し①：コナミコマンド ---------- */
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

  /* ---------- 隠し②：開発者コンソール ---------- */
  useEffect(() => {
    try {
      console.log(
        "%c脱出のヒントは、コンソールにはありません。＞ｗ＜",
        "color:#3fd6e6;font-size:16px;font-weight:bold",
      );
      console.log("……が、window.tsudzuki() を実行すると、いいことがあります。");
      (window as unknown as { tsudzuki?: () => string }).tsudzuki = () => {
        grantA("console");
        return "＞ｗ＜ 実績解除！　こんな所を掘るやつが、脱出できないわけがない。";
      };
    } catch {}
    return () => {
      try {
        delete (window as unknown as { tsudzuki?: () => string }).tsudzuki;
      } catch {}
    };
  }, [grantA]);

  /* ---------- リセット ---------- */
  const newGamePlus = useCallback(() => {
    setChapter(0);
    setInventory([]);
    setEnding(null);
    setFlags((f) => {
      const next = { ...f };
      delete next.escaped;
      // DMの会話は2周目でやり直せる（こな度は引き継ぎ）
      for (const k of Object.keys(next)) if (k.startsWith("dm:")) delete next[k];
      return next;
    });
    setLap((l) => l + 1);
    setStartedAt(Date.now());
    setTab("blog");
    window.scrollTo({ top: 0 });
  }, []);

  const fullReset = useCallback(() => {
    setChapter(0);
    setKona(0);
    konaRef.current = 0;
    setInventory([]);
    setFlags({});
    setAch([]);
    achRef.current = [];
    setEnding(null);
    setLap(1);
    setStartedAt(Date.now());
    setTab("blog");
    try {
      localStorage.removeItem(SAVE);
    } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  if (!loaded) return null;

  /* ---------- 脱出後：リザルト ---------- */
  if (ending && flags.escaped)
    return <Results state={state} onNewGamePlus={newGamePlus} onFullReset={fullReset} />;

  return (
    <div
      className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-4 pb-24 pt-5 lg:max-w-6xl lg:px-8 lg:pb-10"
      style={konamiFx ? { animation: "hueSpin 2.2s linear" } : undefined}
    >
      <style>{`@keyframes hueSpin { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }`}</style>

      {/* ヘッダ（モダンすぎる） */}
      <header className="rounded-3xl border border-line bg-panel/60 p-4 backdrop-blur">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="rounded-full bg-gradient-to-r from-[#3fd6e6]/20 to-[#ff8ac2]/20 px-2 py-0.5 font-black tracking-wider text-accent2">
                livedoor NEXT™ AI Remaster β
              </span>
              <span className="rounded-full bg-danger/15 px-2 py-0.5 font-bold text-danger">
                ⚠ 凍結まで: 未練あと{Math.max(0, 6 - chapter)}
              </span>
            </div>
            <h1 className="mt-1.5 text-lg font-black leading-snug sm:text-xl">
              4g.MiNaMiの気まぐれ日記 <span className="text-brand">: ESCAPE</span>
            </h1>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              — 更新頻度: 約15年に1回 ｜ 現在: 閉じ込められています —
            </div>
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label="効果音の切り替え"
            className="shrink-0 rounded-full border border-line px-2.5 py-1.5 text-xs hover:border-brand"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* 未練の封印 */}
        <div className="mt-3 flex items-center gap-1.5">
          {SEALS.map((s) => {
            const solved = chapter > s.no;
            const current = chapter === s.no;
            return (
              <div
                key={s.no}
                title={s.hint}
                className={`flex h-9 flex-1 items-center justify-center gap-1 rounded-xl border text-sm transition ${
                  solved
                    ? "border-brand/60 bg-brand/15"
                    : current
                      ? "animate-pulse border-gold/60 bg-gold/10"
                      : "border-line bg-black/20 opacity-50"
                }`}
              >
                <span>{solved ? "✅" : s.icon}</span>
                <span className="hidden text-[10px] font-bold sm:inline">{s.title}</span>
              </div>
            );
          })}
          <div
            className="ml-1 shrink-0 text-right font-mono text-sm font-black"
            title={`こな度 ${kona}/${KONA_MAX}`}
          >
            <span className="text-[#ff8ac2]">{KONA_FACES[Math.min(kona, KONA_MAX)]}</span>
          </div>
        </div>
      </header>

      {/* メイン（PC: 2カラム＋常設サイドバー ／ モバイル: タブ切替） */}
      <div className="mt-4 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
        <main className="min-w-0">
          {(isDesktop || tab === "blog") && (
            <BlogViewer state={state} api={api} showMission={!isDesktop} />
          )}
          {!isDesktop && tab === "dm" && <DMWindow state={state} api={api} />}
          {!isDesktop && tab === "items" && <ItemsPanel inventory={inventory} />}
          {!isDesktop && tab === "ach" && <AchPanel ach={ach} />}
        </main>

        {isDesktop && (
          <aside className="sticky top-4 max-h-[calc(100dvh-2rem)] space-y-4 overflow-y-auto pr-1">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-3 text-sm">
              <span className="text-[10px] font-black tracking-widest text-gold">MISSION</span>
              <p className="mt-0.5 font-bold">{objectiveText(chapter)}</p>
            </div>
            <div className="rounded-2xl border border-line bg-panel/60 p-4 backdrop-blur">
              <div className="mb-3 text-[10px] font-black tracking-widest text-muted-foreground">
                💬 DM
              </div>
              <DMWindow state={state} api={api} />
            </div>
            <div>
              <div className="mb-2 text-[10px] font-black tracking-widest text-muted-foreground">
                🎒 持ち物
              </div>
              <ItemsPanel inventory={inventory} />
            </div>
            <AchPanel ach={ach} collapsible />
          </aside>
        )}
      </div>

      {/* フッタ：アクセスカウンター（押せる） */}
      <footer className="mt-8 flex flex-col items-center gap-2 pb-2 text-[11px] text-muted-foreground/60">
        <button
          onClick={() => {
            if (!ach.includes("kiriban")) grantA("kiriban");
          }}
          className="flex items-center gap-1"
          aria-label="アクセスカウンター"
        >
          <span>アクセスカウンター:</span>
          {(ach.includes("kiriban") ? "114515" : "114514").split("").map((d, i) => (
            <span key={i} className="bg-black px-1 font-mono text-sm text-[#33ff66]">
              {d}
            </span>
          ))}
        </button>
        <span>Powered by livedoor NEXT™ AI Remaster β ｜ 思い出は暗号化されていません</span>
      </footer>

      {/* 下部ドック（モバイルのみ。PCはサイドバー常設） */}
      {!isDesktop && (
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-frame/90 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1 px-4 py-2">
          {(
            [
              ["blog", "📰", "記事"],
              ["dm", "💬", "DM"],
              ["items", "🎒", "持ち物"],
              ["ach", "🏆", "実績"],
            ] as const
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => {
                blip();
                setTab(key);
              }}
              className={`relative rounded-xl py-2 text-center text-xs font-bold transition ${
                tab === key ? "bg-brand/15 text-brand" : "text-muted-foreground hover:bg-black/20"
              }`}
            >
              <span className="block text-base">{icon}</span>
              {label}
              {key === "dm" && dmUnread && (
                <span className="absolute right-3 top-1 size-2.5 animate-pulse rounded-full bg-[#ff8ac2]" />
              )}
            </button>
          ))}
        </div>
      </nav>
      )}

      {/* 思い出Cookie同意バナー（モダンすぎる） */}
      {flags.intro && !flags.cookie && (
        <div className="fixed inset-x-0 bottom-16 z-40 px-4 lg:bottom-6">
          <div className="anim-fadeup mx-auto max-w-2xl rounded-2xl border border-line bg-panel p-4 shadow-2xl">
            <p className="text-sm font-bold">🍪 このブログは思い出Cookieを使用します</p>
            <p className="mt-1 text-xs text-muted-foreground">
              あなたの黒歴史体験を向上させるため、2012年の思い出を収集します。
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setFlag("cookie")} className="flex-1 rounded-xl bg-brand py-2 text-sm font-black text-[#062a33]">
                すべて受け入れる
              </button>
              <button onClick={() => setFlag("cookie")} className="flex-1 rounded-xl border border-line py-2 text-sm font-bold">
                すべて受け入れる（同じ）
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 導入 */}
      {!flags.intro && (
        <Intro
          blip={blip}
          onDone={() => {
            setFlag("intro");
            grantA("locked");
          }}
        />
      )}

      {/* エンディング */}
      {ending && !flags.escaped && (
        <EndingScene ending={ending} api={api} onEscape={() => setFlag("escaped")} />
      )}

      {/* トースト */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-5 z-[60] flex justify-center px-4">
          <div className="anim-pop rounded-full border border-brand/50 bg-panel px-5 py-2 text-sm font-bold shadow-[0_0_20px_rgba(63,214,230,0.35)]">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
