import { ItemDef, ItemId } from "./types";

export const ITEMS: Record<ItemId, ItemDef> = {
  smallKey: {
    id: "smallKey",
    name: "小さな鍵",
    glyph: "🗝️",
    desc: "ゴミの山から出てきた小さな真鍮の鍵。何かの引き出しに合いそうだ。",
  },
  usb: {
    id: "usb",
    name: "USBメモリ",
    glyph: "🔌",
    desc: "『革命』と油性ペンで書かれたUSBメモリ。PCに挿せば中身が見られるかもしれない。",
  },
  pillowNote: {
    id: "pillowNote",
    name: "しわくちゃのメモ",
    glyph: "📝",
    desc: "『暗証番号を忘れたとき用 —— 窓 → 本棚 → 画面 → ポスターの裏 の順で読め』",
  },
  flyer: {
    id: "flyer",
    name: "運営からの手紙",
    glyph: "✉️",
    desc: "『革命』運営からの封書。“君はもう十分に戦った。ドアの外は、まだ朝だ。”",
  },
};

/** ドアの暗証番号（窓7・本棚4・画面1・ポスター9 の順） */
export const DOOR_CODE = "7419";
