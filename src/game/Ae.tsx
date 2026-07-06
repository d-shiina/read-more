"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CLIPS, LAYERS, CHAPTER1_TARGET, Clip } from "./clips";
import { matches } from "./config";

const T0 = new Date("2011-04-01").getTime();
const T1 = new Date("2026-05-01").getTime();
const pct = (d: string) => ((new Date(d).getTime() - T0) / (T1 - T0)) * 100;
const dateFromPct = (p: number) => new Date(T0 + (p / 100) * (T1 - T0));
const fmtTC = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

const MENUS = ["ファイル", "コンポジション", "エフェクト", "ヘルプ"];
const STORAGE = "readmore.ae.decrypted";

export default function Ae() {
  const [head, setHead] = useState(pct("2011-07-12"));
  const [selId, setSelId] = useState<string>(CHAPTER1_TARGET);
  const [decrypted, setDecrypted] = useState<string[]>([]);
  const [pass, setPass] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      setDecrypted(raw ? JSON.parse(raw) : []);
    } catch {}
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(decrypted));
    } catch {}
  }, [decrypted, hydrated]);

  const isDecrypted = (id: string) => decrypted.includes(id);
  const isRevealed = (c: Clip) => !c.locked || isDecrypted(c.id);

  const selClip = CLIPS[selId];
  const headDate = useMemo(() => dateFromPct(head), [head]);
  const target =
    selClip && selClip.locked && !isDecrypted(selClip.id) && selClip.key ? selClip : null;
  const clearedCh1 = isDecrypted(CHAPTER1_TARGET);

  const selectClip = (id: string) => {
    setSelId(id);
    setHead(pct(CLIPS[id].date));
    setWrong(false);
  };
  const onRuler = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setHead(p);
    let best = selId;
    let bd = Infinity;
    for (const id in CLIPS) {
      const d = Math.abs(pct(CLIPS[id].date) - p);
      if (d < bd) {
        bd = d;
        best = id;
      }
    }
    if (bd < 2) setSelId(best);
  };
  const submit = () => {
    if (target && matches(pass, target.key!)) {
      setDecrypted((d) => (d.includes(target.id) ? d : [...d, target.id]));
      setPass("");
      setWrong(false);
    } else {
      setWrong(true);
    }
  };

  const konaLine = clearedCh1
    ? CLIPS[CHAPTER1_TARGET].onDecrypt!
    : selId === "first"
      ? "そう、その最初のログは“読める”。連絡先IDを覚えて、革命の日 2011-07-12 に戻って！"
      : "革命の日(2011-07-12)は暗号化されてる。鍵は、いちばん最初のログ(2011-04-16)で彼が晒した“連絡先ID”だよ。";

  const panel = "rounded-lg border border-line bg-panel/80 shadow-[0_2px_10px_rgba(0,0,0,0.4)]";
  const chip = "rounded-md px-2.5 py-1 text-xs font-bold tracking-wider";

  return (
    <div className="flex h-[100dvh] w-full flex-col gap-2 overflow-hidden bg-[#0d0a16] p-2 text-text sm:p-3">
      {/* ===== メニューバー（チャンキー） ===== */}
      <div className={`${panel} flex items-center gap-3 px-3 py-2`}>
        <span className="flex size-9 items-center justify-center rounded-md bg-[#2b3550] text-lg font-black text-[#9fb6e6] ring-1 ring-[#3a4560]">
          Ae
        </span>
        <span className="text-base font-black text-brand">revolution<span className="text-muted-foreground">.aep</span></span>
        <div className="ml-2 hidden gap-1 sm:flex">
          {MENUS.map((m) => (
            <span key={m} className="cursor-default rounded-lg px-2.5 py-1 text-sm text-muted-foreground hover:bg-white/5 hover:text-text">
              {m}
            </span>
          ))}
        </div>
        <span className={`${chip} ml-auto bg-white/5 text-accent2`}>
          復号 {decrypted.filter((id) => CLIPS[id]?.key).length} / 1
        </span>
      </div>

      {/* ===== 上段：3パネル ===== */}
      <div className="grid min-h-0 flex-1 grid-cols-[190px_1fr_240px] gap-2">
        {/* Project */}
        <div className={`${panel} flex min-h-0 flex-col overflow-hidden`}>
          <div className={`${chip} m-2 self-start bg-white/5 text-muted-foreground`}>PROJECT</div>
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-2 text-sm">
            {Object.values(CLIPS).map((c) => {
              const rv = isRevealed(c);
              const sel = selId === c.id;
              return (
                <li
                  key={c.id}
                  onClick={() => selectClip(c.id)}
                  title={c.label}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 transition ${
                    sel
                      ? "border-brand bg-brand/10 shadow-[0_0_10px_rgba(63,214,230,0.25)]"
                      : "border-transparent hover:border-line hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{rv ? "🎬" : "🔒"}</span>
                  <span className={`truncate ${rv ? "text-text" : "text-muted-foreground"}`}>
                    {c.date}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Composition プレビュー */}
        <div className={`${panel} flex min-h-0 flex-col overflow-hidden`}>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className={`${chip} bg-white/5 text-muted-foreground`}>COMP ▸ revolution</div>
            <span className="ml-auto rounded-lg bg-black/40 px-2 py-1 font-mono text-sm font-bold tabular-nums text-accent2">
              {fmtTC(headDate)}
            </span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-3">
            <div className="relative aspect-video w-full max-w-[560px] overflow-hidden rounded-md border-2 border-black bg-black shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(120% 90% at 50% 28%, rgba(56,110,150,0.42), rgba(0,0,0,0.94))" }}
              />
              <div className="absolute inset-5 rounded-lg border border-white/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                {selClip && isRevealed(selClip) ? (
                  <div className="anim-pop">
                    <div className="text-xs font-bold tracking-[0.35em] text-accent2">
                      {selClip.caption.small}
                    </div>
                    <div className="mt-3 text-3xl font-black text-white drop-shadow-[0_2px_12px_rgba(63,214,230,0.4)] sm:text-4xl">
                      {selClip.caption.big}
                    </div>
                    {selClip.caption.sub && (
                      <div className="mt-3 text-sm text-[#a9c4dd]">{selClip.caption.sub}</div>
                    )}
                    {selClip.caption.lines && (
                      <div className="mt-4 space-y-1.5 text-[15px] text-white/90">
                        {selClip.caption.lines.map((l, i) => (
                          <div key={i}>{l}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="anim-pop">
                    <div className="text-xs font-bold tracking-[0.35em] text-muted-foreground">
                      {selClip?.caption.small}
                    </div>
                    <div
                      className="mt-3 font-mono text-4xl font-black text-danger"
                      style={{ animation: "blink 1.4s infinite" }}
                    >
                      🔒 LOCKED
                    </div>
                    <div className="mt-3 select-none font-mono text-sm text-white/25">
                      ▓▓▒▓░▒▓▓░▓▒▓░▒▓▓▒░▓▓
                    </div>
                    <div className="mt-4 rounded-md bg-brand/15 px-4 py-1.5 text-sm font-bold text-brand">
                      → 右の DECRYPT で復号せよ
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/60 px-3 py-2 text-sm text-white/85">
                <span>▶</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-accent2" style={{ width: `${head}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Effect Controls ▸ DECRYPT */}
        <div className={`${panel} flex min-h-0 flex-col overflow-hidden`}>
          <div className={`${chip} m-2 self-start bg-white/5 text-muted-foreground`}>EFFECTS</div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3 text-sm">
            <PropRow label="不透明度" value="100%" />
            <PropRow label="位置" value="960, 540" />

            <div className="rounded-md border border-gold/30 bg-black/25 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
                <span>🔓</span> DECRYPT / 復号
              </div>
              {clearedCh1 && selId === CHAPTER1_TARGET ? (
                <div className="rounded-md bg-[#16301f] px-3 py-2 text-center text-sm font-bold text-[#5fd39a]">
                  ✓ 復号済み
                </div>
              ) : target ? (
                <>
                  <input
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value);
                      setWrong(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="パスフレーズ"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-md border bg-black/50 px-3 py-2.5 font-mono text-base font-bold text-text outline-none"
                    style={{
                      borderColor: wrong ? "var(--danger)" : "var(--line)",
                      animation: wrong ? "shake 0.4s" : undefined,
                    }}
                  />
                  <button
                    onClick={submit}
                    className="mt-2 w-full rounded-md bg-[#1fa6bd] py-2.5 text-base font-bold text-white shadow-[0_0_14px_rgba(63,214,230,0.3)] transition hover:bg-[#29bdd4] active:translate-y-px"
                  >
                    復号する
                  </button>
                  {wrong && (
                    <p className="mt-2 text-xs font-bold text-danger">
                      ✗ その鍵じゃ開かない。最初のログをもう一度。
                    </p>
                  )}
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {selClip && isRevealed(selClip)
                    ? "このクリップは復号済み。"
                    : "このクリップの鍵は、次の章で解放。"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== こな（大きめ吹き出し） ===== */}
      <div className={`${panel} flex items-center gap-3 px-3 py-2`}>
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#cf8fb0]">
          <Image src="/images/chars/kona.svg" alt="こな" fill sizes="44px" className="object-cover" />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#cf8fb0]">こな</div>
          <div className="truncate text-sm text-text">{konaLine}</div>
        </div>
      </div>

      {/* ===== タイムライン（チャンキー） ===== */}
      <div className={`${panel} flex h-[34%] min-h-0 flex-col overflow-hidden`}>
        <div className="grid min-h-0 flex-1 grid-cols-[150px_1fr]">
          {/* レイヤー名 */}
          <div className="border-r-2 border-line">
            <div className="flex h-8 items-center px-3">
              <span className={`${chip} bg-white/5 text-muted-foreground`}>TIMELINE</span>
            </div>
            {LAYERS.map((l) => (
              <div
                key={l.name}
                className="flex h-11 items-center gap-2 border-t-2 border-line/60 px-3 text-sm font-bold"
              >
                <span className="inline-block size-3 rounded" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                <span className="truncate text-text">{l.name}</span>
              </div>
            ))}
          </div>

          {/* グラフ */}
          <div className="relative min-h-0 overflow-hidden">
            {/* ルーラー */}
            <div
              className="relative h-8 cursor-pointer border-b-2 border-line bg-black/20"
              onClick={onRuler}
              title="クリックでプレイヘッド移動"
            >
              {[2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025].map((y) => (
                <div
                  key={y}
                  className="absolute top-0 flex h-full items-center border-l border-line/60 pl-1 text-[11px] font-bold text-muted-foreground"
                  style={{ left: `${pct(`${y}-01-01`)}%` }}
                >
                  {y}
                </div>
              ))}
            </div>

            {LAYERS.map((l) => (
              <div key={l.name} className="relative h-11 border-t-2 border-line/40">
                {l.clipIds.map((id) => {
                  const c = CLIPS[id];
                  const rv = isRevealed(c);
                  const sel = selId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => selectClip(id)}
                      title={`${c.date}　${c.label}`}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition hover:scale-125"
                      style={{ left: `${pct(c.date)}%` }}
                    >
                      <span
                        className={`block size-4 rotate-45 rounded-[3px] border-2 ${rv ? "anim-pop" : ""}`}
                        style={{
                          background: rv ? l.color : "transparent",
                          borderColor: l.color,
                          boxShadow: sel || rv ? `0 0 12px ${l.color}` : "none",
                          opacity: rv ? 1 : 0.6,
                        }}
                      />
                      {!rv && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px]">🔒</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* プレイヘッド（ノブつき） */}
            <div className="pointer-events-none absolute top-0 z-10 h-full" style={{ left: `${head}%` }}>
              <div className="mx-auto h-full w-0.5 bg-accent2 shadow-[0_0_8px_rgba(90,209,230,0.5)]" />
              <div className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-0 rounded-b-sm bg-accent2 shadow-[0_0_8px_rgba(90,209,230,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-bold tabular-nums text-text">{value}</span>
    </div>
  );
}
