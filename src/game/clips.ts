/** AEタイムライン上のクリップ（＝ブログの記憶）。復号パズルのデータ。 */
export interface Clip {
  id: string;
  date: string; // 位置計算用（YYYY-MM-DD）
  layer: string;
  label: string; // ホバー/レイヤー表示
  locked: boolean; // 初期ロック（暗号化）状態
  /** プレビューに出る本文（開封済み/復号済みで表示）。ここに“次の鍵”が隠れることも。 */
  caption: { small: string; big: string; sub?: string; lines?: string[] };
  /** 復号パスフレーズ。未設定＝この章ではまだ復号できない。 */
  key?: string | string[];
  /** 復号成功時のこなの反応 */
  onDecrypt?: string;
}

export interface Layer {
  name: string;
  color: string;
  clipIds: string[];
}

export const CLIPS: Record<string, Clip> = {
  // ---- 読める“最初のログ”。鍵(zaftzaft3)がここに隠れている ----
  first: {
    id: "first",
    date: "2011-04-16",
    layer: "AVA / FPS",
    label: "記念すべき1回目 / 4gotten",
    locked: false,
    caption: {
      small: "2011.04.16 ｜ footage",
      big: "クラン「4gotten」メンバー募集",
      sub: "— 記念すべき1回目の更新 —",
      lines: [
        "どうも、さかやんです ＞ｗ＜",
        "AVA CodeName: 瞳を知り尽した男 / 中尉4",
        "興味ある人は Skype: zaftzaft3 まで連絡ください",
      ],
    },
  },

  // ---- 復号対象①：革命の日。鍵は first の中の zaftzaft3 ----
  kakumei: {
    id: "kakumei",
    date: "2011-07-12",
    layer: "革命 / 編集",
    label: "AfterEffect を知る＝革命",
    locked: true,
    key: ["zaftzaft3", "zaftzaft"],
    caption: {
      small: "2011.07.12",
      big: "自分の中で、革命が起こった",
      sub: "— Joka のフラグムービーに憧れ、After Effect と出会った日 —",
    },
    onDecrypt:
      "…復号成功。『自分の中で革命が起こった』——ここから、ぜんぶが始まった。次は 4gotten の秘密、いこ？",
  },

  // ---- 以降は次章（まだ復号手段なし＝イン Placeholder） ----
  fe: {
    id: "fe",
    date: "2011-07-12",
    layer: "AVA / FPS",
    label: "基本情報技術者試験(FE)",
    locked: true,
    caption: { small: "2011.07.12", big: "基本情報技術者試験（FE）", sub: "ENCRYPTED" },
  },
  css: {
    id: "css",
    date: "2011-07-14",
    layer: "AVA / FPS",
    label: "CS:S のお誘い",
    locked: true,
    caption: { small: "2011.07.14", big: "CS:S のクランお誘い", sub: "ENCRYPTED" },
  },
  offkai: {
    id: "offkai",
    date: "2011-07-18",
    layer: "こな",
    label: "オフ会（カラオケ）",
    locked: true,
    caption: { small: "2011.07.18", big: "オフ会してきた！", sub: "ENCRYPTED" },
  },
  forgotten: {
    id: "forgotten",
    date: "2011-08-02",
    layer: "AVA / FPS",
    label: "ブログの存在を忘れかけていた",
    locked: true,
    caption: { small: "2011.08.02", big: "ブログの存在を忘れかけていた", sub: "ENCRYPTED" },
  },
  newpc: {
    id: "newpc",
    date: "2013-12-25",
    layer: "革命 / 編集",
    label: "新PC / GTX 780 Ti",
    locked: true,
    caption: { small: "2013.12.25", big: "NewPC / GTX 780 Ti", sub: "ENCRYPTED" },
  },
  konaComment: {
    id: "konaComment",
    date: "2011-07-22",
    layer: "こな",
    label: "コメント：また一緒にやろや",
    locked: true,
    caption: { small: "2011.07.22", big: "また今度一緒になんかやろや", sub: "ENCRYPTED" },
  },
  shibaku: {
    id: "shibaku",
    date: "2026-04-15",
    layer: "こな",
    label: "？？？",
    locked: true,
    caption: { small: "2026.04.15", big: "？？？", sub: "LOCKED" },
  },
  fragEnd: {
    id: "fragEnd",
    date: "2026-04-15",
    layer: "フラグムービー",
    label: "完成？",
    locked: true,
    caption: { small: "20XX", big: "完成？", sub: "LOCKED" },
  },
  fragStart: {
    id: "fragStart",
    date: "2011-07-12",
    layer: "フラグムービー",
    label: "Joka に憧れて…",
    locked: true,
    caption: { small: "2011.07.12", big: "Joka に憧れて…", sub: "ENCRYPTED" },
  },
};

export const LAYERS: Layer[] = [
  { name: "革命 / 編集", color: "#b46bff", clipIds: ["kakumei", "newpc"] },
  { name: "こな", color: "#ff6bd6", clipIds: ["konaComment", "offkai", "shibaku"] },
  { name: "AVA / FPS", color: "#46e0ff", clipIds: ["first", "fe", "css", "forgotten"] },
  { name: "フラグムービー", color: "#ffcf5a", clipIds: ["fragStart", "fragEnd"] },
];

/** この章で復号を狙うクリップ */
export const CHAPTER1_TARGET = "kakumei";
