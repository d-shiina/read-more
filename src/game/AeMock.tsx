"use client";

import { useMemo, useState } from "react";

/* ===== 期間（2011-04 → 2026-05）でタイムライン位置を計算 ===== */
const T0 = new Date("2011-04-01").getTime();
const T1 = new Date("2026-05-01").getTime();
const pct = (d: string) => ((new Date(d).getTime() - T0) / (T1 - T0)) * 100;
const dateFromPct = (p: number) => new Date(T0 + (p / 100) * (T1 - T0));

interface Key {
  date: string;
  label: string;
  locked?: boolean;
  big?: boolean;
}
interface Layer {
  name: string;
  color: string;
  keys: Key[];
}

const LAYERS: Layer[] = [
  {
    name: "革命 / 編集",
    color: "#b46bff",
    keys: [
      { date: "2011-07-12", label: "AfterEffect を知る＝革命", big: true },
      { date: "2012-03-06", label: "動画を取り入れたい" },
      { date: "2013-12-25", label: "新PC / GTX 780 Ti" },
    ],
  },
  {
    name: "こな",
    color: "#ff6bd6",
    keys: [
      { date: "2011-07-22", label: "コメント：また一緒にやろや" },
      { date: "2026-04-15", label: "？？？", locked: true },
    ],
  },
  {
    name: "AVA / FPS",
    color: "#46e0ff",
    keys: [
      { date: "2011-04-16", label: "記念すべき1回目 / 4gotten" },
      { date: "2011-07-14", label: "CS:S のお誘い" },
      { date: "2011-07-18", label: "オフ会（カラオケ）" },
      { date: "2011-08-02", label: "Season4 / Dランカーへ" },
      { date: "2012-03-05", label: "SuddenAttack 復帰" },
    ],
  },
  {
    name: "フラグムービー",
    color: "#ffcf5a",
    keys: [
      { date: "2011-07-12", label: "Joka に憧れて…" },
      { date: "2026-04-15", label: "完成？", locked: true },
    ],
  },
];

const MENUS = ["ファイル", "編集", "コンポジション", "レイヤー", "エフェクト", "アニメーション", "ヘルプ"];

function fmtTC(d: Date) {
  // それっぽいタイムコード（年を秒に見立てる遊び）
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}.${mo}.${da}`;
}

export default function AeMock() {
  const [head, setHead] = useState(pct("2011-07-12"));
  const [sel, setSel] = useState<string>("革命.mp4");

  const headDate = useMemo(() => dateFromPct(head), [head]);
  const nearKakumei = Math.abs(head - pct("2011-07-12")) < 1.2;

  const onRuler = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = ((e.clientX - r.left) / r.width) * 100;
    setHead(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#1a1a1a] text-[#c9c9c9]">
      {/* ===== メニューバー ===== */}
      <div className="flex items-center gap-4 border-b border-[#0d0d0d] bg-[#1b1b1b] px-3 py-1.5 text-[12px] text-[#c9c9c9]">
        <span className="font-semibold text-[#9a7bff]">Ae</span>
        <span className="text-[#8a8a8a]">revolution.aep — Adobe After Effects</span>
        <div className="ml-4 hidden gap-4 sm:flex">
          {MENUS.map((m) => (
            <span key={m} className="cursor-default text-[#b4b4b4] hover:text-white">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ===== 上段：3パネル ===== */}
      <div className="grid min-h-0 flex-1 grid-cols-[180px_1fr_210px]">
        {/* Project パネル */}
        <div className="min-h-0 overflow-y-auto border-r border-[#0d0d0d] bg-[#232323] p-2 text-[12px] text-[#c0c0c0]">
          <div className="mb-2 rounded bg-[#2c2c2c] px-2 py-1 text-[11px] text-[#8a8a8a]">
            プロジェクト
          </div>
          <ul className="space-y-0.5">
            {[
              "📁 footage",
              "  🎬 革命.mp4",
              "  🎬 ava_montage.mp4",
              "  🎬 offkai.mp4",
              "📁 audio",
              "  🎵 こな_voice.wav",
              "  🎵 bgm_2011.mp3",
              "🧩 comp / revolution",
            ].map((f) => {
              const name = f.trim().replace(/^[^\wぁ-ん一-龯]+/, "");
              const active = name === sel;
              return (
                <li
                  key={f}
                  onClick={() => f.includes(".mp4") && setSel(name)}
                  className={`cursor-default whitespace-pre rounded px-1 ${
                    active ? "bg-[#38445a] text-white" : "hover:bg-[#2c2c2c]"
                  }`}
                >
                  {f}
                </li>
              );
            })}
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
            {/* フラグムービーの1フレーム風プレビュー */}
            <div className="relative aspect-video w-full max-w-[520px] overflow-hidden rounded-sm border border-[#000] bg-black shadow-inner">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 30%, rgba(90,60,150,0.5), rgba(0,0,0,0.9))",
                }}
              />
              {/* セーフフレーム */}
              <div className="absolute inset-4 border border-white/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                {nearKakumei ? (
                  <>
                    <div className="text-[11px] tracking-[0.3em] text-[#46e0ff]">2011.07.12</div>
                    <div className="mt-2 text-2xl font-black text-white drop-shadow sm:text-3xl">
                      自分の中で、革命が起こった
                    </div>
                    <div className="mt-2 text-xs text-[#b6a6e6]">
                      — After Effect と出会った日 —
                    </div>
                  </>
                ) : (
                  <div className="text-lg text-white/70">{fmtTC(headDate)} のクリップ</div>
                )}
              </div>
              {/* 再生バー */}
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

        {/* Effect Controls パネル */}
        <div className="min-h-0 overflow-y-auto border-l border-[#0d0d0d] bg-[#232323] p-2 text-[12px] text-[#c0c0c0]">
          <div className="mb-2 rounded bg-[#2c2c2c] px-2 py-1 text-[11px] text-[#8a8a8a]">
            エフェクトコントロール: {sel}
          </div>
          <div className="space-y-2">
            <PropRow label="不透明度" value="100%" />
            <PropRow label="位置" value="960, 540" />
            <PropRow label="スケール" value="100%" />
            <div className="mt-3 rounded border border-[#3a3a3a] bg-[#1e1e1e] p-2">
              <div className="mb-1 text-[11px] text-[#ffcf5a]">fx ▸ Decrypt (復号)</div>
              <PropRow label="パスフレーズ" value="＿＿＿＿" locked />
              <div className="mt-1 text-[10px] text-[#8a8a8a]">
                鍵は別のクリップに隠れている…
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 下段：タイムライン ===== */}
      <div className="h-[38%] min-h-0 border-t border-[#0d0d0d] bg-[#1e1e1e]">
        {/* こなの吹き出し（マーカー説明） */}
        <div className="flex items-center gap-2 border-b border-[#0d0d0d] bg-[#232323] px-3 py-1 text-[11px]">
          <span className="text-[#ff6bd6]">こな@skype »</span>
          <span className="text-[#c0c0c0]">
            この“人生のコンポ”、まだ途中でしょ。プレイヘッドを動かして、鍵を探そ？
          </span>
        </div>

        <div className="grid h-[calc(100%-26px)] grid-cols-[160px_1fr]">
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

          {/* タイムグラフ */}
          <div className="relative min-h-0 overflow-hidden">
            {/* ルーラー（年） */}
            <div
              className="relative h-7 cursor-pointer border-b border-[#0d0d0d] bg-[#262626]"
              onClick={onRuler}
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

            {/* レイヤー行＋キーフレーム */}
            {LAYERS.map((l) => (
              <div key={l.name} className="relative h-9 border-b border-[#2a2a2a]">
                {l.keys.map((k, i) => (
                  <button
                    key={i}
                    onClick={() => setHead(pct(k.date))}
                    title={`${k.date}　${k.label}`}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pct(k.date)}%` }}
                  >
                    <span
                      className="block size-3 rotate-45 border"
                      style={{
                        background: k.locked ? "transparent" : l.color,
                        borderColor: l.color,
                        boxShadow: k.big ? `0 0 8px ${l.color}` : "none",
                        opacity: k.locked ? 0.5 : 1,
                      }}
                    />
                    {k.locked && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px]">🔒</span>
                    )}
                  </button>
                ))}
              </div>
            ))}

            {/* プレイヘッド */}
            <div
              className="pointer-events-none absolute top-0 z-10 h-full"
              style={{ left: `${head}%` }}
            >
              <div className="mx-auto h-full w-px bg-[#46e0ff]" />
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#46e0ff]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropRow({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#a0a0a0]">{label}</span>
      <span className={`tabular-nums ${locked ? "text-[#ffcf5a]" : "text-[#d6d6d6]"}`}>
        {value}
      </span>
    </div>
  );
}
