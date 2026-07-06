"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "../store";
import { ASSETS } from "../assets";
import { ANSWERS, matches } from "../config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PuzzleModal() {
  const { state, dispatch } = useGame();
  const open = state.puzzle === "frag";
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (matches(value, ANSWERS.frag)) {
      // 進行をブラウザに保存（＝ブラウザである意味の名残）
      try {
        localStorage.setItem("readmore.solved.frag", "1");
      } catch {}
      dispatch({
        type: "SOLVE_FRAG",
        lines: [
          { speaker: "こな", portrait: ASSETS.chars.kona, text: "……正解。ふふ、覚えててくれたんだ。" },
          { speaker: "こな", portrait: ASSETS.chars.kona, text: "あの頃のキミ、『これは革命だ』って本気で叫んでたよね。" },
          { speaker: "こな", portrait: ASSETS.chars.kona, text: "その気持ち、まだ残ってる？ ……続きは、また今度ね。" },
        ],
      });
      setValue("");
      setWrong(false);
    } else {
      setWrong(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && dispatch({ type: "CLOSE_PUZZLE" })}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-accent2">こなちゃんの謎</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            src={ASSETS.puzzles.frag}
            alt="謎のカード"
            width={800}
            height={560}
            className="h-auto w-full"
          />
        </div>

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
            placeholder="ソフトの名前を英語で"
            autoComplete="off"
            spellCheck={false}
            className={wrong ? "border-danger" : ""}
          />
          <Button onClick={submit} className="bg-brand text-white hover:bg-brand/90">
            こたえる
          </Button>
        </div>

        {wrong && (
          <p className="text-sm text-danger">ちがうみたい。もう一度考えてみて。</p>
        )}
        <p className="text-xs text-muted-foreground">
          ヒント：アドレスバーに答えを打ってもいいし、ページのソースにも何か隠れているかも。
        </p>
      </DialogContent>
    </Dialog>
  );
}
