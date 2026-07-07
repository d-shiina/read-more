"use client";

import type { GameApi, GameState } from "./types";
import { DM_SCRIPT, KONA_FACES, KONA_MAX, type DmExchange } from "./data";

interface DP {
  state: GameState;
  api: GameApi;
}

function KonaLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ff8ac2]/20 text-sm">
        🍮
      </span>
      <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-panel2 px-3 py-2 text-sm leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function MyLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand/20 px-3 py-2 text-sm leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Exchange({ ex, state, api }: DP & { ex: DmExchange }) {
  const answered = state.flags[`dm:${ex.id}`];
  const chosen = ex.choices?.findIndex((_, i) => state.flags[`dm:${ex.id}:${i}`]) ?? -1;

  return (
    <div className="space-y-2">
      {ex.lines.map((l, i) => (
        <KonaLine key={i}>{l}</KonaLine>
      ))}
      {ex.choices && !answered && (
        <div className="space-y-2 pt-1">
          {ex.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                api.setFlag(`dm:${ex.id}`);
                api.setFlag(`dm:${ex.id}:${i}`);
                if (c.kona > 0) api.addKona(c.kona);
                api.ping();
              }}
              className="block w-full rounded-xl border border-brand/40 bg-brand/5 px-3 py-2 text-left text-sm font-bold transition hover:bg-brand/15"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      {ex.choices && answered && chosen >= 0 && (
        <>
          <MyLine>{ex.choices[chosen].label}</MyLine>
          <KonaLine>{ex.choices[chosen].reply}</KonaLine>
          {ex.after && (
            <p className="px-2 text-xs text-muted-foreground">{ex.after}</p>
          )}
        </>
      )}
    </div>
  );
}

export default function DMWindow({ state, api }: DP) {
  const visible = DM_SCRIPT.filter(
    (ex) => ex.minChapter <= state.chapter && (!ex.requiresFlag || state.flags[ex.requiresFlag]),
  );

  return (
    <div className="anim-fadeup">
      {/* こな度メーター */}
      <div className="flex items-center justify-between rounded-2xl border border-[#ff8ac2]/30 bg-[#ff8ac2]/5 p-3">
        <div>
          <div className="text-[10px] font-black tracking-widest text-[#ff8ac2]">こな度</div>
          <div className="mt-0.5 font-mono text-lg font-black">
            {KONA_FACES[Math.min(state.kona, KONA_MAX)]}
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: KONA_MAX }).map((_, i) => (
            <span key={i} className={`text-lg ${i < state.kona ? "" : "opacity-20 grayscale"}`}>
              💗
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-4 text-center text-sm text-muted-foreground">
            まだDMは届いていない。……まずは本人確認から。
          </p>
        )}
        {visible.map((ex) => (
          <Exchange key={ex.id} ex={ex} state={state} api={api} />
        ))}
      </div>

      {visible.length > 0 && (
        <p className="mt-5 text-center text-[11px] text-muted-foreground/60">
          こな 🍮 — オンライン ｜ 既読は、つく。
        </p>
      )}
    </div>
  );
}
