"use client";

import { useGame } from "../state";
import { ITEMS } from "../items";

export default function Inventory() {
  const { state, selectItem } = useGame();
  const slots = 5;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-panel/80 p-2 backdrop-blur">
      <span className="px-1 text-xs tracking-widest text-muted">ITEMS</span>
      <div className="flex flex-1 gap-2">
        {Array.from({ length: slots }).map((_, i) => {
          const id = state.inventory[i];
          const item = id ? ITEMS[id] : null;
          const active = id && state.selectedItem === id;
          return (
            <button
              key={i}
              disabled={!item}
              onClick={() => item && selectItem(item.id)}
              aria-label={item ? item.name : "空きスロット"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border text-2xl transition"
              style={{
                borderColor: active ? "var(--neon2)" : "var(--line)",
                background: active ? "rgba(75,227,255,0.12)" : "var(--panel-2)",
                cursor: item ? "pointer" : "default",
                boxShadow: active ? "0 0 12px rgba(75,227,255,0.5)" : "none",
              }}
            >
              {item ? item.glyph : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
