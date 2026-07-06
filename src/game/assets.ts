/**
 * 画像アセットのパス。ここを差し替えれば本物の絵になる。
 * いまは仮の SVG プレースホルダ（public/images/ 以下）。
 *
 * 本番手順：生成した PNG/JPG を public/images/... に置き、下のパスを変えるだけ。
 * （例: room: "/images/scenes/room-night.png"）
 */
export const ASSETS = {
  titleBg: "/images/title-bg.svg",
  scenes: {
    room: "/images/scenes/room-night.svg",
  },
  chars: {
    kona: "/images/chars/kona.svg",
  },
  items: {
    usb: "/images/items/usb.svg",
    disc: "/images/items/disc.svg",
  },
  puzzles: {
    frag: "/images/puzzles/frag-card.svg",
  },
} as const;
