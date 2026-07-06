"use client";

import { GameProvider, useGame } from "./state";
import { SceneId } from "./types";

import RoomScene from "./scenes/RoomScene";
import DoorScene from "./scenes/DoorScene";
import DeskScene from "./scenes/DeskScene";
import BedScene from "./scenes/BedScene";
import ShelfScene from "./scenes/ShelfScene";
import WindowScene from "./scenes/WindowScene";
import PosterScene from "./scenes/PosterScene";
import TrashScene from "./scenes/TrashScene";

import Inventory from "./ui/Inventory";
import Keypad from "./ui/Keypad";
import ItemModal from "./ui/ItemModal";
import Title from "./ui/Title";
import Prologue from "./ui/Prologue";
import Ending from "./ui/Ending";

const SCENES: Record<SceneId, () => React.JSX.Element> = {
  room: RoomScene,
  door: DoorScene,
  desk: DeskScene,
  bed: BedScene,
  shelf: ShelfScene,
  window: WindowScene,
  poster: PosterScene,
  trash: TrashScene,
};

const SCENE_TITLE: Record<SceneId, string> = {
  room: "部屋",
  door: "ドア",
  desk: "机まわり",
  bed: "ベッド",
  shelf: "本棚",
  window: "窓",
  poster: "ポスター",
  trash: "ゴミの山",
};

function Play() {
  const { state, goto } = useGame();
  const Scene = SCENES[state.scene];
  const f = state.flags;
  const found = [f.curtainOpen, f.shelfChecked, f.usbInserted, f.posterPeeled].filter(
    Boolean,
  ).length;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-3 py-3">
      {/* top bar */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {state.scene !== "room" ? (
            <button
              onClick={() => goto("room")}
              className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-text transition hover:border-neon hover:text-neon"
            >
              ← 部屋へ
            </button>
          ) : (
            <span className="px-1 text-sm font-bold tracking-widest text-neon">
              革命からの脱出
            </span>
          )}
          <span className="text-xs text-muted">{SCENE_TITLE[state.scene]}</span>
        </div>
        <div
          className="rounded-full border border-line px-3 py-1 text-xs"
          style={{ color: found === 4 ? "var(--gold)" : "var(--muted)" }}
          title="ドアの暗証番号の手がかり"
        >
          手がかり {found}/4
        </div>
      </div>

      {/* scene */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-black">
        <Scene />
      </div>

      {/* message bar */}
      <div className="mt-2 min-h-[3.75rem] rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-text">
        {state.message || (
          <span className="text-muted">気になる場所をクリック（タップ）して調べよう。</span>
        )}
      </div>

      {/* inventory */}
      <div className="mt-2">
        <Inventory />
      </div>

      {/* modals */}
      {state.puzzle === "keypad" && <Keypad />}
      <ItemModal />
    </div>
  );
}

function Root() {
  const { state } = useGame();
  switch (state.screen) {
    case "title":
      return <Title />;
    case "prologue":
      return <Prologue />;
    case "ending":
      return <Ending />;
    case "game":
    default:
      return <Play />;
  }
}

export default function Game() {
  return (
    <GameProvider>
      <Root />
    </GameProvider>
  );
}
