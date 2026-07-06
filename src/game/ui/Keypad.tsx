"use client";

import { useState } from "react";
import { useGame } from "../state";
import { DOOR_CODE } from "../items";

export default function Keypad() {
  const { dispatch, state } = useGame();
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong">("idle");
  const hintReady =
    state.flags.curtainOpen &&
    state.flags.shelfChecked &&
    state.flags.usbInserted &&
    state.flags.posterPeeled;

  const press = (d: string) => {
    if (entry.length >= 4) return;
    setStatus("idle");
    setEntry((e) => e + d);
  };
  const clear = () => {
    setStatus("idle");
    setEntry("");
  };
  const submit = () => {
    if (entry === DOOR_CODE) {
      dispatch({ type: "ESCAPE" });
    } else {
      setStatus("wrong");
      setTimeout(() => setEntry(""), 600);
    }
  };

  const display = (entry + "----".slice(entry.length)).split("");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="anim-fade w-full max-w-sm rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <div className="mb-1 text-center text-sm text-muted">ドアのデジタルロック</div>
        <div className="mb-5 text-center text-xs text-muted/70">
          4桁の暗証番号を入力
        </div>

        <div
          className={`mb-5 flex justify-center gap-2 ${
            status === "wrong" ? "animate-[shake_0.4s]" : ""
          }`}
          style={
            status === "wrong"
              ? { animation: "shake 0.4s" }
              : undefined
          }
        >
          {display.map((c, i) => (
            <div
              key={i}
              className="flex h-16 w-12 items-center justify-center rounded-lg border bg-[#04121a] font-mono text-3xl"
              style={{
                borderColor: status === "wrong" ? "var(--danger)" : "var(--line)",
                color: status === "wrong" ? "var(--danger)" : "var(--neon2)",
              }}
            >
              {c === "-" ? "" : c}
            </div>
          ))}
        </div>

        {status === "wrong" && (
          <div className="mb-3 text-center text-sm" style={{ color: "var(--danger)" }}>
            違う。ロックは固く沈黙している。
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <button
              key={n}
              onClick={() => press(n)}
              className="rounded-lg border border-line bg-panel-2 py-4 text-xl font-semibold text-text transition hover:border-neon hover:text-neon active:scale-95"
              style={{ backgroundColor: "var(--panel-2)" }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={clear}
            className="rounded-lg border border-line py-4 text-sm text-muted transition hover:border-danger hover:text-[var(--danger)] active:scale-95"
          >
            CLR
          </button>
          <button
            onClick={() => press("0")}
            className="rounded-lg border border-line bg-panel-2 py-4 text-xl font-semibold text-text transition hover:border-neon hover:text-neon active:scale-95"
            style={{ backgroundColor: "var(--panel-2)" }}
          >
            0
          </button>
          <button
            onClick={submit}
            className="rounded-lg py-4 text-sm font-bold text-black transition active:scale-95"
            style={{ background: "var(--neon2)" }}
          >
            ENTER
          </button>
        </div>

        {!hintReady && (
          <p className="mt-4 text-center text-xs text-muted/70">
            ……まだ、揃っていない数字がある気がする。
          </p>
        )}

        <button
          onClick={() => dispatch({ type: "CLOSE_PUZZLE" })}
          className="mt-4 w-full rounded-lg border border-line py-2 text-sm text-muted transition hover:text-text"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
