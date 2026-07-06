import { ItemDef, ItemId } from "./types";
import { ASSETS } from "./assets";

export const ITEMS: Record<ItemId, ItemDef> = {
  usb: {
    id: "usb",
    name: "USBメモリ",
    image: ASSETS.items.usb,
    desc: "『革命』と油性ペンで書かれたUSBメモリ。当時のフラグムービーの素材が入っていそうだ。",
  },
  disc: {
    id: "disc",
    name: "焼いたDVD-R",
    image: ASSETS.items.disc,
    desc: "手書きで「完成版・最終・本当の最終」と書かれたDVD-R。何度も焼き直した跡がある。",
  },
};
