"use client";

import { useEffect, useMemo, useState } from "react";
import { CLIPS, LAYERS, CHAPTER1_TARGET, Clip } from "./clips";
import { matches } from "./config";

const T0 = new Date("2011-04-01").getTime();
const T1 = new Date("2026-05-01").getTime();
const pct = (d: string) => ((new Date(d).getTime() - T0) / (T1 - T0)) * 100;
const dateFromPct = (p: number) => new Date(T0 + (p / 100) * (T1 - T0));
const fmtTC = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

const MENUS = ["ファイル", "編集", "コンポジション", "レイヤー", "エフェクト", "アニメーション", "ヘルプ"];
const STORAGE = "readmore.ae.decrypted";

export default function Ae() {
  const [head, setHead] = useState(pct("2011-07-12"));
  const [selId, setSelId] = useState<string>(CHAPTER1_TARGET);
  const [decrypted, setDecrypted] = useState<string[]>([]);
  const [pass, setPass] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // localStorage 復元／保存（初回マウント時の外部ストア同期）
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

  // Decrypt の対象＝選択中のロッククリップ（鍵あり・未復号）
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
    // 近いキーフレームを選択
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

  // こなの案内文
  const konaLine = clearedCh1
    ? CLIPS[CHAPTER1_TARGET].onDecrypt!
    : selId === "first"
      ? "そう、その最初のログは“読める”。連絡先IDを覚えて、革命の日 2011-07-12 のクリップに戻って。"
      : "革命の日(2011-07-12)は暗号化されてる。鍵は、いちばん最初のログ(2011-04-16)で彼が晒した“連絡先ID”。";

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#1a1a1a] text-[13px] text-[#c9c9c9]">
      {/* メニューバー */}
      <div className="flex items-center gap-4 border-b border-[#0d0d0d] bg-[#1b1b1b] px-3 py-1.5">
        <span className="font-bold text-[#9a7bff]">Ae</span>
        <span className="text-[#8a8a8a]">revolution.aep — Adobe After Effects</span>
        <div className="ml-4 hidden gap-4 sm:flex">
          {MENUS.map((m) => (
            <span key={m} className="cursor-default text-[#b4b4b4] hover:text-white">
              {m}
            </span>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-[#8a8a8a]">
          復号 {decrypted.filter((id) => CLIPS[id]?.key).length}/1
        </span>
      </div>

      {/* 上段：3パネル */}
      <div className="grid min-h-0 flex-1 grid-cols-[170px_1fr_220px]">
        {/* Project */}
        <div className="min-h-0 overflow-y-auto border-r border-[#0d0d0d] bg-[#232323] p-2">
          <div className="mb-2 rounded bg-[#2c2c2c] px-2 py-1 text-[11px] text-[#8a8a8a]">
            プロジェクト
          </div>
          <ul className="space-y-0.5 text-[12px]">
            <li className="text-[#8a8a8a]">📁 footage</li>
            {Object.values(CLIPS).map((c) => (
              <li
                key={c.id}
                onClick={() => selectClip(c.id)}
                className={`cursor-default truncate rounded px-1 ${
                  selId === c.id ? "bg-[#38445a] text-white" : "hover:bg-[#2c2c2c]"
                }`}
                title={c.label}
              >
                {"  "}
                {isRevealed(c) ? "🎬" : "🔒"} {c.date}.mp4
              </li>
            ))}
          </ul>
        </div>

        {/* Composition プレビュー */}
        <div className="flex min-h-0 flex-col bg-[#1a1a1a]">
          <div className="flex items-center gap-3 border-b border-[#0d0d0d] bg-[#232323] px-3 py-1 text-[11px] text-[#8a8a8a]">
            <span className="text-[#c9c9c9]">コンポジション: revolution</span>
            <span>100%</span>
            <span className="ml-auto tabular-nums text-[#46e0ff]">{fmtTC(headDate)}</span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            <div className="relative aspect-video w-full max-w-[540px] overflow-hidden rounded-sm border border-black bg-black">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 30%, rgba(90,60,150,0.45), rgba(0,0,0,0.92))",
                }}
              />
              <div className="absolute inset-4 border border-white/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                {selClip && isRevealed(selClip) ? (
                  <div className="anim-fadeup">
                    <div className="text-[11px] tracking-[0.3em] text-[#46e0ff]">
                      {selClip.caption.small}
                    </div>
                    <div className="mt-2 text-2xl font-black text-white drop-shadow sm:text-3xl">
                      {selClip.caption.big}
                    </div>
                    {selClip.caption.sub && (
                      <div className="mt-2 text-xs text-[#b6a6e6]">{selClip.caption.sub}</div>
                    )}
                    {selClip.caption.lines && (
                      <div className="mt-4 space-y-1 text-sm text-white/85">
                        {selClip.caption.lines.map((l, i) => (
                          <div key={i}>{l}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="anim-fadeup">
                    <div className="text-[11px] tracking-[0.3em] text-[#8a8a8a]">
                      {selClip?.caption.small}
                    </div>
                    <div className="mt-3 font-mono text-3xl text-[#e0574a]">🔒 ENCRYPTED</div>
                    <div className="mt-2 select-none font-mono text-xs text-[#5a5a5a]">
                      ▓▓▒▓░▒▓▓░▓▒▓░▒▓▓▒░▓▓░▒▓
                    </div>
                    <div className="mt-3 text-xs text-[#8a8a8a]">
                      → 右の Decrypt にパスフレーズを入力
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/50 px-3 py-1.5 text-[11px] text-white/80">
                <span>▶</span>
                <div className="h-1 flex-1 rounded bg-white/20">
                  <div className="h-1 rounded bg-[#46e0ff]" style={{ width: `${head}%` }} />
                </div>
                <span className="tabular-nums">{fmtTC(headDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Effect Controls */}
        <div className="min-h-0 overflow-y-auto border-l border-[#0d0d0d] bg-[#232323] p-2">
          <div className="mb-2 rounded bg-[#2c2c2c] px-2 py-1 text-[11px] text-[#8a8a8a]">
            エフェクトコントロール: {selClip?.date}.mp4
          </div>
          <div className="space-y-2 text-[12px]">
            <PropRow label="不透明度" value="100%" />
            <PropRow label="位置" value="960, 540" />
            <div className="mt-2 rounded border border-[#3a3a3a] bg-[#1e1e1e] p-2">
              <div className="mb-2 text-[11px] text-[#ffcf5a]">fx ▸ Decrypt (復号)</div>
              {clearedCh1 && selId === CHAPTER1_TARGET ? (
                <div className="text-[12px] text-[#46f08a]">✓ 復号済み</div>
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
                    className="w-full rounded border bg-[#111] px-2 py-1 font-mono text-[13px] text-[#d6d6d6] outline-none"
                    style={{
                      borderColor: wrong ? "#e0574a" : "#3a3a3a",
                      animation: wrong ? "shake 0.4s" : undefined,
                    }}
                  />
                  <button
                    onClick={submit}
                    className="mt-2 w-full rounded bg-[#3b6db0] py-1 text-[12px] font-semibold text-white hover:bg-[#4a80c8]"
                  >
                    復号する
                  </button>
                  {wrong && (
                    <p className="mt-1 text-[11px] text-[#e0574a]">
                      その鍵じゃ開かない。最初のログをもう一度。
                    </p>
                  )}
                </>
              ) : (
                <div className="text-[11px] text-[#8a8a8a]">
                  {selClip && isRevealed(selClip)
                    ? "このクリップは復号済み／読み取り可能。"
                    : "このクリップの復号手段は、次の章で解放。"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 下段：タイムライン */}
      <div className="flex h-[38%] min-h-0 flex-col border-t border-[#0d0d0d] bg-[#1e1e1e]">
        <div className="flex items-center gap-2 border-b border-[#0d0d0d] bg-[#232323] px-3 py-1.5 text-[11px]">
          <span className="shrink-0 text-[#ff6bd6]">こな@skype »</span>
          <span className="truncate text-[#d0d0d0]">{konaLine}</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[160px_1fr]">
          {/* レイヤー名 */}
          <div className="border-r border-[#0d0d0d] bg-[#232323] text-[12px]">
            <div className="h-7 border-b border-[#0d0d0d]" />
            {LAYERS.map((l) => (
              <div
                key={l.name}
                className="flex h-9 items-center gap-2 border-b border-[#2a2a2a] px-2 text-[#c0c0c0]"
              >
                <span className="inline-block size-2 rounded-sm" style={{ background: l.color }} />
                <span className="truncate">{l.name}</span>
              </div>
            ))}
          </div>

          {/* グラフ */}
          <div className="relative min-h-0 overflow-hidden">
            <div
              className="relative h-7 cursor-pointer border-b border-[#0d0d0d] bg-[#262626]"
              onClick={onRuler}
              title="クリックでプレイヘッド移動"
            >
              {[2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025].map((y) => (
                <div
                  key={y}
                  className="absolute top-0 h-full border-l border-[#3a3a3a] pl-1 text-[10px] text-[#8a8a8a]"
                  style={{ left: `${pct(`${y}-01-01`)}%` }}
                >
                  {y}
                </div>
              ))}
            </div>

            {LAYERS.map((l) => (
              <div key={l.name} className="relative h-9 border-b border-[#2a2a2a]">
                {l.clipIds.map((id) => {
                  const c = CLIPS[id];
                  const revealed = isRevealed(c);
                  const isSel = selId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => selectClip(id)}
                      title={`${c.date}　${c.label}`}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${pct(c.date)}%` }}
                    >
                      <span
                        className="block size-3 rotate-45 border transition"
                        style={{
                          background: revealed ? l.color : "transparent",
                          borderColor: l.color,
                          boxShadow: isSel ? `0 0 8px ${l.color}` : "none",
                          opacity: revealed ? 1 : 0.55,
                        }}
                      />
                      {!revealed && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px]">
                          🔒
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* プレイヘッド */}
            <div className="pointer-events-none absolute top-0 z-10 h-full" style={{ left: `${head}%` }}>
              <div className="mx-auto h-full w-px bg-[#46e0ff]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#46e0ff]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#a0a0a0]">{label}</span>
      <span className="tabular-nums text-[#d6d6d6]">{value}</span>
    </div>
  );
}
