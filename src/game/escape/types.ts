export type Ending = "A" | "B" | "C";

/** セーブされるゲーム状態全体 */
export interface GameState {
  /** 0=序章(本人確認) 1..5=未練①〜⑤ 6=全解錠 */
  chapter: number;
  /** こな度 0..6 */
  kona: number;
  /** 入手順のアイテムid */
  inventory: string[];
  /** 寄り道・選択肢などの永続フラグ */
  flags: Record<string, boolean>;
  ach: string[];
  ending: Ending | null;
  lap: number;
  startedAt: number;
}

/** 各パズル/画面からゲーム全体を操作するAPI */
export interface GameApi {
  grantA: (id: string) => void;
  addKona: (n: number) => void;
  setFlag: (key: string) => void;
  addItem: (id: string) => void;
  /** 章nの錠前を解く（chapter===n のときだけ進む） */
  solve: (chapter: number) => void;
  /** エンディング決定 */
  choose: (ending: Ending) => void;
  blip: () => void;
  fanfare: () => void;
  ping: () => void;
  shot: () => void;
}
