"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "../store";
import { ITEMS } from "../items";
import { ItemId } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/** サイドバーに置くアイテム欄（グリッド） */
export default function Inventory() {
  const { state } = useGame();
  const [open, setOpen] = useState<ItemId | null>(null);
  const slots = 6;

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: slots }).map((_, i) => {
          const id = state.inventory[i];
          const item = id ? ITEMS[id] : null;
          return (
            <button
              key={i}
              disabled={!item}
              onClick={() => item && setOpen(item.id)}
              aria-label={item ? item.name : "空きスロット"}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-panel transition enabled:hover:border-brand enabled:hover:shadow-[0_0_10px_rgba(180,107,255,0.5)]"
            >
              {item && (
                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-sm">
          {open && (
            <>
              <div className="mx-auto my-2 size-24">
                <Image
                  src={ITEMS[open].image}
                  alt={ITEMS[open].name}
                  width={96}
                  height={96}
                  className="size-24 object-contain"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center text-brand">
                  {ITEMS[open].name}
                </DialogTitle>
                <DialogDescription className="text-center leading-relaxed">
                  {ITEMS[open].desc}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
