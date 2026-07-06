"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "../store";
import { ASSETS } from "../assets";
import { matches } from "../config";
import type { Article } from "../blog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function KonaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="relative mt-0.5 inline-block size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-brand">
        <Image src={ASSETS.chars.kona} alt="こな" fill className="object-cover" />
      </span>
      <div className="min-w-0">
        <div className="mb-1 text-xs font-bold text-brand">こな</div>
        <div className="rounded-xl rounded-tl-none border border-border bg-panel px-4 py-3 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RiddleBox({ article }: { article: Article }) {
  const { dispatch, isSolved } = useGame();
  const solved = isSolved(article.id);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (matches(value, article.riddle.answer)) {
      dispatch({ type: "SOLVE", id: article.id });
      setWrong(false);
      setValue("");
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="mb-3 text-[11px] font-semibold tracking-widest text-muted-foreground">
        COMMENT ／ コメント
      </div>

      <div className="flex flex-col gap-4">
        <KonaBubble>
          <p>{article.riddle.comment}</p>
          <p className="mt-2 font-semibold text-foreground">Q. {article.riddle.question}</p>
          {article.riddle.hint && (
            <p className="mt-1 text-xs text-muted-foreground">ヒント：{article.riddle.hint}</p>
          )}
        </KonaBubble>

        {!solved ? (
          <div className="ml-12">
            <div
              className="flex gap-2"
              style={wrong ? { animation: "shake 0.4s" } : undefined}
            >
              <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setWrong(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="こたえを入力"
                autoComplete="off"
                spellCheck={false}
                className={wrong ? "border-danger" : ""}
              />
              <Button onClick={submit} className="bg-brand text-white hover:bg-brand/90">
                続きを読む →
              </Button>
            </div>
            {wrong && (
              <p className="mt-2 text-sm text-danger">ちがうみたい。記事をよく読んでみて。</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              ※ アドレスバーやページのソースにも、何か隠れているかも。
            </p>
          </div>
        ) : (
          <>
            {article.riddle.reply.map((line, i) => (
              <KonaBubble key={i}>{line}</KonaBubble>
            ))}
            <div className="ml-12 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-center anim-pop">
              <div className="text-xs tracking-widest text-accent2">CHAPTER CLEAR</div>
              <div className="mt-1 text-lg font-black text-brand">つづく</div>
              <div className="mt-1 text-xs text-muted-foreground">
                次の記事は、また今度。（この続きに 4gotten・AVA・Joka・あの新PC…）
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
