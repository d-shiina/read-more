"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGame } from "../store";

/** ADV風の会話ウィンドウ（タイプライター＋クリックで送り） */
export default function DialogueBox() {
  const { state, dispatch } = useGame();
  const line = state.dialogue[state.dialogueIndex];
  const [shown, setShown] = useState("");
  const [typing, setTyping] = useState(false);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!line) return;
    // 会話行が変わるたびにタイプライターを初期化して再生（外部のsetIntervalを駆動する副作用）
    /* eslint-disable react-hooks/set-state-in-effect */
    setShown("");
    setTyping(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    let i = 0;
    raf.current = setInterval(() => {
      i++;
      setShown(line.text.slice(0, i));
      if (i >= line.text.length) {
        if (raf.current) clearInterval(raf.current);
        setTyping(false);
      }
    }, 28);
    return () => {
      if (raf.current) clearInterval(raf.current);
    };
  }, [line]);

  if (!line) return null;

  const onClick = () => {
    if (typing) {
      if (raf.current) clearInterval(raf.current);
      setShown(line.text);
      setTyping(false);
    } else {
      dispatch({ type: "ADVANCE" });
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-5">
      <button
        onClick={onClick}
        className="anim-fadeup pointer-events-auto block w-full cursor-pointer text-left"
        aria-label="会話を進める"
      >
        {line.speaker && (
          <div className="mb-[-10px] ml-2 inline-flex items-center gap-2">
            {line.portrait && (
              <span className="relative inline-block size-9 overflow-hidden rounded-full ring-2 ring-brand">
                <Image src={line.portrait} alt={line.speaker} fill className="object-cover" />
              </span>
            )}
            <span className="rounded-md bg-brand px-3 py-1 text-sm font-bold text-white shadow">
              {line.speaker}
            </span>
          </div>
        )}
        <div className="rounded-xl border border-border bg-card/95 px-5 py-4 shadow-2xl backdrop-blur">
          <p className="min-h-[3.5em] text-[15px] leading-relaxed text-foreground sm:text-base">
            {shown}
            {typing && <span className="ml-0.5 animate-pulse">▍</span>}
          </p>
          {!typing && (
            <div className="mt-1 text-right text-xs text-muted-foreground">
              ▼ クリックで進む
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
