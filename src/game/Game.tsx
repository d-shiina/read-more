"use client";

import { GameProvider, useGame } from "./store";
import Scene from "./ui/Scene";
import DialogueBox from "./ui/DialogueBox";
import Sidebar from "./ui/Sidebar";
import PuzzleModal from "./ui/PuzzleModal";
import Title from "./ui/Title";
import Clear from "./ui/Clear";

function Play() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      {/* 左：場所移動＋アイテム */}
      <Sidebar />

      {/* 右：シーン（コンテンツ） */}
      <main className="relative flex h-full flex-1 items-center justify-center overflow-hidden bg-black">
        <div
          className="relative aspect-[1280/800]"
          style={{ width: "min(100%, calc(100dvh * 1.6))" }}
        >
          <Scene />
          <DialogueBox />
        </div>
      </main>

      <PuzzleModal />
    </div>
  );
}

function Root() {
  const { state } = useGame();
  switch (state.screen) {
    case "title":
      return <Title />;
    case "clear":
      return <Clear />;
    default:
      return <Play />;
  }
}

export default function Game() {
  return (
    <GameProvider>
      {/* view-source向けの隠しヒント（ブラウザである意味の名残） */}
      <span
        aria-hidden
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{
          __html: "<!-- 次の手がかり: konachan の誕生日を、思い出せ。 -->",
        }}
      />
      <Root />
    </GameProvider>
  );
}
