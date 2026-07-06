export type SceneId = "room";

export type ItemId = "usb" | "disc";

export type FlagId =
  | "talkedKona"
  | "gotUsb"
  | "gotDisc"
  | "posterSeen"
  | "windowSeen"
  | "solvedFrag";

export type Screen = "title" | "game" | "clear";

export interface Line {
  speaker?: string; // 話者名（省略で地の文）
  portrait?: string; // 立ち絵/アイコンの画像パス
  text: string;
}

export interface HotspotDef {
  id: string;
  label: string;
  /** 背景画像に対する％座標 */
  x: number;
  y: number;
  w: number;
  h: number;
  hint?: boolean;
}

export interface ItemDef {
  id: ItemId;
  name: string;
  image: string;
  desc: string;
}

export interface GameState {
  screen: Screen;
  scene: SceneId;
  inventory: ItemId[];
  flags: Record<FlagId, boolean>;
  dialogue: Line[]; // 表示中の会話キュー
  dialogueIndex: number;
  puzzle: "frag" | null;
  selectedItem: ItemId | null;
  startedAt: number | null;
  finishedAt: number | null;
}
