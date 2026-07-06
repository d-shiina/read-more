"use client";

import Image from "next/image";
import { useGame } from "../store";
import { ASSETS } from "../assets";
import { Button } from "@/components/ui/button";

export default function Title() {
  const { dispatch } = useGame();
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Image
        src={ASSETS.titleBg}
        alt=""
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="relative z-10 flex flex-col items-center anim-fadeup">
        <p className="mb-3 text-sm tracking-[0.5em] text-accent2">ESCAPE / 謎解き</p>
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
          <span
            className="text-brand"
            style={{ textShadow: "0 0 26px rgba(180,107,255,0.8)" }}
          >
            read
          </span>{" "}
          <span className="text-foreground">more</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          ネトゲに溺れた夜。こなちゃんと過ごした時間。
          <br />
          フラグムービーに憧れた、あの頃の「革命」。
          <br />
          ——続きは、続きを読むから。
        </p>

        <Button
          onClick={() => dispatch({ type: "START" })}
          className="mt-9 h-12 rounded-full bg-brand px-10 text-lg font-bold text-white hover:bg-brand/90"
        >
          はじめる
        </Button>

        <p className="mt-8 text-xs text-muted-foreground/70">
          気になる場所をクリック／タップして調べよう。
        </p>
      </div>
    </div>
  );
}
