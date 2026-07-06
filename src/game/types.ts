export type SceneId =
  | "room"
  | "door"
  | "desk"
  | "bed"
  | "shelf"
  | "window"
  | "poster"
  | "trash";

export type ItemId = "smallKey" | "usb" | "pillowNote" | "flyer";

export type FlagId =
  | "curtainOpen" // 窓のカーテンを開けた（窓の数字が見える）
  | "pillowMoved" // 枕をどかしてメモを取った
  | "trashSearched" // ゴミの山を漁った（鍵入手）
  | "drawerOpen" // 机の引き出しを開けた（USB入手）
  | "usbInserted" // USBをPCに挿した（画面の数字が見える）
  | "posterPeeled" // ポスターの端をめくった（数字が見える）
  | "shelfChecked" // 本棚のエナジー缶を調べた
  | "escaped"; // 脱出成功

export interface ItemDef {
  id: ItemId;
  name: string;
  glyph: string; // emoji-ish glyph shown in inventory
  desc: string; // shown when examined
}

export type Screen = "title" | "prologue" | "game" | "ending";

export interface GameState {
  screen: Screen;
  scene: SceneId;
  inventory: ItemId[];
  selectedItem: ItemId | null;
  flags: Record<FlagId, boolean>;
  message: string;
  puzzle: "keypad" | null; // currently open modal puzzle
  startedAt: number | null;
  finishedAt: number | null;
}

export type Action =
  | { type: "START" }
  | { type: "BEGIN_GAME" }
  | { type: "GOTO"; scene: SceneId }
  | { type: "MESSAGE"; text: string }
  | { type: "SET_FLAG"; flag: FlagId; value?: boolean }
  | { type: "ADD_ITEM"; item: ItemId }
  | { type: "SELECT_ITEM"; item: ItemId | null }
  | { type: "OPEN_PUZZLE"; puzzle: "keypad" }
  | { type: "CLOSE_PUZZLE" }
  | { type: "ESCAPE" }
  | { type: "RESET" };
